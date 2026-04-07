import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'MudaFácil <noreply@mudafacil.com.br>',
    to: email,
    subject: 'Bem-vindo ao MudaFácil! Seu trial de 14 dias começou',
    html: `
      <h1>Olá, ${name}!</h1>
      <p>Seu trial gratuito de 14 dias está ativo. Aproveite todas as funcionalidades:</p>
      <ul>
        <li>Canvas interativo de carga com drag & drop</li>
        <li>Comparação visual de caminhões</li>
        <li>Cotações ilimitadas de transportadoras</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Começar minha mudança →</a></p>
    `,
  })
}
