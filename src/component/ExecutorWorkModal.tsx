import React, {useEffect, useState} from 'react';
import {Flex, Modal} from 'antd';
import {EquipmentModel} from "../model/EquipmentModel";
import {Pie} from "@ant-design/plots";
import {requestAPI} from "../service/RequestService";
import dayjs, {Dayjs} from "dayjs";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const ExecutorWorkModal = (props: ModalProps) => {
    const [data, setData] = useState<any[]>([]);
    const [getAll, {
        data: requests,
        isLoading: isRequestsLoading
    }] = requestAPI.useGetAllMutation();
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (requests){
            let countAfterDeadlines = requests.reduce((acc, request) => {
                let date = dayjs(request.deadlineDate, "DD-MM-YYYY HH:mm");
                if (!dayjs().isAfter(date)) return acc + 1;
                return acc;
            }, 0)
            console.log(countAfterDeadlines)
            setData([
                {type: "Просрочены", value: countAfterDeadlines},
                {type: "Выполнены", value: requests.length - countAfterDeadlines},
            ])
        }
    }, [requests]);
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };
    return (
        <Modal title={"Общая исполнительская дисциплина"}
               open={props.visible}
               footer={()=>{}}
               onCancel={() => props.setVisible(false)}
               width={'550px'}
               loading={isRequestsLoading}
        >
            <Pie {...config} />
        </Modal>
    );
};