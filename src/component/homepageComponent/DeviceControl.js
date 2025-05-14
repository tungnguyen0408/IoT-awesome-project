import React, { useState, useEffect } from "react";
import { Switch, CircularProgress } from "@mui/material";
import { AiOutlineBulb } from "react-icons/ai";
import { MdAcUnit, MdOpacity, MdOutlineWarning } from "react-icons/md";
import axios from "axios";
const DeviceControl = ({ blinkState, windSpeedState, statusMessage }) => {
  const [devices, setDevices] = useState({
    temperatureDevice: false,
    humidityDevice: false,
    lightDevice: false,
  });

  const [loading, setLoading] = useState({
    temperatureDevice: false,
    humidityDevice: false,
    lightDevice: false,
    otherDevice: false,
  });

  const [deviceCount, setDeviceCount] = useState({});
  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        // Lấy trạng thái thiết bị
        const response = await axios.get(
          "http://localhost:8080/api/v1/latest-status"
        );

        const fetchedDevices = {
          temperatureDevice: false,
          humidityDevice: false,
          lightDevice: false,
        };

        response.data.data.forEach((item) => {
          if (item.device in fetchedDevices) {
            fetchedDevices[item.device] = item.status;
          }
        });

        setDevices(fetchedDevices);

        // 👇 Gọi API lấy count cho từng thiết bị
        const [tempCount, humidityCount, lightCount] = await Promise.all([
          axios.get(
            "http://localhost:8080/api/v1/count?device=temperatureDevice"
          ),
          axios.get("http://localhost:8080/api/v1/count?device=humidityDevice"),
          axios.get("http://localhost:8080/api/v1/count?device=lightDevice"),
        ]);

        setDeviceCount({
          temperatureDevice: tempCount.data.data,
          humidityDevice: humidityCount.data.data,
          lightDevice: lightCount.data.data,
        });
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái thiết bị:", error);
      }
    };

    fetchDeviceStatus();
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const match = statusMessage.match(/led(\d)_(ON|OFF)_SUCCESS/);
      if (match) {
        const [, deviceNumber, action] = match;
        let deviceKey = "";
        if (deviceNumber === "1") deviceKey = "temperatureDevice";
        else if (deviceNumber === "2") deviceKey = "humidityDevice";
        else if (deviceNumber === "3") deviceKey = "lightDevice";

        setDevices((prev) => ({
          ...prev,
          [deviceKey]: action === "ON",
        }));

        setLoading((prev) => ({
          ...prev,
          [deviceKey]: false,
        }));
      }
    }
  }, [statusMessage]);

  const toggleDevice = async (device) => {
    if (loading[device]) return;

    setLoading((prev) => ({ ...prev, [device]: true }));
    const newStatus = !devices[device];

    const ledPayload = {};
    if (device === "temperatureDevice")
      ledPayload.led1 = newStatus ? "ON" : "OFF";
    if (device === "humidityDevice") ledPayload.led2 = newStatus ? "ON" : "OFF";
    if (device === "lightDevice") ledPayload.led3 = newStatus ? "ON" : "OFF";

    try {
      await axios.post("http://localhost:8080/mqtt/publish", ledPayload);
      // await sendMQTTMessage(ledPayload);

      await axios.post(
        `http://localhost:8080/api/v1/update-status?device=${device}&status=${newStatus}`
      );
      const countResponse = await axios.get(
        `http://localhost:8080/api/v1/count?device=${device}`
      );
      setDeviceCount((prev) => ({
        ...prev,
        [device]: countResponse.data.data,
      }));
      setDevices((prev) => ({
        ...prev,
        [device]: newStatus,
      }));
    } catch (error) {
      console.error("Lỗi khi điều khiển thiết bị:", error);
    } finally {
      setTimeout(() => {
        setLoading((prev) => ({ ...prev, [device]: false }));
      }, 1500);
    }
  };

  const [windStatus, setWindStatus] = useState(
    windSpeedState > 50 ? "Tốc độ gió vượt ngưỡng!" : "Ổn định"
  );

  useEffect(() => {
    if (windSpeedState > 50) {
      setWindStatus("Tốc độ gió vượt ngưỡng!");
    } else {
      const timeout = setTimeout(() => {
        setWindStatus("Ổn định");
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [windSpeedState]);

  const deviceList = [
    {
      label: "Đèn 1",
      key: "temperatureDevice",
      icon: MdAcUnit,
      nameIcon: "temperature-icon",
      activeColor: "#03a9f4",
    },
    {
      label: "Đèn 2",
      key: "humidityDevice",
      icon: MdOpacity,
      nameIcon: "humidity-icon",
      activeColor: "#4caf50",
    },
    {
      label: "Đèn 3",
      key: "lightDevice",
      icon: AiOutlineBulb,
      nameIcon: "light-icon",
      activeColor: "#ffeb3b",
    },
    {
      label: "Cảnh báo",
      key: "otherDevice",
      icon: MdOutlineWarning,
      nameIcon: "light-icon",
      activeColor: "#fe2020",
    },
  ];

  const column1 = deviceList.slice(0, 2);
  const column2 = deviceList.slice(2);

  return (
    <div className="device-list-columns">
      {[column1, column2].map((column, colIndex) => (
        <div className="device-column" key={colIndex}>
          {column.map(({ label, key, icon: Icon, nameIcon, activeColor }) => (
            <div
              key={key}
              className={`device-item ${devices[key] ? "active" : ""} ${
                blinkState && key === "otherDevice" ? "flashing" : ""
              }`}
            >
              <Icon
                className={`device-icon ${nameIcon}`}
                style={{
                  color:
                    devices[key] || (key === "otherDevice" && blinkState)
                      ? activeColor
                      : "#ccc",
                  transition: "color 0.3s ease-in-out",
                  fontSize: "2rem",
                }}
              />
              <span className="device-label">{label}</span>
              {key !== "otherDevice" ? (
                <div className="switch-container">
                  <Switch
                    checked={devices[key]}
                    onChange={() => toggleDevice(key)}
                    className="device-switch"
                    disabled={loading[key]}
                  />
                  {loading[key] && (
                    <CircularProgress
                      size={20}
                      className="switch-loading-spinner"
                    />
                  )}
                </div>
              ) : (
                <div className="switch-container placeholder-switch">
                  <span className="status-label">{windStatus}</span>
                </div>
              )}

              {/* Hiển thị số lần bật nếu không phải otherDevice */}
              {key !== "otherDevice" && (
                <p className="device-count">
                  Đã bật: {deviceCount[key] || 0} lần
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DeviceControl;
