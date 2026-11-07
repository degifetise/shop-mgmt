import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CURRENCY, lineTotals, number, sumTotals } from "./utils.js";

export function downloadPdf(products, isDuplicate) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const totals = sumTotals(products);
  const today = new Date().toISOString().slice(0, 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Stock Ledger", 40, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(94, 107, 102);
  doc.text(`Date: ${today}    Amounts in ${CURRENCY}`, 40, 66);

  const body = products.map((p, i) => {
    const t = lineTotals(p);
    return [
      i + 1,
      isDuplicate(p) ? `${p.name} (duplicate)` : p.name,
      p.quantity,
      number(p.buyPrice),
      number(p.sellPrice),
      number(t.totalBuy),
      number(t.totalSell),
      number(t.profit),
    ];
  });

  autoTable(doc, {
    startY: 84,
    head: [
      [
        "#",
        "Product",
        "Qty",
        "Buying price",
        "Selling price",
        "Total buying",
        "Total selling",
        "Profit",
      ],
    ],
    body,
    foot: [
      [
        "",
        `Total (${totals.count} products)`,
        totals.quantity,
        "",
        "",
        number(totals.totalBuy),
        number(totals.totalSell),
        number(totals.profit),
      ],
    ],
    showFoot: "lastPage",
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 6, textColor: [22, 33, 29] },
    headStyles: { fillColor: [15, 92, 74], textColor: 255 },
    footStyles: { fillColor: [227, 239, 234], textColor: [22, 33, 29], fontStyle: "bold" },
    columnStyles: {
      0: { halign: "right", cellWidth: 30 },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && isDuplicate(products[data.row.index])) {
        data.cell.styles.textColor = [185, 28, 28];
        data.cell.styles.fillColor = [254, 242, 242];
      }
    },
  });

  const y = doc.lastAutoTable.finalY + 28;
  doc.setTextColor(22, 33, 29);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Total products: ${totals.count}`, 40, y);
  doc.text(`Total quantity: ${totals.quantity}`, 200, y);
  doc.text(`Total buying: ${number(totals.totalBuy)} ${CURRENCY}`, 340, y);
  doc.text(`Total selling: ${number(totals.totalSell)} ${CURRENCY}`, 570, y);

  doc.save(`stock-ledger-${today}.pdf`);
}
