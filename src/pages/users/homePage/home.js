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
  const [flashOther, setFlashOther] = useState(false);
  const [blinkState, setBlinkState] = useState(false);

  const blinkIntervalRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/sensor/addition", async (message) => {
          const parsed = JSON.parse(message.body);
          parsed.time = new Date().toLocaleTimeString();
          setSensorData((prev) => [...prev.slice(-9), parsed]);

          const windSpeed = parsed.wind;

          if (windSpeed > 50) {
            // Nếu gió lớn, dừng nhấp nháy và bật LED một lần
            if (blinkIntervalRef.current) {
              clearInterval(blinkIntervalRef.current);
              blinkIntervalRef.current = null;
            }

            await axios.post("http://localhost:8080/mqtt/publish", {
              led4: "ON",
            });

            setTimeout(() => {
              axios.post("http://localhost:8080/mqtt/publish", {
                led4: "OFF",
              });
            }, 300);

            setFlashOther(true);
            setTimeout(() => setFlashOther(false), 1000);
          } else {
            // Nếu gió nhỏ hơn hoặc bằng 50, bật nhấp nháy liên tục
            if (!blinkIntervalRef.current) {
              blinkIntervalRef.current = setInterval(async () => {
                setBlinkState(true); // 👉 Bật
                await axios.post("http://localhost:8080/mqtt/publish", {
                  led4: "ON",
                });

                setTimeout(() => {
                  axios.post("http://localhost:8080/mqtt/publish", {
                    led4: "OFF",
                  });
                  setBlinkState(false); // 👉 Tắt
                }, 200);
              }, 600);
            }
          }
        });
      },
    });

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
        <DeviceControl flashOther={flashOther} blinkState={blinkState} />
      </div>
    </div>
  );
};

export default memo(HomePage);
