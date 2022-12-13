import React, {useState, useEffect, useCallback, useMemo} from "react";
import AppLayout from '@/Layouts/AppLayout';
import axios from "axios";
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';
import FilterComponent from "@/Pages/Category/FilterComponent";
import { debounce } from "lodash";


export default function Dashboard() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState();
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
                `${route('categories.create')}?search=${search}&page=${currentPage}&per_page=${perPage}&sort=${column.selector}&order=${sortDirection}`
            );
            setSearch(search);
            setData(response.data.data);
            setTotalRows(response.data.total);
            setLoading(false);
            setCurrentPage(currentPage);
            setPerPage(perPage);
            setColumn(column);
            setDirection(sortDirection);
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


    const columns = useMemo(
        () => [
            {
                name: 'Name',
                selector: row => row.name,
                sortable: true,
                sortField: 'name',
            },
            {
                cell: row => <button onClick={handleDelete(row)}>Delete</button>
            }
        ],
        [handleDelete]
    );

    const  handleClear = () => {
        if (search) {
            setResetPaginationToggle(!resetPaginationToggle);
            setSearch('');
            fetchData(search,currentPage, perPage, column, sortDirection);

        }
        fetchData(search,currentPage, perPage, column, sortDirection);

    }
    const onFilter = e => {
        const ss = e?.target?.value;
        fetchData(search,currentPage, perPage, column, sortDirection);
        setSearch(ss);

    }
//handle input change
    const onClear = () => {
        setFilterText('');
        setResetPaginationToggle(!resetPaginationToggle);
    }

    // const subHeaderComponent = useMemo(() => {
    //     const handleClear = () => {
    //         if (filterText) {
    //             setResetPaginationToggle(!resetPaginationToggle);
    //             setFilterText("");
    //         }
    //     };
    //
    //     return (
    //         <FilterComponent
    //             onFilter={e => setFilterText(e.target.value)}
    //             onClear={handleClear}
    //             filterText={filterText}
    //         />
    //     );
    // }, [filterText, resetPaginationToggle]);

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
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                            name</label>
                        <input
                            type="text"
                            id="first_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="John"
                            value={search}
                            onChange={onFilter}

                        />

                        <button type="button"
                                onClick={handleClear}

                                className="py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Extra
                            Clear
                        </button>
                    </div>
                </div>
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


                />
            </div>
        </AppLayout>
    );
    }
