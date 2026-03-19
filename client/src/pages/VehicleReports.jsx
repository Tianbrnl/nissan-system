import { EllipsisVertical, FileDown, Pen, Plus, SquarePen, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState, useEffect  } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import CreateVariant from "../components/VehicleReports/CreateVariant";
import UpdateUnit from "../components/VehicleReports/UpdateUnit";
import UpdateVariant from "../components/VehicleReports/UpdateVariant";
import {
  fetchVehicleSalesReport,
  fetchPaymentTermReport,
  fetchReservationByTeamReport
} from "../services/vehicleSales";

const REPORT_MONTH_LABELS = [
    'DEC 2025',
    'JAN 2026',
    'FEB 2026',
    'MAR 2026',
    'APR 2026',
    'MAY 2026',
    'JUN 2026',
    'JUL 2026',
    'AUG 2026',
    'SEP 2026',
    'OCT 2026',
    'NOV 2026',
    'DEC 2026'
];

const getMonthIndex = (value) => {
    if (!value) return -1;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return -1;

    const label = date
        .toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
        .toUpperCase();

    return REPORT_MONTH_LABELS.indexOf(label);
};

const toNumber = (value) => Number(value) || 0;

const transformVehicleSales = (data) => {
    const months = REPORT_MONTH_LABELS.length;
    const map = {};
    const totals = Array(months).fill(0);

    data.forEach(item => {
        const unitId = item.unitId ?? item.unit?.id ?? item.Unit?.id ?? item.id;
        const unit = item.unitName || item.unit?.name || item.Unit?.name || item.unit ;
        const monthIndex = getMonthIndex(item.targetReleaseDate);
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

const transformPaymentTerm = (data) => {
    const months = REPORT_MONTH_LABELS.length;

    const result = {
        payment: [
            { name: "Cash", data: Array(months).fill(0) },
            { name: "Financing", data: Array(months).fill(0) },
            { name: "Bank OP", data: Array(months).fill(0) }
        ],
        totals: Array(months).fill(0)
    };

    data.forEach(item => {
        const monthIndex = getMonthIndex(item.targetReleaseDate);
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

const transformReservation = (data) => {
    const months = REPORT_MONTH_LABELS.length;
    const map = {};
    const totals = Array(months).fill(0);

    data.forEach(item => {
        const teamInfo = item.team || item.Team;
        const teamId = item.teamId ?? teamInfo?.id;
        const team = 
            teamInfo?.teamLeader ||   
            teamInfo?.teamName ||
            teamInfo?.name ||
            item.teamName ||
            teamInfo?.teamCode ||     
            item.teamCode ||
            "Unknown";
        const monthIndex = getMonthIndex(item.reservedAt);
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
 
export default function VehicleReports() {
    const [showCreateVariant, setShowCreateVariant] = useState(false);
    const [showUpdateVariant, setShowUpdateVariant] = useState(false);
    const [showUpdateUnit, setShowUpdateUnit] = useState(false);

    const [unitId, setUnitId] = useState(null);
// 1. state
    const [vehicleSales, setVehicleSales] = useState({ vehicles: [], totals: [] });
    const [paymentTerm, setPaymentTerm] = useState({ payment: [], totals: [] });
    const [reservationByTeam, setReservationByTeam] = useState({ teams: [], totals: [] });

    const dates = REPORT_MONTH_LABELS.map(name => ({ value: '', name }));
    const handleEditModel = (modelId) => {
        setUnitId(modelId);
        setShowUpdateUnit(true);
    }

// 2. useEffect
    useEffect(() => {
        const loadReports = async () => {
        const v = await fetchVehicleSalesReport();
        const p = await fetchPaymentTermReport();
        const r = await fetchReservationByTeamReport();

        console.log("Vehicle:", v);
        console.log("Payment:", p);
       console.log("Reservation:", r);

        if (v?.success) setVehicleSales(transformVehicleSales(v.data));
        if (p.success) setPaymentTerm(transformPaymentTerm(p.data));
        if (r.success) setReservationByTeam(transformReservation(r.data));
    };

    loadReports();
    }, []);
    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>Vehicle & Reservation Reports</PageTitle>
                        <PageSubTitle>Monthly breakdown by model, payment terms, and team reservations</PageSubTitle>
                    </div>
                    <button className="btn bg-nissan-red text-white rounded-xl">
                        <FileDown size={16} /> Export
                    </button>
                </div>

                {/* Vehicle Sales by Model (Monthly) */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Vehicle Sales by Units (Monthly)</p>
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
                            <button className="btn bg-nissan-red text-white rounded-xl">
                                <FileDown size={16} /> Export
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

                                                        <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </DropdownMenu.Item>
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
                        <p className="text-lg font-semibold">Payment Term (Monthly)</p>


                        <button className="btn bg-nissan-red text-white rounded-xl">
                            <FileDown size={16} /> Export
                        </button>

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
                        <p className="text-lg font-semibold">Reservation by Team (Monthly)</p>

                        <button className="btn bg-nissan-red text-white rounded-xl">
                            <FileDown size={16} /> Export
                        </button>
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
                                {reservationByTeam?.teams?.map(team => (
                                    <tr key={team.id}>
                                        <td className="rowHeader">{team?.name}</td>
                                        {team?.data?.map((d, index) => (
                                            <td key={index} className={d > 0 ? '' : 'text-nissan-gray'}>{d}</td>
                                        ))}
                                        <td className="rowFooter">{team.data.reduce((sum, value) => sum + value, 0)}</td>
                                    </tr>
                                ))}
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