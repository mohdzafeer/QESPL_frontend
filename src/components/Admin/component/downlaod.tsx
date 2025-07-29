import { jsPDF } from "jspdf";

export const handleDownload = (order: any) => {
  if (!order) {
    alert("No order data available for download.");
    return;
  }

  const doc = new jsPDF();

  // --- Page Dimensions ---
  const pageWidth = doc.internal.pageSize.getWidth(); // A4 width: 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // A4 height: 297 mm

  // --- Adjustable Margins ---
  const topMargin = 20; // Increased top margin to 20mm
  const bottomMargin = 20; // Increased bottom margin to 20mm
  const sideMargin = 10; // Left and right margin

  // --- Colors ---
  const primaryColor = [10, 41, 117]; // #0A2975 in RGB
  const headerBgColor = [10, 41, 117]; // Blue for header background
  const alternateRowColor = [240, 240, 240]; // Light gray for alternate rows

  // --- Set default font and styling ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black text by default

  let currentY = topMargin; // Starting Y position for the left column (Company Address)

  // --- Top Left: Company Address (from QESPL_PO_35_QESPL_JUL_25.pdf) ---
  const companyAddressStartX = sideMargin;
  let companyAddressCurrentY = currentY;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Quick Engineering Solutions Pvt. Ltd.", companyAddressStartX, companyAddressCurrentY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  companyAddressCurrentY += 5;
  doc.text("Naya Nagar, CDF Industrial Area, Anopshahar Road,", companyAddressStartX, companyAddressCurrentY);
  companyAddressCurrentY += 5;
  doc.text("Cherat, Aligarh, Uttar Pradesh 202002", companyAddressStartX, companyAddressCurrentY);
  companyAddressCurrentY += 5;
  doc.text("Email: qenggsolutions@gmail.com", companyAddressStartX, companyAddressCurrentY);
  companyAddressCurrentY += 5;
  doc.text("Phone: +91 8077774614", companyAddressStartX, companyAddressCurrentY);
  const companyAddressBottomY = companyAddressCurrentY; // Bottom edge of company address block

  // --- Top Right: Purchase Order Title & PO Number ---
  const poTitleStartX = pageWidth / 2; // Start roughly in the middle for right alignment
  let poTitleCurrentY = topMargin;

  doc.setFontSize(24); // Larger font size for "Purchase Order"
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Set color to primaryColor
  const purchaseOrderText = "Purchase Order";
  const purchaseOrderTextWidth = doc.getTextWidth(purchaseOrderText);
  doc.text(purchaseOrderText, pageWidth - sideMargin - purchaseOrderTextWidth, poTitleCurrentY); // Right aligned

  poTitleCurrentY += 8; // Space between title and PO number
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0); // Reset to black for PO number
  const poNumberText = `#${order.orderNumber || order.orderId || "no PO Number Available"}`;
  const poNumberTextWidth = doc.getTextWidth(poNumberText);
  doc.text(poNumberText, pageWidth - sideMargin - poNumberTextWidth, poTitleCurrentY); // Right aligned
  const poBlockBottomY = poTitleCurrentY; // Bottom edge of PO block

  // Set currentY for the next section (Client/Company details) to be below the lowest of the top two blocks
  currentY = Math.max(companyAddressBottomY, poBlockBottomY) + 15; // Added extra space

  // --- Client & Company Details Section ---
  const sectionMargin = sideMargin; // Use main sideMargin for this section
  const sectionWidth = pageWidth - (2 * sideMargin);
  const halfSectionWidth = sectionWidth / 2;
  const clientLineSpacing = 5; // Reduced vertical spacing for address/contact details

  // Company Name (bold, larger font, blue color)
  doc.setFontSize(14); // Larger font
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Blue color
  doc.text(order.companyName.toUpperCase() || "no Company Name provided", sectionMargin, currentY);
  doc.setTextColor(0, 0, 0); // Reset to black
  currentY += 8; // Space after company name

  // Client Name (directly below company name)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(order.clientName || "No Client Name provided", sectionMargin, currentY);
  currentY += 6; // Slightly more space after client name

  // Address and Contact Details (Left Column)
  const leftColumnX = sectionMargin;
  let leftColumnY = currentY;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10); // Decreased font size for address
  const addressText = String(order.address || "___");
  // Calculate address width to ensure it doesn't overlap PO heading area
  const maxAddressWidth = (pageWidth / 2) - sideMargin - 5; // Half page width minus sideMargin and some padding
  const addressLines = doc.splitTextToSize(addressText, maxAddressWidth);
  doc.text("Address:", leftColumnX, leftColumnY);
  doc.text(addressLines, leftColumnX + doc.getTextWidth("Address: "), leftColumnY);
  leftColumnY += (addressLines.length * clientLineSpacing); // Use new line spacing

  doc.text(`Contact No.: ${order.contact || "___"}`, leftColumnX, leftColumnY);
  leftColumnY += clientLineSpacing;

  // Zipcode and GST Number (Right Column)
  const rightColumnX = sectionMargin + halfSectionWidth;
  let rightColumnY = currentY; // Align with the start of address in left column

  doc.setFontSize(10); // Decreased font size for zipcode and GST
  doc.text(`Zipcode: ${order.zipCode || "___"}`, rightColumnX, rightColumnY);
  rightColumnY += clientLineSpacing;
  doc.text(`GST No.: ${order.gstNumber || "___"}`, rightColumnX, rightColumnY);
  rightColumnY += clientLineSpacing;

  currentY = Math.max(leftColumnY, rightColumnY) + 5; // Reduced space before table

  // --- Products Table ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Products", sideMargin, currentY);
  currentY += 4;

  // Table headers and column widths (S.No., Product, Quantity, Remark)
  const tableWidth = pageWidth - (2 * sideMargin); // Usable width for the table
  // Re-distribute widths to sum up to tableWidth (e.g., 190mm if sideMargin is 10mm)
  // S.No. (15), Product (65), Quantity (25), Remark (85) => Total 190mm
  const columnWidths = [15, 65, 25, 85];
  const tableHeaders = ["S.No.", "Product", "Quantity", "Remark"]; // Explicitly defined array

  const tableX = sideMargin;
  const tableHeaderY = currentY;
  const rowHeight = 10; // Minimum height for each row in the table
  const headerPaddingX = 2; // Small padding for header text
  const productTextLeftPadding = 2; // Little left margin for product text in rows AND its header

  // Draw table header background (using primary blue color)
  doc.setFillColor(headerBgColor[0], headerBgColor[1], headerBgColor[2]);
  doc.rect(tableX, tableHeaderY, tableWidth, rowHeight, 'F'); // Use tableWidth for background fill

  // Position and draw table headers (white text on blue background)
  doc.setTextColor(255, 255, 255); // White text for headers
  let currentHeaderDrawX = tableX;
  tableHeaders.forEach((header, index) => {
    let textX = currentHeaderDrawX + headerPaddingX;
    // Apply specific left padding for "Product" header
    if (header === "Product") {
      textX += productTextLeftPadding;
    }
    doc.text(header, textX, tableHeaderY + rowHeight / 2, { baseline: "middle" });
    currentHeaderDrawX += columnWidths[index];
  });
  doc.setTextColor(0, 0, 0); // Reset to black for table content

  currentY += rowHeight; // Move Y below header

  // Draw table rows
  doc.setFont("helvetica", "normal");

  const products = order.products || [];

  products.forEach((product: any, index: number) => {
    const srNo = index + 1;
    const productName = String(product.name || "N/A");
    const quantity = String(product.quantity || 0);
    const remark = String(product.remark || "N/A");

    // Calculate height needed for product name and remark wrapping
    // Use productTextLeftPadding for internal text wrapping calculation
    const productNameLines = doc.splitTextToSize(productName, columnWidths[1] - (productTextLeftPadding * 2));
    const remarkLines = doc.splitTextToSize(remark, columnWidths[3] - (productTextLeftPadding * 2));

    const lineHeight = 5; // Assuming 5mm per line for font size 12
    const verticalTextPadding = 2; // Small padding above and below text in cell

    // Determine required row height based on the tallest content
    const requiredRowHeight = Math.max(
      productNameLines.length * lineHeight,
      remarkLines.length * lineHeight,
      rowHeight - (2 * verticalTextPadding) // Ensure minimum height for single line content
    ) + (2 * verticalTextPadding);

    // Check if adding this row would exceed the page height minus the bottom margin
    if (currentY + requiredRowHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = topMargin; // Reset Y to topMargin for new page

      // Re-draw table header on new page
      doc.setFillColor(headerBgColor[0], headerBgColor[1], headerBgColor[2]);
      doc.rect(tableX, currentY, tableWidth, rowHeight, 'F');
      doc.setTextColor(255, 255, 255);
      let newPageHeaderDrawX = tableX;
      tableHeaders.forEach((header, idx) => {
        let textX = newPageHeaderDrawX + headerPaddingX;
        if (header === "Product") {
          textX += productTextLeftPadding;
        }
        doc.text(header, textX, currentY + rowHeight / 2, { baseline: "middle" });
        newPageHeaderDrawX += columnWidths[idx];
      });
      doc.setTextColor(0, 0, 0);
      currentY += rowHeight;
    }

    // Draw row background (alternate light gray and white)
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255); // White for even rows
    } else {
      doc.setFillColor(alternateRowColor[0], alternateRowColor[1], alternateRowColor[2]); // Light gray for odd rows
    }
    doc.rect(tableX, currentY, tableWidth, requiredRowHeight, 'F'); // Use tableWidth for background fill

    // Draw text for each cell with updated positioning and alignment
    // S.No. - Centered
    doc.text(String(srNo), tableX + (columnWidths[0] / 2), currentY + requiredRowHeight / 2, { align: "center", baseline: "middle" });

    // Product Name - Left aligned, vertically centered within the row
    doc.text(productNameLines, tableX + columnWidths[0] + productTextLeftPadding, currentY + requiredRowHeight / 2 - (productNameLines.length * lineHeight / 2) + (lineHeight / 2));

    // Quantity - Centered
    doc.text(quantity, tableX + columnWidths[0] + columnWidths[1] + (columnWidths[2] / 2), currentY + requiredRowHeight / 2, { align: "center", baseline: "middle" });

    // Remark - Left aligned, vertically centered within the row
    doc.text(remarkLines, tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + productTextLeftPadding, currentY + requiredRowHeight / 2 - (remarkLines.length * lineHeight / 2) + (lineHeight / 2));

    currentY += requiredRowHeight; // Advance Y for the next row
  });

  currentY += 10; // Space after table

  // --- Footer Details (from QESPL_PO_35_QESPL_JUL_25.pdf) ---
  // Ensure footer elements don't go below the bottom margin
  const footerStartMinY = pageHeight - bottomMargin - (5 * 7) - 10; // Approximate height for footer lines + notes + generated on

  if (currentY < footerStartMinY) {
    currentY = footerStartMinY;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // "Generated by" remains as previous (12pt, bold)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Generated by: ${order.generatedBy?.username || "Rehan"}`, sideMargin, currentY);
  currentY += 7;

  doc.setFont("helvetica", "bold"); // Bold for "Order through"
  doc.text(`Order through: ${order.orderThrough?.username || "Mr. Akif"}`, sideMargin, currentY);
  currentY += 7;
  doc.setFont("helvetica", "bold"); // Bold for "Estimated Date/Time of Dispatch"
  doc.text(`Estimated Date of Dispatch: ${order.estimatedDispatchDate?.split('T')[0] || "2025-07-29"}`, sideMargin, currentY);
  currentY += 10; // Increased space before Note

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold");
  doc.text("Note :", sideMargin, currentY);
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal");
  currentY += 7;
  doc.text("1. If you want to update this Purchase Order, You must ask permission from admin/sub-admin", sideMargin, currentY);
  currentY += 5;
  doc.text("1. If you want to delete this Purchase Order, You must ask permission from admin/sub-admin", sideMargin, currentY);
  // currentY += 5;
  // doc.text("1. If you want to update this Purchase Order, You must ask permission from admin/sub-admin", sideMargin, currentY);

  const now = new Date();
  // Format date and time as "DD/MM/YYYY HH:MM am/pm IST"
  const generatedOnDateTime = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })} IST`;

  // "Generated on" at bottom left with reduced text and bold, aligned to bottomMargin
  const smallFontSize = 8;
  doc.setFontSize(smallFontSize); // More reduced text size
  doc.setFont("helvetica", "bold"); // Bold
  doc.text(`Generated on: ${generatedOnDateTime}`, sideMargin, pageHeight - bottomMargin + 5); // Adjusted position

  // Save the PDF
  doc.save(`PO_${String(order.orderNumber || "new_PO")}.pdf`);
};