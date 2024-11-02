/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.entity';
import { In, Repository } from 'typeorm';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { PaginationFilterBookLoanDto } from './DTO/pagination-filter-bookLoan.dto';
import { Book } from 'src/books/book.entity';
import { GETResponseDTO } from './DTO/GETSResponse';
import { BookLoanResponseDTO } from './DTO/RequestDTO';
import { LoanPolicy } from 'src/user/loan-policy';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { NotesService } from 'src/notes/notes.service';
import { UserService } from 'src/user/user.service';
import { ChangeLoanStatus } from './DTO/ChangeLoanStatus.dto';

@Injectable()
export class BookLoanService {
  constructor(
    @InjectRepository(BookLoan)
    private readonly bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private noteService: NotesService,
    private userService: UserService,
  ) {}

  async createLoan(
    createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    try {
      //Verifica la info del libro
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
      const user = await this.userService.findCedula(
        createBookLoanDto.userCedula,
      );

      if (!user) {
        throw new NotFoundException('El usuario no existe');
      }

      const loan = await this.bookLoanRepository.findOneBy({
        bookBookCode: createBookLoanDto.bookBookCode,
        Status: In(['pendiente', 'en progreso']),
      });

      if (loan) {
        throw new BadRequestException(
          `El libro con código ${createBookLoanDto.bookBookCode} ya tiene un préstamo activo y no puede ser prestado nuevamente.`,
        );
      }
      //Verifica al usuario
      const userCurrentLoans = await this.bookLoanRepository.count({
        where: {
          userCedula: createBookLoanDto.userCedula,
          Status: In(['Pendiente', 'En progreso']),
        },
      });
      const loanLimits = LoanPolicy.getLoanLimits(
        user.loanPolicy,
        userCurrentLoans,
      );
      if (!loanLimits.canLoan) {
        throw new BadRequestException(
          'No puedes realizar mas préstamos en este momento, excediste el máximo de prestamos, puedes cancelar alguna solicitud pendiente o devolver un libro a la biblioteca para realizar una nueva solicitud.',
        );
      }
      const newBookLoan = this.bookLoanRepository.create(createBookLoanDto);
      newBookLoan.Status = 'Pendiente';
      newBookLoan.book = book;
      await this.bookLoanRepository.save(newBookLoan);
      const createNoteDto: CreateNoteDto = {
        message: `El libro con código ${book.BookCode} ha sido solicitado por el usuario: ${user.name} cédula:${user.cedula}.`,
        type: 'Solicitud de libro',
      };
      await this.noteService.createNote(createNoteDto);

      return { message: 'Éxito' };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error al solicitar';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async createAdminLoan(
    createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    try {
      const book = await this.bookRepository.findOne({
        where: { BookCode: createBookLoanDto.bookBookCode },
      });
      if (!book) {
        throw new NotFoundException(
          `El libro con código ${createBookLoanDto.bookBookCode} no fue encontrado`,
        );
      }
      if (!book.Status) {
        throw new BadRequestException(
          `El libro con código ${book.BookCode} está inactivo y no puede ser prestado.`,
        );
      }

      const loan = await this.bookLoanRepository.findOneBy({
        bookBookCode: createBookLoanDto.bookBookCode,
        Status: In(['pendiente', 'en progreso']),
      });

      if (loan) {
        throw new BadRequestException(
          `El libro con código ${createBookLoanDto.bookBookCode} ya tiene un préstamo activo y no puede ser prestado nuevamente.`,
        );
      }

      const newBookLoan = this.bookLoanRepository.create({
        ...createBookLoanDto,
        Status: 'En progreso',
        book: book,
      });

      await this.bookLoanRepository.save(newBookLoan);

      const createNoteDto: CreateNoteDto = {
        message: `El libro con código ${book.BookCode} ha sido prestado por el funcionario: ${createBookLoanDto.aprovedBy}.`,
        type: 'Préstamo de libro',
      };

      await this.noteService.createNote(createNoteDto);

      return { message: 'Préstamo generado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }
  async setInProcess(data: ChangeLoanStatus): Promise<{ message: string }> {
    try {
      const bookLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: data.LoanID },
      });

      if (!bookLoan) {
        throw new NotFoundException(
          `Préstamo numero ${data.LoanID} no encontrado`,
        );
      }
      bookLoan.Status = 'En progreso';
      bookLoan.aprovedBy = data.person;

      await this.bookLoanRepository.save(bookLoan);
      return { message: 'Aprobado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async finalizeLoan(data: ChangeLoanStatus): Promise<{ message: string }> {
    try {
      const bookLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: data.LoanID },
      });

      if (!bookLoan) {
        throw new NotFoundException(
          `Préstamo numero ${data.LoanID} no encontrado`,
        );
      }
      bookLoan.Status = 'Finalizado';
      bookLoan.receivedBy = data.person;
      bookLoan.Observations = data.Observations;

      await this.bookLoanRepository.save(bookLoan);
      return { message: 'Éxito al finalizar el préstamo' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async update(
    bookLoanId: number,
    updateBookLoanDto: updatedBookLoan,
  ): Promise<{ message: string }> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(
        `El préstamo con ID ${bookLoanId} no fue encontrado`,
      );
    }

    Object.assign(bookLoan, updateBookLoanDto);

    this.bookLoanRepository.save(bookLoan);
    return;
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
    }

    if (filters.signatureCode) {
      query
        .leftJoinAndSelect('bookLoan.book', 'book')
        .andWhere('book.signatureCode = :signatureCode', {
          signatureCode: String(filters.signatureCode),
        });
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

  // de aquí
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
      .where('bookLoan.Status = :status', { status: 'En progreso' })
      .andWhere('bookLoan.book IS NOT NULL');
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
      query.andWhere('bookLoan.userCedula LIKE :cedula', {
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
        name: loan.userName,
        lastName: loan.userAddress,
        cedula: loan.userCedula,
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
      query.andWhere('bookLoan.userCedula LIKE :cedula', {
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
        name: loan.userName,
        lastName: loan.userAddress,
        cedula: loan.userCedula,
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
      .where('bookLoan.Status = :status', { status: 'Finalizado' });

    if (StartDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) >= :StartDate', {
        StartDate,
      });
    if (EndDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) <= :EndDate', { EndDate });
    if (name)
      query.andWhere('bookLoan.userName LIKE :name', {
        name: `%${name}%`,
      });
    if (cedula)
      query.andWhere('bookLoan.userCedula LIKE :cedula', {
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
        name: loan.userName,
        lastName: loan.userAddress,
        cedula: loan.userCedula,
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
  // a aquí se eliminaran

  //Solamente se va a usar este, contendrá todos los parámetros
  async getLoansList(
    paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      name,
      signatureCode,
      cedula,
      Status,
    } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .where('bookLoan.Status = :status', { status: 'Finalizado' });

    if (StartDate)
      query.andWhere('Date(bookLoan.LoanRequestDate) = :StartDate', {
        StartDate,
      });

    if (name)
      query.andWhere('bookLoan.userName LIKE :name', {
        name: `%${name}%`,
      });

    if (cedula)
      query.andWhere('bookLoan.userCedula LIKE :cedula', {
        cedula: `%${cedula}%`,
      });

    if (signatureCode) {
      query.andWhere('bookLoan.signatureCode LIKE :signatureCode', {
        signatureCode: `%${signatureCode}%`,
      });
    }

    if (Status) {
      query.andWhere('book.Status = :Status', {
        Status: `%${signatureCode}%`,
      });
    } else {
      query.andWhere('book.Status NOT IN (:...statuses)', {
        statuses: ['En progreso', 'Pendiente'],
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
        name: loan.userName,
        lastName: loan.userAddress,
        cedula: loan.userCedula,
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

  async isBookLoanActive(bookCode: number): Promise<boolean> {
    const count = await this.bookLoanRepository.count({
      where: {
        bookBookCode: bookCode,
        Status: In(['Pendiente', 'En progreso']),
      },
    });
    return count > 0;
  }
}
