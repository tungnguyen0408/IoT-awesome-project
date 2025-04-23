import { TextField, Select, MenuItem, Button } from "@mui/material";

const SearchBar = ({
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
      />
      <Select
        value={searchField}
        onChange={onSearchFieldChange}
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
        onClick={onSearchClick}
        style={{ height: "56px" }}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;
