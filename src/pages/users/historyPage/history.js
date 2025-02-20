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
  TableSortLabel,
} from "@mui/material";
import "./historyStyle.scss";

const DeviceHistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "asc",
  });

  useEffect(() => {
    const generateHistoryData = () => {
      const daysAgo = [0, 1, 2];
      const randomDay = daysAgo[Math.floor(Math.random() * daysAgo.length)];
      const date = new Date();
      date.setDate(date.getDate() - randomDay);

      return {
        id: Math.floor(Math.random() * 100),
        device: `Thiết bị ${Math.floor(Math.random() * 10) + 1}`,
        action: Math.random() > 0.5 ? "Bật" : "Tắt",
        time: date.toLocaleString(),
      };
    };

    const initialHistory = Array.from({ length: 20 }, generateHistoryData);
    setHistoryData(initialHistory);
  }, []);

  const filteredData = historyData.filter(({ time }) =>
    time.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý sắp xếp theo thời gian
  const handleSort = () => {
    setSortConfig((prev) => ({
      key: "time",
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a.time < b.time) return sortConfig.direction === "asc" ? -1 : 1;
    if (a.time > b.time) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="container device-history-page">
      <h3>📜 Lịch sử bật/tắt thiết bị</h3>
      <label htmlFor="search-time" className="search-label">
        🔍 Tìm kiếm theo thời gian:
      </label>
      {/* Ô tìm kiếm */}
      <TextField
        label="Tìm kiếm theo thời gian..."
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
              <TableCell>
                <TableSortLabel
                  active={true}
                  direction={sortConfig.direction}
                  onClick={handleSort}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Thời gian
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
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
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
        labelRowsPerPage="Số hàng mỗi trang"
        sx={{
          "& .MuiTablePagination-selectLabel": {
            color: "#1976d2",
            fontWeight: "bold",
          },
          "& .MuiSelect-select": {
            color: "#1976d2",
            fontWeight: "bold",
          },
          "& .MuiOutlinedInput-root": { color: "red" },
        }}
      />
    </div>
  );
};

export default memo(DeviceHistoryPage);
