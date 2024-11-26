import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {Navbar} from "./Navbar";
import UserScreen from "../screen/admin/UserScreen";
import { LoginScreen } from '../screen/LoginScreen';

export const Router = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route
                    path='/login'
                    element={<LoginScreen/>}
                />
                <Route
                    path='/admin/users'
                    element={<UserScreen/>}
                />
                <Route
                    path='*'
                    element={<div>четыреста четыре нот фаунд))</div>}
                />
            </Routes>
        </BrowserRouter>)
};