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

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    device: "",
    status: "",
    time: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("time");

  // Fetch history data, triggered only when search button is clicked
  const fetchHistoryData = async () => {
    try {
      let url = `http://localhost:8080/api/v1/all_status?page=${page}&size=${rowsPerPage}`;

      // Create dynamic filter parameters
      if (searchQuery.device) {
        url += `&filter=device&value=${encodeURIComponent(searchQuery.device)}`;
      }
      if (searchQuery.status !== "") {
        const statusValue =
          searchQuery.status === "Bật"
            ? "true"
            : searchQuery.status === "Tắt"
            ? "false"
            : "";
        if (statusValue) {
          url += `&filter=status&value=${encodeURIComponent(statusValue)}`;
        }
      }
      if (searchQuery.time) {
        url += `&filter=time&value=${encodeURIComponent(searchQuery.time)}`;
      }

      url += `&sort=${orderBy}&order=${order}`;

      const response = await axios.get(url);

      const { data } = response.data;
      if (data && Array.isArray(data.data)) {
        setHistoryData(data.data);
        setTotalItems(data.meta?.total || 0);
      } else {
        setHistoryData([]); // If data is invalid, set empty array
      }
    } catch (error) {
      console.log("Lỗi khi gọi API", error);
      setHistoryData([]); // Fallback in case of error
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
          Tìm kiếm theo thiết bị, trạng thái và thời gian
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <TextField
            label="Thiết bị"
            variant="outlined"
            value={searchQuery.device}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, device: e.target.value })
            }
            className="search-bar"
            style={{ flex: 1, marginRight: "10px" }}
            InputProps={{ style: { height: "56px" } }}
          />
          <TextField
            label="Trạng thái (Bật/Tắt)"
            variant="outlined"
            value={searchQuery.status}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, status: e.target.value })
            }
            className="search-bar"
            style={{ flex: 1, marginRight: "10px" }}
            InputProps={{ style: { height: "56px" } }}
          />
          <TextField
            label="Thời gian"
            variant="outlined"
            value={searchQuery.time}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, time: e.target.value })
            }
            className="search-bar"
            style={{ flex: 2.5, marginRight: "10px" }}
            InputProps={{ style: { height: "56px" } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchHistoryData} // Trigger data fetch here
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
