import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {PriorityModel} from "../model/PriorityModel";

export const priorityAPI = createApi({
    reducerPath: 'priorityAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/priority`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['Priority'],
    endpoints: (build) => ({
        getAll: build.mutation<PriorityModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['Priority']
        }),
        create: build.mutation<PriorityModel, PriorityModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Priority']
        }),
        update: build.mutation<PriorityModel, PriorityModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Priority']
        }),
        delete: build.mutation<PriorityModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Priority']
        }),
    })
});