import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {generateNumberColumn, generateStringColumn, SORT_ORDER} from "../../config/columnFieldGenerator";
import {GroupModel} from "../../model/GroupModel";
import {groupAPI} from "../../service/GroupService";
import {GroupModal} from "../../component/GroupModal";

const GroupScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
    const [getAll, {
        data: groups,
        isLoading: isGroupsLoading
    }] = groupAPI.useGetAllMutation();
    const [deleteGroup, {
        data: deletedGroup,
        isLoading: isGroupDeleteLoading
    }] = groupAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedGroup) getAll();
    }, [deletedGroup]);
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
        if (!groupModalVisible) setSelectedGroup(null);
    }, [groupModalVisible]);
    const columns: TableProps<GroupModel>['columns'] = [
        {...generateNumberColumn(groups, "ИД", "id", SORT_ORDER.DESCEND)},
        {...generateStringColumn(groups, "Название", "name")},
        {
            dataIndex: 'delete',
            render: (_,record:GroupModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteGroup(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isGroupsLoading || isGroupDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {groupModalVisible && <GroupModal selectedGroup={selectedGroup} visible={groupModalVisible} setVisible={setGroupModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setGroupModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={groups}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setGroupModalVisible(true);
                                setSelectedGroup(record);
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

export default GroupScreen;