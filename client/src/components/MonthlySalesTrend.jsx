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


const teams = [
    {
        month: 'Jan',
        thisYear: 48,
        lastYear: 52,
    },
    {
        month: 'Feb',
        thisYear: 43,
        lastYear: 50,
    },
    {
        month: 'Mar',
        thisYear: 38,
        lastYear: 42,
    },
    {
        month: 'Apr',
        thisYear: 34,
        lastYear: 38,
    },
    {
        month: 'Jun',
        thisYear: 37,
        lastYear: 41,
    },
    {
        month: 'Jul',
        thisYear: 42,
        lastYear: 46,
    },
    {
        month: 'Aug',
        thisYear: 35,
        lastYear: 38,
    },
    {
        month: 'Sep',
        thisYear: 42,
        lastYear: 45,
    },
    {
        month: 'Oct',
        thisYear: 38,
        lastYear: 43,
    },
    {
        month: 'Nov',
        thisYear: 45,
        lastYear: 48,
    },
    {
        month: 'Dec',
        thisYear: 40,
        lastYear: 45,
    },
];



export default function MonthlySalesTrend() {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="thisYear"
                    name="2025"
                    fill="#94A3B8"
                    radius={[8, 8, 0, 0]}
                />
                <Line
                    type="monotone"
                    dataKey="lastYear"
                    name="2026"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}