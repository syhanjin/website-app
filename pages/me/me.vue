<template>
  <view>
    <u-status-bar></u-status-bar>
    <u-cell-group>
      <u-cell class="item" :url="accountUrl">
        <view slot="title" class="account">
          <u-avatar :size="50" :src="$store.state.me.avatar" :defaultUrl="require('@/static/avatar-default.jpg')" />
          <view class="info" v-if="$store.state.isAuthenticated">
            <p class="name">{{ $store.state.me.name }}</p>
            <p class="uuid">{{ $store.state.me.uuid }}</p>
            <!-- <navigator class="signature" url="/pages/me/setSignature">
            <i class="uicon-edit-pen"></i>{{ $store.state.me.signature }}
          </navigator> -->
            <p class="signature">{{ $store.state.me.signature || '未设置个性签名' }}</p>
          </view>
          <view class="info" v-else>
            未登录
          </view>
        </view>
        <i class="uicon-arrow-right" slot="right-icon" />
      </u-cell>
    </u-cell-group>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    onPullDownRefresh() {
      uni.$once('data-fetched', uni.stopPullDownRefresh)
      uni.$emit('fetch-data', {account: true})
    },
    methods: {},
    computed: {
      accountUrl() {
        return this.$store.state.isAuthenticated ? '/pages/me/settings' : '/pages/me/login?redirect=/pages/me/me'
      }
    }
  }
</script>

<style scoped>
  /* .item {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: #fff;
    justify-content: space-between;
    padding: 0 15px;
  }*/
  .item {
    background-color: #fff;
  }

  .account {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .account .info {
    display: flex;
    flex-direction: column;
    /* height: 80px; */
    flex: 1;
    margin-left: 20px;
  }

  .account .info>* {
    margin-bottom: 5px;
  }

  .account .info .name {
    font-size: 16px;
    line-height: 16px;
  }

  .account>.info>.uuid {
    font-size: 10px;
    line-height: 10px;
    color: gray;
  }

  .account>.info>.signature {
    font-size: 12px;
    line-height: 12px;
  }
</style>
