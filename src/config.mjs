export const CONFIG = {
  fromEmail: process.env.FROM_EMAIL,
  subject: process.env.SUBJECT ?? "Validación automática de tu solicitud de crédito",
  queueUrl: process.env.RESULT_QUEUE_URL,
  region: process.env.AWS_REGION || "us-east-2"
};