import {SortOrder} from "antd/es/table/interface";

export enum SORT_ORDER {
    DESCEND = 'descend',
    ASCEND = 'ascend',
    DISABLE = 'disable'
}

export const generateModelColumn = (collection: any[] | undefined, title: string, dataIndex: string, filterSearchField:string) => {
    return {
        title,
        dataIndex,
        key: dataIndex,
        filters: collection?.reduce((acc: { text: string, value: string }[], model: any) => {
            if (acc.find((g: { text: string, value: string }) => g.text === model[dataIndex][filterSearchField]) === undefined)
                return acc.concat({text: model[dataIndex][filterSearchField], value: model[dataIndex][filterSearchField]});
            return acc;
        }, []),
        onFilter: (value: any, record: any) => {
            return record[dataIndex][filterSearchField].indexOf(value) === 0
        },
        filterSearch: true,
        sorter: (a:any, b:any) => a[dataIndex][filterSearchField].length - b[dataIndex][filterSearchField].length,
        render: (val:any, record:any) => (<div>{val[filterSearchField]}</div>)
    }
}

export const generateStringColumn = (collection: any[] | undefined, title: string, dataIndex: string) => {
    return {
        title,
        dataIndex,
        key: dataIndex,
        filters: collection?.reduce((acc: { text: string, value: string }[], model: any) => {
            if (acc.find((g: { text: string, value: string }) => g.text === model[dataIndex]) === undefined)
                return acc.concat({text: model[dataIndex], value: model[dataIndex]});
            return acc;
        }, []),
        onFilter: (value: any, record: any) => {
            return record[dataIndex].indexOf(value) === 0
        },
        filterSearch: true,
        sorter: (a:any, b:any) => a[dataIndex].length - b[dataIndex].length,
    }
}

export const generateNumberColumn = (collection: any[] | undefined, title: string, dataIndex: string, defaultSortOrder: SORT_ORDER) => {
    return {
        title,
        dataIndex,
        key: dataIndex,
        filters: collection?.reduce((acc: { text: string, value: string }[], model: any) => {
            if (acc.find((g: { text: string, value: string }) => g.text === model[dataIndex]) === undefined)
                return acc.concat({text: model[dataIndex], value: model[dataIndex]});
            return acc;
        }, []),
        onFilter: (value: any, record: any) => {
            return record[dataIndex].indexOf(value) === 0
        },
        filterSearch: true,
        sorter: (a:any, b:any) => a[dataIndex] - b[dataIndex],
        defaultSortOrder: defaultSortOrder as SortOrder
    }
}