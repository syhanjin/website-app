<template>
  <view>
    <u-navbar title="注册账号"></u-navbar>
    <u-form ref="form" :model="form" :rules="rules" class="signup" labelWidth="80px">
      <u-form-item>
        <h3>注册用户</h3>
      </u-form-item>
      <div v-if="errors.length" class="errors">
        <text v-for="(error, index) in errors" :key="index">{{ error }}</text>
      </div>
      <u-form-item label="用户名" prop="name">
        <u-input v-model="form.name" prefixIcon="account" />
      </u-form-item>
      <u-form-item label="密码" prop="pwd1">
        <u-input v-model="form.pwd1" prefixIcon="lock" password />
      </u-form-item>
      <u-form-item label="确认密码" prop="pwd2">
        <u-input v-model="form.pwd2" prefixIcon="lock" password />
      </u-form-item>
      <u-form-item label="电子邮件" prop="email">
        <u-input v-model="form.email" prefixIcon="email" />
      </u-form-item>
      <u-form-item>
        <u-row customStyle="width: 100%">
          <u-col :span="5.5">
            <u-button :disabled="submitDisabled" type="primary" @click="submitForm('form')">
              {{ submitText }}
            </u-button>
          </u-col>
          <u-col :span="1" />
          <u-col :span="5.5">
            <u-button @click="resetForm('form')">重置</u-button>
          </u-col>
        </u-row>
      </u-form-item>
    </u-form>
  </view>
</template>

<script>
  export default {
    data() {
      const checkName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'))
        }
        callback()
      }
      const checkPwd1 = (rule, value, callback) => {
        if (value && this.form.pwd2) {
          this.$refs.form.validateField('pwd2')
        }
        if (!value || value.length < 8) {
          callback(new Error('密码太短'))
        } else {
          callback()
        }
      }
      const checkPwd2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('确认密码不可为空'))
          return
        }
        if (value !== this.form.pwd1) {
          callback(new Error('密码不匹配'))
        } else {
          callback()
        }
      }
      const checkEmail = (rule, value, callback) => {
        if (!value) callback(new Error('邮箱不可为空'))
        const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z\d]+((\.|-)[A-Za-z\d]+)*\.[A-Za-z\d]+$/
        if (!reg.test(value)) {
          callback(new Error('这不是一个邮箱'))
        }
        callback()
      }
      return {
        redirect: '',
        form: {
          name: '',
          pwd1: '',
          pwd2: '',
          email: ''
        },
        errors: [],
        submitDisabled: false,
        submitText: '创建账户',
        rules: {
          name: {
            validator: checkName,
            trigger: 'blur'
          },
          pwd1: {
            validator: checkPwd1,
            trigger: 'blur'
          },
          pwd2: {
            validator: checkPwd2,
            trigger: 'blur'
          },
          email: {
            validator: checkEmail,
            trigger: 'blur'
          }
        }
      }
    },
    async onLoad(option) {
      this.redirect = option.redirect || '/pages/index/index'
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate().then(res => {
          this.submitText = '正在创建'
          this.submitDisabled = true
          this.$http
            .post('/users/', {
              name: this.form.name,
              email: this.form.email,
              password: this.form.pwd2
            })
            .then((resp) => {
              if (resp.data.uuid) {
                this.submitText = '创建成功'
                uni.showModal({
                  title: '激活账户',
                  content: '您将会收到一封激活邮件（如未收到请检查垃圾箱），您需要点击邮件内的激活链接完成激活，否则将无法登录',
                  showCancel: false,
                  success: () => {
                    uni.redirectTo({
                      url: '/pages/me/login?redirect=' + this.redirect
                    })
                  }
                })
              }
            })
            .catch((error) => {
              const data = error.data
              let errors = []
              if (typeof(data) === 'string') {
                errors.push(data)
              } else {
                for (const key in data) {
                  errors = errors.concat(data[key])
                }
              }
              this.errors = errors
              this.creating = false
              console.log(this.errors)
              this.submitText = '创建失败'
              setTimeout(() => {
                this.submitText = '重新创建'
                this.submitDisabled = false
              }, 3000)
            })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
  .signup {
    width: 98%;
    padding: 20px 10px;
    margin: 60px auto;
    border-radius: 5px;
    border: 3px solid #b4bccc;
    max-width: 450px;
  }

  .email {
    width: 100%;
  }

  .errors {
    width: 100%;
    /*margin-bottom: 22px;*/
    /*padding: 5px 5%;*/
    /*background-color: #ba3131;*/
    /*color: #fff;*/
    color: #ba3131;
  }

  .errors>text {
    display: block;
    margin-bottom: 10px;
    text-align: center;
    font-size: 14px;
  }

  .errors>text:last-child {
    margin-bottom: 0;
  }
</style>
