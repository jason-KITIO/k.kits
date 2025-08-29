// template/smsTemplate.ts
export function generateVerificationSMS(code: string) {
  return `Votre code de vérification est : ${code}. Ce code est valide 10 minutes.`;
}
