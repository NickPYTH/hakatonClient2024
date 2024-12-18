import React, {useEffect, useState} from 'react';
import {Checkbox, Flex, Input, Modal, Select} from 'antd';
import {UserModel} from "../model/UserModel";
import {userAPI} from "../service/UserService";
import {useSelector} from "react-redux";
import {RootStateType} from "../store/store";
import {RoleModel} from "../model/RoleModel";
import {groupAPI} from "../service/GroupService";
import {GroupModel} from "../model/GroupModel";

type ModalProps = {
    selectedUser: UserModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const UserModal = (props: ModalProps) => {
    const roles = useSelector((state: RootStateType) => state.roles.roles);
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);
    const [secondName, setSecondName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const [isBoss, setIsBoss] = useState<boolean>(false);
    const [tgName, setTgName] = useState<string | null>(null);
    const [tgId, setTgId] = useState<string | null>(null);
    const [createUser, {
        data: createdUser,
        isLoading: isCreateUserLoading
    }] = userAPI.useCreateUserMutation();
    const [updateUser, {
        data: updatedUser,
        isLoading: isUpdateUserLoading
    }] = userAPI.useUpdateUserMutation();
    const [getGroups, {
        data: groups,
        isLoading: isGetGroupsLoading
    }] = groupAPI.useGetAllMutation();
    useEffect(() => {
        getGroups();
    }, []);
    useEffect(() => {
        if (props.selectedUser) {
            setUsername(props.selectedUser.username);
            setPassword(props.selectedUser.password);
            setName(props.selectedUser.name);
            setSurname(props.selectedUser.surname);
            setSecondName(props.selectedUser.secondName);
            setEmail(props.selectedUser.email);
            setPhone(props.selectedUser.phone);
            setSelectedRole(props.selectedUser.role.id);
            setIsBoss(props.selectedUser.isBoss);
            setTgName(props.selectedUser.tgName);
            setTgId(props.selectedUser.tgId);
            if (props.selectedUser.group)
                setSelectedGroup(props.selectedUser.group.id)
        }
    }, [props.selectedUser]);
    useEffect(() => {
        if (createdUser || updatedUser) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdUser, updatedUser]);
    const confirmHandler = () => {
        if (props.selectedUser === null && password === null) return;
        if (name && username && surname && secondName && email && selectedRole && phone && selectedGroup){
            let user: UserModel = {
                id: 0,
                name,
                username,
                password,
                surname,
                secondName,
                email,
                phone,
                role: {
                    id: selectedRole,
                    name: ''
                },
                group: {
                    id: selectedGroup,
                    name: ''
                },
                isBoss,
                tgName: tgName ?? '',
                tgId: tgId ?? ''
            };
            if (props.selectedUser) updateUser({...user, id: props.selectedUser.id});
            else createUser(user);
        }
    }
    console.log(isBoss)
    return (
        <Modal title={props.selectedUser ? "Редактирование пользователя" : "Создание пользователя"}
               open={props.visible}
               loading={(isCreateUserLoading || isUpdateUserLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedUser ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Логин</div>
                    <Input placeholder={"Введите логин"} value={username ?? ""} onChange={(e) => setUsername(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Пароль</div>
                    <Input type={'password'} placeholder={props.selectedUser ? "Введите пароль если хотите его изменить" : "Введите пароль"} value={password ?? ""} onChange={(e) => setPassword(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Имя</div>
                    <Input placeholder={"Введите имя"} value={name ?? ""} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Фамилия</div>
                    <Input placeholder={"Введите фамилию"} value={surname ?? ""} onChange={(e) => setSurname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Отчество</div>
                    <Input placeholder={"Введите отчество"} value={secondName ?? ""} onChange={(e) => setSecondName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Почта</div>
                    <Input placeholder={"Введите почту"} value={email ?? ""} onChange={(e) => setEmail(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Телефон</div>
                    <Input placeholder={"Введите телефон"} value={phone ?? ""} onChange={(e) => setPhone(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Роль</div>
                    <Select
                        value={selectedRole}
                        placeholder={"Выберите роль"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedRole(id)}
                        options={roles.map((role: RoleModel) => ({value: role.id, label: role.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Группа</div>
                    <Select
                        loading={isGetGroupsLoading}
                        value={selectedGroup}
                        placeholder={"Выберите группу"}
                        style={{width: '100%'}}
                        onChange={(id) => setSelectedGroup(id)}
                        options={groups?.map((group: GroupModel) => ({value: group.id, label: group.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Руководитель группы</div>
                    <Checkbox checked={isBoss} onChange={(e) => setIsBoss(e.target.checked)} />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>TG name</div>
                    <Input placeholder={"Введите tg name"} value={tgName ?? ""} onChange={(e) => setTgName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>TG id</div>
                    <Input placeholder={"Введите tg id"} value={tgId ?? ""} onChange={(e) => setTgId(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};