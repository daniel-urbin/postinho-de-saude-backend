import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Função para enviar e-mails usando Resend.
 * @param destinatario - E-mail do destinatário.
 * @param assunto - Assunto do e-mail.
 * @param mensagem - Conteúdo do e-mail.
 */
export async function enviarEmail(destinatario: string, assunto: string, mensagem: string) {
  try {
    await resend.emails.send({
      from: 'noreply@seuprojeto.com', // Configure um remetente verificado no Resend
      to: destinatario,
      subject: assunto,
      text: mensagem,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail');
  }
}