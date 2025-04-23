// components/sensor/constants.js
export const SENSOR_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "temperature", label: "Nhiệt độ (°C)" },
  { id: "humidity", label: "Độ ẩm (%)" },
  { id: "light", label: "Ánh sáng (lux)" },
  { id: "time", label: "Thời gian" },
];

export const SEARCH_FIELDS = [
  { value: "all", label: "Tất cả" },
  { value: "time", label: "Thời gian" },
  { value: "temperature", label: "Nhiệt độ" },
  { value: "humidity", label: "Độ ẩm" },
  { value: "light", label: "Ánh sáng" },
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
