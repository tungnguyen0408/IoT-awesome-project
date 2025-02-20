import { useState, useEffect, memo } from "react";
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
} from "@mui/material";
import "./sensorStyle.scss";

const SensorDataPage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "asc",
  });

  useEffect(() => {
    const generateRandomData = () => {
      const daysAgo = [0, 1, 2];
      const randomDay = daysAgo[Math.floor(Math.random() * daysAgo.length)];
      const date = new Date();
      date.setDate(date.getDate() - randomDay);

      return {
        id: Math.floor(Math.random() * 1000),
        time: date.toLocaleString(),
        temperature: (Math.random() * 10 + 20).toFixed(1),
        humidity: (Math.random() * 30 + 40).toFixed(1),
        light: (Math.random() * 300 + 200).toFixed(1),
      };
    };

    const initialData = Array.from({ length: 50 }, generateRandomData);
    setSensorData(initialData);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const filteredData = sensorData.filter((item) => {
    const value = searchQuery.toLowerCase();
    if (!value) return true;
    switch (searchField) {
      case "time":
        return item.time.toLowerCase().includes(value);
      case "temperature":
        return item.temperature.toString().includes(value);
      case "humidity":
        return item.humidity.toString().includes(value);
      case "light":
        return item.light.toString().includes(value);
      default:
        return (
          item.time.toLowerCase().includes(value) ||
          item.temperature.toString().includes(value) ||
          item.humidity.toString().includes(value) ||
          item.light.toString().includes(value)
        );
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

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
          style={{ width: "115px" }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="time">Thời gian</MenuItem>
          <MenuItem value="temperature">Nhiệt độ</MenuItem>
          <MenuItem value="humidity">Độ ẩm</MenuItem>
          <MenuItem value="light">Ánh sáng</MenuItem>
        </Select>
      </div>
      <TableContainer component={Paper} className="sensor-table">
        <Table>
          <TableHead>
            <TableRow>
              {[
                { key: "id", label: "ID" },
                { key: "temperature", label: "Nhiệt độ (°C)" },
                { key: "humidity", label: "Độ ẩm (%)" },
                { key: "light", label: "Ánh sáng (lux)" },
                { key: "time", label: "Thời gian" },
              ].map(({ key, label }) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.direction}
                    onClick={() => handleSort(key)}
                    sx={{
                      color: "white !important",
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(({ id, time, temperature, humidity, light }) => (
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
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
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

export default memo(SensorDataPage);
