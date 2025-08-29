import Twilio from "twilio";

const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function sendOtpSms(phone: string, otp: string) {
  const message = `Votre code OTP est : ${otp}. Ce code est valide 10 minutes.`;

  return client.messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: message,
  });
}
