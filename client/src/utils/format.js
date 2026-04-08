export const cleanDate = (date) => {
    if (!date || date === "0000-00-00" || date === "Invalid date") return "";
    return date;
};
