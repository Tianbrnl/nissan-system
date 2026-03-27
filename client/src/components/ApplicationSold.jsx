import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { fetchApplicationSold } from "../services/dashboardServices";

export default function ApplicationSold() {

    const [applicationSold, setApplicationSold] = useState([]);

    useEffect(() => {
        try {
            try {
                const loadApplicationSold = async () => {
                    const { success, message, applicationSold: apiApplicationSold } = await fetchApplicationSold();
                    if (success) return setApplicationSold(apiApplicationSold);
                    console.error(message);
                }
                loadApplicationSold();
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }

    }, []);


    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applicationSold}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="applications"
                    fill="#94A3B8"
                    radius={[8, 8, 0, 0]}
                />
                <Bar
                    dataKey="sold"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}