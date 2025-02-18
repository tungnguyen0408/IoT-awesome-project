import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/users/homePage/home";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import SensorDataPage from "./pages/users/sensorData/sensorData.js";
import DeviceHistoryPage from "./pages/users/historyPage/history.js";
import ProfilePage from "./pages/users/profilePage/profile.js";
const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTERS.USER.SENSORDATA,
      component: <SensorDataPage />,
    },
    {
      path: ROUTERS.USER.HISTORY,
      component: <DeviceHistoryPage />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <ProfilePage />,
    },
  ];

  return (
    <MasterLayout>
      <Routes>
        {userRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};
export default RouterCustom;
