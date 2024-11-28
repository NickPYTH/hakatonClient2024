import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal} from 'antd';
import {TypeModel} from "../model/TypeModel";
import {StatusModel} from "../model/StatusModel";
import {statusAPI} from "../service/StatusService";

type ModalProps = {
    selectedStatus: StatusModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const StatusModal = (props: ModalProps) => {
    const [name, setName] = useState<string | null>(null);
    const [createStatus, {
        data: createdStatus,
        isLoading: isCreateStatusLoading
    }] = statusAPI.useCreateMutation();
    const [updateStatus, {
        data: updatedStatus,
        isLoading: isUpdateStatusLoading
    }] = statusAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedStatus) {
            setName(props.selectedStatus.name);
        }
    }, [props.selectedStatus]);
    useEffect(() => {
        if (createdStatus || updatedStatus) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdStatus, updatedStatus]);
    const confirmHandler = () => {
        if (name){
            let typeModel: TypeModel = {
                id: 0,
                name,
            };
            if (props.selectedStatus) updateStatus({...typeModel, id: props.selectedStatus.id});
            else createStatus(typeModel);
        }
    }
    return (
        <Modal title={props.selectedStatus ? "Редактирование статуса заявки" : "Создание статуса заявки"}
               open={props.visible}
               loading={(isCreateStatusLoading || isUpdateStatusLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedStatus ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Название</div>
                    <Input placeholder={"Введите название"} value={name ?? ""} onChange={(e) => setName(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};