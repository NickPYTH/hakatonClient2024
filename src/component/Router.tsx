import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {Navbar} from "./Navbar";
import UserScreen from "../screen/admin/UserScreen";

export const Router = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route
                    path='hakaton/users'
                    element={<UserScreen/>}
                />
                <Route
                    path='*'
                    element={<div>404</div>}
                />
            </Routes>
        </BrowserRouter>)
};