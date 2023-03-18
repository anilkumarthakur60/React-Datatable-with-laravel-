import React, { useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DataTable from 'react-data-table-component';
import { DebounceInput } from 'react-debounce-input';
import { usePage } from '@inertiajs/inertia-react';
import route from 'ziggy-js';
import usePaginationData from '@/Hooks/usePaginationData';
import Button from '@mui/material/Button';


export default function Index() {

  const { auth } = usePage().props;

  const {
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
    resetPaginationToggle, setResetPaginationToggle,

  } = usePaginationData({
    routeName: route('apiPosts.index'),
  });


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
      cell: (row) => <Button type='button' onClick={() => logData(row)}>
        Delete
      </Button>
      ,
      sortable: true,
      sortField: 'created_at',
    },
  ];


  const [eventData, setEventData] = useState([]);
  //
  useEffect(() => {

    window.Echo.private(`pageRefreshChannel.${auth?.id}`).listen('PageRefreshEvent', e => {
      console.debug(e, 'message sent');
      setEventData(e.data);
      getData();

    });
  }, []);


  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'off',
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',


  };



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
                  value={filters.queryFilter}
                  name={'queryFilter'}
                  onChange={handleFilterChange}
                />
                <DebounceInput
                  minLength={2}
                  className={`border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none`}

                  placeholder='Search'
                  name={'queryFilter'}
                  debounceTimeout={500}
                   value={filters.queryFilter}
                  onChange={handleFilterChange}

                />

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
