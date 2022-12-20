import React, {useState, useEffect, useCallback} from "react";
import AppLayout from '@/Layouts/AppLayout';
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';
import axios from "axios";
import {debounce} from "lodash";
import FilterComponent from "@/Pages/Category/FilterComponent";
import {DebounceInput} from 'react-debounce-input';


export default function Index() {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const route = useRoute();
    const [filterText, setFilterText] = useState();
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


    const getData = async page => {
        const response = await axios.get(route('posts.create',
            {
                page: page,
                search: search  ,
                sort: sort,
                sortDir: sortDir,
                filters: filters,
                per_page: perPage

            }));
            setData(response.data.data);
            setTotalRows(response.data.meta.total);

    }



    function logData(row) {
        console.log(row);
    }

    const columns = [
        {
            name: 'Title',
            selector: row => row.name,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Slug',
            selector: row => row.slug,
            sortable: true,
            sortField: 'slug',
        },
        {
            name: 'Date',
            selector: row => row.created_at,
            sortable: true,
            sortField: 'created_at',
        },
        {
            name: 'Action',
            cell: (row) => <button type="button" onClick={() => logData(row)}
                                   className="py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Delete
            </button>
            ,
            sortable: true,
            sortField: 'created_at',
        },
    ];

    const handleSort = async (column, sortDirection) => {
        setSort(column.sortField);
        setSortDir(sortDirection);
        getData(page);
    };
    const handleRowPerPageChange = async (newPerPage, page) => {

        setPerPage(newPerPage);
        setPage(page);
        getData(page);
        // const response = await axios.get(route('posts.create',
        //     {
        //         page: page,
        //         search: filterText,
        //         sort: sort,
        //         sortDir: sortDir,
        //         filters: filters,
        //         per_page: newPerPage
        //
        //     }));
        // setData(response.data.data);
        // setTotalRows(response.data.meta.total);

    };
    const handlePageChange = async page => {
        setPage(page);
        getData(page);
    }

    useEffect(() => {
            getData(1);
        },
        [
            page,
            sort,
            sortDir,
            filters,
            loading,
            totalRows,
            perPage,
            search,
            filterText,

        ]);

    const resetAll = () => {

        setFilters({});
        setSearch('');
        setPage(1);
        setSort('name');
        setSortDir('asc');
        setPerPage(10);
        getData(page);

    }
    const paginationOptions = {
        rowsPerPageText: 'Rows per page:',
        rangeSeparatorText: 'off',
        noRowsPerPage: false,
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',


    }

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear}
                             filterText={filterText}/>
        );
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
            <button type="button" onClick={resetAll}
                    className="py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Delete
            </button>
            <div className="py-12">
                <DataTable
                    columns={columns}
                    data={data}


                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationPerPage={perPage}
                    onSort={handleSort}
                    sortServer
                    sortIcon={<i className="fas fa-sort"></i>}
                    onChangeRowsPerPage={handleRowPerPageChange}
                    onChangePage={handlePageChange}
                    fixedHeader={true}
                    fixedHeaderScrollHeight="100vh"
                    highlightOnHover={true}
                    paginationComponentOptions={paginationOptions}
                    subHeader={true}
                    persistTableHead={true}
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 500, 1000]}
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                    subHeaderComponent={
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row justify-between items-center">
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                                    placeholder="Search"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <DebounceInput
                                    minLength={2}
                                    value={search}
                                    className={`border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none`}

                                    debounceTimeout={500}
                                    onChange={event => setSearch(event.target.value)} />

                                <button type="button" onClick={() => getData(page)}
                                        className="py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Search
                                </button>
                            </div>

                            <div className="flex flex-row justify-between items-center">
                                <button type="button" onClick={resetAll}
                                        className="py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>


                    }


                />
            </div>


        </AppLayout>
    );
}
