import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Input, Modal, Select, Steps, Upload, UploadProps} from 'antd';
import {useSelector} from "react-redux";
import {RootStateType} from "../store/store";
import {RequestModel} from "../model/RequestModel";
import dayjs, {Dayjs} from "dayjs";
import {requestAPI} from "../service/RequestService";
import {StatusModel} from "../model/StatusModel";
import {PriorityModel} from "../model/PriorityModel";
import {UserModel} from "../model/UserModel";
import {dateTimeFormat} from "../config/constants";
import {SubTypeModel} from "../model/SubTypeModel";
import {TypeModel} from "../model/TypeModel";
import {groupAPI} from "../service/GroupService";
import {GroupModel} from "../model/GroupModel";
import {equipmentAPI} from "../service/EquipmentService";
import {EquipmentModel} from "../model/EquipmentModel";

type ModalProps = {
    selectedRequest: RequestModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    setSelectedRequest: Function
}
export const RequestModal = (props: ModalProps) => {
    const statuses = useSelector((state: RootStateType) => state.statuses.statuses);
    const priorities = useSelector((state: RootStateType) => state.priorities.priorities);
    const types = useSelector((state: RootStateType) => state.types.types);
    const subTypes = useSelector((state: RootStateType) => state.subTypes.subTypes);
    const users = useSelector((state: RootStateType) => state.currentUser.users);
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [solution, setSolution] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | null>(1);
    const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [selectedSubType, setSelectedSubType] = useState<number | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | null>(null);
    const [selectedAssistant, setSelectedAssistant] = useState<number | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const [selectedExecutor, setSelectedExecutor] = useState<number | null>(null);
    const [createDate, setCreateDate] = useState<Dayjs | null>(null);
    const [deadlineDate, setDeadlineDate] = useState<Dayjs | null>(null);
    const [comment, setComment] = useState<string | null>(null);
    const [createRequest, {
        data: createdRequest,
        isLoading: isCreateRequestLoading
    }] = requestAPI.useCreateMutation();
    const [updateRequest, {
        data: updatedRequest,
        isLoading: isUpdateRequestLoading
    }] = requestAPI.useUpdateMutation();
    const [getGroups, {
        data: groups,
        isLoading: isGetGroupsLoading
    }] = groupAPI.useGetAllMutation();
    const [getEquipments, {
        data: equipments,
        isLoading: isGetEquipmentsLoading
    }] = equipmentAPI.useGetAllMutation();
    useEffect(() => {
        getGroups();
        getEquipments();
    }, []);
    useEffect(() => {
        if (currentUser){
            if (currentUser.role.id === 3) setSelectedAssistant(currentUser.id);
        }
    }, [currentUser]);
    useEffect(() => {
        if (props.selectedRequest) {
            setName(props.selectedRequest.name);
            setDescription(props.selectedRequest.description);
            setSolution(props.selectedRequest.solution);
            setSelectedStatus(props.selectedRequest.status.id);
            setSelectedPriority(props.selectedRequest.priority.id);
            if (props.selectedRequest.subType !== null) {
                setSelectedType(props.selectedRequest.subType.typeId);
                setSelectedSubType(props.selectedRequest.subType.id);
            }
            setSelectedClient(props.selectedRequest.client.id);
            setSelectedAssistant(props.selectedRequest.assistant.id);
            setSelectedGroup(props.selectedRequest.group.id);
            if (props.selectedRequest.executor)
                setSelectedExecutor(props.selectedRequest.executor.id);
            if (props.selectedRequest.equipment)
                setSelectedEquipment(props.selectedRequest.equipment.id);
            setCreateDate(dayjs(props.selectedRequest.createDate, dateTimeFormat));
            setDeadlineDate(dayjs(props.selectedRequest.deadlineDate, dateTimeFormat));
            setComment(props.selectedRequest.comment);
        }
    }, [props.selectedRequest]);
    useEffect(() => {
        if (createdRequest || updatedRequest) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdRequest, updatedRequest]);
    const confirmHandler = () => {
        let status:StatusModel|undefined = statuses.find((status:StatusModel) => status.id === selectedStatus);
        let subType:SubTypeModel|undefined = subTypes.find((subType:SubTypeModel) => subType.id === selectedSubType);
        let priority:PriorityModel|undefined = priorities.find((priority: PriorityModel) => priority.id === selectedPriority);
        let client:UserModel|undefined = users.find((user:UserModel) => user.id === selectedClient);
        let executor:UserModel|undefined = users.find((user:UserModel) => user.id === selectedExecutor);
        let group:GroupModel|undefined = groups?.find((group:GroupModel) => group.id === selectedGroup);
        let assistant:UserModel|undefined = users.find((user:UserModel) => user.id === selectedAssistant);
        let equipment:EquipmentModel|undefined = equipments?.find((equipment:EquipmentModel) => equipment.id === selectedEquipment);
        if (assistant && client && group && priority && status && subType && name){
            let requestModel: RequestModel = {
                id: 0,
                assistant,
                client,
                comment: comment ?? "",
                createDate: props.selectedRequest ? props.selectedRequest.createDate : "",
                deadlineDate: props.selectedRequest ? props.selectedRequest.deadlineDate : "",
                description: description ?? "",
                group,
                executor: executor ?? null,
                name,
                priority,
                solution: solution ?? "",
                status,
                subType,
                equipment: equipment ?? null,
            };
            if (props.selectedRequest) updateRequest({...requestModel, id: props.selectedRequest.id});
            else createRequest(requestModel);
        }
    }
    return (
        <Modal title={props.selectedRequest ? "Редактирование заявки" : "Создание заявки"}
               open={props.visible}
               loading={(isCreateRequestLoading || isUpdateRequestLoading)}
               onOk={confirmHandler}
               onCancel={() => {
                   props.setVisible(false);
                   props.setSelectedRequest(null);
               }}
               okText={props.selectedRequest ? "Сохранить" : "Создать"}
               width={'650px'}
               maskClosable={false}
        >
            <Flex gap={'small'} vertical={true}>
                {props.selectedRequest &&
                    <Steps
                        style={{marginTop: 15, marginBottom: 15}}
                        current={props.selectedRequest.status.id - 1}
                        items={[
                            {
                                title: 'Создано',
                                description: '',
                            },
                            {
                                title: 'В работе',
                                description: '',
                            },
                            {
                                title: 'Выполнено',
                                description: '',
                            },
                        ]}
                    />
                }
                <Flex align={"center"}>
                    <div style={{width: 180}}>Название</div>
                    <Input placeholder={"Введите название"} value={name ?? ""} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Описание</div>
                    <Input placeholder={"Введите описание"} value={description ?? ""} onChange={(e) => setDescription(e.target.value)}/>
                </Flex>
                {(props.selectedRequest !== null && currentUser?.role.id !== 2) &&
                    <Flex align={"center"}>
                        <div style={{width: 180}}>Статус</div>
                        <Select
                            value={selectedStatus}
                            placeholder={"Выберите статус"}
                            style={{width: '100%'}}
                            onChange={(id) => setSelectedStatus(id)}
                            options={statuses.map((status: StatusModel) => ({value: status.id, label: status.name}))}
                        />
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 180}}>Приоритет заявки</div>
                    <Select
                        value={selectedPriority}
                        placeholder={"Выберите приоритет заявки"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedPriority(id)}
                        options={priorities.map((priority: PriorityModel) => ({value: priority.id, label: priority.name}))}
                    />
                </Flex>
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
                <Flex align={"center"}>
                    <div style={{width: 180}}>Подтип заявки</div>
                    <Select
                        value={selectedSubType}
                        placeholder={"Выберите подтип заявки"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedSubType(id)}
                        options={subTypes.filter((st:SubTypeModel) => st.typeId === selectedType).map((subType: SubTypeModel) => ({value: subType.id, label: subType.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Заявитель</div>
                    <Select
                        value={selectedClient}
                        placeholder={"Выберите заявителя"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedClient(id)}
                        options={users.filter((user: UserModel) => user.role.id === 2).map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Проблемное оборудование</div>
                    <Select
                        value={selectedEquipment}
                        placeholder={"Выберите оборудование (опционально)"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedEquipment(id)}
                        options={equipments?.filter((equipment:EquipmentModel) => equipment.user.id === selectedClient).map((equipment: EquipmentModel) => ({value: equipment.id, label: `${equipment.code} ${equipment.name}`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Ассистент</div>
                    <Select
                        value={selectedAssistant}
                        placeholder={"Выберите ассистента"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedAssistant(id)}
                        options={users.filter((user: UserModel) => user.role.id === 3).map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Группа</div>
                    <Select
                        disabled={isGetGroupsLoading}
                        value={selectedGroup}
                        placeholder={"Выберите группу"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedGroup(id)}
                        options={groups?.map((group:GroupModel) => ({value: group.id, label: group.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Исполнитель</div>
                    <Select
                        value={selectedExecutor}
                        placeholder={"Выберите исполнитель"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedExecutor(id)}
                        options={users.filter((user: UserModel) => user.role.id === 4 && user.group.id === selectedGroup).map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                {props.selectedRequest !== null &&
                    <>
                        <Flex align={"center"}>
                            <div style={{width: 180}}>Дата создания</div>
                            <DatePicker disabled={true} format={dateTimeFormat} style={{width: '100%'}} value={createDate}/>
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 180}}>Дэдлайн</div>
                            <DatePicker disabled={true} format={dateTimeFormat} style={{width: '100%'}} value={deadlineDate}/>
                        </Flex>
                    </>
                }
                {props.selectedRequest !== null &&
                    <Flex align={"center"}>
                        <div style={{width: 180}}>Решение</div>
                        <Input placeholder={"Заполняется исполнителем"} value={solution ?? ""} onChange={(e) => setSolution(e.target.value)}/>
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 180}}>Примечание</div>
                    <Input placeholder={"Введите примечание"} value={comment ?? ""} onChange={(e) => setComment(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};