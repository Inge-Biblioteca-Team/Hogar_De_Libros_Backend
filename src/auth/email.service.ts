/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordReset(email: string, resetLink: string, name: string) {
    const mailOptions = {
      from: 'no-reply@yourapp.com',
      to: email,
      subject: 'Solicitud de Restablecimiento de Contraseña',
      html: `
      <h1>Estimado/a ${name} ,</h1>
      <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en <strong>el sistema de la biblioteca publica municipal de Nicoya</strong>. Si no solicitó este cambio, puede ignorar este mensaje.</p>
      <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
      <p><a href="${resetLink}">Restablecer Contraseña</a></p>
      <p>Este enlace es válido por una hora. Después de este tiempo, deberá solicitar un nuevo restablecimiento de contraseña si aún necesita asistencia.</p>
      <p>Si tiene alguna pregunta o necesita más ayuda, no dude en ponerse en contacto a través de una llamada al +506 2685-4213.</p>
      <p>Gracias por utilizar nuestros servicios.</p>
      <p>Saludos cordiales,</p>
      <strong>Coordinación bibliotecaria</strong><br />
      <strong>Biblioteca publica municipal de Nicoya</strong><br />
      <strong>+506 2685-4213</strong><br />
      <strong>bpnicoya@sinabi.go.cr</strong></p>
    `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
