import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "8AM", temp: 28 },
  { time: "10AM", temp: 30 },
  { time: "12PM", temp: 33 },
  { time: "2PM", temp: 35 },
  { time: "4PM", temp: 32 },
];

export default function EnvironmentalGraph() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}