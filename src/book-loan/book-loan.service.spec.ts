import { Test, TestingModule } from '@nestjs/testing';
import { BookLoanService } from './book-loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookLoan } from './book-loan.entity';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';

describe('BookLoanService', () => {
  let service: BookLoanService;
  let repository: Repository<BookLoan>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookLoanService,
        {
          provide: getRepositoryToken(BookLoan),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookLoanService>(BookLoanService);
    repository = module.get<Repository<BookLoan>>(getRepositoryToken(BookLoan));
  });

  it('debería lanzar un error si el libro no existe', async () => {
    const createBookLoanDto: CreateBookLoanDto = {
      BookPickUpDate: '2024-09-11',
      LoanExpirationDate: '2024-09-18',
      bookBookCode: 999,
      userCedula: '12345678',
      userPhone: '12345678',
      userAddress: '12345678',
      userName: '12345678',
      aprovedBy: undefined, 
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.createLoan(createBookLoanDto)).rejects.toThrow('El libro no existe');
  });

  it('debería lanzar un error si el usuario no existe', async () => {
    const createBookLoanDto: CreateBookLoanDto = {
      BookPickUpDate: '2024-09-11',
      LoanExpirationDate: '2024-09-18',
      bookBookCode: 1,
      userCedula: '99999999',
      userPhone: '12345678',
      userAddress: '12345678',
      userName: '12345678',
      aprovedBy: undefined, 
    };

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce({} as BookLoan);
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.createLoan(createBookLoanDto)).rejects.toThrow('El usuario no existe');
  });

  it('debería crear un préstamo de libro correctamente', async () => {
    const createBookLoanDto: CreateBookLoanDto = {
      BookPickUpDate: '2024-09-11',
      LoanExpirationDate: '2024-09-18',
      bookBookCode: 1,
      userCedula: '12345678',
      userPhone: '12345678',
      userAddress: '12345678',
      userName: '12345678',
      aprovedBy: 'Nuria',
   };

    jest.spyOn(repository, 'findOne').mockResolvedValue({} as BookLoan);
    jest.spyOn(repository, 'save').mockResolvedValue(createBookLoanDto as unknown as BookLoan);


    

    const result = await service.createLoan(createBookLoanDto);
    expect(result).toEqual(expect.objectContaining(createBookLoanDto));
  });
});
