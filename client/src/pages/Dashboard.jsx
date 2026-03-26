import { CircleCheckBig, Target, TrendingUp, Users } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import ReservationByTeam from "../components/ReservationByTeam";
import MonthlySalesTrend from "../components/MonthlySalesTrend";
import PaymentTermDistribution from "../components/PaymenTermDistribution";
import { useEffect } from "react";
import { fetchDashboardTotals, reservationByTeam } from "../services/dashboardServices";
import { useState } from "react";
import ApplicationSold from "../components/ApplicationSold";

export default function Dashboard() {


    const [totals, setTotals] = useState([
        {
            Icom: Target,
            name: 'ToTal Sales',
            total: 0
        },
        {
            Icom: TrendingUp,
            name: 'YTD Sales',
            total: 0
        },
        {
            Icom: Users,
            name: 'Total Reservations',
            total: 0
        },
        {
            Icom: CircleCheckBig,
            name: 'Approval Rate',
            total: '0%'
        }
    ]);

    const [teams, setTeams] = useState([]);


    const loadTotals = async () => {
        const { success, message, totals: apiTotals } = await fetchDashboardTotals();

        if (!success) {
            console.error(message);
            return;
        }

        setTotals([
            {
                Icom: Target,
                name: 'Total Sales',
                total: apiTotals.totalSales
            },
            {
                Icom: TrendingUp,
                name: 'YTD Sales',
                total: apiTotals.yearTodaySales
            },
            {
                Icom: Users,
                name: 'Total Reservations',
                total: apiTotals.totalReservation
            },
            {
                Icom: CircleCheckBig,
                name: 'Approval Rate',
                total: `${apiTotals.approvalRate}%`
            }
        ]);
    };

    const loadReservationByTeam = async () => {
        const { success, message, teams: apiTeams } = await reservationByTeam();
        if (success) return setTeams(apiTeams);
        console.error(message);
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTotals();
                loadReservationByTeam();
            })
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">
                <section>
                    <PageTitle>Dashboard Overview</PageTitle>
                    <PageSubTitle>Executive summary of automotive sales performance</PageSubTitle>
                </section>
                <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                    {totals.map((total, index) => (
                        <div key={index} className="flex border border-gray-300 shadow-lg p-6 rounded-xl">
                            <div className="grow flex gap-2 flex-col">
                                <p className="text-sm">{total.name}</p>
                                <h2 className="font-bold">{total.total}</h2>
                            </div>
                            <div className="h-fit p-2 rounded-lg bg-blue-50 text-blue-600">
                                <total.Icom />
                            </div>
                        </div>
                    ))}
                </section>
                <section className="grid lg:grid-cols-2 gap-8">
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Monthly Sales Trend (2025 vs 2026)</p>
                        <div className="h-70">
                            <MonthlySalesTrend />
                        </div>
                    </div>
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Application vs Sold</p>
                        <div className="h-70">
                            <ApplicationSold />
                        </div>
                    </div>
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Payment Term Distribution</p>
                        <div className="h-70">
                            <PaymentTermDistribution />
                        </div>
                    </div>
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Reservation by Team</p>
                        <div className="h-70">
                            <ReservationByTeam teams={teams} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}