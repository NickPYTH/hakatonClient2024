import React, {useEffect, useState} from 'react';
import {Flex, Menu, MenuProps, Spin} from 'antd';
import {Link} from "react-router-dom";
import {LogoutOutlined} from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {roleAPI} from "../service/RoleService";
import {setRoles} from "../store/slice/RoleSlice";
import {statusAPI} from "../service/StatusService";
import {priorityAPI} from "../service/PriorityService";
import {typeAPI} from "../service/TypeService";
import {setStatuses} from "../store/slice/StatusSlice";
import {setPriorities} from "../store/slice/PrioritySlice";
import {setTypes} from "../store/slice/TypeSlice";
import {userAPI} from "../service/UserService";
import {setUsers} from "../store/slice/UserSlice";

enum ROUTES {
    REQUESTS = 'requests',
    USERS = 'users',
    LOGOUT = 'logout',
}
const items: MenuProps['items'] = [
    {
        label: (
            <Link to={'/admin/requests'}>Заявки</Link>
        ),
        key: ROUTES.REQUESTS,
    },
    {
        label: (
            <Link to={'/admin/users'}>Пользователи</Link>
        ),
        key: ROUTES.USERS,
    },
    {
        label: (
            <Link to={'/login'}>Выйти</Link>
        ),
        key: ROUTES.LOGOUT,
        icon: <LogoutOutlined />,
    },
];
export const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const [getRoles, {
        data: rolesFromRequest,
        isLoading: isGetRolesLoading
    }] = roleAPI.useGetRolesMutation();
    const [getStatuses, {
        data: statusesFromRequest,
        isLoading: isGetStatusesLoading
    }] = statusAPI.useGetAllMutation();
    const [getPriorities, {
        data: prioritiesFromRequest,
        isLoading: isGetPrioritiesLoading
    }] = priorityAPI.useGetAllMutation();
    const [getTypes, {
        data: typesFromRequest,
        isLoading: isGetTypesLoading
    }] = typeAPI.useGetAllMutation();
    const [getUsers, {
        data: usersFromRequest,
        isLoading: isGetUsersLoading
    }] = userAPI.useGetUsersMutation();
    useEffect(() => {
        getRoles();
        getStatuses();
        getTypes();
        getPriorities();
        getUsers();
    }, []);
    useEffect(() => {
        if (rolesFromRequest) dispatch(setRoles(rolesFromRequest));
    }, [rolesFromRequest]);
    useEffect(() => {
        if (statusesFromRequest) dispatch(setStatuses(statusesFromRequest));
    }, [statusesFromRequest]);
    useEffect(() => {
        if (prioritiesFromRequest) dispatch(setPriorities(prioritiesFromRequest));
    }, [prioritiesFromRequest]);
    useEffect(() => {
        if (typesFromRequest) dispatch(setTypes(typesFromRequest));
    }, [typesFromRequest]);
    useEffect(() => {
        if (usersFromRequest) dispatch(setUsers(usersFromRequest));
    }, [usersFromRequest]);
    const [current, setCurrent] = useState<ROUTES>(() => {
        switch (document.location.pathname.slice(1)) {
            case ROUTES.USERS:
                return ROUTES.USERS
            default:
                return ROUTES.USERS
        }
    });
    const onClick = (e: any) => {
        if (e.key === 'logout') localStorage.clear();
        setCurrent(e.key)
    };
    if (isGetRolesLoading || isGetStatusesLoading || isGetPrioritiesLoading || isGetTypesLoading || isGetUsersLoading) return (
        <div style={{width: window.innerWidth, height: window.innerHeight}}>
            <Flex style={{height: '100%'}} align={'center'} justify={'center'}>
                <Spin size={'large'}/>
            </Flex>
        </div>
    );
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>;
};