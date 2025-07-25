// Función para generar un ID único
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Función para formatear fechas
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
};

// Función para formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Función para calcular el total de una orden
export const calculateOrderTotal = (order, studies, packages) => {
  let total = 0;
  order.studies.forEach(studyId => {
    const study = studies.find(s => s.id === studyId);
    if (study) {
      total += study.price;
    }
  });
  order.packages.forEach(packageId => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      total += pkg.price;
    }
  });
  return total;
};

// Función para aplicar descuento de convenio
export const applyConvenioDiscount = (total, convenio, convenios) => {
  const selectedConvenio = convenios.find(c => c.id === convenio);
  if (selectedConvenio) {
    return total * (1 - selectedConvenio.discount / 100);
  }
  return total;
};

// Función para generar el PDF del recibo
export const generateReceiptPdf = (order, patient, studies, packages, convenios, logoBase64) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const totalAmount = calculateOrderTotal(order, studies, packages);
  const finalAmount = applyConvenioDiscount(totalAmount, order.convenioId, convenios);
  const convenioInfo = convenios.find(c => c.id === order.convenioId);

  // Colores y fuentes
  const primaryColor = '#2E7D32'; // Verde oscuro para acentos
  const textColor = '#333333'; // Gris oscuro para texto
  const lightTextColor = '#666666'; // Gris claro para detalles

  doc.setFont("helvetica"); // Puedes cambiar la fuente si tienes alguna cargada

  // Header - Logo y Título
  let currentY = 15;
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 15, currentY, 50, 25); // Ajusta posición y tamaño del logo
  }
  
  doc.setFontSize(22);
  doc.setTextColor(primaryColor);
  doc.text("COMPROBANTE DE PAGO", 200, currentY + 15, { align: 'right' });
  currentY += 35; // Espacio después del header

  doc.setDrawColor(primaryColor); // Color de la línea
  doc.setLineWidth(0.5); // Grosor de la línea
  doc.line(15, currentY, 195, currentY); // Línea divisoria
  currentY += 10;

  // Información de la Transacción
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text("Detalles de la Transacción:", 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor);
  doc.text(`Fecha de Emisión: ${formatDate(new Date().toISOString().split('T')[0])}`, 15, currentY);
  currentY += 5;
  doc.text(`No. de Orden: ${order.id}`, 15, currentY);
  currentY += 5;
  doc.text(`Fecha de Orden: ${formatDate(order.date)}`, 15, currentY);
  currentY += 10;

  doc.line(15, currentY, 195, currentY); // Línea divisoria
  currentY += 10;

  // Información del Paciente
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text("Información del Paciente:", 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor);
  doc.text(`Nombre: ${patient.name} ${patient.lastName}`, 15, currentY);
  currentY += 5;
  doc.text(`Teléfono: ${patient.phone}`, 15, currentY);
  currentY += 5;
  doc.text(`Email: ${patient.email || 'No especificado'}`, 15, currentY);
  currentY += 10;

  doc.line(15, currentY, 195, currentY); // Línea divisoria
  currentY += 10;

  // Detalles de Estudios y Paquetes
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text("Conceptos de Pago:", 15, currentY);
  currentY += 7;

  doc.setFontSize(10);
  doc.setTextColor(lightTextColor);
  doc.setFont("helvetica", "bold");
  doc.text("Descripción", 20, currentY);
  doc.text("Precio Unitario", 120, currentY, { align: 'right' });
  doc.text("Subtotal", 180, currentY, { align: 'right' });
  doc.setFont("helvetica", "normal");
  currentY += 5;
  doc.line(15, currentY, 195, currentY); // Línea divisoria
  currentY += 5;

  // Listado de items
  order.studies.forEach(studyId => {
    const study = studies.find(s => s.id === studyId);
    if (study) {
      doc.text(`${study.name} (${study.category || study.type})`, 20, currentY);
      doc.text(formatCurrency(study.price), 120, currentY, { align: 'right' });
      doc.text(formatCurrency(study.price), 180, currentY, { align: 'right' });
      currentY += 7;
    }
  });

  order.packages.forEach(packageId => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      doc.text(`${pkg.name} (Paquete)`, 20, currentY);
      doc.text(formatCurrency(pkg.price), 120, currentY, { align: 'right' });
      doc.text(formatCurrency(pkg.price), 180, currentY, { align: 'right' });
      currentY += 7;
    }
  });

  currentY += 5;
  doc.line(15, currentY, 195, currentY); // Línea divisoria
  currentY += 5;

  // Totales
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text(`Subtotal:`, 140, currentY);
  doc.text(formatCurrency(totalAmount), 180, currentY, { align: 'right' });
  currentY += 7; // Aumentar el espacio para el siguiente elemento

  if (convenioInfo) {
    doc.text(`Descuento (${convenioInfo.name} - ${convenioInfo.discount}%):`, 140, currentY);
    doc.text(`-${formatCurrency(totalAmount - finalAmount)}`, 180, currentY, { align: 'right' });
    currentY += 7; // Aumentar el espacio para el siguiente elemento
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text(`TOTAL A PAGAR:`, 140, currentY);
  doc.text(formatCurrency(finalAmount), 180, currentY, { align: 'right' });
  currentY += 15;

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor);
  doc.text("Gracias por su preferencia. JOVALABS - Cuidando tu salud con precisión.", 105, doc.internal.pageSize.height - 15, { align: 'center' });

  doc.save(`comprobante_jovalabs_${order.id}.pdf`);
};

// Función para convertir imagen a Base64
export const getBase64Image = (imgUrl, callback) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    callback(dataURL);
  };
  img.src = imgUrl;
};