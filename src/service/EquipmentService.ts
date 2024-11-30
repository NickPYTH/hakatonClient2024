import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {EquipmentModel} from "../model/EquipmentModel";

export const equipmentAPI = createApi({
    reducerPath: 'equipmentAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/equipments`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['Equipment'],
    endpoints: (build) => ({
        getAll: build.mutation<EquipmentModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['Equipment']
        }),
        get: build.mutation<EquipmentModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Equipment']
        }),
        create: build.mutation<EquipmentModel, EquipmentModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Equipment']
        }),
        update: build.mutation<EquipmentModel, EquipmentModel>({
            query: (body) => ({
                url: `/update`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Equipment']
        }),
        delete: build.mutation<EquipmentModel, number>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Equipment']
        }),
    })
});