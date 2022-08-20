<template>
  <view>
    <u-navbar>
      <view slot="center">
        <text>{{_option.date}}</text>
        <text style="color: green; margin: 0 5px;">{{obj.user}} </text>
        <text>{{_option.sn}}</text>
      </view>
    </u-navbar>

    <u-skeleton rows="25" :loading="loading" :rowsHeight="30" :title="false">
      <words v-if="_option.subject=='words'" :obj="obj"></words>
      <template v-if="obj.is_finished">
        <u-text align="center" text="上传的图片" />
        <u-image v-for="img in obj.picture" :key="img.id" :src="img.url" width="100vw" mode="widthFix" height="auto">
        </u-image>
        <u-gap :height="20"></u-gap>
        <template v-if="obj.is_checked">
          <u-button v-if="obj.rating == 'pass'" type="success" plain disabled>已检查 PASS</u-button>
          <u-button v-else type="error" plain disabled>已检查 FAIL</u-button>
        </template>
        <template v-else>
          <u-text type="info" align="center" text="请评价"></u-text>
          <u-gap :height="10"></u-gap>
          <u-row justify="space-between">
            <u-col :span="5.8">
              <u-button type="error" style="border: none;" plain @click="rate('fail')">FAIL</u-button>
            </u-col>
            <u-col :span="5.8">
              <u-button type="primary" @click="rate('pass')">PASS</u-button>
            </u-col>
          </u-row>
        </template>
      </template>
      <template v-else>
        <u-button type="error" plain disabled>该{{_option.sn}}未完成</u-button>
      </template>
    </u-skeleton>
  </view>
</template>

<script>
  import mixin from './mixin.js'
  import words from './components/words.vue'
  export default {
    components: {
      words
    },
    data() {
      return {
        obj: {},
        loading: true
      }
    },
    mixins: [uni.$mixin, mixin],
    async onLoad(option) {
      await this.fetchData()
    },
    methods: {
      async fetchData() {
        await this.$http.get(this.baseURL + '/get_one?id=' + this._option.id)
          .then(resp => {
            this.obj = resp.data
            this.loading = false
          })
      },
      rate(rating){
        uni.showModal({
          title: '确认评价',
          content: '确认要将该'+this._option.sn+'评价为 '+rating+' 吗？\n一经评价不可撤回',
          success: res=>{
            if(res.confirm){
              this.$http.post(this.baseURL + '/check/', {
                rating: rating,
                id: this._option.id
              }).then(resp => {
                uni.showToast({
                  title: '评价成功',
                  success: uni.navigateBack
                })
              }).catch(err=>{
                if(err.data.non_field_errors){
                  uni.showModal({
                    showCancel: false,
                    content: err.data.non_field_errors[0]
                  })
                }else{
                  uni.showModal({
                    showCancel: false,
                    title: '捕获一个错误',
                    content: JSON.stringify(err.data)
                  })
                }
              })
            }
          }
        })
      }
    }
  }
</script>

<style>

</style>
