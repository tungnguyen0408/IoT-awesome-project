import { useState, useEffect, memo } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios"; // 👉 Thêm dòng này
import SensorCards from "component/homepageComponent/SensorCards";
import DeviceControl from "component/homepageComponent/DeviceControl";
import SensorChart from "component/homepageComponent/SensorChart";
import "./homeStyle.scss";

const socketUrl = "http://localhost:8080/ws";

const HomePage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [flashOther, setFlashOther] = useState(false);

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/sensor/addition", async (message) => {
          const parsed = JSON.parse(message.body);
          parsed.time = new Date().toLocaleTimeString();
          setSensorData((prev) => [...prev.slice(-9), parsed]);
          if (parsed.dust > 60) {
            await axios.post("http://localhost:8080/mqtt/publish", {
              led3: "ON",
            });
            setTimeout(() => {
              axios.post("http://localhost:8080/mqtt/publish", {
                led3: "OFF",
              });
            }, 300);

            setFlashOther(true);
            setTimeout(() => setFlashOther(false), 1000);
          }
        });
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, []);

  return (
    <div className="homepage">
      <SensorCards sensorData={sensorData} />
      <div className="dashboard" style={{ marginTop: "10px" }}>
        <SensorChart sensorData={sensorData} />
        <DeviceControl flashOther={flashOther} />
      </div>
    </div>
  );
};

export default memo(HomePage);
