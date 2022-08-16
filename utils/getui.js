export function bindUserCid(uni, _this) {
  function _send(cid) {
    _this.$http.post("/getui/cid/", {
        cid: cid
      })
      .then(resp => {

      })
      .catch(e => {
        uni.showModal({
          title: '绑定cid错误',
          content: '请将此弹窗截图发送给开发者\ncid=' + cid + '\n' + e,
          showCancel: false
        })
      })
  }
  let interval = setInterval(() => {
    let cid = plus.push.getClientInfo().clientid;
    if (cid) {
      _send(cid)
      clearInterval(interval)
    }
  }, 5000)
}
