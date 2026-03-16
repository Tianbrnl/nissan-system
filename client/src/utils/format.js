export const cleanDate = (date) => {
    if (!date || date === "0000-00-00") return "";
    return date;
};