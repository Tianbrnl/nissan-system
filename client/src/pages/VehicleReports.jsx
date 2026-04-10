import { EllipsisVertical, FileDown, Pen, Plus, SquarePen, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import CreateVariant from "../components/VehicleReports/CreateVariant";
import UpdateUnit from "../components/VehicleReports/UpdateUnit";
import UpdateVariant from "../components/VehicleReports/UpdateVariant";
import {
    createPaymentTermMonthlyExport,
    createReservationByTeamMonthlyExport,
    createVehicleSalesByUnitsExport,
    exportToWord
} from "../utils/ExportToWord";
import {
    fetchVehicleSalesReport,
    fetchPaymentTermReport,
    fetchReservationByTeamReport
} from "../services/vehicleSales";
import { generateYearMonths, getMonthIndex, toNumber } from "../utils/tools";

const transformVehicleSales = (data, year) => {
    const months = 12;
    const map = {};
    const totals = Array(months).fill(0);

    data.forEach(item => {
        const unitId = item.unitId ?? item.unit?.id ?? item.Unit?.id ?? item.id;
        const unit = item.unitName || item.unit?.name || item.Unit?.name || item.unit;
        const monthIndex = getMonthIndex(item.targetReleaseDate, year);
        const total = toNumber(item.total ?? 1);

        if (monthIndex === -1) return;

        if (!map[unitId]) {
            map[unitId] = {
                id: unitId,
                name: unit,
                data: Array(months).fill(0)
            };
        }

        map[unitId].data[monthIndex] += total;
        totals[monthIndex] += total;
    });

    return {
        vehicles: Object.values(map),
        totals
    };
};

const transformPaymentTerm = (data, year) => {
    const months = 12;

    const result = {
        payment: [
            { name: "Cash", data: Array(months).fill(0) },
            { name: "Financing", data: Array(months).fill(0) },
            { name: "Bank OP", data: Array(months).fill(0) }
        ],
        totals: Array(months).fill(0)
    };

    data.forEach(item => {
        const monthIndex = getMonthIndex(item.targetReleaseDate, year);
        const total = toNumber(item.total);

        if (monthIndex === -1) return;

        const row = result.payment.find(p => p.name === item.transaction);
        if (row) {
            row.data[monthIndex] += total;
            result.totals[monthIndex] += total;
        }
    });

    return result;
};

const transformReservation = (data, year) => {
    const months = 12;
    const map = {};
    const totals = Array(months).fill(0);

    data.forEach(item => {
        const teamInfo = item.team || item.Team;
        const teamId = item.teamId ?? teamInfo?.id;
        const teamCode = teamInfo?.teamCode || item.teamCode;
        const teamLeader = teamInfo?.teamLeader || item.teamLeader;
        const team =
            item.teamName ||
            teamInfo?.teamName ||
            (teamCode && teamLeader ? `${teamCode} - ${teamLeader}` : null) ||
            teamInfo?.name ||
            teamLeader ||
            teamCode ||
            "Unknown";
        const monthIndex = getMonthIndex(item.reservedDate, year);
        const total = toNumber(item.total);

        if (monthIndex === -1) return;

        if (!map[teamId ?? team]) {
            map[teamId ?? team] = {
                id: teamId ?? team,
                name: team,
                data: Array(months).fill(0)
            };
        }

        map[teamId ?? team].data[monthIndex] += total;
        totals[monthIndex] += total;
    });

    return {
        teams: Object.values(map),
        totals
    };
};

const getAvailableReportYears = (datasets = []) => {
    const years = new Set();

    datasets.forEach(({ rows = [], dateKey }) => {
        rows.forEach((item) => {
            const value = item?.[dateKey];
            if (!value) return;

            const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
                ? new Date(`${value}T00:00:00`)
                : new Date(value);

            if (!Number.isNaN(date.getTime())) {
                years.add(date.getFullYear());
            }
        });
    });

    return Array.from(years).sort((a, b) => b - a);
};

export default function VehicleReports() {

    const [isLoading, setIsLoading] = useState(false);

    const today = new Date();
    const currentYear = today.getFullYear();
    const [year, setYear] = useState(currentYear);

    const [showCreateVariant, setShowCreateVariant] = useState(false);
    const [showUpdateVariant, setShowUpdateVariant] = useState(false);
    const [showUpdateUnit, setShowUpdateUnit] = useState(false);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

    const [unitId, setUnitId] = useState(null);
    const [vehicleSales, setVehicleSales] = useState({ vehicles: [], totals: [] });
    const [paymentTerm, setPaymentTerm] = useState({ payment: [], totals: [] });
    const [reservationByTeam, setReservationByTeam] = useState({ teams: [], totals: [] });

    const dates = generateYearMonths().map(name => ({ value: '', name }));

    // Generate year range from 2025 to 2100
    const getYearRange = () => {
        return Array.from({ length: 76 }, (_, i) => 2025 + i);
    };

    const handleEditModel = (modelId) => {
        setUnitId(modelId);
        setShowUpdateUnit(true);
    }

    const handleExportAll = async () => {
        try {
            const vehicleSalesTable = createVehicleSalesByUnitsExport(vehicleSales, year);
            const paymentTermTable = createPaymentTermMonthlyExport(paymentTerm, year);
            const reservationByTeamTable = createReservationByTeamMonthlyExport(reservationByTeam, year);

            await exportToWord({
                title: `${year} Vehicle Reports`,
                subtitle: "Complete monthly breakdown",
                tables: [vehicleSalesTable, paymentTermTable, reservationByTeamTable],
                fileName: `Vehicle_Reports_${year}`
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadReports = async () => {
            try {
                setIsLoading(true);
                const v = await fetchVehicleSalesReport();
                const p = await fetchPaymentTermReport();
                const r = await fetchReservationByTeamReport();

                const vehicleRows = v?.data ?? [];
                const paymentRows = p?.data ?? [];
                const reservationRows = r?.data ?? [];
                const availableYears = getAvailableReportYears([
                    { rows: vehicleRows, dateKey: "targetReleaseDate" },
                    { rows: paymentRows, dateKey: "targetReleaseDate" },
                    { rows: reservationRows, dateKey: "reservedDate" }
                ]);

                if (availableYears.length > 0 && !availableYears.includes(year)) {
                    setYear(availableYears[0]);
                    return;
                }

                if (v?.success) setVehicleSales(transformVehicleSales(vehicleRows, year));
                if (p?.success) setPaymentTerm(transformPaymentTerm(paymentRows, year));
                if (r?.success) setReservationByTeam(transformReservation(reservationRows, year));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadReports();
    }, [year]);
    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">
                <div className="flex items-end gap-4 flex-wrap">
                    <div className="mr-auto">
                        <PageTitle>{year} VEHICLE & RESERVATION REPORTS</PageTitle>
                        <PageSubTitle>Monthly breakdown by model, payment terms, and team reservations</PageSubTitle>
                    </div>
                    <div className="flex gap-3 items-center">
                        <DropdownMenu.Root open={yearDropdownOpen} onOpenChange={setYearDropdownOpen}>
                            <DropdownMenu.Trigger asChild>
                                <button className="w-24 text-center px-5 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-nissan-red bg-white hover:bg-gray-50 font-medium transition-colors">
                                    {year}
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    align="center"
                                    sideOffset={5}
                                    className="bg-white border border-gray-300 rounded-xl shadow-lg p-4"
                                    style={{ width: '320px' }}
                                >
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="grid grid-cols-4 gap-2">
                                            {getYearRange().map((y) => (
                                                <button
                                                    key={y}
                                                    onClick={() => {
                                                        setYear(y);
                                                        setYearDropdownOpen(false);
                                                    }}
                                                    className={`px-2 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer border-2 ${y === year
                                                        ? 'bg-nissan-red text-white border-nissan-red font-bold'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-nissan-red hover:text-nissan-red'
                                                        }`}
                                                >
                                                    {y}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>

                        <button
                            className="btn bg-nissan-red text-white rounded-xl opacity-60"
                            disabled={isLoading}
                            onClick={handleExportAll}>
                            <FileDown size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Vehicle Sales by Model (Monthly) */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Vehicle Sales by Units (Monthly) - {year}</p>
                        <div className="flex gap-2">
                            <button
                                className="btn rounded-xl"
                                onClick={() => setShowCreateVariant(true)}
                            >
                                <Plus size={16} />
                            </button>
                            <button
                                className="btn rounded-xl"
                                onClick={() => setShowUpdateVariant(true)}
                            >
                                <Pen size={16} />
                            </button>

                        </div>
                    </div>

                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">UNITS</td>
                                    {dates?.map((date, index) => (
                                        <td key={index}>{date?.name}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicleSales?.vehicles?.map(vehicleSale => (
                                    <tr key={vehicleSale?.name}>
                                        <td className="rowHeader flex gap-4 items-center justify-between">
                                            {vehicleSale?.name}
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger asChild>
                                                    <button className="cursor-pointer">
                                                        <EllipsisVertical size={16} />
                                                    </button>
                                                </DropdownMenu.Trigger>

                                                <DropdownMenu.Portal>
                                                    <DropdownMenu.Content
                                                        align="start"
                                                        sideOffset={5}
                                                        className="minimenu bg-white shadow-lg rounded-xl p-1 border border-gray-200"
                                                    >
                                                        <DropdownMenu.Item
                                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                                                            onClick={() => handleEditModel(vehicleSale.id)}
                                                        >

                                                            <SquarePen size={16} />
                                                            Edit Model

                                                        </DropdownMenu.Item>

                                                        {/*<DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </DropdownMenu.Item>*/}
                                                    </DropdownMenu.Content>
                                                </DropdownMenu.Portal>
                                            </DropdownMenu.Root>
                                        </td>
                                        {vehicleSale?.data?.map((d, index) => (
                                            <td key={index} className={d > 0 ? '' : 'text-nissan-gray'}>{d}</td>
                                        ))}
                                        <td className="rowFooter">{vehicleSale.data.reduce((sum, value) => sum + value, 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {vehicleSales?.totals?.map((total, index) => (
                                        <td key={index}>{total}</td>
                                    ))}
                                    <td className="rowFooter">
                                        0
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Payment Term (Monthly) */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Payment Term (Monthly) - {year}</p>




                    </div>
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">PAYMENT TERM</td>
                                    {dates?.map((date, index) => (
                                        <td key={index}>{date?.name}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentTerm?.payment?.map((p) => (
                                    <tr key={p.name}>
                                        <td className="rowHeader">{p?.name}</td>
                                        {p?.data?.map((d, index) => (
                                            <td key={index} className={d > 0 ? '' : 'text-nissan-gray'}>{d}</td>
                                        ))}
                                        <td className="rowFooter">{p.data.reduce((sum, value) => sum + value, 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {paymentTerm?.totals?.map((total, index) => (
                                        <td key={index}>{total}</td>
                                    ))}
                                    <td className="rowFooter">0</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>

                {/* Reservation by Team (Monthly) */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Reservation by Team (Monthly) - {year}</p>


                    </div>

                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">TEAM</td>
                                    {dates?.map((date, index) => (
                                        <td key={index}>{date?.name}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                {reservationByTeam?.teams?.length > 0 ? reservationByTeam.teams.map(team => (
                                    <tr key={team.id}>
                                        <td className="rowHeader">{team?.name}</td>
                                        {team?.data?.map((d, index) => (
                                            <td key={index} className={d > 0 ? '' : 'text-nissan-gray'}>{d}</td>
                                        ))}
                                        <td className="rowFooter">{team.data.reduce((sum, value) => sum + value, 0)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={14} className="py-6 text-center text-nissan-gray">
                                            No reservation data found for {year}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {reservationByTeam?.totals?.map((total, index) => (
                                        <td key={index}>{total}</td>
                                    ))}
                                    <td className="rowFooter">0</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>

            {/* Create Variant */}
            {showCreateVariant && <CreateVariant onClose={() => setShowCreateVariant(false)} />}

            {/* Update Unit */}
            {showUpdateVariant && <UpdateVariant onClose={() => setShowUpdateVariant(false)} />}

            {/* Update Unit */}
            {showUpdateUnit && <UpdateUnit unitId={unitId} onClose={() => setShowUpdateUnit(false)} />}

        </div>
    )
}
