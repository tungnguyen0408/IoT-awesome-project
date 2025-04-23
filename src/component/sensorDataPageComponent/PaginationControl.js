import { TablePagination } from "@mui/material";

const PaginationControl = ({
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => (
  <TablePagination
    component="div"
    count={totalItems}
    page={page}
    onPageChange={onPageChange}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={onRowsPerPageChange}
    rowsPerPageOptions={[5, 10, 20, 50]}
    labelRowsPerPage="Số hàng mỗi trang"
  />
);

export default PaginationControl;
