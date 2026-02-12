function validateDate(date) {
    if (!date) {
        throw new Error("Date is required");
    }

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
        throw new Error("Invalid date format");
    }

    return true;
}

module.exports = {
    validateDate
};
