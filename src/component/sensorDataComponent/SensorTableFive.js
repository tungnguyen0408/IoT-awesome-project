import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

const SensorTableFive = ({ data, orderBy, order, onRequestSort }) => {
  const columns = [
    { id: "id", label: "ID" },
    { id: "temperature", label: "Nhiệt độ (°C)" },
    { id: "humidity", label: "Độ ẩm (%)" },
    { id: "light", label: "Ánh sáng (lux)" },
    { id: "wind", label: "Gió (km/h)" },
    { id: "time", label: "Thời gian" },
  ];

  return (
    <TableContainer component={Paper} className="sensor-table">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => onRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(({ id, time, temperature, humidity, light, wind }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{temperature}</TableCell>
              <TableCell>{humidity}</TableCell>
              <TableCell>{light}</TableCell>
              <TableCell>{wind}</TableCell>
              <TableCell>{time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SensorTableFive;
