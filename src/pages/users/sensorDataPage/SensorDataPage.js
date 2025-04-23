import { useState, useEffect, memo } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import SensorTable from "./SensorTable";
import PaginationControl from "./PaginationControl";
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
      if (error.response?.status === 400) {
        setErrorMessage(error.response.data.message || "Dữ liệu không hợp lệ.");
      } else {
        setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
      setSensorData([]);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className="container sensor-data-page">
      <h3>📊 Dữ liệu cảm biến</h3>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchField={searchField}
        onSearchFieldChange={(e) => setSearchField(e.target.value)}
        onSearchClick={() => {
          setPage(0);
          fetchSensorData(0);
        }}
      />
      {errorMessage && (
        <div className="error-message" style={{ color: "red", marginTop: 8 }}>
          {errorMessage}
        </div>
      )}
      <SensorTable
        data={sensorData}
        orderBy={orderBy}
        order={order}
        onRequestSort={handleRequestSort}
      />
      <PaginationControl
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </div>
  );
};

export default memo(SensorDataPage);
