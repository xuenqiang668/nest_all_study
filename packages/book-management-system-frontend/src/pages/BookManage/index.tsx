import { Button, Card, Form, Input, message } from 'antd';
import './index.css';
import { useEffect, useState } from 'react';
import { deleteByIdBookApi, getBookListApi, UpdateBookDto } from '../../api/bookApi';
import { CreateBookModal } from './CreateBookModal';
import { DetialBookModal } from './DetialBookModal'

export function BookManage() {
    const [bookList, setBookList] = useState<UpdateBookDto[]>([])
    const [bookName, setBookName] = useState<string>('')
    const [isCreateBookModalOpen, setCraeteBookModalOpen] = useState(false);
    const [isDetailBookModalOpen, setDetailBookModalOpen] = useState(false);
    const [id, setId] = useState(0)

    const [num, setNum] = useState(0)

    async function fetchData() {
        try {
            const data = await getBookListApi(bookName)
            if (data.status == 201 || data.status == 200) {
                setBookList(data.data)
            }
        } catch (e: any) {
            message.error(e.response.data.message);
        }
    }

    useEffect(() => {
        fetchData()
    }, [bookName, num])

    const searchBook = (val: { name: string }) => {
        setBookName(val.name)
    }


    return <div id="bookManage">
        <CreateBookModal isOpen={isCreateBookModalOpen} handleClose={() => {
            setCraeteBookModalOpen(false);
            setNum(Number(Math.random() * 1000000))
        }}></CreateBookModal>

        <DetialBookModal id={id} isOpen={isDetailBookModalOpen} handleClose={() => {
            setDetailBookModalOpen(false);
            setNum(Number(Math.random() * 1000000))
        }}></DetialBookModal>

        <h1>图书管理系统</h1>
        <div className="content">
            <div className='book-search'>
                <Form
                    name="search"
                    layout='inline'
                    onFinish={searchBook}
                    colon={false}
                >
                    <Form.Item label="图书名称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit">
                            搜索图书
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ background: 'green' }} onClick={() => { setCraeteBookModalOpen(true) }} >
                            添加图书
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="book-list">
                {
                    bookList.map(item => {
                        return <Card
                            className='card'
                            hoverable
                            key={item.id}
                            style={{ width: 300 }}
                            cover={<img alt="example" src={`http://localhost:3000/${item.cover}`} />}
                        >
                            <h2>{item.name}</h2>
                            <div>{item.author}</div>
                            <div className='links'>
                                <a href="#" onClick={() => {
                                    setId(item.id)
                                    setDetailBookModalOpen(true)
                                }}>详情</a>
                                <a href="#">编辑</a>
                                <a href="#" onClick={async () => {
                                    await deleteByIdBookApi(item.id)
                                    setNum(Number(Math.random() * 1000000))
                                }}>删除</a>
                            </div>
                        </Card>
                    })
                }
            </div>
        </div>
    </div>
}
