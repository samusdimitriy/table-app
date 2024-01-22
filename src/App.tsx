import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AccountsTable from './AccountsTable/AccountsTable';
import ProfilesTable from './ProfilesTable/ProfilesTable';
import CampaignsTable from './CampaignsTable/CampaignsTable';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/accounts" className="nav-link home-link">
                Home
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/accounts" element={<AccountsTable />} />
          <Route
            path="/accounts/:accountId/profiles"
            element={<ProfilesTable />}
          />
          <Route
            path="/accounts/:accountId/profiles/:profileId/campaigns"
            element={<CampaignsTable />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
