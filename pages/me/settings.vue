<template>
  <view>
    <u-navbar title="基本信息"></u-navbar>
    <u-cell-group>
      <u-cell class="item" title="头像" :url="urls.setAvatar" :isLink="true">
        <u-avatar slot="value" :src="$store.state.me.avatar" :size="80"></u-avatar>
      </u-cell>
      <u-cell class="item" title="名字" :url="urls.setName" :isLink="true">
        <text slot="value" class="item-content">{{$store.state.me.name}}</text>
      </u-cell>
      <u-cell class="item" title="用户编号" :isLink="true">
        <text slot="value" class="item-content">{{$store.state.me.uuid}}</text>
      </u-cell>
      <u-cell class="item" title="个性签名" :url="urls.setSignature" :isLink="true">
        <text slot="value" class="item-content">{{$store.state.me.signature||'未设置个性签名'}}</text>
      </u-cell>
      <u-gap height="20"></u-gap>
      <u-button class="item" text="退出登录" type="error" plain :customStyle="{border: 'none'}" @click="logout"></u-button>
      <!-- <view class="avatar-box">
       <u-upload :fileList="avatar.list" accept="image" maxCount="1">
        <u-avatar :src="$store.state.me.avatar" :size="80"></u-avatar>
      </u-upload> 
    </view> -->
    </u-cell-group>
    <u-modal :show="modal.show" :title="modal.title" :content='modal.content' @confirm="modal.confirm" asyncClose
      showCancelButton @cancel="modal.show=false"></u-modal>
  </view>
</template>

<script>
  import {
    checkAuth
  } from '@/utils/auth.js'
  import {
    getCurrentPageUrl
  } from '@/utils/pages.js'
  export default {
    data() {
      return {
        urls: {
          setAvatar: '/pages/me/setAvatar',
          setName: '/pages/me/setName',
          setSignature: '/pages/me/setSignature'
        },
        modal: {
          show: false,
          title: '',
          content: '',
          confirm: () => {}
        }
      }
    },
    onLoad() {
      checkAuth(uni, getCurrentPageUrl())
    },
    onPullDownRefresh() {
      uni.$once('data-fetched', uni.stopPullDownRefresh)
      uni.$emit('fetch-data', {
        account: true
      })
    },
    methods: {
      logout() {
        this.modal = {
          show: true,
          title: '确认要登出吗',
          content: '其实登出我也不知道本地数据会不会被清除',
          confirm: () => {
            this.$http.post("/token/logout")
              .then(resp => {
                this.$store.commit('removeToken')
                uni.removeStorageSync('token')
                this.modal.show = false
                uni.navigateBack()
              })
              .catch(err => {

              })
          }
        }
      }

      // setAvatar(){
      //     uni.chooseImage({
      //       count: 1,
      //       sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
      //       sourceType: ['album', 'camera'],
      //       success: (res) => {
      //         uni.navigateTo({
      //           url: this.urls.setAvatar + '?img='+res.tempFilePaths[0]
      //         })
      //         // console.log(res.tempFilePaths)
      //         // _this.avatar = res.tempFilePaths[0]
      //         // _this.imgList = _this.imgList.concat(res.tempFilePaths);
      //       }
      //     })
      // }
    }
  }
</script>

<style scoped>
  .item {
    background-color: #fff;
  }

  .item-content {
    color: gray;
    max-width: 70%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
