import React, {useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {Link} from "react-router-dom";
import {LogoutOutlined} from '@ant-design/icons';
enum ROUTES {
    USERS = 'users',
    FILIALS = 'filials',
    EQUIPMENTS = 'equipments',
    OBJECTS = 'objects',
    REQUESTS = 'requests',
    LOGOUT = 'logout',
    WIDGETS = 'widgets'
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
            <Link to={'/filials'}>Филиалы</Link>
        ),
        key: ROUTES.FILIALS,
    },
    {
        label: (
            <Link to={'/objects'}>Объекты</Link>
        ),
        key: ROUTES.OBJECTS,
    },
    {
        label: (
            <Link to={'/equipments'}>Оборудование</Link>
        ),
        key: ROUTES.EQUIPMENTS,
    },
    {
        label: (
            <Link to={'/requests'}>Заявки</Link>
        ),
        key: ROUTES.REQUESTS,
    },
    {
        label: (
            <Link to={'/widgets'}>Виджеты</Link>
        ),
        key: ROUTES.WIDGETS,
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
    const [current, setCurrent] = useState<ROUTES>(() => {
        switch (document.location.pathname.slice(1)) {
            case ROUTES.USERS:
                return ROUTES.USERS
            case ROUTES.FILIALS:
                return ROUTES.FILIALS
            case ROUTES.EQUIPMENTS:
                return ROUTES.EQUIPMENTS
            case ROUTES.OBJECTS:
                return ROUTES.OBJECTS
            case ROUTES.REQUESTS:
                return ROUTES.REQUESTS
            case ROUTES.WIDGETS:
                return ROUTES.WIDGETS
            default:
                return ROUTES.USERS
        }
    });
    const onClick = (e: any) => {
        if (e.key === 'logout') localStorage.clear();
        setCurrent(e.key)
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>;
};