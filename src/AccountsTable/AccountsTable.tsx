import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import accountsData from '../data/accounts';
import '../styles.css';

type SortKey = 'accountId' | 'email' | 'creationDate';

interface Account {
  accountId: string;
  email: string;
  authToken: string;
  creationDate: string;
}

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);

  const navigate = useNavigate();

  useEffect(() => {
    setAccounts(accountsData);
  }, []);

  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  const getVisibleAccounts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedAccounts = [...accounts];

    if (sortBy) {
      sortedAccounts.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return sortedAccounts.slice(startIndex, endIndex).map((account) => (
      <tr
        key={account.accountId}
        onClick={() => navigate(`/accounts/${account.accountId}/profiles`)}
      >
        <td>{account.accountId}</td>
        <td>{account.email}</td>
        <td>{account.creationDate}</td>
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <h1>Accounts</h1>
      <Table striped bordered hover className="accounts-table">
        <thead>
          <tr>
            <th onClick={() => setSortBy('accountId')}>Account ID</th>
            <th onClick={() => setSortBy('email')}>Email</th>
            <th onClick={() => setSortBy('creationDate')}>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            getVisibleAccounts()
          ) : (
            <tr>
              <td colSpan={3}>No accounts available</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="pagination-container">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default AccountsTable;
