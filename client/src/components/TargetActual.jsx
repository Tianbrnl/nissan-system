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
        Application: 50,
        Sold: 45,
    },
    {
        month: 'Jan',
        Application: 55,
        Sold: 52,
    },
    {
        month: 'Feb',
        Application: 60,
        Sold: 50,
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
                <Bar dataKey="Application" fill="#94A3B8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Sold" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}