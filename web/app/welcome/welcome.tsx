import React, { useState, useMemo } from 'react';

// Mock Data
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', spent: 1200 },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', status: 'Inactive', spent: 850 },
  { id: 3, name: 'Alice Johnson', email: 'alice@web.com', status: 'Active', spent: 2100 },
  { id: 4, name: 'Bob Wilson', email: 'bob@tech.io', status: 'Active', spent: 450 },
];

const CustomerList = () => {
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // 1. Filtering Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // 2. Sorting Logic
  const sortedCustomers = useMemo(() => {
    const sortableItems = [...filteredCustomers];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [filteredCustomers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header & Filter */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => requestSort('name')}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-4">Email</th>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => requestSort('status')}>
                  Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-4 cursor-pointer hover:text-blue-600 text-right" onClick={() => requestSort('spent')}>
                  Total Spent {sortConfig.key === 'spent' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="p-4 text-gray-600">{customer.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-gray-700 font-mono">${customer.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedCustomers.length === 0 && (
            <div className="p-8 text-center text-gray-500">No customers found matching "{searchTerm}"</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;