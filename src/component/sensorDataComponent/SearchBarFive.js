import { TextField, Select, MenuItem, Button } from "@mui/material";

const SearchBarFive = ({
  searchQuery,
  onSearchChange,
  searchField,
  onSearchFieldChange,
  onSearchClick,
}) => {
  return (
    <div className="search-container">
      <TextField
        label="Nhập từ khóa tìm kiếm"
        variant="outlined"
        value={searchQuery}
        onChange={onSearchChange}
        className="search-bar"
        style={{ flex: 2.5, marginRight: "10px" }}
        helperText="Bạn có thể tìm kiếm theo thời gian, nhiệt độ, độ ẩm, ánh sáng, bụi hoặc gió"
      />
      <Select
        value={searchField}
        onChange={onSearchFieldChange}
        className="search-dropdown"
        style={{ width: "150px", marginRight: "10px" }}
      >
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="time">Thời gian</MenuItem>
        <MenuItem value="temperature">Nhiệt độ</MenuItem>
        <MenuItem value="humidity">Độ ẩm</MenuItem>
        <MenuItem value="light">Ánh sáng</MenuItem>
        <MenuItem value="dust">Bụi (µg/m³)</MenuItem> {/* Thêm dust */}
        <MenuItem value="wind">Gió (km/h)</MenuItem> {/* Thêm wind */}
      </Select>
      <Button
        variant="contained"
        color="primary"
        onClick={onSearchClick}
        style={{ height: "56px" }}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBarFive;
