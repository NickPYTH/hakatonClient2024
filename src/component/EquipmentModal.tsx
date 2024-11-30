import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal, Select} from 'antd';
import {EquipmentModel} from "../model/EquipmentModel";
import {equipmentAPI} from "../service/EquipmentService";
import {UserModel} from "../model/UserModel";
import {useSelector} from "react-redux";
import {RootStateType} from "../store/store";

type ModalProps = {
    selectedEquipment: EquipmentModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const EquipmentModal = (props: ModalProps) => {
    const users = useSelector((state: RootStateType) => state.currentUser.users);
    const [name, setName] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [createEquipment, {
        data: createdEquipment,
        isLoading: isCreateEquipmentLoading
    }] = equipmentAPI.useCreateMutation();
    const [updateEquipment, {
        data: updatedEquipment,
        isLoading: isUpdateEquipmenLoading
    }] = equipmentAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedEquipment) {
            setName(props.selectedEquipment.name);
            setCode(props.selectedEquipment.code);
            setNote(props.selectedEquipment.note);
            setSelectedUser(props.selectedEquipment.user.id);
        }
    }, [props.selectedEquipment]);
    useEffect(() => {
        if (createdEquipment || updatedEquipment) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdEquipment, updatedEquipment]);
    const confirmHandler = () => {
        let user:UserModel|undefined = users.find((u:UserModel) => u.id === selectedUser);
        if (name && code && user){
            let equipmentModel: EquipmentModel = {
                note: note ?? "",
                user,
                id: 0,
                name,
                code
            };
            if (props.selectedEquipment) updateEquipment({...equipmentModel, id: props.selectedEquipment.id});
            else createEquipment(equipmentModel);
        }
    }
    return (
        <Modal title={props.selectedEquipment ? "Редактирование оборудование" : "Создание оборудования"}
               open={props.visible}
               loading={(isCreateEquipmentLoading || isUpdateEquipmenLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedEquipment ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Название</div>
                    <Input placeholder={"Введите название"} value={name ?? ""} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Код</div>
                    <Input placeholder={"Введите код"} value={code ?? ""} onChange={(e) => setCode(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Пользователь</div>
                    <Select
                        value={selectedUser}
                        placeholder={"Выберите пользователя"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedUser(id)}
                        options={users.map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Примечание</div>
                    <Input placeholder={"Введите примечание"} value={note ?? ""} onChange={(e) => setNote(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};