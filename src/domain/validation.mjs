export function validateDebtCapacity(capacityData) {
  const monthlyRate = capacityData.annualRate / 12;
  const monthlyAmount = calculateMonthlyAmount(capacityData.totalAmount, monthlyRate, capacityData.months);

  const maxCapacity = calculateMaxDebtCapacity(capacityData.baseSalary);
  const currentMonthlyDebt = calculateCurrentMonthlyDebt(capacityData.approvedApplicationList);
  const availableCapacity = calculateAvailableCapacity(maxCapacity, currentMonthlyDebt);

  if (monthlyAmount <= availableCapacity) {
    const requiresReview = Number(p.principal ?? 0) > 5 * Number(p.salary ?? 0);
    return requiresReview ? "MANUAL" : "APPROVED"
  }
  return "REJECTED";

}


function calculateMaxDebtCapacity(baseSalary) {
  const salary = Number(baseSalary ?? 0);
  if (!salary || salary <= 0) throw new Error("Salario base inválido");
  return +(salary * 0.35).toFixed(2);
}

function calculateCurrentMonthlyDebt(approvedApplicationList) {

  approvedApplicationList = Array.isArray(approvedApplicationList) ? approvedApplicationList : [];
  return approvedApplicationList.reduce((sum, app) => sum + app.monthlyAmount, 0);
}

export function calculateAvailableCapacity(maxCapacity, currentMonthlyDebt) {
  const max = Number(maxCapacity ?? 0);
  const debt = Number(currentMonthlyDebt ?? 0);
  const available = max - debt;
  return available > 0 ? +available.toFixed(2) : 0;
}

export function calculateMonthlyAmount(loanAmount, monthlyRate, months) {
  const P = Number(loanAmount ?? 0);
  const i = Number(monthlyRate ?? 0);
  const n = Number(months ?? 0);
  if (!P || !n) throw new Error("Invalid data");

  if (!i) return +(P / n).toFixed(2);

  const factor = Math.pow(1 + i, n);
  const installment = P * (i * factor) / (factor - 1);
  return +installment.toFixed(2);
}

export function decideLoan(monthlyAmount, availableCapacity) {


  if (newTariff <= availableCapacity) {
    const requiresReview = Number(p.principal ?? 0) > 5 * Number(p.salary ?? 0);
    return requiresReview ? "MANUAL" : "APPROVED"
  }
  return "REJECTED";
}

