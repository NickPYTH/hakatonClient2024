import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userAPI} from "../service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {authAPI} from "../service/AuthService";
import roleSlice, {RoleModelStateType} from "./slice/RoleSlice";
import {roleAPI} from "../service/RoleService";

export type RootStateType = {
    currentUser: CurrentUserModelStateType,
    roles: RoleModelStateType,
};

const rootReducer = combineReducers({
    currentUser: userSlice,
    roles: roleSlice,
    [userAPI.reducerPath]: userAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [roleAPI.reducerPath]: roleAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(userAPI.middleware)
                .concat(authAPI.middleware)
                .concat(roleAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
