import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = [
    "#3b82f6",
    "#10B981",
    "#F59E0B"
];

export default function PaymentTermDistribution({ paymentTerm }) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip formatter={(value) => `${value}%`} />

                <Pie
                    data={paymentTerm}
                    dataKey="data"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                >
                    {paymentTerm.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}