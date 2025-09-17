import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { CONFIG } from "../config.mjs";

const sesClient = new SESClient({ region: process.env.AWS_REGION || "us-east-2" });

export async function sendHtmlEmail(to, html) {
  const params = {
    Source: CONFIG.fromEmail,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: {
        Data: CONFIG.subject
      },
      Body: {
        Html: {
          Data: html
        }
      }
    }
  };
  return sesClient.send(new SendEmailCommand(params));
}

