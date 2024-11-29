import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {generateNumberColumn, generateStringColumn, SORT_ORDER} from "../../config/columnFieldGenerator";
import {SubTypeModel} from "../../model/SubTypeModel";
import {subTypeAPI} from "../../service/SubTypeService";
import {SubTypeModal} from "../../component/SubTypeModal";
import {useSelector} from "react-redux";
import {RootStateType} from "../../store/store";
import {TypeModel} from "../../model/TypeModel";

const SubTypeScreen: React.FC = () => {
    const types = useSelector((state: RootStateType) => state.types.types);
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [subTypeModalVisible, setSubTypeModalVisible] = useState(false);
    const [selectedSubType, setSelectedSubType] = useState<SubTypeModel | null>(null);
    const [getAll, {
        data: subTypes,
        isLoading: isSubTypesLoading
    }] = subTypeAPI.useGetAllMutation();
    const [deleteSubType, {
        data: deletedSubType,
        isLoading: isSubTypeDeleteLoading
    }] = subTypeAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedSubType) getAll();
    }, [deletedSubType]);
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
        if (!subTypeModalVisible) setSelectedSubType(null);
    }, [subTypeModalVisible]);
    const columns: TableProps<SubTypeModel>['columns'] = [
        {...generateNumberColumn(subTypes, "ИД", "id", SORT_ORDER.DESCEND)},
        {
            dataIndex: 'type',
            title: "Название типа",
            render: (_,record:SubTypeModel) => (<div>{types.find((type:TypeModel) => type.id === record.typeId)?.name}</div>),
        },
        {...generateStringColumn(subTypes, "Название подтипа", "name")},
        {
            dataIndex: 'delete',
            render: (_,record:SubTypeModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteSubType(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isSubTypesLoading || isSubTypeDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {subTypeModalVisible && <SubTypeModal selectedSubType={selectedSubType} visible={subTypeModalVisible} setVisible={setSubTypeModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setSubTypeModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={subTypes}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setSubTypeModalVisible(true);
                                setSelectedSubType(record);
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

export default SubTypeScreen;