export function generateEmailHTML({ name, principal, annualRate, months, monthlyPayment, schedule, status }) {
  const statusMessages = {
    approved: {
      title: '¡Felicitaciones! Tu préstamo ha sido APROBADO ✅',
      message: 'Nos complace informarte que tu solicitud de préstamo ha sido aprobada. Has cumplido con todos los requisitos de capacidad de endeudamiento necesarios.',
      color: '#28a745',
      icon: '✅'
    },
    rejected: {
      title: 'Tu préstamo ha sido RECHAZADO ❌',
      message: 'Lamentablemente, tu solicitud de préstamo no ha sido aprobada. Tu capacidad de endeudamiento actual no es suficiente para cumplir con las cuotas del préstamo en el plazo planteado.',
      color: '#dc3545',
      icon: '❌'
    },
    manual: {
      title: 'Tu préstamo está en EVALUACIÓN MANUAL ⏳',
      message: 'Tu solicitud de préstamo ha pasado a una validación manual por parte de nuestro equipo de análisis crediticio. Esto se debe a que requiere una revisión más detallada de tu perfil financiero.',
      color: '#ffc107',
      icon: '⏳'
    }
  };

  const statusInfo = statusMessages[status] || statusMessages.rejected;

  const rows = schedule.map(r => `
    <tr>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;">${r.period}</td>
      <td style="padding:6px;border:1px solid #ddd;">${fmt(r.payment)}</td>
      <td style="padding:6px;border:1px solid #ddd;">${fmt(r.interest)}</td>
      <td style="padding:6px;border:1px solid #ddd;">${fmt(r.principal)}</td>
      <td style="padding:6px;border:1px solid #ddd;">${fmt(r.balance)}</td>
    </tr>
  `).join("");

  return `
  <!doctype html>
  <html><head><meta charset="utf-8"><title>Estado de tu Préstamo</title></head>
  <body style="font-family:Arial,Helvetica,sans-serif;color:#111;">
    <h2>Hola ${esc(name ?? "cliente")},</h2>
    
    <div style="background-color:${statusInfo.color};color:white;padding:15px;border-radius:8px;margin:20px 0;text-align:center;">
      <h3 style="margin:0;font-size:20px;">${statusInfo.icon} ${statusInfo.title}</h3>
    </div>
    
    <p style="font-size:16px;line-height:1.5;margin:15px 0;">${statusInfo.message}</p>
    
    <h3>Detalles de tu solicitud:</h3>
    <ul>
      <li><b>Monto solicitado:</b> ${fmt(principal)}</li>
      <li><b>Tasa anual:</b> ${(Number(annualRate) * 100).toFixed(2)}%</li>
      <li><b>Plazo:</b> ${months} meses</li>
      <li><b>Cuota mensual estimada:</b> ${fmt(monthlyPayment)}</li>
    </ul>
    
    <h3>Tabla de amortización${status === 'rejected' ? ' (Referencial)' : status === 'manual' ? ' (Proyectada)' : ''}</h3>
    <p style="font-size:14px;color:#666;margin-bottom:15px;">
      ${status === 'approved'
      ? 'A continuación encontrarás el cronograma de pagos para tu préstamo:'
      : status === 'manual'
        ? 'Te mostramos el cronograma de pagos proyectado mientras evaluamos tu solicitud:'
        : 'Te mostramos cómo habría sido el cronograma de pagos para tu referencia:'}
    </p>    <table style="border-collapse:collapse;border:1px solid #ddd;width:100%;max-width:800px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:8px;border:1px solid #ddd;">#</th>
          <th style="padding:8px;border:1px solid #ddd;">Cuota</th>
          <th style="padding:8px;border:1px solid #ddd;">Interés</th>
          <th style="padding:8px;border:1px solid #ddd;">Capital</th>
          <th style="padding:8px;border:1px solid #ddd;">Saldo</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    
    ${status === 'approved'
      ? '<p style="margin-top:20px;padding:10px;background-color:#d4edda;border-left:4px solid #28a745;">📞 Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas para finalizar el proceso.</p>'
      : status === 'manual'
        ? '<p style="margin-top:20px;padding:10px;background-color:#fff3cd;border-left:4px solid #ffc107;">⏰ Nuestros analistas revisarán tu solicitud en un plazo máximo de 3-5 días hábiles. Te contactaremos con la decisión final.</p>'
        : '<p style="margin-top:20px;padding:10px;background-color:#f8d7da;border-left:4px solid #dc3545;">💡 Te recomendamos revisar tus ingresos y gastos, y volver a solicitar cuando tu capacidad de endeudamiento mejore.</p>'}    <p style="margin-top:18px;">Saludos,<br/>Equipo CrediYa</p>
  </body></html>`;
}

function fmt(n) { return Number(n ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
