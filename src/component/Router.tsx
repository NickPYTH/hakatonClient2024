import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {Navbar} from "./Navbar";
import UserScreen from "../screen/admin/UserScreen";
import {LoginScreen} from '../screen/LoginScreen';
import RequestScreen from "../screen/admin/RequestScreen";
import {ClientScreen} from "../screen/ClientScreen";
import TypeScreen from "../screen/admin/TypeScreen";
import StatusScreen from "../screen/admin/StatusScreen";
import PriorityScreen from "../screen/admin/PriorityScreen";
import SubTypeScreen from '../screen/admin/SubTypeScreen';
import GroupScreen from "../screen/admin/GroupScreen";

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
                    path='/admin/groups'
                    element={<GroupScreen/>}
                />
                <Route
                    path='/admin/requests'
                    element={<RequestScreen/>}
                />
                <Route
                    path='/admin/types'
                    element={<TypeScreen/>}
                />
                <Route
                    path='/admin/subtypes'
                    element={<SubTypeScreen/>}
                />
                <Route
                    path='/admin/statuses'
                    element={<StatusScreen/>}
                />
                <Route
                    path='/admin/priorities'
                    element={<PriorityScreen/>}
                />
                <Route
                    path='*'
                    element={<div>четыреста четыре нот фаунд))</div>}
                />
            </Routes>
        </BrowserRouter>)
};