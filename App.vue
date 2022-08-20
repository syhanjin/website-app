<script>
  // #ifdef APP-PLUS
  import {
    checkUpdate
  } from '@/utils/update.js'
  import {
    bindUserCid
  } from '@/utils/getui.js'
  import {
    redirectTo
  } from "@/utils/pages.js"
  // #endif
  export default {
    async beforeCreate() {
      this.$store.commit('initializeStore')
    },
    async onLaunch() {
      uni.$off('fetch-data')
      uni.$on('fetch-data', this.fetchData)
      // #ifdef APP-PLUS
      checkUpdate()
      if (this.$store.state.isAuthenticated) {
        bindUserCid(uni, this)
      }
      const _handlePush = function(msg) {
        if (msg.payload.action == "open_page") {
          redirectTo(uni, msg.payload.url)
        }
      };
      plus.push.addEventListener('click', _handlePush);
      plus.push.addEventListener('receive', _handlePush);
      plus.runtime.setBadgeNumber(0);
      // #endif
    },
    async onShow() {
      await this.fetchData()
    },
    onHide: function() {

    },
    onError(e) {
      let error = e;
      uni.showModal({
        title: '捕获到一个错误，请截图发送给开发者',
        content: error,
        showCancel: false
      })
    },
    methods: {
      async fetchData(data) {
        if (this.$store.state.isAuthenticated) {
          if (!data || data.account) {
            await this.$http
              .get('/users/me/')
              .then(resp => {
                this.$store.commit('setMe', resp.data)
              })
              .catch(err => {
                if (err.statusCode == 401) {
                  uni.removeStorageSync('token')
                  this.$store.commit('removeToken')
                  uni.showToast({
                    title: err.data.detail,
                    duration: 2000,
                    icon: 'error'
                  })
                }
                console.log(err)
              })
          }
          // 暂时将perfection的信息获取放到这里
          if (this.$store.state.me.perfection && (!data || data.perfection)) {
            if (this.$store.state.me.perfection.role == "student") {
              await this.$http.get('/perfection/student/me/')
                .then(resp => {
                  this.$store.commit('setPerfection', resp.data)
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        }
        uni.$emit('data-fetched')
      }
    }
  }
</script>

<style lang="scss">
  /*每个页面公共css */
  @import '@/uni_modules/uni-scss/index.scss';
  @import '@/uni_modules/uview-ui/index.scss';
  @import '@/static/uview-icons/iconfont.css';

  * {
    margin: 0;
    padding: 0;
    // font-family: '微软雅黑';
    box-sizing: border-box;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    top: 0;
    left: 0;
  }


  a {
    text-decoration: none;
    color: #524848;
  }

  body {
    background: #f6f6f6 url(@/static/images/bg.gif);
    overflow-x: auto;
  }

  // [class^="el-icon-ali"], [class*="el-icon-ali"] {
  //   font-family: "iconfont" !important;
  //   font-size: 16px;
  //   font-style: normal;
  //   -webkit-font-smoothing: antialiased;
  //   -moz-osx-font-smoothing: grayscale;
  // }
</style>
