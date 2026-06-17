import React from 'react';
import { CFooter } from '@coreui/react';
import './AppFooter.css';
import getReduxState from '../ReduxState';

const AppFooter = () => {

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // January = 0

  // If month >= April (3), show next financial year
  const financialYear =
    currentMonth >= 3
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;

  return (
    <CFooter className="footer" style={{ backgroundColor: '#ffffff' }}>
      <div className="left-content">
        <span className="branch-name"></span>
      </div>
      <div className="right-content">
        <span className="developer-credit">
              Copyright ICON INFOWARE © {financialYear}</span>
        {/* <a
        className="developer-credit"
          href="https://iconinfoware.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Icon Infoware Technologies
        </a> */}
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);