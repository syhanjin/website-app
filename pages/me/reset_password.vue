<template>
  <view>
    <u-navbar title="找回密码"></u-navbar>
    <u-text type="info" text="我们将会给您发送一封邮件" align="center"></u-text>
    <u-text type="info" text="您需要点击邮件内的链接以重置密码" align="center"></u-text>
    <u-input placeholder="请输入邮箱" v-model="email" inputAlign="center" :class="{'wrong': wrong}" />
    <u-button text="发送邮件" @click="send" :loading="loading" :disabled="disabled"></u-button>
    <u-modal :title="modal.title" :show="modal.show" :content="modal.content" @confirm="modal.show=false"></u-modal>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        wrong: false,
        disabled: false,
        loading: false,
        modal: {
          show: false,
          title: '',
          content: ''
        }
      }
    },
    methods: {
      send() {
        if (!this.email) {
          this.wrong = true
          return
        }
        const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z\d]+((\.|-)[A-Za-z\d]+)*\.[A-Za-z\d]+$/
        if (!reg.test(this.email)) {
          this.wrong = true
          this.modal = {
            show: true,
            title: "发送失败",
            content: "请输入正确的邮件地址"
          }
          return
        }
        this.loading = true
        this.wrong = false
        this.$http.post('/users/reset_password/', {
            email: this.email
          })
          .then(resp => {
            this.modal = {
              show: true,
              title: '发送成功',
              content: '请查看您的邮箱并完成密码重置，如果没有收到请检查邮箱地址是否输入错误或查找您的垃圾箱'
            }
            this.disabled = true
            this.loading = false
          })
          .catch(err => {
            this.modal = {
              show: true,
              title: "发送失败",
              content: err.data.email[0]
            }
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>
  .wrong {
    border-color: red !important;
    color: red !important;
  }

  .wrong>>>.u-input__content .uni-input-placeholder {
    color: red !important;
  }
</style>
