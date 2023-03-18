import { useEffect, useState } from 'react';
import axios from 'axios';

function usePaginationData({ routeName }) {


  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);


  const getData = async () => {

    setLoading(true);
    axios({
      method: 'get',
      url: routeName,
      params: {
        page: page,
        sort: sortBy,
        sortDir: sortDir,
        filters: JSON.stringify(filters),
        per_page: perPage,

      },
    }).then((response) => {
      setData(response.data.data);
      setTotalRows(response?.data?.meta?.total);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    });

  };


  const logData = (row) => {
    console.log(row);
  };

  const handleSort = async (column, sortDirection) => {
    setSortBy(column.sortField);
    setSortDir(sortDirection);
  };


  const handleRowPerPageChange = async (newPerPage, page) => {

    setPerPage(newPerPage);
    setPage(page);

  };
  const handlePageChange = async page => {
    setPage(page);
  };
  const resetAll = () => {

    setFilters({});
    setPage(1);
    setSortBy('name');
    setSortDir('asc');
    setPerPage(10);

  };

  useEffect(() => {
      getData();
    },
    [
      page,
      sortBy,
      sortDir,
      filters,
      totalRows,
      perPage,

    ]);
  const handleFilterChange = ({ target }) => {
    setFilters((prevData) => ({
      ...prevData,
      [target.name]: target.value,
    }));
  };

  const resetPaginationToggle = () => {
    this.setState({ resetPaginationToggle: !this.state.resetPaginationToggle });

  }

  return {
    resetPaginationToggle,
    handleFilterChange,
    handleRowPerPageChange,
    handlePageChange,
    handleSort,
    data,
    page, setPage,
    sortBy, setSortBy,
    sortDir, setSortDir,
    filters, setFilters,
    loading,
    getData,
    totalRows,
    perPage, setPerPage,
    logData,
    resetAll,
  };


}

export default usePaginationData;