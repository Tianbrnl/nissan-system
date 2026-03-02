import { CircleCheckBig, Target, TrendingDown, TrendingUp, Users } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import ReservationByTeam from "../components/ReservationByTeam";
import TargetActual from "../components/TargetActual";
import MonthlySalesTrend from "../components/MonthlySalesTrend";
import PaymentTermDistribution from "../components/PaymenTermDistribution";

export default function Dashboard() {


    const totals = [
        {
            Icom: Target,
            name: 'ToTal Sales',
            total: 125,
            rate: 8
        },
        {
            Icom: TrendingUp,
            name: 'YTD Sales',
            total: 75,
            rate: 8
        },
        {
            Icom: Users,
            name: 'Total Reservations',
            total: 92,
            rate: 12
        },
        {
            Icom: CircleCheckBig,
            name: 'Approval Rate',
            total: '68%',
            rate: 4
        },
        {
            Icom: Target,
            name: 'Projected 2026 Sales',
            total: 580,
            rate: 5
        }
    ]

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
                                <div className={`flex items-center gap-2 ${total.rate > 0 ? 'text-green-600' : 'text-nissan-red'}`}>
                                    {total.rate > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    <p>{total.rate}%</p>
                                </div>
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
                        <p className="text-lg font-semibold">Target vs Actual</p>
                        <div className="h-70">
                            <TargetActual />
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
                            <ReservationByTeam />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}