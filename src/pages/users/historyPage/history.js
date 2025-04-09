import { useState, useEffect, memo } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  TableSortLabel,
} from "@mui/material";
import "./historyStyle.scss";

const DeviceHistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("time");

  useEffect(() => {
    fetchHistoryData();
  }, [page, rowsPerPage, order, orderBy]);

  const fetchHistoryData = async () => {
    try {
      let url = `http://localhost:8080/api/v1/get-all-status?page=${page}&size=${rowsPerPage}`;
      if (searchQuery) {
        url += `&filter=time&value=${encodeURIComponent(searchQuery)}`;
      }

      url += `&sort=${orderBy}&order=${order}`;

      const response = await axios.get(url);
      setHistoryData(response.data.data.data);
      setTotalItems(response.data.data.meta.total);
    } catch (error) {
      console.log("Lỗi khi gọi API", error);
    }
  };

  const handleRequestSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
  };

  return (
    <div className="container device-history-page">
      <h3>📜 Lịch sử bật/tắt thiết bị</h3>
      <div
        className="search-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          marginBottom: "10px",
        }}
      >
        <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Tìm theo thời gian
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <TextField
            label="Nhập thời gian tìm kiếm"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
            style={{ flex: 2.5, marginRight: "10px" }}
            InputProps={{ style: { height: "56px" } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchHistoryData}
            style={{ height: "56px", minWidth: "120px" }}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <TableContainer component={Paper} className="history-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Thiết bị</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "time"}
                  direction={order}
                  onClick={handleRequestSort}
                  sx={{ color: "white", "&.Mui-active": { color: "white" } }}
                >
                  Thời gian
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map(({ id, device, status, time }) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{device}</TableCell>
                <TableCell>{status ? "Bật" : "Tắt"}</TableCell>
                <TableCell>{time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="Số hàng mỗi trang"
      />
    </div>
  );
};

export default memo(DeviceHistoryPage);
