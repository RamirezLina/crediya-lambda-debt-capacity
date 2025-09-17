import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { CONFIG } from "../config.mjs";

const sqsClient = new SQSClient({ region: CONFIG.region || "us-east-2" });

export async function sendToQueue(message) {
  try {
    const queueUrl = CONFIG.queueUrl;
    if (!queueUrl) {
      throw new Error("Queue URL is required");
    }

    const messageBody = JSON.stringify(message);

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: messageBody
    });

    const result = await sqsClient.send(command);

    console.log("Mensaje enviado a cola exitosamente:", {
      messageId: result.MessageId,
      queueUrl: queueUrl
    });

    return result;
  } catch (error) {
    console.error("Error enviando mensaje a cola:", {
      error: error.message,
      message: message
    });
    throw error;
  }
}

