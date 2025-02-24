<template>
    <div>
        <h1>无感刷新token</h1>
        <el-button type="primary" @click="loginFunc">登录</el-button>
        <el-button type="primary" @click="testFunc">测试refresh</el-button>
        <el-button type="primary" @click="testApi('aaa')">test aaa</el-button>
        <el-button type="primary" @click="testApi('bbb')">test bbb</el-button>
        <el-button type="primary" @click="requestAll">并发测试</el-button>
        <el-button type="primary" @click="lostToken">设置token失效</el-button>
    </div>
</template>

<script setup>
import {
    login,
    refreshToken,
    test,
} from '@/api/refreshApi.js';

const testApi = async (e = 'bbb') => {
    const res = await test(e)
    console.log(res);
    return res
}

const requestAll = async () => {
    const res = await Promise.all([testApi(), testApi(), testApi()])
    console.log(res);
}

const lostToken = () => {
    localStorage.setItem('access_token', 222);
}

const testFunc = () => {
    refreshToken({ refresh_token: localStorage.getItem('refresh_token') }).then(res => {
        console.log(res);
        const { access_token, refresh_token } = res;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
    })
}


const loginFunc = () => {
    login({ username: 'admin', password: '111111' }).then(res => {
        console.log(res);
        const { access_token, refresh_token } = res;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
    })
}

</script>

<style lang="scss" scoped></style>