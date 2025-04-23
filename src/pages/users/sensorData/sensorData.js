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
  TableSortLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import "./sensorStyle.scss";

const SensorDataPage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSensorData();
  }, [page, rowsPerPage, order, orderBy]);

  const fetchSensorData = async (customPage = page) => {
    try {
      let url = `http://localhost:8080/api/v1/get-all-data?page=${customPage}&size=${rowsPerPage}`;

      if (searchField !== "all" && searchQuery) {
        url += `&filter=${searchField}&value=${encodeURIComponent(
          searchQuery
        )}`;
      }

      if (orderBy) {
        url += `&sort=${orderBy}&order=${order}`;
      }

      const response = await axios.get(url);
      setSensorData(response.data.data.data);
      setTotalItems(response.data.data.meta.total);
      setErrorMessage("");
    } catch (error) {
      console.log("Lỗi khi gọi API", error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message || "Dữ liệu không hợp lệ.");
      } else {
        setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
      setSensorData([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className="container sensor-data-page">
      <h3>📊 Dữ liệu cảm biến</h3>
      <div className="search-container">
        <TextField
          label="Nhập từ khóa tìm kiếm"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
          style={{ flex: 2.5, marginRight: "10px" }}
        />
        <Select
          value={searchField}
          onChange={handleSearchFieldChange}
          className="search-dropdown"
          style={{ width: "115px", marginRight: "10px" }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="time">Thời gian</MenuItem>
          <MenuItem value="temperature">Nhiệt độ</MenuItem>
          <MenuItem value="humidity">Độ ẩm</MenuItem>
          <MenuItem value="light">Ánh sáng</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setPage(0);
            fetchSensorData(0); // truyền page mới vào
          }}
          style={{ height: "56px" }}
        >
          Tìm kiếm
        </Button>
      </div>
      {errorMessage && (
        <div className="error-message" style={{ color: "red", marginTop: 8 }}>
          {errorMessage}
        </div>
      )}

      <TableContainer component={Paper} className="sensor-table">
        <Table>
          <TableHead>
            <TableRow>
              {[
                { id: "id", label: "ID" },
                { id: "temperature", label: "Nhiệt độ (°C)" },
                { id: "humidity", label: "Độ ẩm (%)" },
                { id: "light", label: "Ánh sáng (lux)" },
                { id: "time", label: "Thời gian" },
              ].map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sensorData.map(({ id, time, temperature, humidity, light }) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{temperature}</TableCell>
                <TableCell>{humidity}</TableCell>
                <TableCell>{light}</TableCell>
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

export default memo(SensorDataPage);
