import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userAPI} from "../service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {authAPI} from "../service/AuthService";
import roleSlice, {RoleModelStateType} from "./slice/RoleSlice";
import {roleAPI} from "../service/RoleService";
import {requestAPI} from "../service/RequestService";
import {statusAPI} from "../service/StatusService";
import {priorityAPI} from "../service/PriorityService";
import {typeAPI} from "../service/TypeService";
import statusSlice, {StatusModelStateType} from "./slice/StatusSlice";
import prioritySlice, {PriorityModelStateType} from "./slice/PrioritySlice";
import typeSlice, {TypeModelStateType} from "./slice/TypeSlice";

export type RootStateType = {
    currentUser: CurrentUserModelStateType,
    roles: RoleModelStateType,
    statuses: StatusModelStateType,
    priorities: PriorityModelStateType,
    types: TypeModelStateType,
};

const rootReducer = combineReducers({
    currentUser: userSlice,
    roles: roleSlice,
    statuses: statusSlice,
    priorities: prioritySlice,
    types: typeSlice,
    [userAPI.reducerPath]: userAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [roleAPI.reducerPath]: roleAPI.reducer,
    [requestAPI.reducerPath]: requestAPI.reducer,
    [statusAPI.reducerPath]: statusAPI.reducer,
    [priorityAPI.reducerPath]: priorityAPI.reducer,
    [typeAPI.reducerPath]: typeAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(userAPI.middleware)
                .concat(authAPI.middleware)
                .concat(roleAPI.middleware)
                .concat(requestAPI.middleware)
                .concat(statusAPI.middleware)
                .concat(priorityAPI.middleware)
                .concat(typeAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
