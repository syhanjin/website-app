<template>
  <view>
    <u-navbar :autoBack="true" title="更新签名" :fixed="false">
      <view slot="left">
        <i class="uicon-arrow-left" />
      </view>
      <u-button slot="right" plain size="mini" shape="circle" @click="setSignature">发布</u-button>
    </u-navbar>
    <u-textarea v-model="signature" :focus="true" :count="true" maxlength="80" :adjustPosition="false"
      confirmType="done" height="100">
    </u-textarea>
    <!-- <u-input placeholder="请输入新签名..." v-model="text" /> -->
    <!-- <el-input v-model="newSignature" type="textarea" :rows="5" maxlength="80" showWordLimit resize="none" /> -->
  </view>
</template>

<script>
  import {checkAuth} from '@/utils/auth.js'
  import {getCurrentPageUrl} from '@/utils/pages.js'
  export default {
    data() {
      return {
        signature: this.$store.state.me.signature
      }
    },
    onLoad() {
      checkAuth(uni, getCurrentPageUrl())
    },
    methods: {
      setSignature() {
        this.$http.post('/users/set_signature/', {
            new_signature: this.signature
          })
          .then(resp => {
            this.$store.commit('setSignature', resp.signature)
            uni.navigateBack()
          })
          .catch(err => {
            console.log(err)
            // this.$message({
            //   dangerouslyUseHTMLString: true,
            //   message: err.data,
            //   type: 'error'
            // })
          })
      }
    }
  }
</script>

<style scoped>
  .u-textarea {
    margin-top: 15px;
  }
</style>
