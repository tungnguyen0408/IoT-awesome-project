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
} from "@mui/material";
import "./sensorStyle.scss";

const SensorDataPage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const generateRandomData = () => ({
      id: Math.floor(Math.random() * 1000),
      time: new Date().toLocaleString(),
      temperature: (Math.random() * 10 + 20).toFixed(1),
      humidity: (Math.random() * 30 + 40).toFixed(1),
      light: (Math.random() * 300 + 200).toFixed(1),
    });

    const initialData = Array.from({ length: 50 }, generateRandomData);
    setSensorData(initialData);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredData = sensorData.filter(
    ({ id, time }) =>
      id.toString().includes(searchQuery) || time.includes(searchQuery)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container sensor-data-page">
      <h3>📊 Dữ liệu cảm biến</h3>
      <TextField
        label="Tìm kiếm theo id thiết bị hoặc thời gian...."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <TableContainer component={Paper} className="sensor-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Nhiệt độ (°C)</TableCell>
              <TableCell>Độ ẩm (%)</TableCell>
              <TableCell>Ánh sáng (lux)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(({ id, time, temperature, humidity, light }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>{temperature}</TableCell>
                  <TableCell>{humidity}</TableCell>
                  <TableCell>{light}</TableCell>
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
        rowsPerPageOptions={[]}
      />
    </div>
  );
};

export default memo(SensorDataPage);
