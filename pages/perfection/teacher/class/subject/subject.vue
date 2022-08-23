<template>
  <view>
    <u-navbar>
      <text slot="center">
        {{_option.date}}{{_option.sn}}
      </text>
    </u-navbar>
    <u-cell-group>
      <u-cell size="large" v-for="(item, index) in list" :key="index" :isLink="true" :url="payload+item.id">
        <text slot="title">{{item.class_.nickname || item.user}}</text>
        <view slot="value" style="display: flex;">
          <view class="tag" v-if="item.is_finished">
            <u-tag type="success" v-if="item.acc>=0.9" :text="'优秀('+item.acc_str+')'" plain size="mini"></u-tag>
            <u-tag type="warning" v-else-if="item.acc>=0.7" :text="'合格('+item.acc_str+')'" plain size="mini"></u-tag>
            <u-tag type="error" v-else :text="'不合格('+item.acc_str+')'" plain size="mini"></u-tag>
          </view>
          <u-tag class="tag" v-else text="未完成" size="mini" type="error"></u-tag>
          <view class="tag tag-rating" v-if="item.is_checked">
            <u-tag v-if="item.rating=='pass'" text="Pass" plain size="mini" type="success"></u-tag>
            <u-tag v-else text="Fail" plain size="mini" type="error"></u-tag>
          </view>
          <view class="tag tag-rating" v-else-if="item.is_finished">
            <u-tag text="未检查" plain plainFill size="mini" type="error"></u-tag>
          </view>
        </view>
        <!--view slot="label" style="font-size: 12px;color: #8d8d8d">
          <view v-if="item.is_finished">
            <text>完成时间：{{item.finished | timeFormat}}</text>
          </view>
          <view v-if="item.is_checked">
            <text>检查时间：{{item.checked | timeFormat}}</text>
          </view>
        </view-->
      </u-cell>
    </u-cell-group>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        sn: '',
        date: '',
        list: []
      }
    },
    mixins: [uni.$mixin],
    async onLoad(option) {
      await this.fetchData()
    },
    async onPullDownRefresh() {
      await this.fetchData()
      uni.stopPullDownRefresh()
    },
    methods: {
      async fetchData() {
        await this.$http.get(
          `/perfection/class/${this._option.class_id}/subject/${this._option.subject}/list_day?date=${this._option.date}`
        ).then(resp => {
          this.list = resp.data
        })
      }
    },
    computed: {
      payload() {
        return '/pages/perfection/teacher/class/subject/check?data=' + JSON.stringify(this._option) + '&id='
      }
    }
  }
</script>

<style scoped>
  .tag {
    margin: 2px;
  }

  .tag-rating>>>.u-tag {
    width: 3.3em;
  }

  .tag-rating>>>.u-tag .u-tag__text {
    flex: 1;
    text-align: center;
  }
</style>
