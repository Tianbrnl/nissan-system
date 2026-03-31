import { useEffect, useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    LineChart,
    Legend
} from "recharts";
import { fetchMonthlySoldTrend } from "../services/dashboardServices";

export default function MonthlySalesTrend({ year }) {

    const [monthlySoldTrend, setMonthlySoldTrend] = useState([]);

    useEffect(() => {
        try {
            try {
                const loadMonthlySoldTrend = async () => {
                    const { success, message, monthlySoldTrend: apiMonthlySoldTrend } = await fetchMonthlySoldTrend(year);
                    if (success) return setMonthlySoldTrend(apiMonthlySoldTrend);
                    console.error(message);
                }
                loadMonthlySoldTrend();
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }

    }, [year]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySoldTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="thisYear"
                    name={String(year)}
                    fill="#94A3B8"
                    radius={[8, 8, 0, 0]}
                />
                <Line
                    type="monotone"
                    dataKey="lastYear"
                    name={String(year - 1)}
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
