export interface SendEmailOptions {
    to: string
    subject: string
    html: string
}

export interface IEmailRepository {
    sendEmail(options: SendEmailOptions): Promise<boolean>;
}