import React, { Suspense, useEffect, } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'
import './scss/style.scss'
// import Cancel from './views/base/Cancelinvoice/MainModel/Mainmode'
import DialogComponent from './Dialog'
import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))


const App = () => {

  const isAuthenticated = useSelector((state) => state.isAuthenticated)


return (
    <div
        style={{
            minHeight: "100%",
            backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #eef4ff 50%, #dbeafe 100%)",
        }}
    >
        <HashRouter>

            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar
                theme="colored"
            />

            <DialogComponent />

            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <Routes>
                    <Route exact path="/login" name="Login Page" element={<Login />} />
                    <Route path="*" name="Home" element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" />} />
                </Routes>
            </Suspense>

        </HashRouter>
    </div>
)
}

export default App
