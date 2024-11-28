import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal} from 'antd';
import {TypeModel} from "../model/TypeModel";
import {typeAPI} from "../service/TypeService";

type ModalProps = {
    selectedType: TypeModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const TypeModal = (props: ModalProps) => {
    const [name, setName] = useState<string | null>(null);
    const [createType, {
        data: createdType,
        isLoading: isCreateTypeLoading
    }] = typeAPI.useCreateMutation();
    const [updateType, {
        data: updatedType,
        isLoading: isUpdateTypeLoading
    }] = typeAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedType) {
            setName(props.selectedType.name);
        }
    }, [props.selectedType]);
    useEffect(() => {
        if (createdType || updatedType) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdType, updatedType]);
    const confirmHandler = () => {
        if (name){
            let typeModel: TypeModel = {
                id: 0,
                name,
            };
            if (props.selectedType) updateType({...typeModel, id: props.selectedType.id});
            else createType(typeModel);
        }
    }
    return (
        <Modal title={props.selectedType ? "Редактирование типа заявки" : "Создание типа заявки"}
               open={props.visible}
               loading={(isCreateTypeLoading || isUpdateTypeLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedType ? "Сохранить" : "Создать"}
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