import { request } from "./request";


export interface AddBookDto {
    name: string
    author: string
    description: string;
    cover: string;
}

export interface UpdateBookDto extends AddBookDto {
    id: number
}

export function getBookListApi(name: string) {
    return request.get("/book/list", {
        params: {
            name
        }
    })
}

export function uploadFileApi(data: File) {
    return request.post("/book/upload", data)
}


export function findByIdApi(id: number) {
    return request.get("/book/find/" + id)
}


export function addBookApi(data: AddBookDto) {
    return request.post("/book/add", data)
}


export function updateBookApi(data: UpdateBookDto) {
    return request.put("/book/update", data)
}

export function deleteByIdBookApi(id: number) {
    return request.delete("/book/delete/" + id)
}


