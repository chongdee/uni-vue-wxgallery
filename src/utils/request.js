export default (params) => {
    // 加载中
    uni.showToast({
        title: '加载中'
    })
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                uni.hideLoading()
            }
        });
    })
}