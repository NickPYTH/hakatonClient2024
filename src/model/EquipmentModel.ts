import {UserModel} from "./UserModel";

export type EquipmentModel = {
    id: number;
    code: string;
    name: string;
    note: string;
    user: UserModel;
}