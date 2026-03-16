import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function ReservationByTeam({teams}) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="data" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}