import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function TeamPerformance({ teams = [] }) {

    if (teams.length === 0) {
        return (
            <div className="text-center p-4">
                <h3>NO DATA</h3>
            </div>
        )
    }

    teams = teams?.map(team => ({ name: team?.name, units: team?.data?.reduce((sum, num) => sum + num, 0) ?? 0 }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="units" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}