import { CONFIG } from "./config.mjs";
import { buildAmortization } from "./domain/amortizacion.mjs";
import { generateEmailHTML } from "./services/emailTemplateService.mjs";
import { sendHtmlEmail } from "./services/mailService.mjs";
import { sendToQueue } from "./services/queueService.mjs";
import { validateDebtCapacity } from "./domain/validation.mjs";



export const handler = async (event) => {
  const batchItemFailures = [];

  for (const record of event.Records) {
    try {
      const decodedMessage = JSON.parse(record.body);
      const capacityData = normalizeFromLoanApplication(decodedMessage);

      const finalStatus = validateDebtCapacity(capacityData);

      const { monthlyPayment, schedule } = buildAmortization(
        capacityData.totalAmount,
        capacityData.annualRate,
        capacityData.months
      );

      const html = generateEmailHTML({
        name: capacityData.name,
        principal: capacityData.totalAmount,
        annualRate: capacityData.annualRate,
        months: capacityData.months,
        monthlyPayment,
        schedule,
        status: finalStatus.toLowerCase()
      });


      await sendHtmlEmail(capacityData.email, html);
      console.log("Email enviado a:", capacityData.email);

      const queueMessage = {
        applicationId: capacityData.applicationId,
        status: finalStatus
      };

      await sendToQueue(queueMessage);
      console.log("Resultado enviado a cola:", finalStatus);
    } catch (err) {
      console.error("Error procesando record:", record.messageId, err);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};

function normalizeFromLoanApplication(queueMessage) {
  const applicationId = queueMessage?.id ?? queueMessage?.idApplication ?? null;
  const email = queueMessage?.email ?? null;
  const name = queueMessage?.name ?? null;
  const totalAmount = toNumber(queueMessage?.totalAmount);
  const annualRate = toNumber(queueMessage?.interestRate);
  const baseSalary = toNumber(queueMessage?.baseSalary);

  const months = monthsBetweenLocalDates(queueMessage?.creationDate, queueMessage?.deadline);

  const approvedApplicationList = Array.isArray(queueMessage?.approvedApplicationList)
    ? queueMessage.approvedApplicationList.map((approvedLoans) => ({
      id: toNumber(approvedLoans?.id),
      monthlyAmount: toNumber(approvedLoans?.monthlyAmount),
    }))
    : [];

  return {
    applicationId,
    email,
    name,
    totalAmount,
    annualRate,
    months,
    baseSalary,
    approvedApplicationList,
  };
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function monthsBetweenLocalDates(startStr, endStr) {
  if (!startStr || !endStr) return 0;
  const s = new Date(`${startStr}T00:00:00Z`);
  const e = new Date(`${endStr}T00:00:00Z`);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;

  const years = e.getUTCFullYear() - s.getUTCFullYear();
  const months = e.getUTCMonth() - s.getUTCMonth();
  let total = years * 12 + months;

  const dayS = s.getUTCDate();
  const dayE = e.getUTCDate();
  if (dayE < dayS) total -= 1;

  return Math.max(total, 1);
}

