import React, {useEffect, useState} from 'react';
import {Button, Form, Input} from 'antd';
import {Navigate} from "react-router-dom";
import {authAPI, CreateTokenRequest} from "../service/AuthService";

export const LoginScreen: React.FC = () => {
    const [redirectToAdmin, setRedirectToAdmin] = useState<boolean>(false);
    const [redirectToClient, setRedirectToClient] = useState<boolean>(false);
    const [redirectToExecutor, setRedirectToExecutor] = useState<boolean>(false);
    const [createTokenRequest, {
        data: credentials,
        error: errorCreateToken,
        isLoading: loadingCreateToken
    }] = authAPI.useCreateTokenMutation();
    // Return to login if reject token verify
    const [verifyTokenRequest, {status: statusVerifyTokenRequest}] = authAPI.useVerifyTokenMutation();
    useEffect(() => {
        verifyTokenRequest();
    }, [])
    useEffect(() => {
        if (statusVerifyTokenRequest === 'rejected') localStorage.clear();
    }, [statusVerifyTokenRequest])
    // -----
    const createTokenRequestHandler = (values: any) => {
        const request: CreateTokenRequest = {username: values.username, password: values.password}
        createTokenRequest(request);
    };
    useEffect((): any => {
        if (credentials) {
            if (credentials.token) {
                localStorage.setItem('token', credentials.token);
                localStorage.setItem('role', credentials.role);
                if (credentials.role === "0") setRedirectToAdmin(true);
                if (credentials.role === "1" || credentials.role === "2") setRedirectToClient(true);
                if (credentials.role === "3") setRedirectToExecutor(true);
            }
        }
    }, [credentials])
    return (
        <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {redirectToAdmin && <Navigate to="/admin/users" replace={false}/>}
            {(redirectToClient || redirectToExecutor) && <Navigate to="/my" replace={false}/>}
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                initialValues={{remember: true}}
                onFinish={createTokenRequestHandler}
                autoComplete="off"
            >
                <Form.Item
                    label="Логин"
                    name="username"
                    rules={[{required: true, message: 'Введите логин!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{required: true, message: 'Введите пароль!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button disabled={loadingCreateToken} type="primary" htmlType="submit">
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};