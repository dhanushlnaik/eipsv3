import React, { useEffect, useState } from 'react';
import { CSmartTable } from '@coreui/react-pro';

export const SmartTableJSONDataExample = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const columns = [
    { key: 'first_name', _style: { minWidth: '130px' } },
    { key: 'last_name', _style: { minWidth: '130px' } },
    'email',
    { key: 'country', _style: { minWidth: '120px' } },
    { key: 'ip_address', label: 'IP' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://apitest.coreui.io/fake_data/users.json'
        );
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUsers([]); // Optionally handle error state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CSmartTable
      columns={columns}
      columnFilter
      columnSorter
      footer
      items={users}
      itemsPerPageSelect
      loading={loading}
      pagination
      tableProps={{
        hover: true,
        responsive: true,
      }}
    />
  );
};
