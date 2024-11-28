import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {StatusModel} from "../model/StatusModel";

export const statusAPI = createApi({
    reducerPath: 'statusAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/statuses`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['Status'],
    endpoints: (build) => ({
        getAll: build.mutation<StatusModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['Status']
        }),
        create: build.mutation<StatusModel, StatusModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Status']
        }),
        update: build.mutation<StatusModel, StatusModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Status']
        }),
        delete: build.mutation<StatusModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Status']
        }),
    })
});