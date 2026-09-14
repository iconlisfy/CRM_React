
import React, { Suspense } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CSpinner } from "@coreui/react";
import "./scss/style.scss";

import DialogComponent from "./Dialog";

import "@coreui/coreui/dist/css/coreui.min.css";
import "@coreui/coreui-pro/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const Login = React.lazy(() => import("./views/pages/login/Login"));

const App = () => {
    const isAuthenticated = useSelector(
        (state) => state.isAuthenticated
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage:
                    "linear-gradient(135deg, #f8fafc 0%, #eef4ff 50%, #dbeafe 100%)",
            }}
        >
            {/* Keep this mounted globally */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
                newestOnTop
                limit={3}
            />

            <HashRouter>
                <DialogComponent />

                <Suspense
                    fallback={
                        <div className="pt-3 text-center">
                            <CSpinner color="primary" variant="grow" />
                        </div>
                    }
                >
                    <Routes>
                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="*"
                            element={
                                isAuthenticated ? (
                                    <DefaultLayout />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                    </Routes>
                </Suspense>
            </HashRouter>
        </div>
    );
};

export default App;

