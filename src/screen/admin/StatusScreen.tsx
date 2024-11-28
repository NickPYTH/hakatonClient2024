import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {generateNumberColumn, generateStringColumn, SORT_ORDER} from "../../config/columnFieldGenerator";
import {TypeModel} from "../../model/TypeModel";
import {typeAPI} from "../../service/TypeService";
import { TypeModal } from '../../component/TypeModal';
import {statusAPI} from "../../service/StatusService";
import {StatusModal} from "../../component/StatusModal";

const StatusScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<TypeModel | null>(null);
    const [getAll, {
        data: statuses,
        isLoading: isStatusesLoading
    }] = statusAPI.useGetAllMutation();
    const [deleteStatus, {
        data: deletedStatus,
        isLoading: isStatusDeleteLoading
    }] = statusAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedStatus) getAll();
    }, [deletedStatus]);
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
        if (!statusModalVisible) setSelectedStatus(null);
    }, [statusModalVisible]);
    const columns: TableProps<TypeModel>['columns'] = [
        {...generateNumberColumn(statuses, "ИД", "id", SORT_ORDER.DESCEND)},
        {...generateStringColumn(statuses, "Название", "name")},
        {
            dataIndex: 'delete',
            render: (_,record:TypeModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteStatus(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isStatusesLoading || isStatusDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {statusModalVisible && <StatusModal selectedStatus={selectedStatus} visible={statusModalVisible} setVisible={setStatusModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setStatusModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={statuses}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setStatusModalVisible(true);
                                setSelectedStatus(record);
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

export default StatusScreen;