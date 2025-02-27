import { Button, Form, Input, message } from "antd"
import { registerDto, loginApi } from "../../api/userAPi";


const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}



const onFinish = async (values: registerDto) => {
    const data: registerDto = {
        username: values.username,
        password: values.password
    }
    try {
        const res = await loginApi(data)
        console.log(res);

        if (res.status == 201 || res.status == 200) {
            message.info('login ok')

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    } catch (error: any) {
        console.log(error);

        message.error(error.response.data.message)
    }

};


export function Login() {
    return <div id="register-container">
        <h1>图书管理系统</h1>
        <Form
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...layout2}
            >
                <Button className='btn' type="primary" htmlType="submit">
                    login
                </Button>
            </Form.Item>
        </Form>
    </div>
}
