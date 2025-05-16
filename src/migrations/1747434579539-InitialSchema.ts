import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class InitialSchema1747434579539 implements MigrationInterface {
    name = 'InitialSchema1747434579539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`enrollment\` (\`enrollmentId\` int NOT NULL AUTO_INCREMENT, \`userCedula\` varchar(255) NOT NULL, \`enrollmentDate\` datetime NOT NULL, \`courseId\` int NOT NULL, \`UserName\` varchar(255) NOT NULL, \`direction\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`ePhone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Activa', PRIMARY KEY (\`enrollmentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`friend_library\` (\`FriendId\` int NOT NULL AUTO_INCREMENT, \`UserFullName\` varchar(255) NOT NULL, \`UserCedula\` varchar(255) NOT NULL, \`UserBirthDate\` date NOT NULL, \`UserGender\` varchar(255) NOT NULL, \`UserAddress\` varchar(255) NOT NULL, \`UserPhone\` varchar(255) NOT NULL, \`UserEmail\` varchar(255) NOT NULL, \`Status\` varchar(255) NOT NULL DEFAULT 'Pendiente', \`PrincipalCategory\` varchar(255) NOT NULL, \`SubCategory\` varchar(255) NOT NULL, \`Experience\` varchar(255) NULL, \`Document\` text NULL, \`DateGenerated\` date NOT NULL, \`ExtraInfo\` varchar(255) NULL, \`Reason\` varchar(255) NULL, \`User_Cedula\` varchar(255) NULL, PRIMARY KEY (\`FriendId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`donation\` (\`DonationID\` int NOT NULL AUTO_INCREMENT, \`UserFullName\` varchar(255) NOT NULL, \`UserCedula\` varchar(255) NOT NULL, \`UserAddress\` varchar(255) NOT NULL, \`UserPhone\` varchar(255) NOT NULL, \`UserEmail\` varchar(255) NOT NULL, \`Status\` varchar(255) NOT NULL DEFAULT 'Pendiente', \`SubCategory\` varchar(255) NOT NULL, \`Document\` text NULL, \`DateGenerated\` date NOT NULL, \`DateRecolatedDonation\` date NOT NULL, \`ItemDescription\` varchar(255) NULL, \`ResourceCondition\` varchar(255) NOT NULL, \`Reason\` varchar(255) NULL, \`User_Cedula\` varchar(255) NULL, PRIMARY KEY (\`DonationID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`collaborator\` (\`CollaboratorId\` int NOT NULL AUTO_INCREMENT, \`UserFullName\` varchar(255) NOT NULL, \`Entitycollaborator\` varchar(255) NULL, \`UserCedula\` varchar(255) NOT NULL, \`UserBirthDate\` date NOT NULL, \`UserGender\` varchar(255) NOT NULL, \`UserAddress\` varchar(255) NOT NULL, \`UserPhone\` varchar(255) NOT NULL, \`UserEmail\` varchar(255) NOT NULL, \`Status\` varchar(255) NOT NULL DEFAULT 'Pendiente', \`PrincipalCategory\` varchar(255) NOT NULL, \`SubCategory\` varchar(255) NOT NULL, \`Experience\` varchar(255) NULL, \`Document\` text NULL, \`DateGenerated\` date NOT NULL, \`ExtraInfo\` varchar(255) NOT NULL DEFAULT 'No posee experiencia previa', \`Description\` varchar(255) NOT NULL, \`Reason\` varchar(255) NULL, \`activityDate\` date NOT NULL, \`User_Cedula\` varchar(255) NULL, PRIMARY KEY (\`CollaboratorId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`cedula\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`province\` varchar(255) NOT NULL, \`district\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`birthDate\` date NOT NULL, \`password\` varchar(255) NOT NULL, \`registerDate\` date NOT NULL, \`acceptTermsAndConditions\` tinyint NOT NULL, \`status\` tinyint NOT NULL, \`loanPolicy\` int NOT NULL DEFAULT '0', \`role\` enum ('external_user', 'reception', 'asistente', 'admin', 'institucional') NOT NULL DEFAULT 'external_user', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`cedula\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms\` (\`roomId\` int NOT NULL AUTO_INCREMENT, \`example\` varchar(255) NOT NULL, \`roomNumber\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`area\` float NOT NULL, \`capacity\` int NOT NULL, \`observations\` varchar(255) NULL, \`image\` text NULL, \`location\` varchar(255) NOT NULL, \`status\` char(1) NOT NULL DEFAULT 'D', PRIMARY KEY (\`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`EventId\` int NOT NULL AUTO_INCREMENT, \`Location\` varchar(255) NOT NULL, \`Title\` varchar(255) NOT NULL, \`Details\` varchar(255) NOT NULL, \`Category\` varchar(255) NOT NULL, \`Date\` date NOT NULL, \`Time\` time NOT NULL, \`Image\` varchar(255) NOT NULL, \`TargetAudience\` varchar(255) NOT NULL, \`Status\` varchar(255) NOT NULL DEFAULT 'Pendiente de ejecución', \`InchargePerson\` varchar(255) NOT NULL, \`programProgramsId\` int NULL, PRIMARY KEY (\`EventId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room_reservations\` (\`rommReservationId\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`reservationDate\` datetime NOT NULL, \`date\` date NOT NULL, \`selectedHours\` text NOT NULL, \`observations\` text NULL, \`personNumber\` varchar(255) NOT NULL, \`reason\` varchar(255) NOT NULL, \`finishObservation\` varchar(255) NOT NULL DEFAULT '', \`reserveStatus\` varchar(255) NOT NULL DEFAULT 'Pendiente', \`EventId\` int NULL, \`courseId\` int NULL, \`userCedula\` varchar(255) NOT NULL, \`roomId\` int NULL, PRIMARY KEY (\`rommReservationId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`courses\` (\`courseId\` int NOT NULL AUTO_INCREMENT, \`courseName\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`courseTime\` time NOT NULL, \`location\` varchar(255) NOT NULL, \`instructor\` varchar(255) NOT NULL, \`courseType\` varchar(255) NOT NULL, \`targetAge\` int NOT NULL, \`capacity\` int NOT NULL, \`Status\` tinyint NOT NULL DEFAULT 1, \`image\` varchar(255) NOT NULL, \`materials\` varchar(255) NULL, \`duration\` varchar(255) NOT NULL, \`endDate\` date NOT NULL, \`programProgramsId\` int NULL, PRIMARY KEY (\`courseId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`programs\` (\`programsId\` int NOT NULL AUTO_INCREMENT, \`programName\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`image\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`programsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`localartist\` (\`ID\` int NOT NULL AUTO_INCREMENT, \`Name\` varchar(255) NOT NULL, \`ArtisProfession\` varchar(255) NOT NULL, \`Cover\` varchar(255) NOT NULL, \`MoreInfo\` text NOT NULL, \`Actived\` tinyint NOT NULL, \`FBLink\` varchar(255) NOT NULL, \`IGLink\` varchar(255) NOT NULL, \`LILink\` varchar(255) NOT NULL, PRIMARY KEY (\`ID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`furniture\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`Description\` varchar(255) NOT NULL, \`Location\` varchar(255) NOT NULL, \`InChargePerson\` varchar(255) NOT NULL, \`ConditionRating\` int NOT NULL, \`Status\` varchar(255) NOT NULL, \`LicenseNumber\` varchar(255) NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`computer_loan\` (\`ComputerLoanId\` int NOT NULL AUTO_INCREMENT, \`LoanStartDate\` datetime NOT NULL, \`LoanExpireDate\` datetime NULL, \`Status\` varchar(255) NOT NULL DEFAULT 'En curso', \`UserName\` varchar(255) NOT NULL, \`cedula\` varchar(255) NOT NULL, \`MachineNumber\` int NOT NULL, PRIMARY KEY (\`ComputerLoanId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workstations\` (\`MachineNumber\` int NOT NULL AUTO_INCREMENT, \`Location\` varchar(255) NOT NULL DEFAULT 'Biblioteca pública', \`Status\` varchar(255) NOT NULL DEFAULT 'Disponible', PRIMARY KEY (\`MachineNumber\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`computers\` (\`EquipmentUniqueCode\` int NOT NULL AUTO_INCREMENT, \`MachineNumber\` int NOT NULL, \`EquipmentSerial\` varchar(255) NOT NULL, \`EquipmentBrand\` varchar(255) NOT NULL, \`ConditionRating\` int NOT NULL, \`Observation\` varchar(255) NOT NULL, \`EquipmentCategory\` varchar(255) NOT NULL, \`Status\` tinyint NOT NULL, PRIMARY KEY (\`EquipmentUniqueCode\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`books-children\` (\`BookCode\` int NOT NULL AUTO_INCREMENT, \`Title\` varchar(255) NOT NULL, \`Author\` varchar(255) NOT NULL, \`Editorial\` varchar(255) NOT NULL, \`PublishedYear\` int NOT NULL, \`ISBN\` varchar(255) NOT NULL, \`ShelfCategory\` varchar(255) NOT NULL, \`Cover\` varchar(255) NOT NULL, \`BookConditionRating\` int NOT NULL, \`SignatureCode\` varchar(255) NOT NULL, \`InscriptionCode\` varchar(255) NOT NULL, \`ReserveBook\` tinyint NOT NULL, \`Observations\` varchar(255) NOT NULL, \`Status\` tinyint NOT NULL, PRIMARY KEY (\`BookCode\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`books\` (\`BookCode\` int NOT NULL AUTO_INCREMENT, \`Title\` varchar(255) NOT NULL, \`Author\` varchar(255) NOT NULL, \`Editorial\` varchar(255) NOT NULL, \`PublishedYear\` int NOT NULL, \`ISBN\` varchar(255) NOT NULL, \`ShelfCategory\` varchar(255) NOT NULL, \`Cover\` varchar(255) NOT NULL, \`BookConditionRating\` int NOT NULL, \`signatureCode\` varchar(255) NOT NULL, \`InscriptionCode\` varchar(255) NOT NULL, \`ReserveBook\` tinyint NOT NULL, \`Observations\` varchar(255) NOT NULL, \`Status\` tinyint NOT NULL, PRIMARY KEY (\`BookCode\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book_loans\` (\`BookLoanId\` int NOT NULL AUTO_INCREMENT, \`LoanRequestDate\` datetime NOT NULL, \`BookPickUpDate\` date NOT NULL, \`LoanExpirationDate\` date NOT NULL, \`Status\` varchar(255) NOT NULL, \`Observations\` varchar(255) NOT NULL, \`userCedula\` varchar(255) NOT NULL, \`userPhone\` varchar(255) NOT NULL, \`userAddress\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`aprovedBy\` varchar(255) NULL, \`receivedBy\` varchar(255) NULL, \`type\` enum ('INFANTIL', 'GENERAL') NOT NULL, \`bookBookCode\` int NULL, \`childrenBookBookCode\` int NULL, PRIMARY KEY (\`BookLoanId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notes\` (\`id_Note\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`deletedAt\` date NULL, \`message\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`trash\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id_Note\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`advice\` (\`id_Advice\` int NOT NULL AUTO_INCREMENT, \`reason\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`GenerateDate\` datetime NOT NULL, \`image\` varchar(255) NOT NULL, \`extraInfo\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_Advice\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`enrollment\` ADD CONSTRAINT \`FK_d1a599a7740b4f4bd1120850f04\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`courseId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friend_library\` ADD CONSTRAINT \`FK_e55940a724db0f96fb9565993e8\` FOREIGN KEY (\`User_Cedula\`) REFERENCES \`users\`(\`cedula\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`donation\` ADD CONSTRAINT \`FK_13719b06ce9fccf7719da65c3f3\` FOREIGN KEY (\`User_Cedula\`) REFERENCES \`users\`(\`cedula\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`collaborator\` ADD CONSTRAINT \`FK_ca0a109210c1b1749b7d2891d34\` FOREIGN KEY (\`User_Cedula\`) REFERENCES \`users\`(\`cedula\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_ffe5fdc1faea962843007f3ba04\` FOREIGN KEY (\`programProgramsId\`) REFERENCES \`programs\`(\`programsId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` ADD CONSTRAINT \`FK_d2433d16052ee0bf91c2bc75834\` FOREIGN KEY (\`EventId\`) REFERENCES \`events\`(\`EventId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` ADD CONSTRAINT \`FK_b3f0fdaf13a27bb26b4100d94bc\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`courseId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` ADD CONSTRAINT \`FK_0cd25e399af801895ecbf30aefe\` FOREIGN KEY (\`userCedula\`) REFERENCES \`users\`(\`cedula\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` ADD CONSTRAINT \`FK_28e2935a6c6d95d2de0c372c0cf\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`roomId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_1f0d13c40b760f70885dce69bf9\` FOREIGN KEY (\`programProgramsId\`) REFERENCES \`programs\`(\`programsId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`computer_loan\` ADD CONSTRAINT \`FK_3403463953fc7480cd52e3a62a9\` FOREIGN KEY (\`MachineNumber\`) REFERENCES \`workstations\`(\`MachineNumber\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`computers\` ADD CONSTRAINT \`FK_0e1ee5db262d027d3127757959a\` FOREIGN KEY (\`MachineNumber\`) REFERENCES \`workstations\`(\`MachineNumber\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book_loans\` ADD CONSTRAINT \`FK_77a9cf8572472791e58d9e81e9a\` FOREIGN KEY (\`bookBookCode\`) REFERENCES \`books\`(\`BookCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book_loans\` ADD CONSTRAINT \`FK_bab4018c0555c0f96aa0dd272ad\` FOREIGN KEY (\`childrenBookBookCode\`) REFERENCES \`books-children\`(\`BookCode\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

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
        await queryRunner.query(`DELETE FROM users WHERE cedula = '123456789'`);
        await queryRunner.query(`ALTER TABLE \`book_loans\` DROP FOREIGN KEY \`FK_bab4018c0555c0f96aa0dd272ad\``);
        await queryRunner.query(`ALTER TABLE \`book_loans\` DROP FOREIGN KEY \`FK_77a9cf8572472791e58d9e81e9a\``);
        await queryRunner.query(`ALTER TABLE \`computers\` DROP FOREIGN KEY \`FK_0e1ee5db262d027d3127757959a\``);
        await queryRunner.query(`ALTER TABLE \`computer_loan\` DROP FOREIGN KEY \`FK_3403463953fc7480cd52e3a62a9\``);
        await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_1f0d13c40b760f70885dce69bf9\``);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` DROP FOREIGN KEY \`FK_28e2935a6c6d95d2de0c372c0cf\``);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` DROP FOREIGN KEY \`FK_0cd25e399af801895ecbf30aefe\``);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` DROP FOREIGN KEY \`FK_b3f0fdaf13a27bb26b4100d94bc\``);
        await queryRunner.query(`ALTER TABLE \`room_reservations\` DROP FOREIGN KEY \`FK_d2433d16052ee0bf91c2bc75834\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_ffe5fdc1faea962843007f3ba04\``);
        await queryRunner.query(`ALTER TABLE \`collaborator\` DROP FOREIGN KEY \`FK_ca0a109210c1b1749b7d2891d34\``);
        await queryRunner.query(`ALTER TABLE \`donation\` DROP FOREIGN KEY \`FK_13719b06ce9fccf7719da65c3f3\``);
        await queryRunner.query(`ALTER TABLE \`friend_library\` DROP FOREIGN KEY \`FK_e55940a724db0f96fb9565993e8\``);
        await queryRunner.query(`ALTER TABLE \`enrollment\` DROP FOREIGN KEY \`FK_d1a599a7740b4f4bd1120850f04\``);
        await queryRunner.query(`DROP TABLE \`advice\``);
        await queryRunner.query(`DROP TABLE \`notes\``);
        await queryRunner.query(`DROP TABLE \`book_loans\``);
        await queryRunner.query(`DROP TABLE \`books\``);
        await queryRunner.query(`DROP TABLE \`books-children\``);
        await queryRunner.query(`DROP TABLE \`computers\``);
        await queryRunner.query(`DROP TABLE \`workstations\``);
        await queryRunner.query(`DROP TABLE \`computer_loan\``);
        await queryRunner.query(`DROP TABLE \`furniture\``);
        await queryRunner.query(`DROP TABLE \`localartist\``);
        await queryRunner.query(`DROP TABLE \`programs\``);
        await queryRunner.query(`DROP TABLE \`courses\``);
        await queryRunner.query(`DROP TABLE \`room_reservations\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP TABLE \`rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`collaborator\``);
        await queryRunner.query(`DROP TABLE \`donation\``);
        await queryRunner.query(`DROP TABLE \`friend_library\``);
        await queryRunner.query(`DROP TABLE \`enrollment\``);
       
    }

}
