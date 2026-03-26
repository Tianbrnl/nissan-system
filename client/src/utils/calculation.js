export const calculateApprovalRate = (applications, appliedApproved, appliedNotApproved) => {
    const totalApproved = (appliedApproved ?? 0) + (appliedNotApproved ?? 0);

    if (!applications) return 0;

    return Math.round((totalApproved / applications) * 100);
};

export const calculateAvailmentRate = (availed, appliedApproved, appliedNotApproved) => {
    const totalApproved = (appliedApproved ?? 0) + (appliedNotApproved ?? 0);

    if (!totalApproved) return 0;

    return Math.round(((availed ?? 0) / totalApproved) * 100);
};

export const getRateColorClass = (rate, target) => (
    rate >= target ? "text-green-600" : "text-red-600"
);