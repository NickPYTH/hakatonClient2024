import React, {useEffect, useState} from 'react';
import {FloatButton, Menu, MenuProps, Segmented, Space, Spin} from "antd";
import {Navigate} from "react-router-dom";
import {EditOutlined, FilterOutlined, LogoutOutlined, RedoOutlined} from "@ant-design/icons";
import {authAPI} from "../service/AuthService";
import {requestAPI} from "../service/RequestService";
import {RequestModel} from "../model/RequestModel";
import {RequestCard} from "../component/RequestCard";
import {useSelector} from "react-redux";
import {RootStateType} from "../store/store";
import {StatusModel} from "../model/StatusModel";

export const ClientScreen = () => {
    const statuses = useSelector((state: RootStateType) => state.statuses.statuses);
    const [requests, setRequests] = useState<RequestModel[]>([]);
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const [currentMenuItem, setCurrentMenuItem] = useState<number>(1);
    const [currentTopMenuItem, setCurrentTopMenuItem] = useState('mail');
    const [getMyRequests, {
        data: requestsFromRequest,
        isLoading: isRequestsLoading,
    }] = requestAPI.useGetAllMutation();
    const [redirectToCreateTask, setRedirectToCreateTask] = useState<boolean>(false);
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, []);
    useEffect(() => {
        if (statusVerifyTokenRequest === 'rejected') localStorage.clear();
        if (statusVerifyTokenRequest === 'rejected') {
            localStorage.clear()
            setRedirectToLogin(true)
        }
    }, [statusVerifyTokenRequest])
    // -----
    useEffect(() => {
        if (requestsFromRequest) setRequests(requestsFromRequest);
    }, [requestsFromRequest]);
    const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
    const topNavigationItems: MenuProps['items'] = [
        {
            label: 'Фильтр',
            key: 'filter',
            icon: <FilterOutlined/>,
        },
        {
            label: 'Обновить',
            key: 'refresh',
            icon: <RedoOutlined/>,
        },
        {
            label: 'Выйти',
            key: 'logout',
            icon: <LogoutOutlined/>,
        },
    ];
    const tonTopNavigationClick: MenuProps['onClick'] = (e) => {
        if (e.key === "logout") {
            localStorage.clear();
            setRedirectToLogin(true);
        } else if (e.key === "refresh") {
            getMyRequests();
        } else if (e.key === "filter") {
            setFilterModalVisible(true);
        }
        setCurrentTopMenuItem(e.key);
    };
    useEffect(() => {
        getMyRequests();
    }, []);
    useEffect(() => {
        if (currentMenuItem === 1) setRequests((prev:RequestModel[]) => requestsFromRequest?.filter((request:RequestModel) => request.status.id === 1) ?? []);
        if (currentMenuItem === 2) setRequests((prev:RequestModel[]) => requestsFromRequest?.filter((request:RequestModel) => request.status.id === 2) ?? []);
        if (currentMenuItem === 3) setRequests((prev:RequestModel[]) => requestsFromRequest?.filter((request:RequestModel) => request.status.id === 3) ?? []);
    }, [currentMenuItem]);
    return (
        <>
            {redirectToLogin && <Navigate to="/login" replace={false}/>}
            {redirectToCreateTask && <Navigate to="/my/createTask" replace={false}/>}
            {/*{filterModalVisible &&*/}
            {/*    <FilterModal filterByFilial={filterByFilial} filterByObject={filterByObject}*/}
            {/*                 tasks={dataGetMyTasksRequest ?? []} setFilterByFilial={setFilterByFilial}*/}
            {/*                 setFilterByObject={setFilterByObject}*/}
            {/*                 visible={filterModalVisible} setVisible={setFilterModalVisible}/>}*/}
            <Menu className="centeredItemsTop" style={{marginBottom: 5, display: 'flex', justifyContent: 'center'}}
                  defaultValue={'filter'} onClick={tonTopNavigationClick}
                  selectedKeys={[currentTopMenuItem]} mode="horizontal" items={topNavigationItems}/>
            <div className="centeredItemsTop" style={{marginBottom: 5}}>
                <Segmented onChange={(e:any) => {
                    setCurrentMenuItem(e)
                }} size={'middle'} block style={{width: '100%'}} options={statuses.map((status:StatusModel) => ({value: status.id, label: status.name}))}/>
            </div>
            <Space direction="vertical" size="middle"
                   style={{display: 'flex'}}>
                {isRequestsLoading ?
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '40vh'}}>
                        <Spin size={'large'}/>
                    </div>
                    :
                    requests?.map((request:RequestModel) =>
                        <RequestCard id={request.id} name={request.name} date={request.createDate} status={request.status} />
                    )
                }
            </Space>
            <FloatButton.Group shape="circle" style={{right: 24}}>
                <FloatButton onClick={() => setRedirectToCreateTask(true)} type="primary" icon={<EditOutlined/>}/>
            </FloatButton.Group>
        </>
    );
};