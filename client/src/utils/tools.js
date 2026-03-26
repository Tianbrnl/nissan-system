export const generateYearMonths = () => {
    return [
        `JAN `,
        `FEB `,
        `MAR `,
        `APR `,
        `MAY `,
        `JUN `,
        `JUL `,
        `AUG `,
        `SEP `,
        `OCT `,
        `NOV `,
        `DEC `
    ];
};

export const getMonthIndex = (value, year) => {
    if (!value) return -1;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return -1;

    // Filter out dates not in the selected year
    if (date.getFullYear() !== year) return -1;

    // Return 0-based month index (0 = January, 11 = December)
    return date.getMonth();
};

export const toNumber = (value) => Number(value) || 0;

export const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 0-indexed months
    return `${year}-${month}`;
};

