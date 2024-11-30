import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Input, Modal, Select} from 'antd';
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

type ModalProps = {
    selectedRequest: RequestModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const RequestModal = (props: ModalProps) => {
    const statuses = useSelector((state: RootStateType) => state.statuses.statuses);
    const priorities = useSelector((state: RootStateType) => state.priorities.priorities);
    const types = useSelector((state: RootStateType) => state.types.types);
    const subTypes = useSelector((state: RootStateType) => state.subTypes.subTypes);
    const users = useSelector((state: RootStateType) => state.currentUser.users);
    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [solution, setSolution] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [selectedSubType, setSelectedSubType] = useState<number | null>(null);
    const [selectedClient, setSelectedClient] = useState<number | null>(null);
    const [selectedAssistant, setSelectedAssistant] = useState<number | null>(null);
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
            setSelectedExecutor(props.selectedRequest.executor.id);
            setCreateDate(dayjs(props.selectedRequest.createDate, dateTimeFormat));
            setDeadlineDate(dayjs(props.selectedRequest.deadlineDate, dateTimeFormat));
            setComment(props.selectedRequest.comment);
        }
    }, [props.selectedRequest]);
    useEffect(() => {
        if (createdRequest || updatedRequest) {
            let id = 999;
            if (createdRequest) {
                id = createdRequest.id;
            }
            const formdata = new FormData();
            formdata.append("role", "client");
            formdata.append("tg_id", "882012264");
            formdata.append("request_id", id.toString());
            formdata.append("request_name", name ?? "");
            formdata.append("link", "https://nickpyth-hakatonclient2024-e942.twc1.net/my");
            formdata.append("create_date", createDate ? createDate.format("DD-MM-YYYY HH:mm") : "");
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            //@ts-ignore
            fetch("https://evgeny1337-hackatonbot-c635.twc1.net/sendnotif", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
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
        let assistant:UserModel|undefined = users.find((user:UserModel) => user.id === selectedAssistant);
        if (assistant && client && executor && priority && status && subType && createDate && deadlineDate && name){
            let requestModel: RequestModel = {
                id: 0,
                assistant,
                client,
                comment: comment ?? "",
                createDate: createDate.format(dateTimeFormat),
                deadlineDate: deadlineDate.format(dateTimeFormat),
                description: description ?? "",
                executor,
                name,
                priority,
                solution: solution ?? "",
                status,
                subType
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
               onCancel={() => props.setVisible(false)}
               okText={props.selectedRequest ? "Сохранить" : "Создать"}
               width={'550px'}
               maskClosable={false}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Название</div>
                    <Input placeholder={"Введите название"} value={name ?? ""} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Описание</div>
                    <Input placeholder={"Введите описание"} value={description ?? ""} onChange={(e) => setDescription(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Решение</div>
                    <Input placeholder={"Заполняется исполнителем"} value={solution ?? ""} onChange={(e) => setSolution(e.target.value)}/>
                </Flex>
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
                        options={users.map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Ассистент</div>
                    <Select
                        value={selectedAssistant}
                        placeholder={"Выберите ассистента"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedAssistant(id)}
                        options={users.map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Исполнитель</div>
                    <Select
                        value={selectedExecutor}
                        placeholder={"Выберите исполнитель"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedExecutor(id)}
                        options={users.map((user: UserModel) => ({value: user.id, label: `${user.surname} ${user.name[0]}. ${user.secondName[0]}.`}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Дата создания</div>
                    <DatePicker format={dateTimeFormat} style={{width: '100%'}} value={createDate} onChange={(date:Dayjs) => setCreateDate(date)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Дэдлайн</div>
                    <DatePicker format={dateTimeFormat} style={{width: '100%'}} value={deadlineDate} onChange={(date:Dayjs) => setDeadlineDate(date)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Примечание</div>
                    <Input placeholder={"Введите примечание"} value={comment ?? ""} onChange={(e) => setComment(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};