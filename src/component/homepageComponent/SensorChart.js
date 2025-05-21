import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FcComboChart } from "react-icons/fc";

const ChartWrapper = ({ title, dataKey, stroke, fill, sensorData, name }) => (
  <div
    style={{
      flex: 1, // chia đều chiều ngang
      minWidth: 0, // để ResponsiveContainer không bị tràn
      margin: "0 10px", // khoảng cách giữa các chart
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <h3 style={{ marginBottom: 10 }}>
      <FcComboChart size={30} /> {title}
    </h3>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={sensorData}>
        <defs>
          <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
            <stop offset="95%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          fill={`url(#color${dataKey})`}
          name={name}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const SensorChart = ({ sensorData }) => {
  return (
    <div
      className="chart-container"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: "50px",
        width: "100%",
      }}
    >
      <ChartWrapper
        title="Nhiệt độ"
        dataKey="temperature"
        stroke="#ff7300"
        fill="#ff7300"
        sensorData={sensorData}
        name="Nhiệt độ"
      />
      <ChartWrapper
        title="Độ ẩm"
        dataKey="humidity"
        stroke="#0088FE"
        fill="#0088FE"
        sensorData={sensorData}
        name="Độ ẩm"
      />
      <ChartWrapper
        title="Ánh sáng"
        dataKey="light"
        stroke="#00C49F"
        fill="#00C49F"
        sensorData={sensorData}
        name="Ánh sáng"
      />
    </div>
  );
};

export default SensorChart;
