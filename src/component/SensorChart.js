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

const SensorChart = ({ sensorData }) => {
  return (
    <div
      className="chart-container"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {/* Biểu đồ 1: Nhiệt độ, Độ ẩm, Ánh sáng */}
      <div style={{ flex: 1, marginRight: "10px" }}>
        <h2>
          <FcComboChart size={50} />
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sensorData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#ff7300"
              fill="url(#colorTemp)"
              name="Nhiệt độ"
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="#0088FE"
              fill="url(#colorHumidity)"
              name="Độ ẩm"
            />
            <Area
              type="monotone"
              dataKey="light"
              stroke="#00C49F"
              fill="url(#colorLight)"
              name="Ánh sáng"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ 2: Gió và Bụi */}
      <div style={{ flex: 1 }}>
        <h2 style={{ marginTop: "50px" }}></h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sensorData}>
            <defs>
              <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDust" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9c27b0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="wind"
              stroke="#ff9800"
              fill="url(#colorWind)"
              name="Tốc độ gió"
            />
            <Area
              type="monotone"
              dataKey="dust"
              stroke="#9c27b0"
              fill="url(#colorDust)"
              name="Bụi"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;
