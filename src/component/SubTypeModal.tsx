import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal, Select} from 'antd';
import {TypeModel} from "../model/TypeModel";
import {subTypeAPI} from "../service/SubTypeService";
import {SubTypeModel} from "../model/SubTypeModel";
import {useSelector} from "react-redux";
import {RootStateType} from "../store/store";

type ModalProps = {
    selectedSubType: SubTypeModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const SubTypeModal = (props: ModalProps) => {
    const types = useSelector((state: RootStateType) => state.types.types);
    const [name, setName] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [createSubType, {
        data: createdSubType,
        isLoading: isSubTypeLoading
    }] = subTypeAPI.useCreateMutation();
    const [updateSubType, {
        data: updatedSubType,
        isLoading: isUpdateSubTypeLoading
    }] = subTypeAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedSubType) {
            setName(props.selectedSubType.name);
            setSelectedType(props.selectedSubType.typeId);
        }
    }, [props.selectedSubType]);
    useEffect(() => {
        if (createdSubType || updatedSubType) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdSubType, updatedSubType]);
    const confirmHandler = () => {
        if (name){
            let subTypeModel: SubTypeModel = {
                id: 0,
                name,
                typeId: 999
            };
            if (props.selectedSubType) updateSubType({...subTypeModel, id: props.selectedSubType.id});
            else createSubType(subTypeModel);
        }
    }
    return (
        <Modal title={props.selectedSubType ? "Редактирование подтипа заявки" : "Создание подтипа заявки"}
               open={props.visible}
               loading={(isSubTypeLoading || isUpdateSubTypeLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedSubType ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} style={{marginBottom: 10}} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Тип заявки</div>
                    <Select
                        value={selectedType}
                        placeholder={"Выберите тип заявки"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedType(id)}
                        options={types.map((type: TypeModel) => ({value: type.id, label: type.name}))}
                    />
                </Flex>
            </Flex>
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Подтип заявки</div>
                    <Input placeholder={"Введите название"} value={name ?? ""} onChange={(e) => setName(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};