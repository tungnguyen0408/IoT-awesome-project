import React, { useState, useEffect } from "react";
import { Switch, CircularProgress } from "@mui/material";
import { AiOutlineBulb } from "react-icons/ai";
import { MdAcUnit, MdOpacity, MdOutlineWarning } from "react-icons/md";
import axios from "axios";
const DeviceControl = ({ blinkState, windSpeedState, statusMessage }) => {
  const [devices, setDevices] = useState({
    den2ice: false,
    den1: false,
    den3: false,
  });

  const [loading, setLoading] = useState({
    den2ice: false,
    den1: false,
    den3: false,
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
          den2ice: false,
          den1: false,
          den3: false,
        };

        response.data.data.forEach((item) => {
          if (item.device in fetchedDevices) {
            fetchedDevices[item.device] = item.status;
          }
        });

        setDevices(fetchedDevices);

        // 👇 Gọi API lấy count cho từng thiết bị
        const [tempCount, humidityCount, lightCount] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/count?device=den2ice"),
          axios.get("http://localhost:8080/api/v1/count?device=den1"),
          axios.get("http://localhost:8080/api/v1/count?device=den3"),
        ]);

        setDeviceCount({
          den2ice: tempCount.data.data,
          den1: humidityCount.data.data,
          den3: lightCount.data.data,
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
        if (deviceNumber === "1") deviceKey = "den2ice";
        else if (deviceNumber === "2") deviceKey = "den1";
        else if (deviceNumber === "3") deviceKey = "den3";

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
    if (device === "den2ice") ledPayload.led1 = newStatus ? "ON" : "OFF";
    if (device === "den1") ledPayload.led2 = newStatus ? "ON" : "OFF";
    if (device === "den3") ledPayload.led3 = newStatus ? "ON" : "OFF";

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
      key: "den2ice",
      icon: MdAcUnit,
      nameIcon: "temperature-icon",
      activeColor: "#03a9f4",
    },
    {
      label: "Đèn 2",
      key: "den1",
      icon: MdOpacity,
      nameIcon: "humidity-icon",
      activeColor: "#4caf50",
    },
    {
      label: "Đèn 3",
      key: "den3",
      icon: AiOutlineBulb,
      nameIcon: "light-icon",
      activeColor: "#ffeb3b",
    },
    {
      label: "Cảnh báo 1",
      key: "otherDevice1",
      icon: MdOutlineWarning,
      nameIcon: "light-icon",
      activeColor: "#fe2020",
    },
    {
      label: "Cảnh báo 2",
      key: "otherDevice2",
      icon: MdOutlineWarning,
      nameIcon: "light-icon",
      activeColor: "#fe2020",
    },
    {
      label: "Cảnh báo 3",
      key: "otherDevice3",
      icon: MdOutlineWarning,
      nameIcon: "light-icon",
      activeColor: "#fe2020",
    },
  ];

  const column1 = deviceList.slice(0, 3);
  const column2 = deviceList.slice(3);

  return (
    <div className="device-list-columns">
      {/* Cột 1 */}
      <div className="device-column">
        {column1.map(({ label, key, icon: Icon, nameIcon, activeColor }) => (
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
            {key.startsWith("den") ? (
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
            {key.startsWith("den") && (
              <p className="device-count">
                Đã bật: {deviceCount[key] || 0} lần
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Cột 2 */}
      <div className="device-column">
        {column2.map(({ label, key, icon: Icon, nameIcon, activeColor }) => (
          <div
            key={key}
            className={`device-item ${devices[key] ? "active" : ""} ${
              blinkState && key.startsWith("otherDevice") ? "flashing" : ""
            }`}
          >
            <Icon
              className={`device-icon ${nameIcon}`}
              style={{
                color:
                  devices[key] || (key.startsWith("otherDevice") && blinkState)
                    ? activeColor
                    : "#ccc",
                transition: "color 0.3s ease-in-out",
                fontSize: "2rem",
              }}
            />
            <span className="device-label">{label}</span>
            <div className="switch-container placeholder-switch">
              <span className="status-label">{windStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceControl;
