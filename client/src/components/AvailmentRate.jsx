import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function AvailmentRate({ teams = [] }) {

    if (teams.length === 0) {
        return (
            <div className="text-center p-4">
                <h3>NO DATA</h3>
            </div>
        )
    }

    teams = teams?.map(team => ({ name: team?.name, availmentRate: Math.round((team?.availed / team?.appliedApproved) * 100) }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="availmentRate" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}