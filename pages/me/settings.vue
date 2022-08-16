<template>
  <view>
    <u-navbar :autoBack="true" title="基本信息" :fixed="false">
      <view slot="left">
        <i class="uicon-arrow-left" />
      </view>
    </u-navbar>
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
      <!-- <view class="avatar-box">
       <u-upload :fileList="avatar.list" accept="image" maxCount="1">
        <u-avatar :src="$store.state.me.avatar" :size="80"></u-avatar>
      </u-upload> 
    </view> -->
    </u-cell-group>
  </view>
</template>

<script>
  import {checkAuth} from '@/utils/auth.js'
  import {getCurrentPageUrl} from '@/utils/pages.js'
  export default {
    data() {
      return {
        urls: {
          setAvatar: '/pages/me/setAvatar',
          setName: '/pages/me/setName',
          setSignature: '/pages/me/setSignature'
        }
      }
    },
    onLoad() {
      checkAuth(uni, getCurrentPageUrl())
    },
    onPullDownRefresh() {
      uni.$once('data-fetched', uni.stopPullDownRefresh)
      uni.$emit('fetch-data', {account: true})
    },
    methods: {
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
