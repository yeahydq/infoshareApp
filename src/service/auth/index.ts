import { useUserStore } from '@/store'

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })

    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              const userInfo = res.userInfo
              const nickName = userInfo.nickName
              const avatarUrl = userInfo.avatarUrl
              const gender = userInfo.gender
              const province = userInfo.province
              const city = userInfo.city
              const country = userInfo.country
              const updatedUserInfo = {
                nickName,
                avatarUrl,
                gender,
                province,
                city,
                country,
              }
              // 获取数据库的用户信息
              InitInfo(updatedUserInfo, true).then(resolve).catch(reject)
            },
            fail: (err) => {
              console.error(err)
              wx.hideLoading()
              reject(err)
            },
          })
        } else {
          reject(new Error('未授权'))
        }
      },
      fail: (err) => {
        console.error(err)
        wx.hideLoading()
        reject(err)
      },
    })
  })
}

const InitInfo = (userInfo: any, registerIdc: boolean) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    })

    wx.cloud.callFunction({
      name: 'InitInfo',
      data: {
        type: 'INIT',
      },
      success: (res: any) => {
        wx.hideLoading()
        console.log('res', res)
        const result = res.result.data
        // 判断是否已经注册
        if (result.length) {
          // 已注册，拉取公告、推荐列表
          userInfo.openid = result[0]._openid
          userInfo.id = result[0]._id
          userInfo.nickName = result[0].nickName
          userInfo.avatarUrlCloud = result[0].avatarUrlCloud || ''
          downloadFile(userInfo.avatarUrlCloud, userInfo)
          userInfo.phone = result[0].phone
          userInfo.address = result[0].address
          // 设置专业人员状态信息
          userInfo.professionalStatus = result[0].professionalStatus || ''
          userInfo.professionalId = result[0].professionalId || ''
          // 修改库变量
          const userStore = useUserStore()
          userStore.setUserInfo(userInfo)
          // 缓存到本地
          wx.setStorageSync('userInfo', userInfo)
          resolve(userInfo)
        } else if (registerIdc) {
          SubmitRegister(userInfo).then(resolve).catch(reject)
        } else {
          resolve(null)
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log('err', err)
        wx.showToast({
          title: '网络错误，信息获取失败...',
          icon: 'none',
          duration: 2000,
        })
        reject(err)
      },
    })
  })
}

const SubmitRegister = (userInfo: any) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      mask: true,
      title: '正在保存...',
    })

    const name = userInfo.name
    const phone = userInfo.phone
    const avatarUrl = userInfo.avatarUrl
    const nickName = userInfo.nickName

    const dbname = 'UserList'
    const db = wx.cloud.database()

    db.collection(dbname).add({
      data: {
        name,
        phone,
        address: '',
        avatarUrl,
        nickName,
        manager: false,
      },
      success: function (res) {
        uni.hideLoading()
        if (res.errMsg === 'collection.add:ok') {
          uni.showToast({
            title: '恭喜,注册成功！',
            icon: 'none',
            duration: 1000,
          })
          InitInfo(userInfo, false).then(resolve).catch(reject)
        } else {
          uni.showToast({
            title: '网络错误，注册失败，请检查网络后重试！',
            icon: 'none',
            duration: 2000,
          })
          reject(new Error('注册失败'))
        }
      },
      fail: function (err) {
        uni.hideLoading()
        console.error(err)
        reject(err)
      },
    })
  })
}

const downloadFile = (url: string, userInfo: any) => {
  if (!url) return

  return new Promise((resolve, reject) => {
    wx.cloud.downloadFile({
      fileID: url,
      success: (res) => {
        console.log(res.tempFilePath)
        const userStore = useUserStore()
        userStore.setUserInfo({
          avatarUrl: res.tempFilePath,
        })
        wx.setStorageSync('userInfo', userStore.userInfo)
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        console.error('Upload failed', err)
        uni.showToast({
          title: '图片保存失败',
          icon: 'none',
          duration: 2000,
        })
        reject(err)
      },
    })
  })
}
