import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {RequestModel} from "../model/RequestModel";

export const requestAPI = createApi({
    reducerPath: 'requestAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/requests`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['Request'],
    endpoints: (build) => ({
        getAll: build.mutation<RequestModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['Request']
        }),
        create: build.mutation<RequestModel, RequestModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Request']
        }),
        update: build.mutation<RequestModel, RequestModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Request']
        }),
        delete: build.mutation<RequestModel, number>({
            query: (id) => ({
                url: `/delete?Id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Request']
        }),
    })
});