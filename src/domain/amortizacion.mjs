export function buildAmortization(principal, annualRate, months) {
  const P = Number(principal);
  const i = Number(annualRate) / 12;
  const n = Number(months);
  if (!P || !n) throw new Error("Principal o meses inválidos");

  let monthlyPayment;
  if (!i) monthlyPayment = +(P / n).toFixed(2);
  else {
    const pow = Math.pow(1 + i, n);
    monthlyPayment = +(P * (i * pow) / (pow - 1)).toFixed(2);
  }

  const schedule = [];
  let balance = P;
  for (let month = 1; month <= n; month++) {
    const interest = +(balance * i).toFixed(2);
    const principalPart = +(monthlyPayment - interest).toFixed(2);
    balance = +(balance - principalPart).toFixed(2);
    if (balance < 0) balance = 0;
    schedule.push({ period: month, payment: monthlyPayment, interest, principal: principalPart, balance });
  }
  return { monthlyPayment, schedule };
}
