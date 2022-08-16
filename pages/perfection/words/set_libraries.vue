<template>
  <view>
    <u-navbar autoBack :fixed="false" title="选择词库">
      <u-button slot="right" plain size="mini" shape="circle" @click="setLibraries">设置词库</u-button>
    </u-navbar>
    <u-checkbox-group class="library-box" v-model="form_libraries" placement="column" @change="changed = true">
      <u-skeleton rows="15" :title="false" :loading="!libraries.length">
        <u-checkbox class="library" v-for="(lib, index) in libraries" :key="index" :label="label(lib)" :name="lib.id">
        </u-checkbox>
      </u-skeleton>
    </u-checkbox-group>
  </view>
</template>

<script>
  import {
    redirectTo
  } from '@/utils/pages.js'
  export default {
    data() {
      return {
        form_libraries: [],
        libraries: [],
        changed: false
      }
    },
    async onLoad() {
      await this.fetchData()
      this.form_libraries = this.$store.state.perfection.word_libraries.map(item => {
        return item.id
      })
    },
    onBackPress() {
      if (this.changed) {
        uni.showModal({
          title: '有未保存的内容',
          content: '您还没有保存词库信息，确定要返回吗？',
          confirmColor: '#000000',
          cancelColor: '#007aff',
          success: (res) => {
            if (res.confirm) {
              this.changed = false // 必须设置为false，否则下面的navigateBack会被拦住
              uni.navigateBack()
            }
          }
        })
        return true
      }
    },
    methods: {
      async fetchData() {
        await this.$http.get('/perfection/word_libraries/')
          .then(resp => {
            this.libraries = resp
          })
      },
      label(lib) {
        return lib.name + ' (共' + lib.total + '词)'
      },
      setLibraries() {
        if (this.form_libraries.length === 0) {
          uni.showModal({
            title: '请至少选择一个词库',
            content: '什么词库都不选，你是想摸鱼吗！\n「摸完能借我炸一下吗」',
            showCancel: false
          })
          return
        }
        this.$http.post('/perfection/student/set_words_library/', {
            word_libraries: this.form_libraries
          })
          .then(resp => {
            this.changed = false
            uni.$emit('fetch-data', {perfection: true})
            uni.showToast({
              title: '设置成功',
              success: uni.navigateBack()
            })
          })
      }
    }
  }
</script>

<style scoped>
  .library-box {
    padding: 3vh 5vw;
  }

  .library {
    margin-bottom: 8px;
  }
</style>
