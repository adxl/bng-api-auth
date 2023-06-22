import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MailerHelper {
  @Inject(MailerService)
  private readonly mailerService: MailerService;

  public async sendUserCreationEmail(email: string, password: string): Promise<void> {
    await this.mailerService.sendMail({
      from: 'no-reply@bng.fr',
      to: email,
      subject: "Bienvenue sur Board N' Go",
      html:
        '<p>Voici vos identifiants pour vous connecter au site</p><ul><li> Email : ' +
        email +
        '</li><li>Mot de passe : ' +
        password +
        '</li></ul>',
    });
  }
}
