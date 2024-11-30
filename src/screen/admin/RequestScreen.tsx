import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {FileTextOutlined} from '@ant-design/icons'
import {RequestModel} from "../../model/RequestModel";
import {requestAPI} from "../../service/RequestService";
import {authAPI} from "../../service/AuthService";
import {
    generateModelColumn,
    generateNumberColumn,
    generateStringColumn,
    SORT_ORDER
} from "../../config/columnFieldGenerator";
import {RequestModal} from "../../component/RequestModal";
import {host, port, secure} from "../../config/constants";

const RequestScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestModel | null>(null);
    const [getAll, {
        data: requests,
        isLoading: isRequestsLoading
    }] = requestAPI.useGetAllMutation();
    const [deleteRequest, {
        data: deletedRequest,
        isLoading: isRequestDeleteLoading
    }] = requestAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedRequest) getAll();
    }, [deletedRequest]);
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
        if (!requestModalVisible) setSelectedRequest(null);
    }, [requestModalVisible]);
    const columns: TableProps<RequestModel>['columns'] = [
        {...generateNumberColumn(requests, "ИД", "id", SORT_ORDER.DESCEND)},
        {...generateStringColumn(requests, "Название", "name")},
        {...generateStringColumn(requests, "Описание", "description")},
        {...generateStringColumn(requests, "Решение", "solution")},
        {...generateModelColumn(requests, "Статус", "status", "name")},
        {...generateModelColumn(requests, "Приоритет", "priority", "name")},
        {...generateModelColumn(requests, "Тип", "subType", "name")},
        {...generateModelColumn(requests, "Заявитель", "client", "name")},
        {...generateModelColumn(requests, "Хелпер", "assistant", "name")},
        {...generateModelColumn(requests, "Исполнитель", "executor", "name")},
        {...generateStringColumn(requests, "Дата создания", "createDate")},
        {...generateStringColumn(requests, "Крайний срок", "deadlineDate")},
        {...generateStringColumn(requests, "Дата изменения", "updateDate")},
        {...generateStringColumn(requests, "Примечание", "comment")},
        {
            dataIndex: 'delete',
            render: (_,record:RequestModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteRequest(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isRequestsLoading || isRequestDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {requestModalVisible && <RequestModal setSelectedRequest={setSelectedRequest} selectedRequest={selectedRequest} visible={requestModalVisible} setVisible={setRequestModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Flex style={{width: '100%'}} justify={'space-between'}>
                    <Button type={'primary'} onClick={() => setRequestModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                    <Button icon={<FileTextOutlined />} type={'primary'} onClick={() => {
                        const link = document.createElement('a');
                        link.href = `${secure}://${host}${port}/reports/requests`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }} style={{width: 100, margin: 10}}>Отчет</Button>
                </Flex>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={requests}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setRequestModalVisible(true);
                                setSelectedRequest(record);
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

export default RequestScreen;