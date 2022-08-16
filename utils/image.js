export function image2Base64(url) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: 'GET',
      responseType: "arraybuffer",
      success: (res) => {
        let base64 = uni.arrayBufferToBase64(res.data)
        resolve('data:image/jpeg;base64,' + base64)
      },
      fail: (res) => reject(res.errMsg),
    })
  })
}
