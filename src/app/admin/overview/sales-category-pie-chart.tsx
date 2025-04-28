"use client";

import useColorStore from "@/hooks/use-color-store";
import { useTheme } from "next-themes";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}

interface CategoryData {
  name: string;
  value: number;
}

export default function SalesCategoryPieChart({
  data,
}: {
  data: CategoryData[];
}) {
  const { theme } = useTheme();
  const { cssColors } = useColorStore(theme);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: CustomLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="text-xs"
        >
          {`${data[index].name} ${data[index].value} sales`}
        </text>
      </>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(${cssColors["--primary"]})`}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
