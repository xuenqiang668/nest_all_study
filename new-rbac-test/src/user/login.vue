<template>
    <div class="wraps">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" style="max-width: 460px">
            <el-form-item label="账号">
                <el-input v-model="formLabelAlign.username" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="formLabelAlign.password" />
            </el-form-item>
            <!-- <el-form-item label="验证码">
        <div style="display: flex">
          <el-input v-model="formLabelAlign.code" />
          <img @click="resetCode" :src="codeUrl" alt="" />
        </div>
      </el-form-item> -->
            <el-form-item>
                <el-button @click="login_register()">登录</el-button>
                <el-button @click="login_register('register')">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import {
    onMounted,
    reactive,
    ref,
    toRaw,
} from 'vue';

import {
    KEYUTIL,
    KJUR,
} from 'jsrsasign';

const publicUrl = ref<string>('/api/user/getPublic')
const publicKey = ref<string>()

const getPK = async () => {
    await fetch(publicUrl.value, {
        method: 'GET',
        // headers: {
        //   'content-type': 'application/text',
        // }
    }).then(async (res) => {
        publicKey.value = await res.text()
    })

}



const labelPosition = ref<string>('right')

const formLabelAlign = reactive({
    username: '',
    password: '',
})

const publicKeyEncrypt = (data) => {
    // 公钥加密
    const pub = KEYUTIL.getKey(publicKey.value)
    const res = KJUR.crypto.Cipher.encrypt(data, pub)
    return res
}

const login_register = async (path = 'login') => {
    const { username, password } = toRaw(formLabelAlign)

    const data = {
        username,
        password: publicKeyEncrypt(password)
    }
    await fetch(`/api/user/${path}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
    }).then((res) => res.text())
}

onMounted(() => {

    getPK()
})

</script>

<style>
* {
    padding: 0;
    margin: 0;
}

.wraps {
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
}

html,
body,
#app {
    height: 100%;
}
</style>
