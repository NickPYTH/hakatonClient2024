import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {userAPI} from "../../service/UserService";
import {UserModel} from "../../model/UserModel";
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {RoleModel} from "../../model/RoleModel";
import {UserModal} from "../../component/UserModal";

const UserScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    const [getAll, {
        data: users,
        isLoading: isUsersLoading
    }] = userAPI.useGetUsersMutation();
    const [deleteUser, {
        data: deletedUser,
        isLoading: isUserDeleteLoading
    }] = userAPI.useDeleteUserMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedUser) getAll();
    }, [deletedUser]);
    useEffect(() => {
        if (statusVerifyTokenRequest === 'rejected') {
            setRedirectToLogin(true);
        }
    }, [statusVerifyTokenRequest])
    // -----
    useEffect(() => {
        const token: string | null = localStorage.getItem('token');
        if (token) getAll();
        else setRedirectToLogin(true);
    }, [])
    useEffect(() => {
        if (!userModalVisible) setSelectedUser(null);
    }, [userModalVisible]);
    const columns: TableProps<UserModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Логин',
            dataIndex: 'username',
            key: 'username',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.username) === undefined)
                    return acc.concat({text: userModel.username, value: userModel.username});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.username.indexOf(value) === 0
            },
            filterSearch: true,
            sorter: (a, b) => a.username.length - b.username.length,
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.name) === undefined)
                    return acc.concat({text: userModel.name, value: userModel.name});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.name.indexOf(value) === 0
            },
            filterSearch: true,
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.surname) === undefined)
                    return acc.concat({text: userModel.surname, value: userModel.surname});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.surname.indexOf(value) === 0
            },
            filterSearch: true,
            sorter: (a, b) => a.surname.length - b.surname.length,
        },
        {
            title: 'Отчество',
            dataIndex: 'secondName',
            key: 'secondName',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.secondName) === undefined)
                    return acc.concat({text: userModel.secondName, value: userModel.secondName});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.secondName.indexOf(value) === 0
            },
            filterSearch: true,
            sorter: (a, b) => a.secondName.length - b.secondName.length,
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.email) === undefined)
                    return acc.concat({text: userModel.email, value: userModel.email});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.email.indexOf(value) === 0
            },
            filterSearch: true,
            sorter: (a, b) => a.email.length - b.email.length,
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.phone) === undefined)
                    return acc.concat({text: userModel.phone, value: userModel.phone});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.phone.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
            render: (role:RoleModel, record:UserModel) => <div>{role.name}</div>,
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.role.name) === undefined)
                    return acc.concat({text: userModel.role.name, value: userModel.role.name});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.role.name.indexOf(value) === 0
            },
            filterSearch: true,
            sorter: (a, b) => a.role.name.length - b.role.name.length,
        },
        {
            dataIndex: 'delete',
            render: (_,record:UserModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteUser(record.username);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isUsersLoading || isUserDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {userModalVisible && <UserModal selectedUser={selectedUser} visible={userModalVisible} setVisible={setUserModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setUserModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={users}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setUserModalVisible(true);
                                setSelectedUser(record);
                            },
                        };
                    }}
                    pagination={{
                        defaultPageSize: 100,
                    }}
                />
            </Flex>
        </>
    );
};

export default UserScreen;