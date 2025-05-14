import { useState, useEffect, memo, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import SensorCards from "component/homepageComponent/SensorCards";
import DeviceControl from "component/homepageComponent/DeviceControl";
import SensorChart from "component/homepageComponent/SensorChart";
import "./homeStyle.scss";
const socketUrl = "http://localhost:8080/ws";

const HomePage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [blinkState, setBlinkState] = useState(false);
  const [windSpeedState, setWindSpeedState] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const blinkIntervalRef = useRef(null);
  // const stompClientRef = useRef(null);

  // const sendMQTTMessage = async (payload) => {
  //   const client = stompClientRef.current;
  //   if (client && client.connected) {
  //     client.publish({
  //       destination: "/app/mqtt/send",
  //       body: JSON.stringify(payload),
  //     });
  //   } else {
  //     throw new Error("STOMP chưa kết nối hoặc không khả dụng");
  //   }
  // };

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        // Subscribe vào topic /topic/sensor/addition để nhận dữ liệu cảm biến
        stompClient.subscribe("/topic/sensor/addition", async (message) => {
          const parsed = JSON.parse(message.body);
          parsed.time = new Date().toLocaleTimeString();
          setSensorData((prev) => [...prev.slice(-9), parsed]);

          const windSpeed = parsed.wind;
          setWindSpeedState(windSpeed);

          // Điều kiện kích hoạt nhấp nháy đèn LED khi tốc độ gió > 50
          if (windSpeed > 50) {
            if (!blinkIntervalRef.current) {
              blinkIntervalRef.current = setInterval(async () => {
                setBlinkState(true);
                await axios.post("http://localhost:8080/mqtt/publish", {
                  led4: "ON",
                });

                setTimeout(() => {
                  axios.post("http://localhost:8080/mqtt/publish", {
                    led4: "OFF",
                  });
                  setBlinkState(false);
                }, 300);
              }, 600);
            }
          } else {
            if (blinkIntervalRef.current) {
              clearInterval(blinkIntervalRef.current);
              blinkIntervalRef.current = null;
            }
          }
        });
        stompClient.subscribe("/topic/sensor/status", (message) => {
          const status = message.body;
          console.log("Trạng thái nhận được:", status);
          setStatusMessage(status);
        });
      },
    });

    // stompClientRef.current = stompClient;
    stompClient.activate();

    return () => {
      stompClient.deactivate();
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="homepage">
      <SensorCards sensorData={sensorData} />
      <div className="dashboard" style={{ marginTop: "10px" }}>
        <SensorChart sensorData={sensorData} />
        <DeviceControl
          blinkState={blinkState}
          windSpeedState={windSpeedState}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
};

export default memo(HomePage);
