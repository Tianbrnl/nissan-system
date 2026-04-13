import { FileDown } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import TeamPerformance from "../components/TeamPerformance";
import { useEffect } from "react";
import { fetchTeamPerformance } from "../services/vehicleSales";
import { useState } from "react";
import UnitDistribution from "../components/UnitDistribution";
import UnitContributionPerTeam from "../components/UnitContributionPerTeam";
import Input from "../components/ui/Input";
import { exportToWord } from "../utils/ExportToWord";

export default function VehicleSales() {

    const [isLoading, setIsLoading] = useState(false);

    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;
    const formattedMonth = `${thisYear}-${thisMonth.toString().padStart(2, '0')}`;

    const [monthYear, setMonthYear] = useState(formattedMonth);

    const [data, setData] = useState([]);
    const [unitTotals, setUnitTotals] = useState([]);

    const [graphTotalUnits, setGraphTotalUnits] = useState([]);
    const [unitContributionPerTeam, setUnitContributionPerTeam] = useState([]);

    const [totals, setTotals] = useState({
        totalUnitSold: 0,
        totalYearUnitSold: 0,
        topTeam: {
            team: '',
            units: 0
        },
        topUnit: {
            unit: '',
            total: 0
        },
    });

    useEffect(() => {
        try {
            const load = async () => {
                setTotals({
                    totalUnitSold: 0,
                    totalYearUnitSold: 0,
                    topTeam: {
                        team: '',
                        units: 0
                    },
                    topUnit: {
                        unit: '',
                        total: 0
                    },
                });

                setData([]);
                setUnitTotals([]);

                setGraphTotalUnits([]);
                setUnitContributionPerTeam([]);

                const { success, message, teamPerformance, unitTotals, yearlyTotalUnitSold } = await fetchTeamPerformance(monthYear);
                if (success) {

                    if (unitTotals.length === 0) {
                        setTotals((prev) => ({
                            ...prev,
                            totalYearUnitSold: yearlyTotalUnitSold ?? 0
                        }));
                        return
                    }

                    setData(teamPerformance);
                    setUnitTotals(unitTotals);

                    const formattedGraphTotalUnits = teamPerformance.map(tp => ({ team: tp.team, units: tp.total }));
                    setGraphTotalUnits(formattedGraphTotalUnits);

                    const formattedGraphContributionPerTeam = teamPerformance.map(tp => ({ team: tp.team, units: tp.counts.map(unit => ({ name: unit.name, data: unit.count })) }));
                    setUnitContributionPerTeam(formattedGraphContributionPerTeam);

                    const totalUnitSold = unitTotals?.reduce((sum, num) => sum + num.total, 0) ?? 0;

                    const topTeam = formattedGraphTotalUnits.reduce((max, team) => {
                        return team.units > max.units ? team : max;
                    });

                    let topUnit = unitTotals?.reduce((max, unit) => {
                        return unit.total > max.total ? unit : max;
                    });

                    topUnit = { unit: topUnit.name, total: topUnit.total }

                    setTotals({
                        totalUnitSold,
                        totalYearUnitSold: yearlyTotalUnitSold ?? 0,
                        topTeam,
                        topUnit,
                    });
                    return
                };
                console.error(message);
            }
            load();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [monthYear])

    const handleExport = async () => {
        try {
            setIsLoading(true);
            const unitHeaders = data[0]?.counts?.map((count) => count?.name ?? "-") ?? [];
            const headers = ["TEAM", ...unitHeaders, "TOTAL"];
            const rows = data.map((team) => [
                team?.team ?? "-",
                ...(team?.counts?.map((count) => count?.count ?? 0) ?? []),
                team?.total ?? 0,
            ]);

            rows.push([
                "TOTAL",
                ...unitTotals.map((unitTotal) => unitTotal?.total ?? 0),
                unitTotals?.reduce((sum, num) => sum + (num?.total ?? 0), 0) ?? 0,
            ]);

            await exportToWord({
                title: `${monthYear} Performance per Group`,
                subtitle: "Vehicle sales breakdown by team and model",
                headers,
                rows,
                fileName: `Performance_Per_Group_${monthYear}`
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

                {/* header */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>{monthYear} PERFORMANCE PER GROUP</PageTitle>
                        <PageSubTitle>Vehicle sales breackdown by team and model</PageSubTitle>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button
                            className="btn bg-nissan-red text-white rounded-xl disabled:opacity-60"
                            disabled={isLoading}
                            onClick={handleExport}
                        >
                            <FileDown size={16} /> Export
                        </button>
                        <Input
                            type="month"
                            value={monthYear}
                            onChange={(e) => setMonthYear(e.target.value)}
                        />
                    </div>
                </div>

                {/* totals */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Units Sold in {monthYear?.split("-")?.[0]}</p>
                        <h2 className="font-bold text-blue-600">{totals?.totalYearUnitSold}</h2>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Units Sold of the Month</p>
                        <h2 className="font-bold">{totals?.totalUnitSold}</h2>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Top Team</p>
                        <h4 className="font-bold text-nissan-red">{totals?.topTeam?.team}</h4>
                        <p className="text-gray-500 text-sm">{totals?.topTeam?.units} units</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Top Unit Sold</p>
                        <h4 className="font-bold text-green-600">{totals?.topUnit?.unit}</h4>
                        <p className="text-gray-500 text-sm">{totals?.topUnit?.total} units</p>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">TEAM</td>
                                    {data[0]?.counts?.map((count, index) => (
                                        <td key={index}>{count?.name}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((team, index) => (
                                    <tr key={index}>
                                        <td className="rowHeader">{team?.team}</td>
                                        {team?.counts?.map((c, index) => (
                                            <td key={index} className={`${c.count > 0 ? '' : 'text-nissan-gray'}`}>{c.count}</td>
                                        ))}
                                        <td className="rowFooter">
                                            {team?.total}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {unitTotals?.map((unitTotal, index) => (
                                        <td key={index}>{unitTotal.total}</td>
                                    ))}
                                    <td className="rowFooter">
                                        {unitTotals?.reduce((sum, num) => sum + num.total, 0) ?? 0}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <section className="max-lg:grid max-lg:grid-cols-1 lg:flex gap-8">
                    <div className="lg:flex-2 p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Team Performance - (Total Units)</p>
                        <div className="h-70">
                            <TeamPerformance teams={graphTotalUnits} />
                        </div>
                    </div>
                    <div className="lg:flex-1 p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Unit Destribution</p>

                        <div className="h-70">
                            <UnitDistribution monthYear={monthYear} />
                        </div>
                    </div>
                </section>

                <section className="lg:flex-1 p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                    <p className="text-lg font-semibold">Unit Contribution per Team</p>

                    <div className="h-70">
                        <UnitContributionPerTeam teams={unitContributionPerTeam} />
                    </div>
                </section>
            </div>
        </div >
    )
}
