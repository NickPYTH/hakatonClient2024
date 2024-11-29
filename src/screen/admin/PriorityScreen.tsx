import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {generateNumberColumn, generateStringColumn, SORT_ORDER} from "../../config/columnFieldGenerator";
import {priorityAPI} from "../../service/PriorityService";
import {PriorityModal} from "../../component/PriorityModal";
import {PriorityModel} from "../../model/PriorityModel";

const PriorityScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [priorityModalVisible, setPriorityModalVisible] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState<PriorityModel | null>(null);
    const [getAll, {
        data: priorities,
        isLoading: isPrioritiesLoading
    }] = priorityAPI.useGetAllMutation();
    const [deletePriority, {
        data: deletedPriority,
        isLoading: isPriorityDeleteLoading
    }] = priorityAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedPriority) getAll();
    }, [deletedPriority]);
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
        if (!priorityModalVisible) setSelectedPriority(null);
    }, [priorityModalVisible]);
    const columns: TableProps<PriorityModel>['columns'] = [
        {...generateNumberColumn(priorities, "ИД", "id", SORT_ORDER.DESCEND)},
        {...generateStringColumn(priorities, "Название", "name")},
        {...generateNumberColumn(priorities, "Длительность", "term", SORT_ORDER.DISABLE)},
        {
            dataIndex: 'delete',
            render: (_,record:PriorityModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deletePriority(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isPrioritiesLoading || isPriorityDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {priorityModalVisible && <PriorityModal selectedPriority={selectedPriority} visible={priorityModalVisible} setVisible={setPriorityModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setPriorityModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={priorities}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setPriorityModalVisible(true);
                                setSelectedPriority(record);
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

export default PriorityScreen;