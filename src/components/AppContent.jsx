import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Dashboard from '../views/dashboard/Dashboard'
import Leads from '../views/base/Leads/Leads'
import LeadsMain from '../views/base/Leads Main/LeadsMain'
import LeadDetails from '../views/base/Leads Main/LeadDetails'
import CustomerDetails from '../views/base/CustomerDetails/CustomerDetails'


const AppContent = () => {
  return (
    <CContainer fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Leads" element={<LeadsMain />} />
          <Route path="/LeadDetails/:leadCode" element={<LeadDetails />} />
          <Route path="/CustomerDetails" element={<CustomerDetails />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
