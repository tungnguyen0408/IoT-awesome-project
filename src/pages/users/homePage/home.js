import { useState, useEffect, memo } from "react";
import axios from "axios";
import { Switch, Card, CardContent, Box } from "@mui/material";
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
import { AiOutlineBulb } from "react-icons/ai";
import { MdAcUnit, MdOpacity } from "react-icons/md";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./homeStyle.scss";

const socketUrl = "http://localhost:8080/ws";
const API_LATEST = "http://localhost:8080/api/v1/get-top-data";
const API_HISTORY = "http://localhost:8080/api/v1/get-top-ten?quantity=10";

const HomePage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [devices, setDevices] = useState({
    temperatureDevice: true,
    humidityDevice: true,
    lightDevice: true,
  });

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/sensor", (message) => {
          const parsed = JSON.parse(message.body);
          console.log("Received from socket:", parsed);
          setLatestData(parsed); // cập nhật giá trị mới nhất
          setSensorData((prev) => [...prev.slice(-9), parsed]);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, historyRes] = await Promise.all([
          axios.get(API_LATEST),
          axios.get(API_HISTORY),
        ]);

        if (latestRes.data.statusCode === 200) {
          setLatestData(latestRes.data.data);
        }

        if (historyRes.data.statusCode === 200) {
          const formattedData = historyRes.data.data.map((item) => ({
            ...item,
            time: new Date(item.time).toLocaleTimeString(),
          }));
          setSensorData(formattedData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleDevice = (device) => {
    setDevices((prev) => ({ ...prev, [device]: !prev[device] }));
  };

  const deviceList = [
    {
      label: "Điều hòa",
      key: "temperatureDevice",
      icon: MdAcUnit,
      nameIcon: "temperature-icon",
      activeColor: "#03a9f4",
    },
    {
      label: "Quạt",
      key: "humidityDevice",
      icon: MdOpacity,
      nameIcon: "humidity-icon",
      activeColor: "#4caf50",
    },
    {
      label: "Ánh sáng",
      key: "lightDevice",
      icon: AiOutlineBulb,
      nameIcon: "light-icon",
      activeColor: "#ffeb3b",
    },
    {
      label: "Ánh sáng",
      key: "lightDevice",
      icon: AiOutlineBulb,
      nameIcon: "light-icon",
      activeColor: "#ffeb3b",
    },
    {
      label: "Ánh sáng",
      key: "lightDevice",
      icon: AiOutlineBulb,
      nameIcon: "light-icon",
      activeColor: "#ffeb3b",
    },
  ];
  const column1 = deviceList.slice(0, 3);
  const column2 = deviceList.slice(3);
  return (
    <div className="homepage">
      <div className="sensor-info">
        {[
          { label: "🌡️ Nhiệt độ", key: "temperature", unit: "°C" },
          { label: "💧 Độ ẩm", key: "humidity", unit: "%" },
          { label: "💡 Ánh sáng", key: "light", unit: "lux" },
        ].map(({ label, key, unit }) => (
          <Card key={key} className="sensor-card">
            <CardContent>
              <Box className="sensor-box">
                <h3>{label}</h3>
                <p>
                  {latestData ? latestData[key] : "--"} {unit}
                </p>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="dashboard" style={{ marginTop: "10px" }}>
        <div className="chart-container">
          <h2>
            <FcComboChart size={50} /> Biểu đồ cảm biến
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
                fillOpacity={1}
                name="Nhiệt độ"
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#0088FE"
                fill="url(#colorHumidity)"
                fillOpacity={1}
                name="Độ ẩm"
              />
              <Area
                type="monotone"
                dataKey="light"
                stroke="#00C49F"
                fill="url(#colorLight)"
                fillOpacity={1}
                name="Ánh sáng"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* <div className="device-list">
          {deviceList.map(
            ({ label, key, icon: Icon, nameIcon, activeColor }) => (
              <div
                key={key}
                className={`device-item ${devices[key] ? "active" : ""}`}
              >
                <Icon
                  className={`device-icon ${nameIcon}`}
                  style={{
                    color: devices[key] ? activeColor : "#ccc",
                    transition: "color 0.3s ease-in-out",
                    fontSize: "2rem",
                  }}
                />
                <span className="device-label">{label}</span>
                <Switch
                  checked={devices[key]}
                  onChange={() => toggleDevice(key)}
                  className="device-switch"
                />
              </div>
            )
          )}
        </div> */}
        <div className="device-list-columns">
          {[column1, column2].map((column, colIndex) => (
            <div className="device-column" key={colIndex}>
              {column.map(
                ({ label, key, icon: Icon, nameIcon, activeColor }) => (
                  <div
                    key={key}
                    className={`device-item ${devices[key] ? "active" : ""}`}
                  >
                    <Icon
                      className={`device-icon ${nameIcon}`}
                      style={{
                        color: devices[key] ? activeColor : "#ccc",
                        transition: "color 0.3s ease-in-out",
                        fontSize: "2rem",
                      }}
                    />
                    <span className="device-label">{label}</span>
                    <Switch
                      checked={devices[key]}
                      onChange={() => toggleDevice(key)}
                      className="device-switch"
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
