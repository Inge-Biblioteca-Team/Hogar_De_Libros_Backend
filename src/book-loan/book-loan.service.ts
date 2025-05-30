/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { PaginationFilterBookLoanDto } from './DTO/pagination-filter-bookLoan.dto';
import { GETResponseDTO } from './DTO/GETSResponse';
import { BookLoanResponseDTO, extendDTO } from './DTO/RequestDTO';
import { LoanPolicy } from 'src/user/loan-policy';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { NotesService } from 'src/notes/notes.service';
import { UserService } from 'src/user/user.service';
import { ChangeLoanStatus } from './DTO/ChangeLoanStatus.dto';
import { BookLoan, BookType } from './book-loan.entity';
import { Book } from 'src/books/book.entity';
import { BooksChildren } from 'src/book-children/book-children.entity';
import { dayEnd, dayStart, diffDays, removeOffset } from '@formkit/tempo';
import { ExtendLoanDTO } from './DTO/ExtendLoan.dto';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class BookLoanService {
  constructor(
    @InjectRepository(BookLoan)
    private readonly bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private noteService: NotesService,
    private userService: UserService,
    private emailService: MailsService,
    @InjectRepository(BooksChildren)
    private childrenRepo: Repository<BooksChildren>,
  ) {}

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
      await this.emailService.sendAproveLoan(data.LoanID)

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

  async cancelLoan(data: ChangeLoanStatus): Promise<{ message: string }> {
    try {
      const bookLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: data.LoanID },
      });

      if (!bookLoan) {
        throw new NotFoundException(
          `Préstamo numero ${data.LoanID} no encontrado`,
        );
      }
      bookLoan.Status = 'Cancelado';
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

  async refuseLoan(data: ChangeLoanStatus): Promise<{ message: string }> {
    try {
      const bookLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: data.LoanID },
      });

      if (!bookLoan) {
        throw new NotFoundException(
          `Préstamo numero ${data.LoanID} no encontrado`,
        );
      }
      bookLoan.Status = 'Rechazado';
      bookLoan.aprovedBy = data.person;
      bookLoan.Observations = data.Observations;

      await this.bookLoanRepository.save(bookLoan);
      await this.emailService.sendRefuse(data.LoanID)
      return { message: 'Éxito al rechazar el préstamo' };
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

    await this.bookLoanRepository.save(bookLoan);
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
  ): Promise<{ data: BookLoan[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      LoanExpirationDate,
      type,
      cedula,
    } = paginationDto;

    const where: FindOptionsWhere<BookLoan> = {
      Status: 'En progreso',
    };

    if (StartDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${dayStart(StartDate)}`), '-0600'),
        removeOffset(new Date(`${dayEnd(StartDate)}`), '-0600'),
      );
    }

    if (LoanExpirationDate) {
      where.LoanExpirationDate = Equal(LoanExpirationDate);
    }

    if (cedula) {
      where.userCedula = Like(`%${cedula}%`);
    }
    if (type) {
      where.type = type;
    }

    const options: FindManyOptions<BookLoan> = {
      where,
      relations: ['book', 'childrenBook'],
      order: { LoanRequestDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, count] = await this.bookLoanRepository.findAndCount(options);

    return { data, count };
  }

  async getPendingLoans(
    paginationDto: GETResponseDTO,
  ): Promise<{ data: extendDTO[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      EndDate,
      LoanExpirationDate,
      cedula,
      type,
    } = paginationDto;

    const where: FindOptionsWhere<BookLoan> = {
      Status: 'Pendiente',
    };

    if (StartDate && !EndDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${StartDate}T00:00:00.000Z`), '-0600'),
        removeOffset(new Date(`${StartDate}T23:59:59.999Z`), '-0600'),
      );
    }
    if (EndDate && !StartDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${EndDate}T00:00:00.000Z`), '-0600'),
        removeOffset(new Date(`${EndDate}T23:59:59.999Z`), '-0600'),
      );
    }
    if (EndDate && StartDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${StartDate}T00:00:00.000Z`), '-0600'),
        removeOffset(new Date(`${EndDate}T23:59:59.999Z`), '-0600'),
      );
    }

    if (LoanExpirationDate) {
      where.LoanExpirationDate = Equal(LoanExpirationDate);
    }

    if (cedula) {
      where.userCedula = Like(`%${cedula}%`);
    }
    if (type) {
      where.type = type;
    }

    const [data, count] = await this.bookLoanRepository.findAndCount({
      where,
      relations: ['book', 'childrenBook'],
      order: { LoanRequestDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = [];

    for (const loan of data) {
      const Oldobservations = await this.bookLoanRepository
        .createQueryBuilder('bookLoan')
        .select('bookLoan.Observations')
        .where('bookLoan.Status = :status', { status: 'Finalizado' })
        .andWhere('bookLoan.Observations != :emptyString', { emptyString: '' })
        .andWhere('bookLoan.userCedula = :cedula', { cedula: loan.userCedula })
        .orderBy('bookLoan.LoanRequestDate', 'DESC')
        .take(5)
        .getRawMany();

      result.push({
        ...loan,
        OldObservations: Oldobservations.map(
          (obs) => obs.bookLoan_Observations,
        ),
      });
    }

    return { data: result, count };
  }

  async getCompletedLoans(
    paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoan[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      StartDate,
      EndDate,
      name,
      cedula,
      type,
    } = paginationDto;

    const where: FindOptionsWhere<BookLoan> = {
      Status: Not(In(['En progreso', 'Pendiente'])),
    };

    if (StartDate && !EndDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${dayStart(StartDate)}`), '-0600'),
        removeOffset(new Date(`${dayEnd(StartDate)}`), '-0600'),
      );
    }
    if (EndDate && !StartDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${dayStart(EndDate)}`), '-0600'),
        removeOffset(new Date(`${dayEnd(EndDate)}`), '-0600'),
      );
    }
    if (EndDate && StartDate) {
      where.LoanRequestDate = Between(
        removeOffset(new Date(`${dayStart(StartDate)}`), '-0600'),
        removeOffset(new Date(`${dayEnd(EndDate)}`), '-0600'),
      );
    }
    if (name) {
      where.userName = Like(`%${name}%`);
    }
    if (cedula) {
      where.userCedula = Like(`%${cedula}%`);
    }
    if (type) {
      where.type = type;
    }
  

    const options: FindManyOptions<BookLoan> = {
      where,
      relations: ['book', 'childrenBook'],
      order: { LoanRequestDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, count] = await this.bookLoanRepository.findAndCount(options);

    return { data, count };
  }

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
        Adress: loan.userAddress,
        cedula: loan.userCedula,
        PhoneNumber: loan.userPhone,
      },
      book: {
        Title: loan.book.Title,
        signatureCode: loan.book.signatureCode,
        InscriptionCode: loan.book.InscriptionCode,
        BookCode: loan.book.BookCode,
        Author: loan.book.Author,
      },
    }));

    return { data: result, count };
  }

  async bookExist(bookCode: number) {
    const book = await this.bookRepository.findOne({
      where: { BookCode: bookCode },
    });
    if (!book) {
      throw new NotFoundException(
        `El libro con código ${bookCode} no fue encontrado`,
      );
    }
    if (book.Status === false) {
      throw new BadRequestException(
        `El libro con código ${book.BookCode} está inactivo y no puede ser prestado.`,
      );
    }
    const loan = await this.bookLoanRepository.findOneBy({
      book: { BookCode: bookCode },
      Status: In(['pendiente', 'en progreso']),
      type: BookType.GENERAL,
    });
    if (loan) {
      throw new BadRequestException(
        `El libro con código ${bookCode} ya tiene un préstamo activo y no puede ser prestado nuevamente.`,
      );
    }
    return book;
  }

  async userExist(cedula: string) {
    const user = await this.userService.findCedula(cedula);
    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }
    const userCurrentLoans = await this.bookLoanRepository.count({
      where: {
        userCedula: cedula,
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
    return user;
  }

  async createLoan(
    createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    try {
      const book = await this.bookExist(createBookLoanDto.bookBookCode);
      const user = await this.userExist(createBookLoanDto.userCedula);

      const newBookLoan = this.bookLoanRepository.create(createBookLoanDto);
      newBookLoan.Status = 'Pendiente';
      newBookLoan.book = book;
      newBookLoan.childrenBook = null;
      (newBookLoan.type = BookType.GENERAL),
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
      const book = await this.bookExist(createBookLoanDto.bookBookCode);

      const newBookLoan = this.bookLoanRepository.create({
        ...createBookLoanDto,
        Status: 'En progreso',
        book: book,
        childrenBook: null,
        type: BookType.GENERAL,
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

  async bookChildrenExist(bookCode: number) {
    const book = await this.childrenRepo.findOne({
      where: { BookCode: bookCode },
    });

    if (!book) {
      throw new NotFoundException(
        `El libro con código ${bookCode} no fue encontrado`,
      );
    }
    if (book.Status === false) {
      throw new BadRequestException(
        `El libro con código ${book.BookCode} está inactivo y no puede ser prestado.`,
      );
    }
    const loan = await this.bookLoanRepository.findOneBy({
      childrenBook: { BookCode: bookCode },
      Status: In(['pendiente', 'en progreso']),
      type: BookType.INFANTIL,
    });
    if (loan) {
      throw new BadRequestException(
        `El libro con código ${bookCode} ya tiene un préstamo activo y no puede ser prestado nuevamente.`,
      );
    }
    return book;
  }

  async createChildrenLoan(
    createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    try {
      const book = await this.bookChildrenExist(createBookLoanDto.bookBookCode);

      const user = await this.userExist(createBookLoanDto.userCedula);

      const newBookLoan = this.bookLoanRepository.create(createBookLoanDto);
      newBookLoan.Status = 'Pendiente';
      newBookLoan.childrenBook = book;
      newBookLoan.book = null;
      (newBookLoan.type = BookType.INFANTIL),
        await this.bookLoanRepository.save(newBookLoan);
      const createNoteDto: CreateNoteDto = {
        message: `El libro con código ${book.BookCode} ha sido solicitado por el usuario: ${user.name} cédula:${user.cedula}.`,
        type: 'Solicitud de libro infantil',
      };
      await this.noteService.createNote(createNoteDto);

      return { message: 'Éxito' };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error al solicitar';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async createAdminChildrenLoan(
    createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    try {
      const book = await this.bookChildrenExist(createBookLoanDto.bookBookCode);

      const newBookLoan = this.bookLoanRepository.create({
        ...createBookLoanDto,
        Status: 'En progreso',
        book: null,
        childrenBook: book,
        type: BookType.INFANTIL,
      });

      await this.bookLoanRepository.save(newBookLoan);

      const createNoteDto: CreateNoteDto = {
        message: `El libro con código ${book.BookCode} ha sido prestado por el funcionario: ${createBookLoanDto.aprovedBy}.`,
        type: 'Préstamo de libro infantil',
      };

      await this.noteService.createNote(createNoteDto);

      return { message: 'Préstamo generado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async extendLoan(
    bookLoanId: number,
    extendedDTO: ExtendLoanDTO,
  ): Promise<{ message: string }> {
    try {
      const existingLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: bookLoanId },
        relations: ['book', 'childrenBook'],
      });

      if (!existingLoan) {
        throw new NotFoundException(
          `No se encontró un préstamo con ID ${bookLoanId}`,
        );
      }

      if (existingLoan.Status !== 'En progreso') {
        throw new BadRequestException(
          `El préstamo con ID ${bookLoanId} no está en progreso y no puede extenderse.`,
        );
      }

      if (
        diffDays(new Date(existingLoan.LoanExpirationDate), new Date()) <= 4
      ) {
        throw new BadRequestException(
          `No se puede solicitar la extensión del préstamo: faltan menos de 4 días para la fecha límite.`,
        );
      }

      let prevRequest: BookLoan;

      if (existingLoan.book?.BookCode) {
        prevRequest = await this.bookLoanRepository.findOne({
          where: {
            userCedula: existingLoan.userCedula,
            Status: 'Pendiente',
            book: { BookCode: existingLoan.book.BookCode },
          },
        });
      } else if (existingLoan.childrenBook?.BookCode) {
        prevRequest = await this.bookLoanRepository.findOne({
          where: {
            userCedula: existingLoan.userCedula,
            Status: 'Pendiente',
            childrenBook: { BookCode: existingLoan.childrenBook.BookCode },
          },
        });
      }

      if (prevRequest) {
        throw new ConflictException(
          `Ya se solicito una extencion de prestamo para el libro ${prevRequest.book?.Title || prevRequest.childrenBook?.Title}`,
        );
      }

      const loan = this.bookLoanRepository.create(existingLoan);

      loan.LoanRequestDate = new Date();
      (loan.BookPickUpDate = existingLoan.LoanExpirationDate),
        (loan.LoanExpirationDate = new Date(extendedDTO.LoanExpirationDate));
      loan.aprovedBy = null;
      loan.Status = 'Pendiente';
      loan.BookLoanId = undefined;
      loan.Observations = `Solicitud de extension, motivo: ${extendedDTO.Reason}`;

      const newLoan = await this.bookLoanRepository.save(loan);

      await this.noteService.createNote({
        message: `Se ha solicitado la extension del préstamo del libro ${existingLoan.book?.BookCode || existingLoan.childrenBook?.Title}. Nuevo vencimiento solicitado: ${newLoan.LoanExpirationDate} `,
        type: 'Extensión de préstamo',
      });

      return {
        message:
          'Se a realizado la solicitud de extensión de prestamo exitosamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al extender el préstamo';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
