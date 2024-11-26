import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
export interface CreateTokenRequest {
    username:string;
    password:string;
}
export interface CreateTokenResponse {
    token:string;
    role:string;
}
export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}${port}/users`,
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        createToken: build.mutation<CreateTokenResponse, CreateTokenRequest>({
            query: (post) => ({
                url: `/signin?username=${post.username}&password=${post.password}`,
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Auth']
        }),
        verifyToken: build.mutation<void, void>({
            query: () => ({
                url: `/verify`,
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }),
            invalidatesTags: ['Auth']
        }),
    })
});