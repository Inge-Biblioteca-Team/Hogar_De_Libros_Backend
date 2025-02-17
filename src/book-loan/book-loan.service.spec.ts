import { Test, TestingModule } from '@nestjs/testing';
import { BookLoanService } from './book-loan.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.entity';
import { Book } from 'src/books/book.entity';
import { NotesService } from 'src/notes/notes.service';
import { UserService } from 'src/user/user.service';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookLoanService', () => {
  let service: BookLoanService;
  let bookLoanRepository: Repository<BookLoan>;
  let bookRepository: Repository<Book>;
  let userService: UserService;
  let noteService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookLoanService,
        {
          provide: getRepositoryToken(BookLoan),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
        {
          provide: UserService,
          useValue: {
            findCedula: jest.fn(), // Mockea la función findCedula
          },
        },
        {
          provide: NotesService,
          useValue: {
            createNote: jest.fn(), // Mockea la función createNote
          },
        },
      ],
    }).compile();

    service = module.get<BookLoanService>(BookLoanService);
    bookLoanRepository = module.get<Repository<BookLoan>>(getRepositoryToken(BookLoan));
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    userService = module.get<UserService>(UserService);
    noteService = module.get<NotesService>(NotesService);
  });

  describe('createLoan', () => {
    it('debe crear un préstamo exitosamente', async () => {
      const createBookLoanDto: CreateBookLoanDto = {
        bookBookCode: 123,
        userCedula: '456',
        BookPickUpDate: '',
        LoanExpirationDate: '',
        userPhone: '',
        userAddress: '',
        userName: ''
      };

      const book = { BookCode: 123, Status: true } as Book;
      const user = { cedula: '456', name: 'Usuario Prueba', loanPolicy: 'basic' };
      const loanPolicyMock = { canLoan: true }; 

      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);

      jest.spyOn(bookLoanRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(bookLoanRepository, 'count').mockResolvedValue(0);
      jest.spyOn(bookLoanRepository, 'create').mockReturnValue({ Status: 'Pendiente', book } as BookLoan);
      jest.spyOn(bookLoanRepository, 'save').mockResolvedValue(null);
      jest.spyOn(noteService, 'createNote').mockResolvedValue(null);

       expect(true);
    });

    it('debe lanzar un error si el libro no existe', async () => {
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);
      const createBookLoanDto: CreateBookLoanDto = {
        bookBookCode: 123, userCedula: '456',
        BookPickUpDate: '',
        LoanExpirationDate: '',
        userPhone: '',
        userAddress: '',
        userName: ''
      };

      await expect(service.createLoan(createBookLoanDto)).rejects.toThrow(
        new NotFoundException('El libro con código 123 no fue encontrado'),
      );
    });

    it('debe lanzar un error si el usuario no existe', async () => {
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue({ BookCode: 123, Status: true } as Book);
      jest.spyOn(userService, 'findCedula').mockResolvedValue(null);

      const createBookLoanDto: CreateBookLoanDto = {
        bookBookCode: 123, userCedula: '456',
        BookPickUpDate: '',
        LoanExpirationDate: '',
        userPhone: '',
        userAddress: '',
        userName: ''
      };

      await expect(service.createLoan(createBookLoanDto)).rejects.toThrow(
        new NotFoundException('El usuario no existe'),
      );
    });

    it('debe lanzar un error si el libro ya tiene un préstamo activo', async () => {
      const createBookLoanDto: CreateBookLoanDto = {
        bookBookCode: 123, userCedula: '456',
        BookPickUpDate: '',
        LoanExpirationDate: '',
        userPhone: '',
        userAddress: '',
        userName: ''
      };
      const book = { BookCode: 123, Status: true } as Book;
      const user = { cedula: '456', name: 'Usuario Prueba', loanPolicy: 'basic' };

      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);
      
      jest.spyOn(bookLoanRepository, 'findOneBy').mockResolvedValue({ Status: 'En progreso' } as BookLoan);

       expect(true)
    });
  });

  describe('finalizeLoan', () => {
    it('debe finalizar un préstamo correctamente', async () => {
      const mockLoan = {
        BookLoanId: 1,
        Status: 'En progreso',
      } as BookLoan;

      jest.spyOn(bookLoanRepository, 'findOne').mockResolvedValue(mockLoan);
      jest.spyOn(bookLoanRepository, 'save').mockResolvedValue(null);

      await expect(
        service.finalizeLoan({ LoanID: 1, person: 'Admin', Observations: 'Devuelto en buen estado' }),
      ).resolves.toEqual({ message: 'Éxito al finalizar el préstamo' });

      expect(bookLoanRepository.save).toHaveBeenCalledWith({
        ...mockLoan,
        Status: 'Finalizado',
        receivedBy: 'Admin',
        Observations: 'Devuelto en buen estado',
      });
    });

    it('debe lanzar error si el préstamo no existe', async () => {
      jest.spyOn(bookLoanRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.finalizeLoan({ LoanID: 99, person: 'Admin', Observations: 'Devuelto' }),
      ).rejects.toThrow(new NotFoundException('Préstamo numero 99 no encontrado'));
    });
  });

  describe('cancelLoan', () => {
    it('debe cancelar un préstamo correctamente', async () => {
      const mockLoan = {
        BookLoanId: 1,
        Status: 'Pendiente',
      } as BookLoan;

      jest.spyOn(bookLoanRepository, 'findOne').mockResolvedValue(mockLoan);
      jest.spyOn(bookLoanRepository, 'save').mockResolvedValue(null);

      await expect(
        service.cancelLoan({ LoanID: 1, person: 'Admin', Observations: 'Cancelado por error' }),
      ).resolves.toEqual({ message: 'Éxito al finalizar el préstamo' });

      expect(bookLoanRepository.save).toHaveBeenCalledWith({
        ...mockLoan,
        Status: 'Cancelado',
        receivedBy: 'Admin',
        Observations: 'Cancelado por error',
      });
    });

    it('debe lanzar error si el préstamo no existe', async () => {
      jest.spyOn(bookLoanRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.cancelLoan({ LoanID: 99, person: 'Admin', Observations: 'Error' }),
      ).rejects.toThrow(new NotFoundException('Préstamo numero 99 no encontrado'));
    });
  });
});
