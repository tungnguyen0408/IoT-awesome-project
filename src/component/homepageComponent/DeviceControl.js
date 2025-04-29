import React, { useState, useEffect } from "react";
import { Switch, CircularProgress } from "@mui/material";
import { AiOutlineBulb } from "react-icons/ai";
import { MdAcUnit, MdOpacity } from "react-icons/md";
import axios from "axios";

const DeviceControl = ({ flashOther }) => {
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem("deviceStates");
    return saved
      ? JSON.parse(saved)
      : {
          temperatureDevice: false,
          humidityDevice: false,
          lightDevice: false,
          otherDevice: false,
        };
  });

  useEffect(() => {
    localStorage.setItem("deviceStates", JSON.stringify(devices));
  }, [devices]);

  const [loading, setLoading] = useState({});
  const [isSuccess, setIsSuccess] = useState({});
  const [deviceCount, setDeviceCount] = useState({});

  useEffect(() => {
    const fetchAllDeviceCounts = async () => {
      try {
        const newCounts = {};
        for (const device of Object.keys(devices)) {
          const response = await axios.get(
            `http://localhost:8080/api/v1/count?device=${device}`
          );
          newCounts[device] = response.data.data;
        }
        setDeviceCount(newCounts);
      } catch (error) {
        console.error("Lỗi khi lấy số lần bật thiết bị:", error);
      }
    };
    fetchAllDeviceCounts();
  }, []);

  const toggleDevice = async (device) => {
    if (loading[device]) return;

    setLoading((prev) => ({ ...prev, [device]: true }));
    setIsSuccess((prev) => ({ ...prev, [device]: null }));

    const newStatus = !devices[device];
    const tempDevices = { ...devices, [device]: newStatus };

    const ledPayload = {
      led1: tempDevices.temperatureDevice ? "ON" : "OFF",
      led2: tempDevices.humidityDevice ? "ON" : "OFF",
      led3: tempDevices.lightDevice ? "ON" : "OFF",
      led4: tempDevices.otherDevice ? "ON" : "OFF",
    };

    try {
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

      await axios.post("http://localhost:8080/mqtt/publish", ledPayload);

      setTimeout(() => {
        setDevices(tempDevices);
        setIsSuccess((prev) => ({ ...prev, [device]: true }));
        setLoading((prev) => ({ ...prev, [device]: false }));
      }, 500);
    } catch (error) {
      console.error("Lỗi khi gửi API:", error);
      setIsSuccess((prev) => ({ ...prev, [device]: false }));
      setLoading((prev) => ({ ...prev, [device]: false }));
    }
  };

  useEffect(() => {
    let interval;
    if (flashOther) {
      interval = setInterval(() => {
        setDevices((prev) => ({
          ...prev,
          otherDevice: !prev.otherDevice, // đổi từ lightDevice → otherDevice
        }));
      }, 500);
    } else {
      setDevices((prev) => ({
        ...prev,
        otherDevice: false, // đổi từ lightDevice → otherDevice
      }));
    }

    return () => clearInterval(interval);
  }, [flashOther]);

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
      label: "Đèn 4",
      key: "otherDevice",
      icon: AiOutlineBulb,
      nameIcon: "light-icon",
      activeColor: "#ffeb3b",
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
                flashOther && key === "otherDevice" ? "flashing" : ""
              }`}
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
              <p className="device-count">
                Đã bật: {deviceCount[key] || 0} lần
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DeviceControl;
