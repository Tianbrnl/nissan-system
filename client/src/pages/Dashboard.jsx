import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import ReservationByTeam from "../components/ReservationByTeam";
import MonthlySalesTrend from "../components/MonthlySalesTrend";
import PaymentTermDistribution from "../components/PaymenTermDistribution";
import { useEffect } from "react";
import { reservationByTeam } from "../services/dashboardServices";
import { useState } from "react";
import ApplicationSold from "../components/ApplicationSold";
import Input from "../components/ui/Input";

export default function Dashboard() {

    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;
    const formattedMonth = `${thisYear}-${thisMonth.toString().padStart(2, '0')}`;
    const [monthYear, setMonthYear] = useState(formattedMonth);
    const selectedYear = Number(monthYear.substring(0, 4));
    const [teams, setTeams] = useState([]);
    const selectedMonthLabel = new Date(`${monthYear}-01`).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });

    useEffect(() => {
        const loadReservationByTeam = async () => {
            const { success, message, teams: apiTeams } = await reservationByTeam(monthYear);
            if (success) {
                setTeams(apiTeams);
                return;
            }

            console.error(message);
        };

        loadReservationByTeam();
    }, [monthYear]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">
                <section className="flex justify-between items-center">
                    <div>
                        <PageTitle>Dashboard Overview</PageTitle>
                        <PageSubTitle>Executive summary of automotive sales performance</PageSubTitle>
                    </div>
                    <Input
                        type="month"
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                    />
                </section>
            {/* <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
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
                </section> */}
            <section className="grid lg:grid-cols-2 gap-8">
                <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                    <p className="text-lg font-semibold">Monthly Sales Trend {selectedYear - 1} vs {selectedYear}</p>
                    <div className="h-70">
                        <MonthlySalesTrend year={selectedYear} />
                    </div>
                </div>
                <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                    <p className="text-lg font-semibold">Application vs Sold {selectedYear}</p>
                    <div className="h-70">
                        <ApplicationSold year={selectedYear} />
                    </div>
                </div>
                <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                    <p className="text-lg font-semibold">Payment Term Distribution {selectedMonthLabel}</p>
                    <div className="h-70">
                        <PaymentTermDistribution monthYear={monthYear} />
                    </div>
                </div>
                <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                    <p className="text-lg font-semibold">Reservation by Team {selectedMonthLabel}</p>
                    <div className="h-70">
                        <ReservationByTeam teams={teams} />
                    </div>
                </div>
            </section>
            </div>
        </div>
    );
}
