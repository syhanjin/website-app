export function checkAuth(uni, url) {
  const token = uni.getStorageSync("token")
  if (token) {
    return true
  } else {
    uni.redirectTo({
      url: "/pages/me/login?redirect=" + url
    })
  }
}
export function hasPerfection(uni, store, url) {
  // 双重保险
  let __check = () => {
    if (store.state.me.perfection === null) {
      uni.redirectTo({
        url: "/pages/perfection/create?redirect=" + url,
        fail: (err) => (uni.showToast({
          title: err,
          icon: 'none'
        }))
      })
    }
  }
  if (store.state.me.perfection === undefined) {
    // 数据还未获取，绑定事件
    uni.$once('data-fetched', __check)
  } else {
    // 数据已经获取，直接检验
    __check()
  }
}
