export const APPID = 'e2393d5d-e566-4b99-97dc-fc9d768c6177'
// export const APPID = '55ec3e12-3823-4893-90ad-6973887c25fa'
// import {baseURL} from '@/request.js'
const baseURL = 'http://sakuyark.com/api/v1'
export function checkUpdate() {
  let info = uni.getAppBaseInfo()
  uni.request({
    url: baseURL + '/app/' + APPID + '/latest/?VersionCode=' + info.appVersionCode,
    success: (resp) => {
      if (Number(info.appVersionCode) < resp.data.version_code) {
        function showModal() {
          let content = '当前版本：' + info.appVersion
          content += '\n==更新内容==\n' + resp.data.updates
          if (resp.data.is_force) {
            content += '\n**该版本（或更早）为强制版本**'
          }
          uni.showModal({
            title: '发现新版本' + resp.data.version_name,
            content: content,
            showCancel: !resp.data.is_force,
            cancelText: '下次再说',
            confirmText: '立即更新',
            success: (res) => {
              if (res.confirm) {
                uni.showLoading({
                  title: '更新中……'
                })
                uni.downloadFile({
                  url: resp.data.apk,
                  success: (downloadResult) => {
                    uni.hideLoading();
                    if (downloadResult.statusCode === 200) {
                      plus.runtime.install( //安装
                        downloadResult.tempFilePath, {
                          force: true
                        },
                        (res) => {
                          uni.showToast('更新成功，重启中');
                          plus.runtime.restart()
                        }
                      )
                    }
                  }
                })
              } else if (resp.data.is_force) {
                showModal()
              }
            }
          })
        }
        showModal()
      }
    }
  })
}
