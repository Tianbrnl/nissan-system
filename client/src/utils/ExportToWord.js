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

const toSafeNumber = (value) => Number(value) || 0;

const sumValues = (values = []) =>
  values.reduce((sum, value) => sum + toSafeNumber(value), 0);

const mapItems = (items = [], mapper) => items.map((item, index) => mapper(item, index));

const getApplicationsApprovalEntries = (data) => data?.applicationsApprovals ?? [];

const getTeamPerformanceEntries = (data) => data?.teams ?? [];

const buildDataRow = (label, entries = [], valueSelector) => {
  const rowValues = mapItems(entries, (entry) => valueSelector(entry));
  return [label, ...rowValues, sumValues(rowValues)];
};

const buildMonthlyTotalValues = (entries = [], valueSelectors = []) =>
  mapItems(entries, (entry) =>
    sumValues(mapItems(valueSelectors, (selector) => selector(entry))),
  );

const formatPercentage = (value) => `${toSafeNumber(value)}%`;

const getApplicationsApprovalGrandTotal = (data, monthlyTotals = []) =>
  sumValues(
    Object.keys(data?.totals ?? {}).length > 0
      ? Object.values(data?.totals ?? {})
      : monthlyTotals,
  );
// application & approval export 
export const createApplicationsApprovalMatrixExport = (data, monthYear) => {
  const entries = getApplicationsApprovalEntries(data);
  const reportYear = monthYear?.substring?.(0, 4) ?? "";
  const metricConfigs = [
    { label: "Applied", selector: (entry) => entry?.applications ?? 0 },
    {
      label: "Approved (As Applied)",
      selector: (entry) => entry?.appliedApproved ?? 0,
    },
    {
      label: "Approved (Not As Applied)",
      selector: (entry) => entry?.appliedNotApproved ?? 0,
    },
    { label: "Availed", selector: (entry) => entry?.availed ?? 0 },
  ];

  const monthlyTotals = buildMonthlyTotalValues(
    entries,
    mapItems(metricConfigs, (config) => config.selector),
  );

  return {
    title: `Applications & Approvals - Overall Monthly Matrix - ${reportYear}`,
    headers: [
      "ACCOUNT TYPE",
      ...mapItems(entries, (entry) => entry?.month ?? "-"),
      "TOTAL",
    ],
    rows: [
      ...mapItems(metricConfigs, (config) =>
        buildDataRow(config.label, entries, config.selector),
      ),
      [
        "TOTAL",
        ...monthlyTotals,
        getApplicationsApprovalGrandTotal(data, monthlyTotals),
      ],
    ],
  };
};

const buildMonthlyReportRows = (entries = [], valueSelector, labelSelector) => [
  ...mapItems(entries, (entry) => {
    const monthlyValues = valueSelector(entry);
    return [
      labelSelector(entry),
      ...monthlyValues,
      sumValues(monthlyValues),
    ];
  }),
];

const buildMonthlyReportTotalRow = (totals = []) => [
  "TOTAL",
  ...totals,
  sumValues(totals),
];

export const createVehicleSalesByUnitsExport = (data, year) => {
  const vehicles = data?.vehicles ?? [];
  const totals = data?.totals ?? [];

  return {
    title: `Vehicle Sales by Units (Monthly) - ${year ?? ""}`,
    headers: ["UNITS", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "TOTAL"],
    rows: [
      ...buildMonthlyReportRows(
        vehicles,
        (vehicle) => vehicle?.data ?? [],
        (vehicle) => vehicle?.name ?? "-",
      ),
      buildMonthlyReportTotalRow(totals),
    ],
  };
};

export const createPaymentTermMonthlyExport = (data, year) => {
  const paymentEntries = data?.payment ?? [];
  const totals = data?.totals ?? [];

  return {
    title: `Payment Term (Monthly) - ${year ?? ""}`,
    headers: ["PAYMENT TERM", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "TOTAL"],
    rows: [
      ...buildMonthlyReportRows(
        paymentEntries,
        (payment) => payment?.data ?? [],
        (payment) => payment?.name ?? "-",
      ),
      buildMonthlyReportTotalRow(totals),
    ],
  };
};

export const createReservationByTeamMonthlyExport = (data, year) => {
  const teams = data?.teams ?? [];
  const totals = data?.totals ?? [];

  return {
    title: `Reservation by Team (Monthly) - ${year ?? ""}`,
    headers: ["TEAM", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "TOTAL"],
    rows: [
      ...buildMonthlyReportRows(
        teams,
        (team) => team?.data ?? [],
        (team) => team?.name ?? "-",
      ),
      buildMonthlyReportTotalRow(totals),
    ],
  };
};

export const createTeamPerformanceExport = (
  data,
  monthYear,
  calculateApprovalRate,
  calculateAvailmentRate,
) => {
  const entries = getTeamPerformanceEntries(data);
  const totals = data?.totals ?? {};

  const mapTeamRow = (team) => [
    team?.team ?? "-",
    team?.applications ?? 0,
    team?.appliedApproved ?? 0,
    team?.appliedNotApproved ?? 0,
    team?.availed ?? 0,
    formatPercentage(
      calculateApprovalRate?.(
        team?.applications,
        team?.appliedApproved,
        team?.appliedNotApproved,
      ) ?? 0,
    ),
    formatPercentage(
      calculateAvailmentRate?.(
        team?.availed,
        team?.appliedApproved,
        team?.appliedNotApproved,
      ) ?? 0,
    ),
  ];

  return {
    title: `Team Performance - ${monthYear ?? ""}`,
    headers: [
      "TEAM",
      "APPLICATIONS",
      "APPROVED (AS APPLIED)",
      "APPROVED (NOT AS APPLIED)",
      "AVAILED",
      "APPROVAL RATE",
      "AVAILMENT RATE",
    ],
    rows: [
      ...mapItems(entries, mapTeamRow),
      [
        "TOTAL",
        totals?.applications ?? 0,
        totals?.appliedApproved ?? 0,
        totals?.appliedNotApproved ?? 0,
        totals?.availed ?? 0,
        formatPercentage(
          calculateApprovalRate?.(
            totals?.applications,
            totals?.appliedApproved,
            totals?.appliedNotApproved,
          ) ?? 0,
        ),
        formatPercentage(
          calculateAvailmentRate?.(
            totals?.availed,
            totals?.appliedApproved,
            totals?.appliedNotApproved,
          ) ?? 0,
        ),
      ],
    ],
  };
};

export const exportToWord = async (config) => {
  const { title, subtitle, headers, rows, fileName, tables } = config;

  const buildTable = (tableHeaders, tableRows) => {
    const headerCells = tableHeaders.map(
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

    const dataRows = tableRows.map(
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

    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [new TableRow({ children: headerCells }), ...dataRows],
    });
  };

  const documentTables = tables?.length
    ? tables
    : [{ title: null, headers, rows }];

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

  documentTables.forEach((tableConfig, index) => {
    if (tableConfig?.title) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: tableConfig.title,
              bold: true,
              size: 26,
              color: "1C1C1C",
            }),
          ],
          spacing: {
            before: index === 0 ? 0 : 300,
            after: 200,
          },
        }),
      );
    }

    sections.push(buildTable(tableConfig.headers ?? [], tableConfig.rows ?? []));
  });

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
