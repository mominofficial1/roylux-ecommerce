import jsPDF from 'jspdf';
import { Order, SiteSettings } from './types';

export function generateInvoicePDF(order: any, settings?: SiteSettings) {
  // A4 dimensions: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Background subtle luxury paper tint
  doc.setFillColor(252, 251, 249); // #fcfbf9
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Luxury Black Header Banner
  doc.setFillColor(15, 15, 15); // Deep Charcoal #0f0f0f
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent line under header
  doc.setFillColor(212, 175, 55); // #d4af37 gold
  doc.rect(0, 42, pageWidth, 1.5, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('ROYLUX', margin, 18);

  // Brand Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text('HAUTE STREETWEAR & HEAVYWEIGHT FLEECE', margin, 24);

  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 200);
  const companyAddress = settings?.address || 'Banani / Gulshan-2, Dhaka 1213, Bangladesh';
  const companyPhone = settings?.phone || '+880 1700-000000';
  const companyEmail = settings?.email || 'concierge@roylux.com';
  doc.text(`${companyAddress} | ${companyPhone} | ${companyEmail}`, margin, 30);
  doc.text('Official Web: roylux-ecommerce.vercel.app', margin, 35);

  // Header Right: Invoice Title & Meta
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('OFFICIAL INVOICE', pageWidth - margin, 16, { align: 'right' });

  const invoiceNum = order.orderNumber || order.id || 'RL-INV';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55);
  doc.text(`INV-${String(invoiceNum).toUpperCase()}`, pageWidth - margin, 23, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 200);
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`DATE: ${orderDate}`, pageWidth - margin, 29, { align: 'right' });
  const orderStatus = order.orderStatus || order.status || 'CONFIRMED';
  doc.text(`STATUS: ${String(orderStatus).toUpperCase()}`, pageWidth - margin, 35, { align: 'right' });

  // Two Column Customer & Order Overview Cards
  let y = 52;
  const colWidth = (contentWidth - 6) / 2;

  // Customer Name / Phone / Address
  const customerName = order.customer?.fullName || order.customerName || 'Valued Customer';
  const customerPhone = order.customer?.mobile || order.customerPhone || 'N/A';
  const customerEmail = order.customer?.email || order.customerEmail || 'N/A';

  const fullAddr = order.customer?.fullAddress || order.shippingAddress?.address || '';
  const dist = order.customer?.district || order.shippingAddress?.district || '';
  const divn = order.customer?.division || order.shippingAddress?.division || '';
  const addressParts = [fullAddr, dist, divn].filter(Boolean);
  const addressText = addressParts.length > 0 ? addressParts.join(', ') : 'Delivery Address on file';

  // Left Card: Customer Details
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(230, 228, 222);
  doc.roundedRect(margin, y, colWidth, 38, 2, 2, 'FD');

  doc.setTextColor(15, 15, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('BILLED TO (CUSTOMER)', margin + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(customerName.substring(0, 28), margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Phone: ${customerPhone}`, margin + 4, y + 19);
  doc.text(`Email: ${customerEmail}`, margin + 4, y + 24);

  const splitAddress = doc.splitTextToSize(`Address: ${addressText}`, colWidth - 8);
  doc.text(splitAddress.slice(0, 2), margin + 4, y + 29);

  // Right Card: Order & Delivery Overview
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + colWidth + 6, y, colWidth, 38, 2, 2, 'FD');

  doc.setTextColor(15, 15, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DELIVERY & PAYMENT SPEC', margin + colWidth + 10, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Order Reference: #${order.orderNumber || order.id}`, margin + colWidth + 10, y + 13);

  const payMethod = order.paymentMethod || 'cod';
  const payLabel = payMethod === 'cod' ? 'Cash on Delivery (COD)' : String(payMethod).toUpperCase();
  doc.text(`Payment Method: ${payLabel}`, margin + colWidth + 10, y + 19);

  const payStatus = order.paymentStatus || 'pending';
  doc.text(`Payment Status: ${String(payStatus).toUpperCase()}`, margin + colWidth + 10, y + 25);

  const isDhaka = dist.toLowerCase().includes('dhaka') || order.deliveryArea === 'dhaka';
  doc.text(
    `Delivery Zone: ${isDhaka ? 'Inside Dhaka City (24-48h)' : 'All Bangladesh 64 Districts (2-4d)'}`,
    margin + colWidth + 10,
    y + 31
  );

  // Itemized Table
  y = 97;

  // Table Header
  doc.setFillColor(15, 15, 15);
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('#', margin + 3, y + 5.5);
  doc.text('ITEM DESCRIPTION', margin + 12, y + 5.5);
  doc.text('SPEC / COLOR', margin + 95, y + 5.5);
  doc.text('QTY', margin + 130, y + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', margin + 155, y + 5.5, { align: 'right' });
  doc.text('TOTAL (BDT)', pageWidth - margin - 3, y + 5.5, { align: 'right' });

  y += 8;

  // Table Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const items = order.items || [];
  items.forEach((item: any, index: number) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 246, isEven ? 255 : 243);
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setDrawColor(235, 233, 227);
    doc.line(margin, y + 9, pageWidth - margin, y + 9);

    doc.setTextColor(15, 15, 15);
    doc.text(String(index + 1), margin + 3, y + 6);

    const itemName = item.name || item.productName || 'RoyLux Heavyweight Fleece';
    doc.text(itemName.length > 40 ? itemName.substring(0, 40) + '...' : itemName, margin + 12, y + 6);

    const itemSize = item.size || item.selectedSize || 'Standard';
    const itemColor = item.color || item.selectedColor;
    const spec = `Size: ${itemSize}${itemColor ? ` | ${itemColor}` : ''}`;
    doc.setTextColor(80, 80, 80);
    doc.text(spec, margin + 95, y + 6);

    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const lineTotal = item.subtotal || price * qty;

    doc.setTextColor(15, 15, 15);
    doc.text(String(qty), margin + 130, y + 6, { align: 'center' });
    doc.text(`TK ${price.toLocaleString()}`, margin + 155, y + 6, { align: 'right' });
    doc.text(`TK ${lineTotal.toLocaleString()}`, pageWidth - margin - 3, y + 6, {
      align: 'right',
    });

    y += 9;
  });

  // Financial Breakdown Card (Bottom Right)
  y += 6;
  const summaryX = pageWidth - margin - 75;
  const summaryWidth = 75;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 217, 210);
  doc.roundedRect(summaryX, y, summaryWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);

  const subtotal = Number(order.subtotal) || 0;
  const deliveryCharge = Number(order.deliveryCharge ?? order.deliveryFee ?? (isDhaka ? 70 : 130));
  const discount = Number(order.discountAmount ?? order.discount ?? 0);
  const total = Number(order.total) || subtotal + deliveryCharge - discount;

  doc.text('Items Subtotal:', summaryX + 4, y + 7);
  doc.setTextColor(15, 15, 15);
  doc.text(`TK ${subtotal.toLocaleString()}`, pageWidth - margin - 4, y + 7, { align: 'right' });

  doc.setTextColor(80, 80, 80);
  doc.text('Doorstep Delivery Charge:', summaryX + 4, y + 14);
  doc.setTextColor(15, 15, 15);
  doc.text(`TK ${deliveryCharge.toLocaleString()}`, pageWidth - margin - 4, y + 14, { align: 'right' });

  if (discount > 0) {
    doc.setTextColor(22, 101, 52); // green
    doc.text('RoyLux Promo Discount:', summaryX + 4, y + 21);
    doc.text(`- TK ${discount.toLocaleString()}`, pageWidth - margin - 4, y + 21, {
      align: 'right',
    });
  }

  // Divider inside summary
  doc.setDrawColor(212, 175, 55);
  doc.line(summaryX + 3, y + 26, pageWidth - margin - 3, y + 26);

  // Total Row Highlighted
  doc.setFillColor(15, 15, 15);
  doc.rect(summaryX + 2, y + 28, summaryWidth - 4, 11, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.text('TOTAL AMOUNT (BDT):', summaryX + 6, y + 35.5);
  doc.text(`TK ${total.toLocaleString()}`, pageWidth - margin - 6, y + 35.5, {
    align: 'right',
  });

  // Left Side Policy & Security Seal
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth - summaryWidth - 6, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 15, 15);
  doc.text('ROYLUX BRAND GUARANTEE & EXCHANGE TERMS', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 90, 90);
  const termsText = [
    '• 340+ GSM Combed Ringspun Cotton Fleece with thermal brushed insulation.',
    '• 7-Day Hassle-Free Doorstep Exchange for size replacement or defect inquiry.',
    '• Please retain this official invoice for warranty and return authorization.',
    '• For assistance, contact our 24/7 hotline at +880 1700-000000 or concierge@roylux.com.',
  ];
  termsText.forEach((t, i) => {
    doc.text(t, margin + 4, y + 14 + i * 5);
  });

  // Bottom Authorized Signature & Barcode representation
  const bottomY = pageHeight - 32;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, bottomY, pageWidth - margin, bottomY);

  // Stylized Barcode / Serial representation
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  const serialDate = String(order.createdAt || '').substring(0, 10) || '2026';
  doc.text(`*RL-${order.orderNumber || order.id}-${serialDate}*`, margin, bottomY + 7);
  doc.text('VERIFIED AUTHENTIC ROYLUX GARMENT DISPATCH', margin, bottomY + 12);

  // Authorized Stamp Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  const sigX = pageWidth - margin - 45;
  doc.line(sigX, bottomY + 12, pageWidth - margin, bottomY + 12);
  doc.text('Authorized Signature & Seal', sigX + 2, bottomY + 17);

  // Save the PDF
  const filename = `RoyLux-Invoice-${order.orderNumber || order.id}.pdf`;
  doc.save(filename);
}
