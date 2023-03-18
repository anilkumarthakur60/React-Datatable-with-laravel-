import React, { useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';
import axios from 'axios';
import FilterComponent from '@/Pages/Category/FilterComponent';
import { DebounceInput } from 'react-debounce-input';
import { usePage } from '@inertiajs/inertia-react';


export default function Index() {

    const { auth } = usePage().props;

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


    const getData = async () => {

        setLoading(true);


        axios({
            method: 'get',
            url: route('posts.create'),
            params: {
                page: page,
                search: search,
                sort: sort,
                sortDir: sortDir,
                filters: filters,
                per_page: perPage,

            },
        }).then((response) => {
            setData(response.data.data);
            setTotalRows(response.data.meta.total);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        });

    };


    function logData(row) {
        console.log(row);
    }

    const columns = [
        {
            name: 'Title',
            selector: (row) => row.name,
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
            cell: (row) => <button type='button' onClick={() => logData(row)}
                className='py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
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
        getData();
    };
    const handleRowPerPageChange = async (newPerPage, page) => {

        setPerPage(newPerPage);
        setPage(page);
        getData();
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
        getData();
    };

    useEffect(() => {
        getData();
    },
        [
            page,
            sort,
            sortDir,
            filters,
            totalRows,
            perPage,
            search,
            filterText,

        ]);

    const [eventData, setEventData] = useState([]);
    //
    useEffect(() => {

        window.Echo.private(`pageRefreshChannel.${auth?.id}`).listen('PageRefreshEvent', e => {
            console.debug(e, 'message sent');
            setEventData(e.data);
            getData();

        });
    }, []);


    const resetAll = () => {

        setFilters({});
        setSearch('');
        setPage(1);
        setSort('name');
        setSortDir('asc');
        setPerPage(10);
        getData();

    };
    const paginationOptions = {
        rowsPerPageText: 'Rows per page:',
        rangeSeparatorText: 'off',
        noRowsPerPage: false,
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',


    };

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear}
                filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);


    return (
        <AppLayout
            title='Dashboard'
            renderHeader={() => (
                <h2 className='font-semibold text-xl text-gray-800 leading-tight'>
                    Dashboard
                </h2>
            )}
        >

            <div className=''>
                <pre>
                    {JSON.stringify(eventData, null, 2)}
                </pre>
            </div>
            <button type='button' onClick={resetAll}
                className='py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
                Delete
            </button>

            <div className='py-12'>
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
                    sortIcon={<i className='fas fa-sort'></i>}
                    onChangeRowsPerPage={handleRowPerPageChange}
                    onChangePage={handlePageChange}
                    fixedHeader={true}
                    fixedHeaderScrollHeight='100vh'
                    highlightOnHover={true}
                    paginationComponentOptions={paginationOptions}
                    subHeader={true}
                    persistTableHead={true}
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 500, 1000]}
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                    subHeaderComponent={
                        <div className='flex flex-row justify-between items-center'>
                            <div className='flex flex-row justify-between items-center'>
                                <input
                                    type='text'
                                    className='border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none'
                                    placeholder='Search'
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <DebounceInput
                                    minLength={2}
                                    value={search}
                                    className={`border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none`}

                                    debounceTimeout={500}
                                    onChange={event => setSearch(event.target.value)} />

                                <button type='button' onClick={() => getData()}
                                    className='py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                >
                                    Search
                                </button>
                            </div>

                            <div className='flex flex-row justify-between items-center'>
                                <button type='button' onClick={resetAll}
                                    className='py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
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
