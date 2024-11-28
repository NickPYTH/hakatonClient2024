import React, {useState} from "react";
import {Button, Card, Flex} from "antd";
import {Navigate} from "react-router-dom";
import {isMobile} from "react-device-detect";
import {RequestModel} from "../model/RequestModel";

type ModalProps = {
    request: RequestModel,
    setSelectedRequest: Function,
    setVisibleRequestModal: Function
}
export const RequestCard = (props: ModalProps) => {
    return (
        <Card style={{width: isMobile ? window.innerWidth-50 : 350, marginBottom: 10}} title={props.request.name} size="small">
            <Flex vertical>
                <div><strong>ИД заявки</strong>: {props.request.id}</div>
                <div><strong>Описание</strong>: {props.request.description}</div>
                <div><strong>Дата создания:</strong> {props.request.createDate}</div>
                <div><strong>Исполнитель</strong>: {`${props.request.executor.surname} ${props.request.executor.name[0]}. ${props.request.executor.secondName[0]}`}.</div>
                <Button type={'primary'} style={{width: 130, marginTop: 15}}
                        onClick={() => {
                            props.setSelectedRequest(props.request);
                            props.setVisibleRequestModal(true);
                        }}>
                    Открыть
                </Button>
            </Flex>
        </Card>
    )
}