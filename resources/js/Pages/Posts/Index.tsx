import React, {useState, useEffect, useCallback, useMemo} from "react";
import AppLayout from '@/Layouts/AppLayout';
import axios from "axios";
import DataTable from 'react-data-table-component';
import useRoute from '@/Hooks/useRoute';
import FilterComponent from "@/Pages/Category/FilterComponent";


export default function Index() {

    const route = useRoute();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState(null);
    const [page, setPage] = useState(1);
    const [pending, setPending] = React.useState(true);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);


    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);

    const columns = [

        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            sortField: 'name',
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


    const fetchPosts = useCallback(async (page) => {

        setPage(page);
        setLoading(true);
        const response = await axios.get(route('posts.create', {
            page: page,
            per_page: perPage,
            search: search,
            order: 'asc',

        }));
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    }, []);

    const handlePageChange = page => {
        console.log('---------data logging handlePageChange--------',page);
        fetchPosts(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        console.log('---------data logging handlePerRowsChange--------',newPerPage,page);
        setLoading(true);
        fetchPosts(page);
        setPerPage(newPerPage);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts(page);

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
                    paginationPerPage={perPage}
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100,0]}
                    subHeaderComponent={subHeaderComponentMemo}
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1



                />
            </div>
        </AppLayout>
    );
}
