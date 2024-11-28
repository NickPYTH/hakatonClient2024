import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {Navbar} from "./Navbar";
import UserScreen from "../screen/admin/UserScreen";
import { LoginScreen } from '../screen/LoginScreen';
import RequestScreen from "../screen/RequestScreen";
import {ClientScreen} from "../screen/ClientScreen";

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
                    path='/'
                    element={<LoginScreen/>}
                />
                <Route
                    path='/my'
                    element={<ClientScreen/>}
                />
                <Route
                    path='/admin/users'
                    element={<UserScreen/>}
                />
                <Route
                    path='/admin/requests'
                    element={<RequestScreen/>}
                />
                <Route
                    path='*'
                    element={<div>четыреста четыре нот фаунд))</div>}
                />
            </Routes>
        </BrowserRouter>)
};