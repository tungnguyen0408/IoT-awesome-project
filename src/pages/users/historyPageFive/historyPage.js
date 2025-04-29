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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./historyStyle.scss";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filterType, setFilterType] = useState(""); // "device", "status", "time"
  const [filterValue, setFilterValue] = useState("");
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
      let url = `http://localhost:8080/api/v1/all_status?page=${page}&size=${rowsPerPage}`;

      if (filterType && filterValue) {
        let value = filterValue;
        if (filterType === "status") {
          value =
            value.toLowerCase() === "bật"
              ? "true"
              : value.toLowerCase() === "tắt"
              ? "false"
              : "";
        }
        url += `&filter=${filterType}&value=${encodeURIComponent(value)}`;
      }

      url += `&sort=${orderBy}&order=${order}`;

      const response = await axios.get(url);
      const { data } = response.data;
      if (data && Array.isArray(data.data)) {
        setHistoryData(data.data);
        setTotalItems(data.meta?.total || 0);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API", error);
      setHistoryData([]);
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
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <label style={{ fontWeight: "bold" }}>Tìm kiếm theo:</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <FormControl style={{ width: "200px" }}>
            <InputLabel>Lọc theo</InputLabel>
            <Select
              value={filterType}
              label="Lọc theo"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="device">Thiết bị</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
              <MenuItem value="time">Thời gian</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Từ khóa"
            variant="outlined"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ flex: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setPage(0);
              fetchHistoryData();
            }}
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
            {Array.isArray(historyData) && historyData.length > 0 ? (
              historyData.map(({ id, device, status, time }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{device}</TableCell>
                  <TableCell>{status ? "Bật" : "Tắt"}</TableCell>
                  <TableCell>{time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
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

export default memo(HistoryPage);
