import { Button, Form, Input, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { CoverUpload } from "./Coverupload";
import { addBookApi, findByIdApi, updateBookApi } from "../../api/bookApi";
import { useEffect } from "react";

interface DetialBookModalProps {
    id: number
    isOpen: boolean;
    handleClose: Function
}
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export interface UpdateBook {
    id: number
    name: string;
    author: string;
    description: string;
    cover: string;
}

export function DetialBookModal(props: DetialBookModalProps) {

    const [form] = useForm<UpdateBook>();


    const handleOk = async function () {
        await form.validateFields();

        const values = form.getFieldsValue();
        try {
            await updateBookApi({ ...values, id: props.id })

            message.success("add ok")
            props.handleClose()
        } catch (e: any) {
            message.error('add error')
        }
    }

    async function query() {
        if (!props.id) {
            return;
        }
        try {
            const res = await findByIdApi(props.id);
            const { data } = res;
            if (res.status === 200 || res.status === 201) {
                form.setFieldValue('id', data.id);
                form.setFieldValue('name', data.name);
                form.setFieldValue('author', data.author);
                form.setFieldValue('description', data.description);
                form.setFieldValue('cover', data.cover);
            }
        } catch (e: any) {
            message.error(e.response.data.message);
        }
    }

    useEffect(() => {
        query();
    }, [props.id]);



    return <Modal title="update" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText={'update'}>
        <Form
            form={form}
            colon={false}
            {...layout}
        >
            <Form.Item
                label="图书名称"
                name="name"
                rules={[
                    { required: true, message: '请输入图书名称!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="作者"
                name="author"
                rules={[
                    { required: true, message: '请输入图书作者!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="描述"
                name="description"
                rules={[
                    { required: true, message: '请输入图书描述!' },
                ]}
            >
                <TextArea />
            </Form.Item>
            <Form.Item
                label="封面"
                name="cover"
                rules={[
                    { required: true, message: '请上传图书封面!' },
                ]}
            >
                <CoverUpload />
            </Form.Item>
        </Form>
    </Modal>
}
