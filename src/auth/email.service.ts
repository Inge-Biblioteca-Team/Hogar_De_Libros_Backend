import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
 

  async sendPasswordReset(email: string, resetLink: string,subject:string) {
    const mailOptions = {
      from: 'no-reply@yourapp.com',
      to: email,
      subject: subject,
      text: `Haz click en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
      html: `
        <h1>Restablecimiento de contraseña</h1>
        <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}