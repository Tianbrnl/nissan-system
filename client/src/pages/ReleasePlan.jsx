import { FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { fetchReleasePlan, updateReleasePlan } from "../services/releaseServices";
import { exportToWord } from "../utils/ExportToWord";
import Input from "../components/ui/Input";

const getTodayString = () => new Date().toISOString().split("T")[0];
const getTodayMonthString = () => getTodayString().slice(0, 7);
const monthValueToDate = (monthValue) => `${monthValue}-01`;
const TEAM_LABELS = {
    NSR1: "NSR1 - MIKE",
    NSR2: "NSR2 - JHOVEN",
    NSR3: "NSR3 - JAYR",
};

const getTeamDisplayName = (team) => TEAM_LABELS[team] || team;

const calculateTotals = (groups) => {
    const totals = groups.reduce((acc, group) => {
        acc.actual += Number(group.actual) || 0;
        acc.additionalThisWeek += Number(group.additionalThisWeek) || 0;
        acc.additionalNextWeek += Number(group.additionalNextWeek) || 0;
        acc.monthEndCommitment += Number(group.monthEndCommitment) || 0;
        return acc;
    }, {
        actual: 0,
        additionalThisWeek: 0,
        additionalNextWeek: 0,
        monthEndCommitment: 0,
    });

    return {
        ...totals,
        variance: Math.abs(totals.actual - totals.monthEndCommitment),
    };
};

const mapApiGroups = (apiGroups = []) => {
    return apiGroups.map((group, index) => ({
        id: `${group.team}-${index}`,
        team: group.team,
        actual: Number(group.actual) || 0,
        additionalThisWeek: Number(group.thisWeek) || 0,
        additionalNextWeek: Number(group.nextWeek) || 0,
        monthEndCommitment: Number(group.monthEnd) || 0,
    }));
};

export default function ReleasePlan() {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [editMonth, setEditMonth] = useState(getTodayMonthString());
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const loadReleasePlan = async () => {
                setIsLoading(true);

                const [viewResponse, editResponse] = await Promise.all([
                    fetchReleasePlan(selectedDate),
                    fetchReleasePlan(monthValueToDate(editMonth))
                ]);

                if (!viewResponse.success) {
                    console.error(viewResponse.message);
                    toast.error(viewResponse.message);
                    setGroups([]);
                    setIsLoading(false);
                    return;
                }

                if (!editResponse.success) {
                    console.error(editResponse.message);
                    toast.error(editResponse.message);
                    setGroups([]);
                    setIsLoading(false);
                    return;
                }

                const viewGroups = mapApiGroups(viewResponse.data);
                const editGroups = mapApiGroups(editResponse.data);
                const editMonthEndByTeam = new Map(
                    editGroups.map((group) => [group.team, group.monthEndCommitment])
                );

                setGroups(viewGroups.map((group) => ({
                    ...group,
                    monthEndCommitment: editMonthEndByTeam.get(group.team) ?? 0
                })));
            };

            loadReleasePlan();

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, editMonth]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleEditCommitment = (groupId, value) => {
        const parsedValue = Number.parseInt(value, 10);

        setGroups((prev) => prev.map((group) => (
            group.id === groupId
                ? { ...group, monthEndCommitment: Number.isNaN(parsedValue) ? 0 : parsedValue }
                : group
        )));
    };

    const handleSaveCommitments = async () => {
        try {
            setIsLoading(true);

            const payload = groups.map((group) => ({
                team: group.team,
                actual: group.actual,
                thisWeek: group.additionalThisWeek,
                nextWeek: group.additionalNextWeek,
                monthEnd: group.monthEndCommitment,
            }));

            const { success, message, data } = await updateReleasePlan({
                date: monthValueToDate(editMonth),
                groups: payload
            });

            if (!success) {
                console.error(message);
                toast.error(message);
                return;
            }

            const savedGroups = mapApiGroups(data);
            const savedMonthEndByTeam = new Map(
                savedGroups.map((group) => [group.team, group.monthEndCommitment])
            );

            setGroups((prev) => prev.map((group) => ({
                ...group,
                monthEndCommitment: savedMonthEndByTeam.get(group.team) ?? group.monthEndCommitment
            })));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const totals = calculateTotals(groups);

    const handleExport = async () => {
        try {
            setIsLoading(true);
            const headers = ["GROUP", "ACTUAL", "ADDITIONAL (THIS WEEK)", "ADDITIONAL (NEXT WEEK)", "MONTH-END COMMITMENT", "VARIANCE"];
            const rows = groups.map((group) => [
                getTeamDisplayName(group.team),
                group.actual,
                group.additionalThisWeek,
                group.additionalNextWeek,
                group.monthEndCommitment,
                Math.abs(group.actual - group.monthEndCommitment)
            ]);

            rows.push([
                "TOTAL",
                totals.actual,
                totals.additionalThisWeek,
                totals.additionalNextWeek,
                totals.monthEndCommitment,
                totals.variance
            ]);

            await exportToWord({
                title: "Release Plan",
                subtitle: `View date ${selectedDate} with editable commitments for ${editMonth}`,
                headers,
                rows,
                fileName: `Release_Plan_Report_${selectedDate}_${editMonth}`
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>Release Plan</PageTitle>
                        <PageSubTitle>Monthly release commitments and variance tracking</PageSubTitle>
                    </div>
                    <div className="flex gap-4 items-center flex-wrap">
                        <input
                            type="date"
                            value={selectedDate}
                            className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-nissan-red bg-white hover:bg-gray-50 font-medium transition-colors"
                            onChange={handleDateChange}
                        />
                        <button
                            className="btn bg-nissan-red text-white rounded-xl disabled:opacity-60"
                            disabled={isLoading}
                            onClick={handleExport}
                        >
                            <FileDown size={16} /> Export
                        </button>

                    </div>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Actual</p>
                        <h2 className="font-bold">{totals.actual}</h2>
                        <p className="text-xs">Current completed releases</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Commitment</p>
                        <h2 className="font-bold text-blue-600">{totals.monthEndCommitment}</h2>
                        <p className="text-xs">month total commitment</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Variance</p>
                        <h2 className={`font-bold ${totals.actual >= totals.monthEndCommitment ? "text-green-600" : "text-nissan-red"}`}>
                            {totals.variance}
                        </h2>
                        <p className="text-xs">Total Variance</p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">GROUP</td>
                                    <td>ACTUAL</td>
                                    <td>ADDITIONAL (THIS WEEK)</td>
                                    <td>ADDITIONAL (NEXT WEEK)</td>
                                    <td className="rowFooter">
                                        <div className="flex items-center justify-between gap-2">
                                            <span>MONTH-END COMMITMENT</span>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="month"
                                                    value={editMonth}
                                                    onChange={(e) => setEditMonth(e.target.value)}
                                                />
                                                <button
                                                    className="btn bg-blue-600 text-white rounded-xl disabled:opacity-60"
                                                    onClick={handleSaveCommitments}
                                                    disabled={isLoading}
                                                    title={`Save month-end commitments for ${editMonth}`}
                                                >
                                                    {isLoading ? "Saving..." : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="varianceCol">VARIANCE</td>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td className="rowHeader" colSpan={6}>Loading release plan...</td>
                                    </tr>
                                )}

                                {!isLoading && groups.map((group) => {
                                    const variance = Math.abs(group.actual - group.monthEndCommitment);
                                    const isBehind = group.actual < group.monthEndCommitment;

                                    return (
                                        <tr key={group.id}>
                                            <td className="rowHeader">{getTeamDisplayName(group.team)}</td>
                                            <td>{group.actual}</td>
                                            <td>{group.additionalThisWeek}</td>
                                            <td>{group.additionalNextWeek}</td>
                                            <td className="rowFooter">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={group.monthEndCommitment}
                                                    onChange={(event) => handleEditCommitment(group.id, event.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                                />
                                            </td>
                                            <td className={`varianceCol ${isBehind ? "text-nissan-red" : "text-green-600"}`}>
                                                {variance}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {!isLoading && groups.length === 0 && (
                                    <tr>
                                        <td className="rowHeader" colSpan={6}>No release plan data found.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    <td>{totals.actual}</td>
                                    <td>{totals.additionalThisWeek}</td>
                                    <td>{totals.additionalNextWeek}</td>
                                    <td className="rowFooter">{totals.monthEndCommitment}</td>
                                    <td className={`varianceCol ${totals.actual < totals.monthEndCommitment ? "text-nissan-red" : "text-green-600"}`}>
                                        {totals.variance}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
