import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal} from 'antd';
import {GroupModel} from "../model/GroupModel";
import {groupAPI} from "../service/GroupService";

type ModalProps = {
    selectedGroup: GroupModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const GroupModal = (props: ModalProps) => {
    const [name, setName] = useState<string | null>(null);
    const [createGroup, {
        data: createdGroup,
        isLoading: isCreateGroupLoading
    }] = groupAPI.useCreateMutation();
    const [updateGroup, {
        data: updatedGroup,
        isLoading: isUpdateGroupLoading
    }] = groupAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedGroup) {
            setName(props.selectedGroup.name);
        }
    }, [props.selectedGroup]);
    useEffect(() => {
        if (createdGroup || updatedGroup) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdGroup, updatedGroup]);
    const confirmHandler = () => {
        if (name){
            let groupModel: GroupModel = {
                id: 0,
                name,
            };
            if (props.selectedGroup) updateGroup({...groupModel, id: props.selectedGroup.id});
            else createGroup(groupModel);
        }
    }
    return (
        <Modal title={props.selectedGroup ? "Редактирование рабочей группы" : "Создание рабочей группы"}
               open={props.visible}
               loading={(isCreateGroupLoading || isUpdateGroupLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedGroup ? "Сохранить" : "Создать"}
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