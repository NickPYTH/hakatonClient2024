import {StatusModel} from "./StatusModel";
import {PriorityModel} from "./PriorityModel";
import {TypeModel} from "./TypeModel";
import {UserModel} from "./UserModel";

export type RequestModel = {
    id: number;
    name: string;
    description: string;
    solution: string;
    status: StatusModel;
    priority: PriorityModel;
    type: TypeModel;
    client: UserModel;
    assistant: UserModel;
    executor: UserModel;
    createDate: string;
    deadlineDate: string;
    comment: string;
}