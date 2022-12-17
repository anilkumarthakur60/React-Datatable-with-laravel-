import React, {useState, useEffect, useCallback, useMemo} from "react";
import AppLayout from '@/Layouts/AppLayout';
import axios from "axios";
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';


export default function Index() {

    const route = useRoute();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const columns = [

        {
            name: 'Name',
            selector: row => row.title,
            sortable: true,
            sortField: 'title',
            filterable: true,

        },

        {
            name: 'Category',
            selector: row => row.category?.name,
            sortable: true,
            sortField: 'category_id',

            filterable: true,
        },
    ];
    const fetchUsers = async page => {
        setLoading(true);

        const response = await axios.get(`${route('posts.create')}?page=${page}&per_page=${perPage}&delay=1`);

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        fetchUsers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await axios.get(`${route('posts.create')}?page=${page}&per_page=${newPerPage}&delay=1`);

        setData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(1); // fetch page 1 of users

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
                    title="Users"
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                />
            </div>
        </AppLayout>
    );
}
