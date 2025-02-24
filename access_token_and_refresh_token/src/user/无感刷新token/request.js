//axios-init.js
import axios from 'axios';

import { refreshToken } from '@/api/refreshApi.js';

const service = axios.create({
    baseURL: '/', // api 的 base_url
    timeout: 30 * 1000, // 请求超时时间
});
//配置发送请求前的拦截器 可以设置token信息
service.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem('access_token')
        // 这里配置全局loading
        if (access_token) {
            config.headers['authorization'] = 'Bearer ' + access_token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 配置响应拦截器
// 是否正在刷新的标记
let isRefreshing = false
// 重试队列
let requests = []
service.interceptors.response.use(
    (res) => {
        return Promise.resolve(res.data)
    },
    async (error) => {
        let { data, config } = error.response
        if (isRefreshing) {
            // 在这儿收集 token失效的promise的  resolve
            return new Promise((resolve) => {
                requests.push({
                    config,
                    resolve
                })
            })
        }

        if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
            isRefreshing = true
            const res = await refreshToken({ refresh_token: localStorage.getItem('refresh_token') })

            if (res) {
                const { access_token, refresh_token } = res;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                error.config.headers['authorization'] = 'Bearer ' + localStorage.getItem("access_token")
                isRefreshing = false

                // 设置好最新token  然后再 执行resolve  释放
                requests.forEach(({ config, resolve }) => {
                    config.headers['authorization'] = 'Bearer ' + localStorage.getItem("access_token")
                    resolve(axios(config))
                })
                requests.length = 0
                return axios(config)
            } else {
                // 登录去
            }

        } else {
            return Promise.reject(error.response.data);
        }


    }
);

export default service;
