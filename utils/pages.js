export function getCurrentPageUrl(){
  let pages = getCurrentPages();
  return pages[pages.length - 1].$page.fullPath;
}

export function redirectTo(uni, url){
  uni.redirectTo({
    url: url,
    fail: (res) => {
      uni.switchTab({
        url: url
      })
    }
  })
}