/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { Between, Repository } from 'typeorm';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Collaborator } from 'src/collaborator/collaborator.entity';
import { addDay, date, format, weekEnd, weekStart } from '@formkit/tempo';
import { FriendsLibrary } from 'src/friends-library/friend-library.entity';
import { Donation } from 'src/donation/donation.entity';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';

@Injectable()
export class MailsService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor(
    @InjectRepository(BookLoan)
    private readonly bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Collaborator)
    private readonly colabRepo: Repository<Collaborator>,
    @InjectRepository(FriendsLibrary)
    private readonly friendRepo: Repository<FriendsLibrary>,
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
    @InjectRepository(RoomReservation)
    private readonly roomRepo: Repository<RoomReservation>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async formatDate(NFdate: string | Date) {
    return format({
      date: NFdate,
      format: 'DD-MM-YYYY',
      tz: 'America/Costa_Rica',
    });
  }

  async sendAproveLoan(loanID: number) {
    try {
      const bookLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: loanID },
      });
      const userData = await this.UserRepository.findOne({
        where: { cedula: bookLoan.userCedula },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: userData.email,
        subject: `Aprobacion de prestamo de libro ${bookLoan.book.Title || bookLoan.childrenBook.Title}`,
        html: `
    <p>Estimado Sr. o Sra. ${userData.name},</p>
    <p>
      El préstamo del libro <strong>${bookLoan.book?.Title || bookLoan.childrenBook?.Title}</strong> ha sido aprobado.
    </p>
    <p>
      Puede recogerlo el día <strong>${await this.formatDate(bookLoan.BookPickUpDate)}</strong>.
    </p>
    <p>
      Le recordamos que este préstamo vence el día <strong>${await this.formatDate(bookLoan.LoanExpirationDate)}</strong>.
    </p>
    <p>Gracias por utilizar nuestros servicios.</p>
      <br />
      <p>
      <strong>Coordinación bibliotecaria</strong><br />
      <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
      <strong>+506 2685-4213</strong><br />
      <strong>bpnicoya@sinabi.go.cr</strong>
    </p>
    `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }
  async sendRefuse(loanID: number) {
    try {
      const bookLoan = await this.bookLoanRepository.findOne({
        where: { BookLoanId: loanID },
      });
      const userData = await this.UserRepository.findOne({
        where: { cedula: bookLoan.userCedula },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: userData.email,
        subject: `Rechazo de préstamo de libro: ${bookLoan.book?.Title || bookLoan.childrenBook?.Title}`,
        html: `
        <p>Estimado Sr. o Sra. ${userData.name},</p>
        <p>
          Lamentamos informarle que su solicitud de préstamo del libro <strong>${bookLoan.book?.Title || bookLoan.childrenBook?.Title}</strong> ha sido rechazada.
        </p>
        <p>
          <strong>Motivo:</strong> ${bookLoan.Observations}
        </p>
        <p>
          Para más información, puede comunicarse con nosotros a través de los medios indicados al final de este mensaje.
        </p>
        <p>Gracias por su comprensión.</p>
        <br />
        <p>
          <strong>Coordinación bibliotecaria</strong><br />
          <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
          <strong>+506 2685-4213</strong><br />
          <strong>bpnicoya@sinabi.go.cr</strong>
        </p>
      `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async colabAprove(colabID: number) {
    try {
      const colab = await this.colabRepo.findOne({
        where: { CollaboratorId: colabID },
      });

      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: colab.UserEmail,
        subject: `Aprobación de colaboración conjunta`,
        html: `
           <p>Estimado(a) ${colab.UserFullName},</p>
    <p>
      Nos complace informarle que su solicitud de colaboración conjunta en la categoría <strong>${colab.PrincipalCategory}</strong> (subcategoría <strong>${colab.SubCategory}</strong>) ha sido <strong>aprobada</strong>.
    </p>
    <p>
      La actividad se llevará a cabo el día <strong>${await this.formatDate(colab.activityDate)}</strong>.
    </p>
    <p>
      Agradecemos su interés en colaborar con nuestra institución. Próximamente estaremos en contacto para brindarle más detalles.
    </p>
    <br />
    <p>
      <strong>Coordinación bibliotecaria</strong><br />
      <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
      <strong>+506 2685-4213</strong><br />
      <strong>bpnicoya@sinabi.go.cr</strong>
    </p>
            `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }
  async colabRefuse(colabID: number) {
    try {
      const colab = await this.colabRepo.findOne({
        where: { CollaboratorId: colabID },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: colab.UserEmail,
        subject: `Rechazo de colaboración conjunta`,
        html: `
      <p>Estimado(a) ${colab.UserFullName},</p>
    <p>
      Lamentamos informarle que su solicitud de colaboración conjunta en la categoría <strong>${colab.PrincipalCategory}</strong> (subcategoría <strong>${colab.SubCategory}</strong>) ha sido <strong>rechazada</strong>.
    </p>
    ${colab.Reason ? `<p><strong>Motivo:</strong> ${colab.Reason}</p>` : ''}
    <p>
      Le agradecemos su interés en colaborar con nosotros y le invitamos a participar en un futuro.
    </p>
    <br />
    <p>
      <strong>Coordinación bibliotecaria</strong><br />
      <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
      <strong>+506 2685-4213</strong><br />
      <strong>bpnicoya@sinabi.go.cr</strong>
    </p>
      `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }
  async colabCancel(colabID: number) {
    try {
      const colab = await this.colabRepo.findOne({
        where: { CollaboratorId: colabID },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: colab.UserEmail,
        subject: `Cancelación de colaboración conjunta`,
        html: `
              <p>Estimado(a) ${colab.UserFullName},</p>
              <p>
                Le informamos que la colaboración conjunta programada para el día <strong>${await this.formatDate(colab.activityDate)}</strong>, en la categoría <strong>${colab.PrincipalCategory}</strong> (subcategoría <strong>${colab.SubCategory}</strong>), ha sido <strong>cancelada</strong>.
              </p>
              ${
                colab.Reason
                  ? `<p><strong>Motivo:</strong> ${colab.Reason}</p>`
                  : ''
              }
              <p>
                Lamentamos los inconvenientes que esto pueda ocasionarle. Agradecemos su disposición y esperamos contar con su participación en futuras actividades.
              </p>
              <br />
              <p>
                <strong>Coordinación bibliotecaria</strong><br />
                <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
                <strong>+506 2685-4213</strong><br />
                <strong>bpnicoya@sinabi.go.cr</strong>
              </p>
            `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async friendAprove(FriendID: number) {
    try {
      const friend = await this.friendRepo.findOne({
        where: { FriendId: FriendID },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: friend.UserEmail,
        subject: `Aprobación como Amigo de la Biblioteca`,
        html: `
          <p>Estimado(a) ${friend.UserFullName},</p>
          <p>
            Nos complace informarle que su solicitud para ser reconocido como <strong>Amigo de la Biblioteca</strong> ha sido <strong>aprobada</strong>.
          </p>
          <p>
            Categoría: <strong>${friend.PrincipalCategory}</strong><br />
            Subcategoría: <strong>${friend.SubCategory}</strong>
          </p>
          <p>
            Este reconocimiento refleja su valiosa contribución y apoyo a nuestra institución. Estaremos en contacto pronto para brindarle más detalles sobre su participación.
          </p>
          <br />
          <p>
            <strong>Coordinación bibliotecaria</strong><br />
            <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
            <strong>+506 2685-4213</strong><br />
            <strong>bpnicoya@sinabi.go.cr</strong>
          </p>
        `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async friendRefuse(FriendID: number) {
    try {
      const friend = await this.friendRepo.findOne({
        where: { FriendId: FriendID },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: friend.UserEmail,
        subject: `Rechazo de solicitud como Amigo de la Biblioteca`,
        html: `
          <p>Estimado(a) ${friend.UserFullName},</p>
          <p>
            Lamentamos informarle que su solicitud para ser reconocido como <strong>Amigo de la Biblioteca</strong> ha sido <strong>rechazada</strong>.
          </p>
          ${
            friend.Reason
              ? `<p><strong>Motivo:</strong> ${friend.Reason}</p>`
              : ''
          }
          <p>
            Agradecemos su interés en colaborar con nuestra biblioteca y le animamos a seguir apoyando nuestras actividades en el futuro.
          </p>
          <br />
          <p>
            <strong>Coordinación bibliotecaria</strong><br />
            <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
            <strong>+506 2685-4213</strong><br />
            <strong>bpnicoya@sinabi.go.cr</strong>
          </p>
        `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }
  async DonationAprove(donationID: number) {
    try {
      const donation = await this.donationRepo.findOne({
        where: { DonationID: donationID },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: donation.UserEmail,
        subject: `Aprobación de su donación a la Biblioteca`,
        html: `
          <p>Estimado(a) ${donation.UserFullName},</p>
          <p>
            Nos complace informarle que su ofrecimiento de donación en la subcategoría <strong>${donation.SubCategory}</strong> ha sido <strong>aprobado</strong>.
          </p>
          <p>
            Agradecemos profundamente su generosidad. Puede entregar la donación el día <strong>${await this.formatDate(donation.DateRecolatedDonation)}</strong>.
          </p>
          ${
            donation.ItemDescription
              ? `<p><strong>Descripción del artículo:</strong> ${donation.ItemDescription}</p>`
              : ''
          }
          <p>
            Su aporte contribuirá significativamente a fortalecer los recursos de nuestra biblioteca.
          </p>
          <br/>
          <p>
            <strong>Coordinación bibliotecaria</strong><br />
            <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
            <strong>+506 2685-4213</strong><br />
            <strong>bpnicoya@sinabi.go.cr</strong>
          </p>
        `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }
  async DonationRefuse(donationID: number) {
    try {
      const donation = await this.donationRepo.findOne({
        where: { DonationID: donationID },
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: donation.UserEmail,
        subject: `Rechazo de su donación a la Biblioteca`,
        html: `
              <p>Estimado(a) ${donation.UserFullName},</p>
              <p>
                Le agradecemos sinceramente por su interés en donar a la Biblioteca Pública Municipal de Nicoya.
              </p>
              <p>
                Sin embargo, lamentamos informarle que la donación ofrecida en la subcategoría <strong>${donation.SubCategory}</strong> ha sido <strong>rechazada</strong>.
              </p>
              ${
                donation.Reason
                  ? `<p><strong>Motivo:</strong> ${donation.Reason}</p>`
                  : ''
              }
              <p>
                Valoramos su disposición a colaborar, y le animamos a participar en futuras iniciativas o donaciones.
              </p>
              <br/>
              <p>
                <strong>Coordinación bibliotecaria</strong><br />
                <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
                <strong>+506 2685-4213</strong><br />
                <strong>bpnicoya@sinabi.go.cr</strong>
              </p>
            `,
      };

      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async roomLoanAprove(roomLoanID: number) {
    try {
      const roomLoan = await this.roomRepo.findOne({
        where: { rommReservationId: roomLoanID },
        relations: ['user'],
      });
      if (!roomLoan.user) {
        return;
      }
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: roomLoan.user.email,
        subject: `Reserva de sala aprobada – Biblioteca Pública Municipal de Nicoya`,
        html: `
          <p>Estimado(a) ${roomLoan.user.name},</p>
          <p>
            Su solicitud de <strong>reserva de sala</strong> ha sido <strong>aprobada</strong>.
          </p>
          <p>
            Detalles de la reserva:
          </p>
          <ul>
            <li><strong>Institución:</strong> ${roomLoan.name}</li>
            <li><strong>Fecha reservada:</strong> ${await this.formatDate(roomLoan.date)}</li>
            <li><strong>Horas seleccionadas:</strong> ${roomLoan.selectedHours.join(', ')}</li>
            <li><strong>Cantidad de personas:</strong> ${roomLoan.personNumber}</li>
            <li><strong>Motivo:</strong> ${roomLoan.reason}</li>
          </ul>
          <p>
            Por favor, asista con puntualidad y respete las normas de uso de la sala.
          </p>
          <br />
          <p>
            <strong>Coordinación bibliotecaria</strong><br />
            <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
            <strong>+506 2685-4213</strong><br />
            <strong>bpnicoya@sinabi.go.cr</strong>
          </p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }
  async roomLoanRefuse(roomLoanID: number) {
    try {
      const roomLoan = await this.roomRepo.findOne({
        where: { rommReservationId: roomLoanID },
        relations: ['user'],
      });
      if (!roomLoan.user) {
        return;
      }
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: roomLoan.user.email,
        subject: `Reserva de sala rechazada – Biblioteca Pública Municipal de Nicoya`,
        html: `
          <p>Estimado(a) ${roomLoan.user.name},</p>
          <p>
            Le agradecemos su interés en reservar una sala. Sin embargo, su solicitud ha sido <strong>rechazada</strong>.
          </p>
          ${
            roomLoan.finishObservation
              ? `<p><strong>Motivo:</strong> ${roomLoan.finishObservation}</p>`
              : ''
          }
          <p>
            Si desea más información, puede comunicarse con nosotros mediante los canales oficiales.
          </p>
          <br />
          <p>
            <strong>Coordinación bibliotecaria</strong><br />
            <strong>Biblioteca Pública Municipal de Nicoya</strong><br />
            <strong>+506 2685-4213</strong><br />
            <strong>bpnicoya@sinabi.go.cr</strong>
          </p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async enrollmentConfirm(enrollmentID: number) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({
        where: { enrollmentId: enrollmentID },
        relations: ['course'],
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: enrollment.email,
        subject: 'Confirmación de matrícula al curso',
        html: `
          <p>Hola <strong>${enrollment.UserName}</strong>,</p>
          <p>Tu matrícula al curso <strong>${enrollment.course.courseName}</strong> ha sido confirmada exitosamente.</p>
          <p><strong>Fecha:</strong> ${await this.formatDate(enrollment.course.date)}<br>
          <strong>Hora:</strong> ${enrollment.course.courseTime}<br>
          <strong>Duración:</strong> ${enrollment.course.duration}<br>
          <strong>Ubicación:</strong> ${enrollment.course.location}<br>
          <strong>Instructor:</strong> ${enrollment.course.instructor}</p>
          <p>Gracias por ser parte de nuestros programas educativos.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async enrollmentCancel(enrollmentID: number) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({
        where: { enrollmentId: enrollmentID },
        relations: ['course'],
      });
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: enrollment.email,
        subject: `Cancelación de Matrícula – ${enrollment.course.courseName}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Cancelación de Matrícula</h2>
            <p>Estimado/a <strong>${enrollment.UserName}</strong>,</p>
            <p>Le informamos que su matrícula al curso <strong>${enrollment.course.courseName}</strong> ha sido cancelada.</p>
    
            <p><strong>Detalles del curso:</strong></p>
            <ul>
              <li><strong>Instructor:</strong> ${enrollment.course.instructor}</li>
              <li><strong>Fecha:</strong> ${await this.formatDate(enrollment.course.date)}</li>
              <li><strong>Hora:</strong> ${enrollment.course.courseTime}</li>
              <li><strong>Ubicación:</strong> ${enrollment.course.location}</li>
            </ul>
    
            ${enrollment.course.program?.programName ? `<p>Este curso pertenece al programa <strong>${enrollment.course.program.programName}</strong>.</p>` : ''}
    
            <p>Si esta cancelación fue un error, por favor contáctenos para más información.</p>
    
            <p>Gracias por confiar en nosotros.</p>
          </div>
        `,
      };
      await this.transporter.sendMail(mailOptions);
    } finally {
      return;
    }
  }

  async loanMemo() {
    try {
      const StartofTheWeek = weekStart(new Date());
      const maxExpDate = weekEnd(new Date());
      const loans = await this.bookLoanRepository.find({
        where: {
          LoanExpirationDate: Between(StartofTheWeek, maxExpDate),
          Status: 'En progreso',
        },
        relations: ['book', 'childrenBook'],
      });

      await Promise.all(
        loans.map(async (bookLoan) => {
          const user = await this.UserRepository.findOne({
            where: { cedula: bookLoan.userCedula },
          });
          if (!user) return;
   
          const mailOptions = {
            from: 'no-reply@yourapp.com',
            to: user.email,
            subject: `Recordatorio: Préstamo proximo a vencer`,
            html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto;">
              <h2 style="color: #2c3e50;">📚 Recordatorio de vencimiento de préstamo</h2>
              <p>Hola <strong>${user.name}</strong>,</p>
              
              <p>Este es un recordatorio de que tienes un préstamo próximo a vencer. A continuación, los detalles:</p>
              
              <ul>
                <li><strong>📅 Fecha de vencimiento:</strong> ${await this.formatDate(bookLoan.LoanExpirationDate)}</li>
                <li><strong>📖 Libro:</strong> ${bookLoan.book?.Title || bookLoan.childrenBook?.Title || 'Título no disponible'}</li>
              </ul>
          
              <p>Por favor, asegúrate de devolver el libro antes de la fecha indicada para evitar inconvenientes.</p>
          
              <h3 style="margin-top: 30px;">¿Deseas extender tu préstamo por más días?</h3>
              <p>Contacta con la biblioteca para gestionar la extensión.</p>
          
              <h4>📌 Medios de contacto:</h4>
              <ul>
                <li><strong>Teléfono:</strong> +506 2685-4213</li>
                <li><strong>WhatsApp:</strong> +506 7271-6041</li>
                <li><strong>Horario:</strong> Lunes a viernes, de 8:00 AM a 5:00 PM</li>
              </ul>
          
              <hr style="margin: 30px 0;" />
          
              <footer style="font-size: 0.9em; color: #666;">
                <p><strong>Coordinación bibliotecaria</strong><br />
                Biblioteca Pública Municipal de Nicoya<br />
                📞 +506 2685-4213<br />
                ✉️ bpnicoya@sinabi.go.cr</p>
          
                <p style="margin-top: 20px;">
                  Este es un mensaje automático, por favor no respondas directamente a este correo.
                </p>
              </footer>
            </div>
          `,
          };

          await this.transporter.sendMail(mailOptions);
        }),
      );
    } finally {
      return;
    }
  }
}
