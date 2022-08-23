<template>
  <view>
    <u-navbar>
      <text slot="center">{{class_.name}}-学生管理</text>
      <navigator slot="right" :url="settingsUrl">
        <u-icon name="setting-fill"></u-icon>
      </navigator>
    </u-navbar>
    <u-cell-group>
      <block v-for="(item, index) in list">
        <view @longpress="longtap(item, index)" @longtap="longtap(item, index)">
          <u-cell>
            <u-avatar slot="icon" :src="item.perfection.user.avatar"></u-avatar>
            <view slot="title">
              <text>{{item.name()}}</text>
            </view>
          </u-cell>
        </view>
      </block>
    </u-cell-group>
    <!-- <u-index-list :index-list="indexList">
      <template v-for="(seg, index) in list">
        <u-index-item>
          <u-index-anchor :text="indexList[index]"></u-index-anchor>
          <u-cell-group>
            <block v-for="(item) in seg">
              <view @longpress="longtap(item)" @longtap="longtap(item)">
                <u-cell>
                  <u-avatar slot="icon" :src="item.perfection.user.avatar"></u-avatar>
                  <view slot="title">
                    <text>{{item.name()}}</text>
                  </view>
                  <view slot="value">
                    <u-tag v-if="item.perfection.user.uuid == $store.state.me.uuid" text="我" plain size="mini"></u-tag>
                  </view>
                </u-cell>
              </view>
            </block>
          </u-cell-group>
        </u-index-item>
      </template>
    </u-index-list> -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        // indexList: [],
        // rawList: [],
        class_: {}
      }
    },
    async onLoad(option) {
      this.id = option.id
      if (!this.id) {
        console.log(this.id)
      } else {
        await this.fetchData()
      }
    },
    async onPullDownRefresh() {
      await this.fetchData()
      uni.stopPullDownRefresh()
    },
    methods: {
      async fetchData() {
        await this.$http.get(`/perfection/class/${this.id}/students/`)
          .then(resp => {
            this.list = resp.data
            this.list.map(item => {
              item.name = () => {
                return item.nickname || item.perfection.user.name
              }
            })
            // this.rawList = resp.data
            // if (this.rawList.length) this.sortRow()
          })
        await this.$http.get(`/perfection/class/${this.id}/`)
          .then(resp => {
            this.class_ = resp.data
          })
      },

      longtap(item, index) {
        // console.log('longtap')
        uni.showModal({
          title: '设置群昵称',
          content: item.nickname,
          editable: true,
          success: (res) => {
            if (res.confirm) {
              this.$http.post(`/perfection/class/${this.id}/students/${item.perfection.id}/set/`, {
                  nickname: res.content
                })
                .then(resp => {
                  // uni.startPullDownRefresh()
                  this.list[index].nickname = res.content
                }).catch(err => {
                  uni.showModal({
                    showCancel: false,
                    title: '修改失败',
                    content: JSON.stringify(err)
                  })
                })
            }
          }
        })
      },
      /*
      sortRow() {
        let list = this.rawList
        list.map(item => {
          item.name = () => {
            return item.nickname || item.perfection.user.name
          }
        })
        list = this.pySegSort(list)
        this.indexList = list.map((item) => item.initial)
        this.list = list.map(item => item.data)
      },
      pySegSort(list) {
        if (list.length == 0) return;
        if (!String.prototype.localeCompare) return null;
        const letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split("");
        const zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");
        let segs = []; // 存放数据
        let res = {};
        let curr;
        const re = /[^\u4e00-\u9fa5]/; //中文正则
        const pattern = new RegExp(
          "[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]"); //特殊符号

        letters.filter((items, i) => {
          curr = {
            initial: '', //字母
            data: [], //数据
          };
          list.map((v, index) => {
            // 特殊字符
            if (pattern.test(v.name()[0])) {
              if ((!zh[i - 1] || zh[i - 1].localeCompare(v.name()) <= 0) && v.name().localeCompare(zh[i]) ==
                -1) {
                curr.data.push(v);
              }
            }
            // 判断首个字是否是中文 
            if (re.test(v.name()[0])) {
              // 英文 
              if (v.name()[0].toUpperCase() == items) {
                curr.data.push(v);
              }
            } else {
              // 中文
              if ((!zh[i - 1] || zh[i - 1].localeCompare(v.name()) <= 0) && v.name().localeCompare(zh[i]) ==
                -1) {
                curr.data.push(v);
              }
            }

          })

          if (curr.data.length) {
            curr.initial = letters[i]
            segs.push(curr);
            curr.data.sort((a, b) => {
              return a.name().localeCompare(b.name());
            });
          }
        })
        res = Array.from(new Set(segs)) //去重
        // console.log(res);
        return res;
      }*/
    },
    computed: {
      settingsUrl() {
        return `/pages/perfection/class/settings?id=${this.id}`
      }
    }
  }
</script>

<style>

</style>
