<template>
  <view>
    <u-navbar @leftClick="back" :fixed="false" title="开通打卡系统"></u-navbar>
    <u-text mode="text" align="center" type="info" text="........................"></u-text>
    <div v-if="errors.length" class="errors">
      <text v-for="(error, index) in errors" :key="index">{{ error }}</text>
    </div>
    <u-button @click="create">开通</u-button>
  </view>
</template>

<script>
  import {redirectTo} from '@/utils/pages.js'
  export default {
    data() {
      return {
        redirect: '',
        errors: []
      }
    },
    onLoad(option) {
      this.redirect = option.redirect || '/pages/perfection/perfection'
      uni.$once('dataFetched', () => {
        if (this.$store.state.me.perfection) {
          this.back()
        }
      })
      uni.$emit('fetch-data')
    },
    methods: {
      back() {
        uni.$emit('fetch-data')
        redirectTo(uni,this.redirect)
      },
      create() {
        this.$http.post('/perfection/student/')
          .then(resp => {
            this.back()
          })
          .catch((error) => {
            console.log(error)
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
          })
      }
    }
  }
</script>

<style scoped>
  .errors>text {
    display: block;
    margin-bottom: 10px;
    text-align: center;
    font-size: 14px;
    color: red;
  }

  .errors>text:last-child {
    margin-bottom: 0;
  }
</style>
