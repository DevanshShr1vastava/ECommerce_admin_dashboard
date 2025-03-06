import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Card, Flex, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { loginAuth } from '../utils/AuthAPI'
import { useNavigate } from 'react-router-dom'
import { authToken } from '../utils/AppStores'

interface FieldType {
    username: string
    password: string
}

const schema = yup
    .object({
        username: yup.string().required(),
        password: yup
            .string()
            .min(8, 'Mulst be atleast 8 characters')
            .required(),
    })
    .required()

const Login = () => {
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        resolver: yupResolver(schema),
    })
    const AuthStore = authToken();
    const navigate = useNavigate()
    const {mutate : loginMutate} = useMutation({
        mutationFn : ({username, password}:FieldType)=> loginAuth(username, password),
        retry : false,
        onSuccess: (data)=>{
            navigate('/');
            AuthStore.setToken(data.accessToken);
            reset({
                username: '',
                password: '',
            })
        },
        onError : (error)=>{
            alert("Invalid Credentials");
        }
    })

    const onSubmitHandler = (data: FieldType) => {
        loginMutate(data)
    }

    const onReset = () => {
        reset({
            username: '',
            password: '',
        })
    }

    return (
        <Flex justify={'center'} align={'center'}>
            <Card title="Login" variant="outlined" style={{ width: 400 }}>
                <Form
                    name="loginForm"
                    onFinish={handleSubmit(onSubmitHandler)}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        validateStatus={errors.username ? 'error' : ''}
                        help={errors.username?.message}
                    >
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    )
}

export default Login
