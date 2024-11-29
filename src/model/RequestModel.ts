import {StatusModel} from "./StatusModel";
import {PriorityModel} from "./PriorityModel";
import {UserModel} from "./UserModel";
import {SubTypeModel} from "./SubTypeModel";

export type RequestModel = {
    id: number;
    name: string;
    description: string;
    solution: string;
    status: StatusModel;
    priority: PriorityModel;
    subType: SubTypeModel;
    client: UserModel;
    assistant: UserModel;
    executor: UserModel;
    createDate: string;
    deadlineDate: string;
    comment: string;
}