import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {generateNumberColumn, generateStringColumn, SORT_ORDER} from "../../config/columnFieldGenerator";
import {TypeModel} from "../../model/TypeModel";
import {typeAPI} from "../../service/TypeService";
import { TypeModal } from '../../component/TypeModal';

const TypeScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<TypeModel | null>(null);
    const [getAll, {
        data: types,
        isLoading: isTypesLoading
    }] = typeAPI.useGetAllMutation();
    const [deleteType, {
        data: deletedType,
        isLoading: isTypeDeleteLoading
    }] = typeAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedType) getAll();
    }, [deletedType]);
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
        if (!typeModalVisible) setSelectedType(null);
    }, [typeModalVisible]);
    const columns: TableProps<TypeModel>['columns'] = [
        {...generateNumberColumn(types, "ИД", "id", SORT_ORDER.DESCEND)},
        {...generateStringColumn(types, "Название", "name")},
        {
            dataIndex: 'delete',
            render: (_,record:TypeModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteType(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isTypesLoading || isTypeDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {typeModalVisible && <TypeModal selectedType={selectedType} visible={typeModalVisible} setVisible={setTypeModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setTypeModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={types}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setTypeModalVisible(true);
                                setSelectedType(record);
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

export default TypeScreen;