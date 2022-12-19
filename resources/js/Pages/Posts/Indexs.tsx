import React, {useState, useEffect, useCallback} from "react";
import AppLayout from '@/Layouts/AppLayout';
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';
import axios from "axios";
import styled from 'styled-components';
import {set} from "lodash";

export default function Index() {

    const [datas, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const route = useRoute();

    const getData = async page => {
console.log('---------data logging while calling api--------',page);
        try {
            setLoading(true);
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
            setLoading(false);

        } catch (e) {
            console.log(e);
        }
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
        console.log('---------data logging- handleSort-------', column, sortDirection);

        setLoading(true);
        setSort(column.sortField);
        setSortDir(sortDirection);
        getData(page);
        setLoading(false);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        console.log('---------data logging- handlePerRowsChange-------', newPerPage, page);

        setPerPage(newPerPage);
        getData(newPerPage);
        setLoading(false);
    };
    const handlePageChange = async page => {
        console.log('---------data logging- handlePageChange-------', page);
        setLoading(true);
        setPage(page);
        getData(page);
        setLoading(false);
    }

    useEffect(() => {
        getData(1);
    }, []);


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
                    columns={columns}
                    data={datas}


                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationPerPage={perPage}
                    onSort={handleSort}
                    sortServer
                    sortIcon={<i className="fas fa-sort"></i>}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    fixedHeader={true}
                    fixedHeaderScrollHeight="100vh"
                    highlightOnHover={true}


                />
            </div>


        </AppLayout>
    );
}
