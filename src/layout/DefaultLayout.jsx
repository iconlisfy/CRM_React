import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/Index'
import { WorkListProvider } from '../Context/WorkListContext'

const DefaultLayout = () => {
  return (

    <WorkListProvider>

      <div className="d-flex flex-column min-vh-100">
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>

    </WorkListProvider>
  )
}

export default DefaultLayout

