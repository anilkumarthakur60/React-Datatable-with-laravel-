import React, {useState, useEffect, useCallback} from "react";
import AppLayout from '@/Layouts/AppLayout';
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';
import axios from "axios";
import {set} from "lodash";
import {data} from "autoprefixer";

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

    const getData = async page => {
            const response = await axios.get(route('posts.create',
                {
                    page: page,
                    search: search,
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
        const response = await axios.get(route('posts.create',
            {
                page: page,
                search: search,
                sort: sort,
                sortDir: sortDir,
                filters: filters,
                per_page: newPerPage

            }));
        setData(response.data.data);
        setTotalRows(response.data.meta.total);

    };
    const handlePageChange = async page => {
        setPage(page);
        getData(page);
    }

    useEffect(() => {
            getData(1);
        },
        []);

    const resetAll = () => {
        setFilters({});
        setSearch('');

        setPage(1);
        setSort('name');
        setSortDir('asc');
        setPerPage(10);
        getData(1);

    }
    const paginationOptions ={
            rowsPerPageText: 'Rows per page:',
            rangeSeparatorText: 'off',
            noRowsPerPage: false,
            selectAllRowsItem: true,
            selectAllRowsItemText: 'All',


        }


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


                />
            </div>


        </AppLayout>
    );
}
