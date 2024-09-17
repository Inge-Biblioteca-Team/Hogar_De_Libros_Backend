/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.enity';
import { In, Repository } from 'typeorm';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { PaginationFilterBookLoanDto } from './DTO/pagination-filter-bookLoan.dto';
import { Book } from 'src/books/book.entity';
import { GETResponseDTO } from './DTO/GETSResponse';
import { BookLoanResponseDTO } from './DTO/RequestDTO';
import { LoanPolicy } from 'src/user/loan-policy';

@Injectable()
export class BookLoanService {
  constructor(
    @InjectRepository(BookLoan)
    private readonly bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async createLoan(
    createBookLoanDto: CreateBookLoanDto,
    user: any,
  ): Promise<BookLoan> {
    const role = user.role;

    if (!LoanPolicy.canLoan(role)) {
      throw new ForbiddenException(
        'No tienes permisos para realizar préstamos.',
      );
    }

    const book = await this.bookRepository.findOne({
      where: { BookCode: createBookLoanDto.bookBookCode },
    });

    if (!book) {
      throw new NotFoundException(
        `El libro con código ${createBookLoanDto.bookBookCode} no fue encontrado`,
      );
    }

    if (book.Status === false) {
      throw new BadRequestException(
        `El libro con código ${book.BookCode} está inactivo y no puede ser prestado.`,
      );
    }

    const existingLoan = await this.bookLoanRepository.findOne({
      where: {
        bookBookCode: book.BookCode,
        Status: In(['Pendiente', 'En progreso']),
      },
    });

    if (existingLoan) {
      throw new BadRequestException(
        `El libro con código ${book.BookCode} ya está prestado.`,
      );
    }

    const userCurrentLoans = await this.bookLoanRepository.count({
      where: {
        userCedula: createBookLoanDto.userCedula,
        Status: In(['Pendiente', 'En progreso']),
      },
    });

    const loanLimits = LoanPolicy.getLoanLimits(role, userCurrentLoans + 1);

    const maxBooksAllowed = loanLimits.maxBooks;
    if (
      maxBooksAllowed !== 'unlimited' &&
      userCurrentLoans >= maxBooksAllowed
    ) {
      throw new BadRequestException(
        `Has alcanzado el límite máximo de ${maxBooksAllowed} préstamos para tu rol.`,
      );
    }

    const newBookLoan = this.bookLoanRepository.create(createBookLoanDto);
    newBookLoan.Status = 'Pendiente';
    newBookLoan.book = book;

    const maxDaysAllowed = loanLimits.days;
    if (maxDaysAllowed !== 'unlimited') {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + maxDaysAllowed);
      newBookLoan.LoanExpirationDate = expirationDate;
    }

    return await this.bookLoanRepository.save(newBookLoan);
  }

  async setInProcess(bookLoanId: number): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
    }

    bookLoan.Status = 'En progreso';

    return await this.bookLoanRepository.save(bookLoan);
  }

  async finalizeLoan(
    bookLoanId: number,
    finalizeBookLoanDto: FinalizeBookLoanDto,
  ): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
    }
    bookLoan.Status = 'Finalizado';

    bookLoan.Observations = finalizeBookLoanDto.Observations;

    return await this.bookLoanRepository.save(bookLoan);
  }

  async update(
    bookLoanId: number,
    updateBookLoanDto: updatedBookLoan,
  ): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(
        `El préstamo con ID ${bookLoanId} no fue encontrado`,
      );
    }

    Object.assign(bookLoan, updateBookLoanDto);

    return this.bookLoanRepository.save(bookLoan);
  }

  async findBookLoans(
    filters: PaginationFilterBookLoanDto,
  ): Promise<{ data: BookLoan[]; count: number }> {
    const { page = 1, limit = 10 } = filters;
    const query = this.bookLoanRepository.createQueryBuilder('bookLoan');

    if (
      filters.LoanRequestDateRange &&
      filters.LoanRequestDateRange.length === 2
    ) {
      const [startDate, endDate] = filters.LoanRequestDateRange;
      query.andWhere(
        'bookLoan.LoanRequestDate BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    if (filters.LoanExpirationDate) {
      query.andWhere(
        'DATE(bookLoan.LoanExpirationDate) = :LoanExpirationDate',
        {
          LoanExpirationDate: filters.LoanExpirationDate,
        },
      );
    }

    if (filters.BookPickUpDate) {
      query.andWhere('DATE(bookLoan.BookPickUpDate) = :BookPickUpDate', {
        BookPickUpDate: filters.BookPickUpDate,
      });
      console.log('Entre');
    }
    console.log(filters.BookPickUpDate);

    if (filters.signatureCode) {
      console.log('signatureCode:', filters.signatureCode);
      query
        .leftJoinAndSelect('bookLoan.book', 'book')
        .andWhere('book.signatureCode = :signatureCode', {
          signatureCode: String(filters.signatureCode),
        });

      console.log(filters.signatureCode);
    }

    if (filters.cedula) {
      query
        .andWhere('bookLoan.Status = :status', { status: 'Finalizado' })
        .andWhere('bookLoan.userCedula = :userCedula', {
          userCedula: filters.cedula,
        });
    }

    const [data, count] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }

  async getInProgressLoans(
    paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      LoanExpirationDate,
      signatureCode,
      cedula,
    } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .leftJoinAndSelect('bookLoan.user', 'user')
      .where('bookLoan.Status = :status', { status: 'En progreso' })
      .andWhere('bookLoan.book IS NOT NULL')
      .andWhere('bookLoan.user IS NOT NULL');
    if (StartDate) {
      query.andWhere('bookLoan.LoanRequestDate >= :StartDate', {
        StartDate,
      });
    }
    if (LoanExpirationDate)
      query.andWhere(
        'Date(bookLoan.LoanExpirationDate) <= :LoanExpirationDate',
        {
          LoanExpirationDate,
        },
      );
    if (signatureCode) {
      query.andWhere('book.signatureCode LIKE :signatureCode', {
        signatureCode: `%${signatureCode}%`,
      });
    }
    if (cedula)
      query.andWhere('user.cedula LIKE :cedula', {
        cedula: `%${cedula}%`,
      });

    query.skip((page - 1) * limit).take(limit);
    query.orderBy('bookLoan.LoanRequestDate', 'DESC');

    const [data, count] = await query.getManyAndCount();

    const result = data.map((loan) => ({
      Status: loan.Status,
      BookLoanId: loan.BookLoanId,
      LoanRequestDate: loan.LoanRequestDate,
      BookPickUpDate: loan.BookPickUpDate,
      LoanExpirationDate: loan.LoanExpirationDate,
      Observations: loan.Observations,
      user: {
        name: loan.user.name,
        lastName: loan.user.lastName,
        cedula: loan.user.cedula,
      },
      book: {
        Title: loan.book.Title,
        signatureCode: loan.book.signatureCode,
        InscriptionCode: loan.book.InscriptionCode,
        BookCode: loan.book.BookCode,
      },
    }));

    return { data: result, count };
  }

  async getPendingLoans(
    paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      EndDate,
      LoanExpirationDate,
      cedula,
    } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .leftJoinAndSelect('bookLoan.user', 'user')
      .where('bookLoan.Status = :status', { status: 'Pendiente' });

    if (StartDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) >= :StartDate', {
        StartDate,
      });
    if (EndDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) <= :EndDate', { EndDate });
    if (LoanExpirationDate)
      query.andWhere(
        'Date(bookLoan.LoanExpirationDate) = :LoanExpirationDate',
        {
          LoanExpirationDate,
        },
      );
    if (cedula)
      query.andWhere('user.cedula LIKE :cedula', {
        cedula: `%${cedula}%`,
      });

    query.skip((page - 1) * limit).take(limit);
    query.orderBy('bookLoan.LoanRequestDate', 'DESC');
    const [data, count] = await query.getManyAndCount();

    const result = data.map((loan) => ({
      Status: loan.Status,
      BookLoanId: loan.BookLoanId,
      LoanRequestDate: loan.LoanRequestDate,
      BookPickUpDate: loan.BookPickUpDate,
      LoanExpirationDate: loan.LoanExpirationDate,
      Observations: loan.Observations,
      user: {
        name: loan.user.name,
        lastName: loan.user.lastName,
        cedula: loan.user.cedula,
      },
      book: {
        Title: loan.book.Title,
        signatureCode: loan.book.signatureCode,
        InscriptionCode: loan.book.InscriptionCode,
        BookCode: loan.book.BookCode,
      },
    }));

    return { data: result, count };
  }

  async getCompletedLoans(
    paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      EndDate,
      name,
      signatureCode,
      cedula,
    } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .leftJoinAndSelect('bookLoan.user', 'user')
      .where('bookLoan.Status = :status', { status: 'Finalizado' });

    if (StartDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) >= :StartDate', {
        StartDate,
      });
    if (EndDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) <= :EndDate', { EndDate });
    if (name)
      query.andWhere('user.name LIKE :name', {
        name: `%${name}%`,
      });
    if (cedula)
      query.andWhere('user.cedula LIKE :cedula', {
        cedula: `%${cedula}%`,
      });
    if (signatureCode) {
      query.andWhere('book.signatureCode LIKE :signatureCode', {
        signatureCode: `%${signatureCode}%`,
      });
    }
    query.skip((page - 1) * limit).take(limit);
    query.orderBy('bookLoan.LoanRequestDate', 'DESC');
    const [data, count] = await query.getManyAndCount();
    const result = data.map((loan) => ({
      Status: loan.Status,
      BookLoanId: loan.BookLoanId,
      LoanRequestDate: loan.LoanRequestDate,
      BookPickUpDate: loan.BookPickUpDate,
      LoanExpirationDate: loan.LoanExpirationDate,
      Observations: loan.Observations,
      user: {
        name: loan.user.name,
        lastName: loan.user.lastName,
        cedula: loan.user.cedula,
      },
      book: {
        Title: loan.book.Title,
        signatureCode: loan.book.signatureCode,
        InscriptionCode: loan.book.InscriptionCode,
        BookCode: loan.book.BookCode,
      },
    }));

    return { data: result, count };
  }
}
