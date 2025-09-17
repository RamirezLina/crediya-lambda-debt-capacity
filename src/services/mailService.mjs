import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { CONFIG } from "../config.mjs";


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
  return ses.send(new SendEmailCommand(params));
}

