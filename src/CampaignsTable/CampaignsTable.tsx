import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import campaignsData from '../data/campaigns';
import '../styles.css';

type SortKey = 'campaignId' | 'clicks' | 'cost' | 'date';

interface Campaign {
  campaignId: string;
  profileId: string;
  clicks: number;
  cost: number;
  date: string;
}

const CampaignsTable: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  useEffect(() => {
    const campaignsForProfile = campaignsData.filter(
      (campaign) => campaign.profileId === profileId
    );
    setCampaigns(campaignsForProfile);
  }, [profileId]);

  const handleSort = (columnName: SortKey) => {
    setSortBy(columnName);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const getVisibleCampaigns = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedCampaigns = [...campaigns];

    if (sortBy) {
      sortedCampaigns.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (sortOrder === 'asc') {
          return typeof aValue === 'number' ? aValue - (bValue as number) : 0;
        } else {
          return typeof bValue === 'number' ? bValue - (aValue as number) : 0;
        }
      });
    }

    return sortedCampaigns.slice(startIndex, endIndex).map((campaign) => (
      <tr key={campaign.campaignId}>
        <td>{campaign.campaignId}</td>
        <td>{campaign.clicks}</td>
        <td>{campaign.cost}</td>
        <td>{campaign.date}</td>
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <h2>Campaigns for Profile ID: {profileId}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('campaignId')}>Campaign ID</th>
            <th onClick={() => handleSort('clicks')}>Clicks</th>
            <th onClick={() => handleSort('cost')}>Cost</th>
            <th onClick={() => handleSort('date')}>Date</th>
          </tr>
        </thead>
        <tbody>{getVisibleCampaigns()}</tbody>
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
        <span onClick={() => window.history.back()}>Back to Profile</span>
      </div>
    </div>
  );
};

export default CampaignsTable;
