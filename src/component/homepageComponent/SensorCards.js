import React from "react";
import { Card, CardContent, Box } from "@mui/material";

const SensorCards = ({ sensorData }) => {
  const sensors = [
    { label: "🌡️ Nhiệt độ", key: "temperature", unit: "°C" },
    { label: "💧 Độ ẩm", key: "humidity", unit: "%" },
    { label: "💡 Ánh sáng", key: "light", unit: "lux" },
    { label: "💨 Tốc độ gió", key: "wind", unit: "m/s" },
    { label: "🌫️ Bụi", key: "dust", unit: "µg/m³" },
  ];
  const latestData = sensorData[sensorData.length - 1];

  return (
    <div className="sensor-info">
      {sensors.map(({ label, key, unit }) => (
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
  );
};

export default SensorCards;
