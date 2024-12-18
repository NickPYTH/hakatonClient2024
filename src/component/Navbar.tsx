import React, {useEffect, useState} from 'react';
import {Flex, Menu, MenuProps, Spin} from 'antd';
import {Link, useLocation} from "react-router-dom";
import {LogoutOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {roleAPI} from "../service/RoleService";
import {setRoles} from "../store/slice/RoleSlice";
import {statusAPI} from "../service/StatusService";
import {priorityAPI} from "../service/PriorityService";
import {typeAPI} from "../service/TypeService";
import {setStatuses} from "../store/slice/StatusSlice";
import {setPriorities} from "../store/slice/PrioritySlice";
import {setTypes} from "../store/slice/TypeSlice";
import {userAPI} from "../service/UserService";
import {setCurrentUser, setUsers} from "../store/slice/UserSlice";
import {RootStateType} from "../store/store";
import {subTypeAPI} from "../service/SubTypeService";
import {setSubTypes} from "../store/slice/SubTypeSlice";
import {host, port, secure} from "../config/constants";
import {ExecutorWorkModal} from "./ExecutorWorkModal";

enum ROUTES {
    REQUESTS = 'admin/requests',
    USERS = 'admin/users',
    GROUPS = 'admin/groups',
    STATUSES = 'admin/statuses',
    TYPES = 'admin/types',
    SUB_TYPES = 'admin/subtypes',
    PRIORITIES = 'admin/priorities',
    EQUIPMENTS = 'admin/equipments',
    REPORTS = 'admin/reports',
    LOGOUT = 'logout',
}
export const Navbar = () => {
    const location = useLocation();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const dispatch = useDispatch();
    const [executorWorkModalVisible, setExecutorWorkModalVisible] = useState(false);
    const items: MenuProps['items'] = [
        {
            label: (
                <Link to={ROUTES.USERS}>Пользователи</Link>
            ),
            key: ROUTES.USERS,
        },
        {
            label: (
                <Link to={ROUTES.GROUPS}>Рабочие группы</Link>
            ),
            key: ROUTES.GROUPS,
        },
        {
            label: (
                <Link to={ROUTES.EQUIPMENTS}>Оборудование</Link>
            ),
            key: ROUTES.EQUIPMENTS,
        },
        {
            label: (
                <Link to={ROUTES.REQUESTS}>Заявки</Link>
            ),
            key: ROUTES.REQUESTS,
        },
        {
            label: "Отчеты",
            key: ROUTES.REPORTS,
            children: [
                {
                    label: "Отчет по заявкам",
                    key: "requestReport",
                    onClick: () => {
                        const link = document.createElement('a');
                        link.href = `${secure}://${host}${port}/reports/requests`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                },
                {
                    label: "Исполнительская дисциплина",
                    key: "executorWorkReport",
                    onClick: () => setExecutorWorkModalVisible(true)
                },
            ]
        },
        {
            label: "Справочники",
            key: "dicts",
            children: [
                {
                    label: (
                        <Link to={ROUTES.STATUSES}>Статусы заявок</Link>
                    ),
                    key: ROUTES.STATUSES,
                },
                {
                    label: (
                        <Link to={ROUTES.PRIORITIES}>Приоритеты заявок</Link>
                    ),
                    key: ROUTES.PRIORITIES,
                },
                {
                    label: (
                        <Link to={ROUTES.TYPES}>Типы заявок</Link>
                    ),
                    key: ROUTES.TYPES,
                },
                {
                    label: (
                        <Link to={ROUTES.SUB_TYPES}>Подтипы заявок</Link>
                    ),
                    key: ROUTES.SUB_TYPES,
                },
            ]
        },
        {
            label: (
                <Link onClick={() => dispatch(setCurrentUser(null))} to={'/login'}>Выйти</Link>
            ),
            key: ROUTES.LOGOUT,
            icon: <LogoutOutlined />,
        },
    ];
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
    const [getSubTypes, {
        data: subTypesFromRequest,
        isLoading: isGetSubTypesLoading
    }] = subTypeAPI.useGetAllMutation();
    const [getUsers, {
        data: usersFromRequest,
        isLoading: isGetUsersLoading
    }] = userAPI.useGetUsersMutation();
    const [getCurrentUser, {
        data: currentUserFromRequest,
        isLoading: isCurrentUserLoading
    }] = userAPI.useGetCurrentUserMutation();
    useEffect(() => {
        getCurrentUser();
        getRoles();
        getStatuses();
        getTypes();
        getSubTypes();
        getPriorities();
        getUsers();
    }, [location]);
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
    useEffect(() => {
        if (currentUserFromRequest) dispatch(setCurrentUser(currentUserFromRequest));
    }, [currentUserFromRequest]);
    useEffect(() => {
        if (subTypesFromRequest) dispatch(setSubTypes(subTypesFromRequest));
    }, [subTypesFromRequest]);
    const [current, setCurrent] = useState<ROUTES>(() => {
        switch (document.location.pathname.slice(1)) {
            case ROUTES.USERS:
                return ROUTES.USERS
            case ROUTES.GROUPS:
                return ROUTES.GROUPS
            case ROUTES.REQUESTS:
                return ROUTES.REQUESTS
            case ROUTES.STATUSES:
                return ROUTES.STATUSES
            case ROUTES.TYPES:
                return ROUTES.TYPES
            case ROUTES.SUB_TYPES:
                return ROUTES.SUB_TYPES
            case ROUTES.PRIORITIES:
                return ROUTES.PRIORITIES
            case ROUTES.EQUIPMENTS:
                return ROUTES.EQUIPMENTS
            default:
                return ROUTES.USERS
        }
    });
    const onClick = (e: any) => {
        if (e.key === 'logout') localStorage.clear();
        setCurrent(e.key)
    };
    if (isGetRolesLoading ||
        isGetStatusesLoading ||
        isGetPrioritiesLoading ||
        isGetTypesLoading ||
        isCurrentUserLoading ||
        isGetUsersLoading) return (
        <div style={{width: window.innerWidth, height: window.innerHeight}}>
            <Flex style={{height: '100%'}} align={'center'} justify={'center'}>
                <Spin size={'large'}/>
            </Flex>
        </div>
    );
    if (currentUser) {
        if (currentUser.role.id !== 2 && currentUser.role.id !== 3 && currentUser.role.id !== 4)
            return <div>
                {executorWorkModalVisible && <ExecutorWorkModal visible={executorWorkModalVisible} setVisible={setExecutorWorkModalVisible}/>}
                <div style={{position: 'absolute', right: 50, top: 11}}><strong>{currentUser.surname} {currentUser.name[0]}. {currentUser.secondName[0]}.</strong></div>
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
        </div>;
        else return <></>
    }
    else return <></>
};