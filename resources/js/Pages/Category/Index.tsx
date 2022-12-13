import React, {useState, useEffect, useCallback, useMemo} from "react";
import AppLayout from '@/Layouts/AppLayout';
import axios from "axios";
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';

export default function Dashboard() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('search');
    const [column, setColumn] = useState('name');
    const [sortDirection, setDirection] = useState('asc');
    const [pending, setPending] = React.useState(true);
    const [refresh, setRefresh] = useState(false);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filterText, setFilterText] = useState('');


    const route = useRoute();

    const paginationComponentOptions = {
        rowsPerPageText: 'Rows Per Page:',
        rangeSeparatorText: 0,
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };


    const fetchData = useCallback(async (search, currentPage, perPage, column, sortDirection) => {
            setLoading(true);
            setPending(true);
            const response = await axios.get(
                `${route('categories.create')}?${search}=asj&page=${currentPage}&per_page=${perPage}&sort=${column.selector}&order=${sortDirection}`
            );
            setSearch(search);
            setData(response.data.data);
            setTotalRows(response.data.total);
            setLoading(false);
            setPending(false);
        },
        [
            currentPage, perPage, totalRows, search

        ]);


    useEffect(() => {
        fetchData(search, currentPage, perPage, column, sortDirection);
    }, []);


    const handleSort = async (column, sortDirection) => {

        fetchData(search, currentPage, perPage, column, sortDirection);
        setColumn(column);
        setDirection(sortDirection);
    };


    const handlePageChange = page => {
        fetchData(search, currentPage, perPage, column, sortDirection);
        setCurrentPage(page);
        setPerPage(perPage);
    };

    const handleDelete = useCallback(
        row => async () => {

        },
        []
    );
    const handlePerRowsChange = async (newPerPage, page) => {
        fetchData(search, currentPage, perPage, column, sortDirection);
        setPerPage(newPerPage);
    };
    const handleSearch = async (search) => {
        fetchData(search, currentPage, perPage, column, sortDirection);
        setSearch(search);
    }

    const columns = useMemo(
        () => [
            {
                name: "Name",
                selector: row => row.name,
                sortable: true
            },

            {
                cell: row => <button onClick={handleDelete(row)}>Delete</button>
            }
        ],
        [handleDelete]
    );

    const handleClear = () => {
        if (search) {
            setRefresh(!refresh);
            setSearch('');
        }
    };



    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        }


    }, [filterText, resetPaginationToggle]);
    return (
        <AppLayout
            title="Dashboard"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            )}
        >
            <div className="py-12">
                <DataTable
                    title="Users"
                    columns={columns}
                    data={data}
                    progressPending={pending}
                    pagination
                    fixedHeader={true}
                    fixedHeaderScrollHeight="100vh"
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationDefaultPage={currentPage}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    selectableRows
                    onSort={handleSort}
                    onSelectedRowsChange={({selectedRows}) => console.log(selectedRows)
                    }
                    subHeaderComponent={subHeaderComponentMemo}


                />
            </div>
        </AppLayout>
    );
}
