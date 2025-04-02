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

          // 设置专业人员状态信息，确保获取所有相关字段
          userInfo.professionalStatus = result[0].professionalStatus || null
          userInfo.professionalId = result[0].professionalId || null
          userInfo.updateTime = result[0].updateTime || new Date().getTime()

          console.log('登录成功，用户专业人员状态:', {
            professionalStatus: userInfo.professionalStatus,
            professionalId: userInfo.professionalId,
          })

          // 修改库变量
          const userStore = useUserStore()
          userStore.setUserInfo(userInfo)

          // 缓存到本地
          wx.setStorageSync('userInfo', userInfo)

          // 登录后主动调用云函数检查专业人员状态
          if (userInfo.openid) {
            console.log('登录后主动检查专业人员申请状态')
            checkProfessionalStatus(userInfo.openid)
              .then((profInfo) => {
                if (profInfo) {
                  console.log('专业人员状态更新:', profInfo)
                  // 如果状态有变化，更新本地状态
                  if (
                    profInfo.hasApplication &&
                    (!userInfo.professionalId ||
                      !userInfo.professionalStatus ||
                      userInfo.professionalId !== profInfo.professionalId ||
                      userInfo.professionalStatus !== profInfo.status)
                  ) {
                    const updatedInfo = {
                      ...userInfo,
                      professionalId: profInfo.professionalId,
                      professionalStatus: profInfo.status,
                      updateTime: new Date().getTime(),
                    }

                    // 更新Store和本地存储
                    userStore.setUserInfo(updatedInfo)
                    wx.setStorageSync('userInfo', updatedInfo)
                    console.log('用户专业人员状态已更新:', updatedInfo)
                  }
                }
              })
              .catch((err) => {
                console.error('检查专业人员状态失败:', err)
              })
          }

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

// 辅助函数：检查专业人员状态
const checkProfessionalStatus = (openid: string) => {
  return new Promise<{
    hasApplication: boolean
    professionalId: string | null
    status: string | null
  }>((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'checkApplication',
      },
      success: (res: any) => {
        console.log('检查专业人员状态结果:', res.result)
        if (res.result && res.result.success) {
          if (res.result.hasApplication && res.result.application) {
            resolve({
              hasApplication: true,
              professionalId: res.result.application._id,
              status: res.result.application.status || 'pending',
            })
          } else {
            resolve({
              hasApplication: false,
              professionalId: null,
              status: null,
            })
          }
        } else {
          reject(new Error('获取专业人员状态失败'))
        }
      },
      fail: (err) => {
        console.error('调用检查专业人员状态接口失败:', err)
        reject(err)
      },
    })
  })
}
