import { memo, useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { FaCircleUser } from "react-icons/fa6";
const Header = () => {
  const [menus] = useState([
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Dữ liệu cảm biến",
      path: ROUTERS.USER.SENSORDATAPAGEFIVE,
    },
    {
      name: "Lịch sử bật/tắt",
      path: ROUTERS.USER.HISTORYPAGE,
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="header">
        <div className="container">
          <div className="row">
            <div className="col-xl-3">
              <div className="header__logo">
                <h1>IoT Smart</h1>
              </div>
            </div>
            <div className="col-xl-6">
              <nav className="header__menu">
                <ul>
                  {menus?.map((menu, menuKey) => (
                    <li
                      key={menuKey}
                      className={menuKey === activeIndex ? "active" : ""}
                      onClick={() => {
                        setActiveIndex(menuKey);
                      }}
                    >
                      <Link to={menu?.path}>{menu?.name}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="col-xl-3">
              <div className="header__cart">
                <Link to={"http://localhost:3000/thong-tin-ca-nhan"}>
                  <FaCircleUser size={23} />
                  <span>Tùng Nguyễn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Header);
