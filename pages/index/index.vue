<template>
  <view class="container">
    <u-status-bar></u-status-bar>
    <view>
      <u-button type="primary" text="使用说明" @click="to_docs"></u-button>
      <!-- <web-view src="http://docs.sakuyark.com"></web-view> -->
      <!-- <jo-markdown :nodes="content"> </jo-markdown> -->
    </view>
    <u-text text="*该页面未开发" type="error"></u-text>
  </view>
</template>

<script>
  // import markdownFunc from '@/uni_modules/jo-markdown/components/jo-markdown/index.js';
  export default {
    data() {
      return {
        content: '',
        md: ''
      }
    }, 
    async onLoad() {
      // await this.fetchData()
      // this.content = markdownFunc(this.md, 'markdown')
    },
    methods: {
      to_docs(){
        uni.navigateTo({
          url: `/pages/webpage?src=http://docs.sakuyark.com`
        })
      }
      // async fetchData(){
      //   await this.$http.get("http://127.0.0.1/media/001.md")
      //   .then(resp => {
      //     this.md = resp.data
      //   })
      // }
    }
  }
</script>

<style>
  .container {
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
  }
  .docs {
    
  }
</style>
