import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Dashboard from '../views/dashboard/Dashboard'
import Leads from '../views/base/Leads/Leads'
import Enquiry from '../views/base/Enquiry/Enquiry'
// import CurrentWorkList from '../views/base/Current Work List/CurrentWorkList'
// import TicketList from '../views/base/Ticket List/TicketList'
// import TransferDetails from '../views/base/Transfer Details/TransferDetails'
// import TagList from '../views/base/Tag List/TagList'
// import CustomerDetails from '../views/base/CustomerDetails/CustomerDetails'
// import TotalWorkList from '../views/base/Total WorkList/TotalWorkList'
// import ServicesandSolutions from '../views/base/Services&Solutions/ServicesandSolutions'
// import AllReports from '../views/base/All Reports/AllReports'
// import OverAllworkReports from '../views/base/All Reports/OverAllworkReports'
// import ServiceView from '../views/base/All Reports/ServiceView'
// import CreateNewUser from '../views/base/Create New User/CreateNewUser'
// import WorkStatus from '../views/base/Work Status/WorkStatus'

const AppContent = () => {
  return (
    <CContainer fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Leads" element={<Leads />} />
          <Route path="/enq" element={<Enquiry />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
