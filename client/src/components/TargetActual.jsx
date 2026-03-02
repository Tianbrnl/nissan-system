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


const teams = [

    {
        month: 'Dec',
        target: 50,
        actual: 45,
    },
    {
        month: 'Jan',
        target: 55,
        actual: 52,
    },
    {
        month: 'Feb',
        target: 60,
        actual: 50,
    },
];



export default function TargetActual() {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend/>
                <Bar dataKey="target" fill="#94A3B8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}