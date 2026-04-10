import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { readMemberSalesSummary } from "../../services/teamServices";
import { Modal, ModalBackground, ModalHeader } from "../ui/ui-modal";

const EMPTY_SUMMARY = {
    monthlyCounts: [],
    totalSold: 0,
    teamCode: "",
    teamLeader: "",
    year: ""
};

export default function ViewMemberSalesSummary({
    member,
    monthYear,
    onClose = () => { }
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [summary, setSummary] = useState(EMPTY_SUMMARY);

    useEffect(() => {
        let isMounted = true;

        const loadSummary = async () => {
            setLoading(true);
            setError("");

            const year = monthYear?.split("-")?.[0];
            const { success, message, memberSales } = await readMemberSalesSummary(member?.id, year);

            if (!isMounted) {
                return;
            }

            if (success) {
                setSummary(memberSales);
            } else {
                setError(message || "Failed to load member sales summary.");
                setSummary(EMPTY_SUMMARY);
            }

            setLoading(false);
        };

        loadSummary();

        return () => {
            isMounted = false;
        };
    }, [member?.id, monthYear]);

    return (
        <ModalBackground>
            <Modal maxWidth={920}>
                <div className="space-y-6">
                    <ModalHeader
                        icon={BarChart3}
                        title={`${member?.memberName || "NMP"} Sold Summary`}
                        subTitle={`${summary?.teamCode || "-"}${summary?.teamLeader ? ` | ${summary.teamLeader}` : ""} | ${summary?.year || monthYear?.split("-")?.[0] || ""}`}
                        onClose={onClose}
                    />

                    {loading && (
                        <div className="rounded-xl border border-gray-300 px-4 py-10 text-center text-gray-500">
                            Loading yearly sales summary...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-300 p-4 space-y-2">
                                    <p className="text-sm text-gray-500">Total Sold</p>
                                    <p className="text-3xl font-semibold text-nissan-black">{summary?.totalSold ?? 0}</p>
                                </div>
                                <div className="rounded-xl bg-nissan-red p-4 text-white space-y-2">
                                    <p className="text-sm">Active Months</p>
                                    <p className="text-3xl font-semibold">
                                        {(summary?.monthlyCounts || []).filter((item) => Number(item.count) > 0).length}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-300 overflow-hidden">
                                <div className="table-style">
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>MONTH</td>
                                                <td>SOLD COUNT</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(summary?.monthlyCounts || []).map((item) => (
                                                <tr key={item.month}>
                                                    <td className="font-medium">{item.month}</td>
                                                    <td>{item.count}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-semibold">
                                                <td>Total</td>
                                                <td>{summary?.totalSold ?? 0}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </ModalBackground>
    );
}
