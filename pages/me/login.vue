<template>
  <view class="login-box">
    <u-navbar title="账号登录"></u-navbar>
    <u-loading-page :loading="submitting" loading-text="登录中..." />
    <p class="title">登录</p>
    <u-form :labelWidth="0" :rules="rules" ref="form" :model="form">
      <u-form-item>
        <u-text mode="text" type="info" text="新用户需要点击激活邮件内的激活链接激活" align="center" />
      </u-form-item>
      <u-form-item prop="name">
        <u-input v-model="form.name">
          <i class="uicon-account" slot="prefix"></i>
        </u-input>
      </u-form-item>
      <u-form-item prop="password">
        <u-input v-model="form.password" type="password">
          <i class="uicon-lock" slot="prefix"></i>
        </u-input>
      </u-form-item>
      <u-form-item v-if="errors.length > 0" class="errors">
        <text v-for="(error, index) in errors" :key="index">{{ error }}</text>
      </u-form-item>
      <u-form-item>
        <u-button @click="submit">{{submitText}}</u-button>
      </u-form-item>
    </u-form>
    <div class="other signup">
      <text mode="text">没有账号？</text>
      <navigator :url="'/pages/me/signup?redirect='+redirect" style="color: blue">前往注册</navigator>
    </div>
    <div class="other reset-password">
      <text mode="text">忘记密码？</text>
      <navigator :url="'/pages/me/reset_password?redirect='+redirect" style="color: blue">找回密码</navigator>
    </div>
    <div class="other resend-activation">
      <text mode="text">没有收到激活邮件？</text>
      <navigator :url="'/pages/me/resend_activation?redirect='+redirect" style="color: blue">重新发送</navigator>
    </div>
  </view>
</template>

<script>
  import {
    redirectTo
  } from '@/utils/pages.js'
  // #ifdef APP-PLUS
  import {
    bindUserCid
  } from '@/utils/getui.js'
  // #endif
  export default {
    data() {
      return {
        redirect: '',
        form: {
          name: '',
          password: ''
        },
        submitText: '登录',
        submitting: false,
        errors: [],
        rules: {
          name: {
            type: 'string',
            required: true,
            message: '请填写用户名',
            trigger: ['blur']
          },
          password: {
            type: 'string',
            required: true,
            message: '密码不可为空',
            trigger: ['blur']
          }
        }
      }
    },
    async onLoad(option) {
      this.redirect = option.redirect || '/pages/index/index'
    },
    beforeCreate() {
      if (this.$store.state.isAuthenticated) {
        uni.redirectTo({
          url: this.redirect
        })
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate().then(res => {
          this.submitText = '登录中...'
          this.submitting = true
          this.$http.post('/token/login/', this.form)
            .then(resp => {
              this.submitting = false
              const token = resp.data.auth_token
              this.$store.commit('setToken', token)
              uni.setStorageSync('token', token)
              this.submitText = '登录成功'
              // #ifdef APP-PLUS
              bindUserCid(uni, this)
              // #endif
              uni.$emit('fetch-data', {
                account: true
              })
              redirectTo(uni, this.redirect)
            })
            .catch(err => {
              this.submitting = false
              const data = err.data || err
              if (data.non_field_errors !== undefined) {
                this.errors = ['用户名或密码错误']
                this.submitText = '再次尝试'
              } else {
                let errors = []
                if (typeof(data) === 'string') {
                  errors.push(data)
                } else {
                  for (const key in data) {
                    errors = errors.concat(data[key])
                  }
                }
                this.errors = errors
                this.submitText = '登录失败'
                this.submitDisabled = true
                setTimeout(() => {
                  this.submitText = '再次尝试'
                  this.submitDisabled = false
                }, 3000)
              }
            })
        })
      }
    }
  }
</script>

<style scoped>
  .login-box {
    width: 98%;
    padding: 9vh 20px 5vh;
    /* border: 3px solid green; */
    margin: 44px auto;
    border-radius: 10px;
    height: 98vh;
  }

  .title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 15px;
  }

  .other {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
