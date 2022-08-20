<template>
  <view>
    <u-navbar title="加入班级"></u-navbar>
    <u-text text="班级id"></u-text>
    <u-input placeholder="请输入老师给你的班级id" v-model="id" inputAlign="center" :class="{'wrong': wrong}" />
    <u-button text="加入" @click="join"></u-button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        id: '',
        wrong: false
      }
    },
    methods: {
      join() {
        if (this.id.length === 0) {
          this.wrong = true
          return
        }
        this.$http.get('/perfection/class/' + this.id + '/add')
        .then(resp => {
          uni.navigateBack({
            success: (uni.$emit('perfection-class-refresh'))
          })
        })
        .catch(err => {
          if(err.statusCode === 404){
            uni.showModal({
              showCancel: false,
              title: '班级不存在',
              content: '请检查id是否输入错误'
            })
          }else if(err.statusCode === 400){
            uni.showModal({
              showCancel: false,
              title: '出现错误',
              content: err.data.non_field_errors[0]
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .wrong {
    border-color: red !important;
    color: red !important;
  }

  .wrong>>>.u-input__content .uni-input-placeholder {
    color: red !important;
  }
</style>
