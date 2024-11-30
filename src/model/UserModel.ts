import {RoleModel} from "./RoleModel";
import {GroupModel} from "./GroupModel";

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
    group: GroupModel;
    isBoss: boolean;
    tgName: string;
    tgId: string;
}