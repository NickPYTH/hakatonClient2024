import {RoleModel} from "./RoleModel";

export type UserModel = {
    id: number;
    username: string;
    password: string | null;
    name: string;
    surname: string;
    secondName: string;
    email: string;
    phone: string;
    role: RoleModel;
}