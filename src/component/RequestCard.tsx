import React, {useState} from "react";
import {Card, Tag} from "antd";
import {Navigate} from "react-router-dom";
import {StatusModel} from "../model/StatusModel";

type ModalProps = {
    id: number,
    name: string,
    date: string,
    status: StatusModel,
}
export const RequestCard = (props: ModalProps) => {
    const [redirectToViewTask, setRedirectToViewTask] = useState<boolean>(false);
    return (
        <Card onClick={() => setRedirectToViewTask(true)} title={props.name} size="small">
            {redirectToViewTask && <Navigate to={`/my/request/${props.id}`} replace={false}/>}
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
                <p>
                    <div>
                        Дата создания: {props.date}
                    </div>
                    {props.status.id === 1 && <Tag color={'green'}>Создано</Tag>}
                    {props.status.id === 2 && <Tag color={'processing'}>В работе</Tag>}
                    {props.status.id === 3 && <Tag color={'magenta'}>Выполнена</Tag>}
                </p>
            </div>
        </Card>
    )
}