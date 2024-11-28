import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal} from 'antd';
import {PriorityModel} from "../model/PriorityModel";
import {priorityAPI} from "../service/PriorityService";

type ModalProps = {
    selectedPriority: PriorityModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const PriorityModal = (props: ModalProps) => {
    const [name, setName] = useState<string | null>(null);
    const [createPriority, {
        data: createdPriority,
        isLoading: isCreatePriorityLoading
    }] = priorityAPI.useCreateMutation();
    const [updatePriority, {
        data: updatedPriority,
        isLoading: isUpdatePriorityLoading
    }] = priorityAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedPriority) {
            setName(props.selectedPriority.name);
        }
    }, [props.selectedPriority]);
    useEffect(() => {
        if (createdPriority || updatedPriority) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdPriority, updatedPriority]);
    const confirmHandler = () => {
        if (name){
            let priorityModel: PriorityModel = {
                id: 0,
                name,
            };
            if (props.selectedPriority) updatePriority({...priorityModel, id: props.selectedPriority.id});
            else createPriority(priorityModel);
        }
    }
    return (
        <Modal title={props.selectedPriority ? "Редактирование приоритета заявки" : "Создание приоритета заявки"}
               open={props.visible}
               loading={(isCreatePriorityLoading || isUpdatePriorityLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedPriority ? "Сохранить" : "Создать"}
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