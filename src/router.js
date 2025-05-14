import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/users/homePage/home";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage/profile.js";
import SensorDataPageFive from "pages/users/sensorDataPageFive/SensorDataPageFive";
import HistoryPage from "pages/users/historyPageFive/historyPage";
const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTERS.USER.SENSORDATAPAGEFIVE,
      component: <SensorDataPageFive />,
    },
    {
      path: ROUTERS.USER.HISTORYPAGE,
      component: <HistoryPage />,
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
