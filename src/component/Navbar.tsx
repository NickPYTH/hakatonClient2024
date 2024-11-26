import React, {useEffect, useState} from 'react';
import {Flex, Menu, MenuProps, Spin} from 'antd';
import {Link} from "react-router-dom";
import {LogoutOutlined} from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {roleAPI} from "../service/RoleService";
import {setRoles} from "../store/slice/RoleSlice";

enum ROUTES {
    USERS = 'users',
    LOGOUT = 'logout',
}
const items: MenuProps['items'] = [
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
    useEffect(() => {
        getRoles();
    }, []);
    useEffect(() => {
        if (rolesFromRequest) dispatch(setRoles(rolesFromRequest));
    }, [rolesFromRequest]);
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
    if (isGetRolesLoading) return (
        <div style={{width: window.innerWidth, height: window.innerHeight}}>
            <Flex style={{height: '100%'}} align={'center'} justify={'center'}>
                <Spin size={'large'}/>
            </Flex>
        </div>
    );
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>;
};