import React, {useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import {userAPI} from "../service/UserService";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "../store/slice/UserSlice";
import {RootStateType} from "../store/store";
type propsType = {}
export const Navbar = (props: propsType) => {
    const [items, setItems] = useState<MenuProps['items']>([]);
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [getCurrentUser, {
        data: currentUserData,
        isLoading: isCurrentUserLoading
    }] = userAPI.useGetCurrentMutation();
    useEffect(() => {
        getCurrentUser();
    }, []);
    useEffect(() => {
        if (currentUserData) {
            setItems([
                {
                    label: 'Филиалы',
                    key: 'filials',
                },
                {
                    label: 'Справочники',
                    key: 'dicts',
                    children: [
                        {
                            label: 'Жильцы',
                            key: 'guests',
                        },
                        {
                            label: 'Договоры',
                            key: 'contracts',
                        },
                        {
                            label: 'Организации',
                            key: 'organizations',
                        },
                        {
                            label: 'Ответственные лица',
                            key: 'responsibilities',
                        },
                        {
                            label: 'Основания',
                            key: 'reasons',
                        },
                    ]
                },
                {
                    label: 'Отчеты',
                    key: 'reports',
                    children: [
                        {
                            label: 'Ежемесячный отчет по филиалам',
                            key: 'monthReport',
                        },
                    ]
                },
                {
                    label: 'Администрирование',
                    key: 'adm',
                    children: [
                        {
                            label: 'Пользователи',
                            key: 'users',
                        },
                    ]
                },
            ]);
            if (currentUserData.roleId === 1) {
                setItems([
                    {
                        label: 'Филиалы',
                        key: 'filials',
                    },
                    {
                        label: 'Справочники',
                        key: 'dicts',
                        children: [
                            {
                                label: 'Жильцы',
                                key: 'guests',
                            },
                            {
                                label: 'Договоры',
                                key: 'contracts',
                            },
                            {
                                label: 'Организации',
                                key: 'organizations',
                            },
                            {
                                label: 'Ответственные лица',
                                key: 'responsibilities',
                            },
                            {
                                label: 'Основания',
                                key: 'reasons',
                            },
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Ежемесячный отчет по филиалам',
                                key: 'monthReport',
                            },
                        ]
                    },
                    {
                        label: 'Администрирование',
                        key: 'adm',
                        children: [
                            {
                                label: 'Пользователи',
                                key: 'users',
                            },
                        ]
                    },
                ]);
            } else if (currentUserData.roleId === 2) {
                setItems([
                    {
                        label: 'Общежития',
                        key: 'hotels',
                    },
                ]);
            }
            // if (location.pathname === "/hotels/users") navigate(`/hotels/users`);
            // if (location.pathname === "/hotels/hotels") navigate(`/hotels/hotels`)
            // if (location.pathname.includes('guests')) navigate(`/hotels/guests`)
            // if (location.pathname.includes('filials')) navigate(`/hotels/filials`)
            // if (location.pathname.includes('hotels')) navigate(`/hotels/filials`)
            dispatch(setCurrentUser(currentUserData))
        }
    }, [currentUserData]);
    const [current, setCurrent] = useState(() => {
        if (location.pathname === "/hotels/reasons") return 'reasons';
        if (location.pathname === "/hotels/responsibilities") return 'responsibilities';
        if (location.pathname === "/hotels/organizations") return 'organizations';
        if (location.pathname === "/hotels/contracts") return 'contracts';
        if (location.pathname === "/hotels/users") return 'users';
        if (location.pathname === "/hotels/hotels") return 'hotels';
        if (location.pathname.includes('guests')) return 'guests';
        if (location.pathname.includes('filials')) return 'filials';
        if (location.pathname.includes('hotels')) return 'filials';
        return "";
    });
    const [visibleMonthReport, setVisibleMonthReport] = useState(false);
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        if (e.key === 'monthReport') {
            setVisibleMonthReport(true);
        }
        if (e.key === 'reasons') navigate(`hotels/reasons`)
        if (e.key === 'contracts') navigate(`hotels/contracts`)
        if (e.key === 'filials') navigate(`hotels/filials`)
        if (e.key === 'hotels') navigate(`hotels/hotels`)
        if (e.key === 'guests') navigate(`hotels/guests`)
        if (e.key === 'users') navigate(`hotels/users`)
        if (e.key === 'organizations') navigate(`hotels/organizations`)
        if (e.key === 'responsibilities') navigate(`hotels/responsibilities`)
    };
    return (<>
            <Menu disabled={isCurrentUserLoading} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
        </>
    );
};