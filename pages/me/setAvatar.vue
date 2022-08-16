<template>
  <view>
    <u-navbar :autoBack="true" title="修改头像" :fixed="false">
      <view slot="left">
        <i class="uicon-arrow-left" />
      </view>
    </u-navbar>
    <!-- #ifdef APP-PLUS -->
    该页面与APP端不兼容，需要更改头像请到网页端
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <u-loading-page loading-text="" :loading="loading"></u-loading-page>
    <view class="set-avatar-box">
      <view class="avatar-preview-box">
        <view :style="avatarPreviewStyle" class="avatar-preview">
          <view :style="avatarPreview.div">
            <img :src="avatar" :style="avatarPreview.img">
          </view>
        </view>
      </view>
      <VueCropper ref="avatarCropper" class="avatar-cropper" :img="avatar" :outputSize="1" outputType="jpeg"
        :autoCrop="true" :fixed="true" :centerBox="true" mode="128px" @realTime="avatarRealTime"></VueCropper>
      <!-- <yq-avatar selWidth="200px" selHeight="200px" @upload="upload" :avatarSrc="avatarUrl" ref="avatar" :inner="true"
      avatarStyle="width: 128px; height: 128px; border-radius: 50%;" expWidth="128px" expHeight="128px"></yq-avatar> -->
    </view>
    <view class="options">
      <u-button @click="chooseImg">选择</u-button>
      <u-button @click="submit">上传</u-button>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
  // #ifdef H5
  import VueCropper from "@/node_modules/vue-cropper/src/vue-cropper"
  // #endif
  import { checkAuth } from '@/utils/auth.js'
  import { getCurrentPageUrl } from '@/utils/pages.js'
  export default {
    // #ifdef H5
    components: {
      VueCropper
    },
    // #endif
    data() {
      return {
        // #ifdef H5
        avatar: '',
        avatarPreview: {},
        avatarPreviewStyle: {},
        loading: false
        // #endif
      }
    },
    onLoad() {
      checkAuth(uni, getCurrentPageUrl())
    },
    methods: {
      // #ifdef H5
      chooseImg() {
        uni.chooseImage({
          count: 1,
          sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'],
          crop: {
            width: 128,
            height: 128
          },
          success: (res) => {
            // console.log(res.tempFilePaths)
            this.avatar = res.tempFilePaths[0]
            // _this.imgList = _this.imgList.concat(res.tempFilePaths);
          }
        })
      },
      submit() {
        if (this.avatar === '') {
          return
        }
        this.loading = true
        this.$refs.avatarCropper.getCropBlob(data => {
          let img = URL.createObjectURL(data);
          // console.log(img)
          this.$http.uploadFile('/users/set_avatar/', {
              name: 'new_avatar',
              filePath: img,
            })
            // let formData = new FormData()
            // let file = new window.File([data], 'avatar.jpg', {
            //   type: 'image/jpeg'
            // })
            // formData.append('new_avatar', file)
            // this.$http
            //   .post(
            //     '/users/set_avatar/', formData
            //   )
            .then(resp => {
              this.$nextTick(() => {
                this.loading = false
                uni.navigateBack()
                // this.$store.commit('setAvatar', this.BASEURL + resp.data.avatar)
              })
            })
            .catch((err) => {
              console.log(err)
              this.loading = false
              //     // this.$message({
              //     //   dangerouslyUseHTMLString: true,
              //     //   message: err.response.data,
              //     //   type: 'error'
              //     // })
            })
        })
      },
      avatarRealTime(data) {
        const preview = data
        this.avatarPreviewStyle = {
          width: preview.w + 'px',
          height: preview.h + 'px',
          overflow: 'hidden',
          margin: '0',
          zoom: 128 / preview.w
        }

        this.avatarPreview = data
      }
      // #endif
    }
  }
</script>

<style scoped>
  .title {
    font-size: 18px;
    font-weight: 400;
    margin: 15px 0;
  }

  .set-avatar-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .avatar-cropper {
    height: 100vw !important;
    width: 100vw !important;
    display: block;
    /* margin-right: 30px; */
  }

  .avatar-preview-box {
    margin: 5px;
    height: 25vw;
    width: 25vw;
    border-radius: 50%;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
  }

  .avatar-preview {
    border-radius: 50%;
    margin: auto;
  }

  .placeholder {
    flex: 1;
  }

  .options {
    display: flex;
    width: 100%;
    position: absolute;
    bottom: 0;
  }
</style>
