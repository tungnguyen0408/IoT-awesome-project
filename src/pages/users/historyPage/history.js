import { useState, useEffect, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from "@mui/material";
import "./historyStyle.scss";

const DeviceHistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const generateHistoryData = () => ({
      id: Math.floor(Math.random() * 100),
      device: `Thiết bị ${Math.floor(Math.random() * 10) + 1}`,
      action: Math.random() > 0.5 ? "Bật" : "Tắt",
      time: new Date().toLocaleString(),
    });

    const initialHistory = Array.from({ length: 20 }, generateHistoryData);
    setHistoryData(initialHistory);
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = historyData.filter(({ device, action }) =>
    `${device} ${action}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container device-history-page">
      <h3>📜 Lịch sử bật/tắt thiết bị</h3>

      {/* Ô tìm kiếm */}
      <TextField
        label="Tìm kiếm thiết bị hoặc hành động..."
        variant="outlined"
        fullWidth
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} className="history-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Thiết bị</TableCell>
              <TableCell>Hành động</TableCell>
              <TableCell>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(({ id, device, action, time }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{device}</TableCell>
                  <TableCell>{action}</TableCell>
                  <TableCell>{time}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage} // Cố định số dòng mỗi trang
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]} // Ẩn tùy chọn số dòng mỗi trang
      />
    </div>
  );
};

export default memo(DeviceHistoryPage);
