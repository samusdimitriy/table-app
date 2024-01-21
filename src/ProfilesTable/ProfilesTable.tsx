import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import profilesData from '../data/profiles';
import '../styles.css';

type SortKey = 'profileId' | 'country' | 'marketplace';

interface Profile {
  profileId: string;
  accountId: string;
  country: string;
  marketplace: string;
}

const ProfilesTable: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    const profilesForAccount = profilesData.filter(
      (profile) => profile.accountId === accountId
    );
    setProfiles(profilesForAccount);
  }, [accountId]);

  const handleSort = (columnName: SortKey) => {
    setSortBy(columnName);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const totalPages = Math.ceil(profiles.length / itemsPerPage);

  const handleRowClick = (profileId: string) => {
    navigate(`/accounts/${accountId}/profiles/${profileId}/campaigns`);
  };

  const getVisibleProfiles = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedProfiles = [...profiles];

    if (sortBy) {
      sortedProfiles.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return sortedProfiles.slice(startIndex, endIndex).map((profile) => (
      <tr
        key={profile.profileId}
        onClick={() => handleRowClick(profile.profileId)}
      >
        <td>{profile.profileId}</td>
        <td>{profile.country}</td>
        <td>{profile.marketplace}</td>
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <h2>Profiles for Account ID: {accountId}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('profileId')}>Profile ID</th>
            <th onClick={() => handleSort('country')}>Country</th>
            <th onClick={() => handleSort('marketplace')}>Marketplace</th>
          </tr>
        </thead>
        <tbody>
          {profiles.length > 0 ? (
            getVisibleProfiles()
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
          {' '}
          Page {currentPage} of {totalPages}{' '}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next Page
        </Button>
      </div>

      <div className="back-link">
        <span onClick={() => navigate('/accounts')}>Back to Accounts</span>
      </div>
    </div>
  );
};

export default ProfilesTable;
