import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedUsuarioAdmin1747359999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = bcrypt.hashSync('admin123', 10); // Cambia la contraseña si lo deseas

    await queryRunner.query(`
      INSERT INTO users (
        cedula, email, name, lastName, phoneNumber, province, district, gender,
        address, birthDate, password, registerDate, acceptTermsAndConditions,
        status, loanPolicy, role
      ) VALUES (
        '123456789',
        'bibliotecapublicanicoya@gmail.com',
        'Biblioteca',
        'Administrador Default',
        '2685-4213',
        'Guanacaste',
        'Nicoya',
        'Hombre',
        'Frente a las piscinas de ANDE, Nicoya, Costa Rica 59',
        '2000-01-01',
        '${password}',
        CURDATE(),
        true,
        true,
        77,
        'admin'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE cedula = '123456789'
    `);
  }
}
