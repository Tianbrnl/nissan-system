import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

export const exportToWord = async (config) => {
  const { title, subtitle, headers, rows, fileName } = config;

  // Create header rows
  const headerCells = headers.map(
    (header) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: header,
                bold: true,
                color: "1C1C1C",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        shading: {
          fill: "F5F6F8",
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
      }),
  );

  // Create data rows
  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(cell),
                      color: "333333",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
              },
            }),
        ),
      }),
  );

  // Create table
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [new TableRow({ children: headerCells }), ...dataRows],
  });

  // Create document sections
  const sections = [
    // Title
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32,
          color: "C3002F",
        }),
      ],
      spacing: {
        after: 200,
      },
    }),
  ];

  // Add subtitle if provided
  if (subtitle) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            size: 24,
            color: "666666",
          }),
        ],
        spacing: {
          after: 400,
        },
      }),
    );
  }

  // Add table
  sections.push(table);

  // Add footer
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `\nGenerated on ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          italics: true,
          size: 18,
          color: "999999",
        }),
      ],
      spacing: {
        before: 400,
      },
    }),
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  // Generate and save document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
};

// Vehicle Sales Report Export
export const exportVehicleSalesByModel = (data, months, models) => {
  const headers = ["Model", ...months, "Total"];
  const rows = models.map((model) => {
    const monthValues = months.map((month) => data[month]?.[model] || 0);
    const total = monthValues.reduce((sum, val) => sum + val, 0);
    return [model, ...monthValues, total];
  });

  // Add total row
  const monthTotals = months.map((month) =>
    models.reduce((sum, model) => sum + (data[month]?.[model] || 0), 0),
  );
  const grandTotal = monthTotals.reduce((sum, val) => sum + val, 0);
  rows.push(["TOTAL", ...monthTotals, grandTotal]);

  return exportToWord({
    title: "Vehicle Sales by Model",
    subtitle: "Monthly Report",
    headers,
    rows,
    fileName: "Vehicle_Sales_By_Model_Report",
  });
};

// Payment Term Report Export
export const exportPaymentTerms = (data, months) => {
  const headers = ["Payment Term", ...months, "Total"];
  const terms = ["Cash", "Financing", "Bank PO"];
  const rows = terms.map((term) => {
    const key = term === "Bank PO" ? "BankPO" : term;
    const monthValues = months.map((month) => data[month]?.[key] || 0);
    const total = monthValues.reduce((sum, val) => sum + val, 0);
    return [term, ...monthValues, total];
  });

  // Add total row
  const monthTotals = months.map((month) => {
    const monthData = data[month];
    return (
      (monthData?.Cash || 0) +
      (monthData?.Financing || 0) +
      (monthData?.BankPO || 0)
    );
  });
  const grandTotal = monthTotals.reduce((sum, val) => sum + val, 0);
  rows.push(["TOTAL", ...monthTotals, grandTotal]);

  return exportToWord({
    title: "Payment Terms Report",
    subtitle: "Monthly Breakdown",
    headers,
    rows,
    fileName: "Payment_Terms_Report",
  });
};

// Reservation by Team Report Export
export const exportReservationsByTeam = (data, months, teams) => {
  const headers = ["Team", ...months, "Total"];
  const rows = teams.map((team) => {
    const monthValues = months.map((month) => data[month]?.[team] || 0);
    const total = monthValues.reduce((sum, val) => sum + val, 0);
    return [team, ...monthValues, total];
  });

  // Add total row
  const monthTotals = months.map((month) =>
    teams.reduce((sum, team) => sum + (data[month]?.[team] || 0), 0),
  );
  const grandTotal = monthTotals.reduce((sum, val) => sum + val, 0);
  rows.push(["TOTAL", ...monthTotals, grandTotal]);

  return exportToWord({
    title: "Reservations by Team",
    subtitle: "Monthly Report",
    headers,
    rows,
    fileName: "Reservations_By_Team_Report",
  });
};