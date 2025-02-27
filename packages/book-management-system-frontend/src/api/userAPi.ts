import { request } from "./request";


export interface registerDto {
    username: string
    password: string
}

export function registerApi(data: registerDto) {
    return request.post("/user/register", data)
}

export function loginApi(data: registerDto) {
    return request.post("/user/login", data)
}



