import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ children, ...props }) => {
  return (
    <>
      <Header />
      <div {...props}>{children}</div>
    </>
  );
};

export default memo(MasterLayout);
// Body cần phải động
// Bất kể trang nào cũng có cấu trúc như này
