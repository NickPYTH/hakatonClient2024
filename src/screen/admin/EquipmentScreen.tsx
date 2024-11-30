import React, {useEffect, useState} from 'react';
import {Button, Flex, Popconfirm, Spin, Table, TableProps} from 'antd';
import {Navigate} from 'react-router-dom';
import {authAPI} from "../../service/AuthService";
import {generateNumberColumn, generateStringColumn, SORT_ORDER} from "../../config/columnFieldGenerator";
import {EquipmentModel} from "../../model/EquipmentModel";
import {equipmentAPI} from "../../service/EquipmentService";
import {EquipmentModal} from "../../component/EquipmentModal";

const EquipmentScreen: React.FC = () => {
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentModel | null>(null);
    const [getAll, {
        data: equipments,
        isLoading: isEquipmentsLoading
    }] = equipmentAPI.useGetAllMutation();
    const [deleteEquipment, {
        data: deletedEquipment,
        isLoading: isTypeDeleteLoading
    }] = equipmentAPI.useDeleteMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (deletedEquipment) getAll();
    }, [deletedEquipment]);
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
        if (!equipmentModalVisible) setSelectedEquipment(null);
    }, [equipmentModalVisible]);
    const columns: TableProps<EquipmentModel>['columns'] = [
        {...generateNumberColumn(equipments, "ИД", "id", SORT_ORDER.DESCEND)},
        {...generateStringColumn(equipments, "Название", "name")},
        {...generateStringColumn(equipments, "Код", "code")},
        {...generateStringColumn(equipments, "Примечание", "note")},
        {
            dataIndex: 'delete',
            render: (_,record:EquipmentModel) => <Flex justify={'center'}>
                <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                    deleteEquipment(record.id);
                }}>
                    <Button danger>Удалить</Button>
                </Popconfirm>
            </Flex>,
        },
    ]
    if (isEquipmentsLoading || isTypeDeleteLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <>
            <Flex vertical={true}>
                {equipmentModalVisible && <EquipmentModal selectedEquipment={selectedEquipment} visible={equipmentModalVisible} setVisible={setEquipmentModalVisible} refresh={getAll}/>}
                {redirectToLogin && <Navigate to="/login" replace={false}/>}
                <Button type={'primary'} onClick={() => setEquipmentModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={equipments}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setEquipmentModalVisible(true);
                                setSelectedEquipment(record);
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

export default EquipmentScreen;