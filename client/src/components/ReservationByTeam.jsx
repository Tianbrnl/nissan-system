import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


const teams = [

    {
        id: 1,
        name: 'NSR1 – Mike',
        data: 35,
    },
    {
        id: 2,
        name: 'NSR2 – Jhoven',
        data: 32,
    },
    {
        id: 3,
        name: 'NSR3 – Jayr',
        data: 25,
    },
];



export default function ReservationByTeam() {

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