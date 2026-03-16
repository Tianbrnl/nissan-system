import { EllipsisVertical, FileDown, Pen, Plus, SquarePen, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import CreateVariant from "../components/VehicleReports/CreateVariant";
import UpdateUnit from "../components/VehicleReports/UpdateUnit";
import UpdateVariant from "../components/VehicleReports/UpdateVariant";

export default function VehicleReports() {

    const [showCreateVariant, setShowCreateVariant] = useState(false);
    const [showUpdateVariant, setShowUpdateVariant] = useState(false);
    const [showUpdateUnit, setShowUpdateUnit] = useState(false);

    const [unitId, setUnitId] = useState(null);

    const dates = [
        { value: '', name: 'DEC 2025' },
        { value: '', name: 'JAN 2026' },
        { value: '', name: 'FEB 2026' },
        { value: '', name: 'MAR 2026' },
        { value: '', name: 'APR 2026' },
        { value: '', name: 'MAY 2026' },
        { value: '', name: 'JUN 2026' },
        { value: '', name: 'JUL 2026' },
        { value: '', name: 'AUG 2026' },
        { value: '', name: 'SEP 2026' },
        { value: '', name: 'OCT 2026' },
        { value: '', name: 'NOV 2026' },
        { value: '', name: 'DEC 2026' }
    ];
    const vehicleSales = {
        vehicles: [

            {
                id: 2,
                name: 'Kicks',
                data: [12, 15, 18, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 3,
                name: 'E26',
                data: [6, 9, 12, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 4,
                name: 'N18',
                data: [6, 9, 12, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 5,
                name: 'Patrol',
                data: [2, 5, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 6,
                name: 'D23',
                data: [9, 12, 15, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 7,
                name: 'Terra',
                data: [5, 8, 11, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 8,
                name: 'Livina',
                data: [3, 6, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 9,
                name: 'Nissan Z',
                data: [1, 4, 7, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 10,
                name: 'Prem',
                data: [1, 4, 7, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }
        ],
        totals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    const paymentTerm = {
        payment: [

            {
                name: 'Cash',
                data: [15, 18, 22, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Financing',
                data: [30, 35, 42, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Bank PO',
                data: [10, 12, 15, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        totals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }


    const reservationByTeam = {
        teams: [

            {
                id: 1,
                name: 'NSR1 – Mike',
                rate: 14,
                data: [35, 38, 42, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 2,
                name: 'NSR2 – Jhoven',
                rate: 13,
                data: [32, 35, 38, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                id: 3,
                name: 'NSR3 – Jayr',
                rate: 16,
                data: [25, 28, 32, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        totals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    const handleEditModel = (modelId) => {
        setUnitId(modelId);
        setShowUpdateUnit(true);
    }


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
                                    <tr key={vehicleSale?.id}>
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
                                {paymentTerm?.payment?.map((p, index) => (
                                    <tr key={index}>
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
                                    <tr key={team?.id}>
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