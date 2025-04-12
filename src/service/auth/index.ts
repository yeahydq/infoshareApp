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
              // const avatarUrl = userInfo.avatarUrl // 不能获取微信头像， 需要后面用户自己上传
              const gender = userInfo.gender
              const province = userInfo.province
              const city = userInfo.city
              const country = userInfo.country
              const updatedUserInfo = {
                nickName,
                // avatarUrl,
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

          // 检查本地avatarUrl是否存在
          const localAvatarUrl = userInfo.avatarUrl || ''

          // 从云端文件路径提取文件名，或使用已保存的文件名
          const cloudFileName = result[0].avatarFileName || userInfo.avatarUrlCloud.split('/').pop()

          // 检查本地是否已有相同文件名的文件，通过文件名映射查找
          let needDownload = true

          // 检查本地是否有相同文件的缓存记录
          try {
            const fileNameMap = uni.getStorageSync('fileNameMap') || {}
            const tempCloudURLs = uni.getStorageSync('tempCloudURLs') || {}

            // 检查云文件URL是否已有本地缓存
            if (tempCloudURLs[userInfo.avatarUrlCloud] && wx.getFileSystemManager().accessSync) {
              try {
                // 检查文件是否存在
                wx.getFileSystemManager().accessSync(tempCloudURLs[userInfo.avatarUrlCloud])
                console.log('本地已缓存此云端文件:', tempCloudURLs[userInfo.avatarUrlCloud])
                userInfo.avatarUrl = tempCloudURLs[userInfo.avatarUrlCloud]
                needDownload = false
              } catch (e) {
                console.log('本地缓存文件不存在，需要重新下载')
              }
            }

            // 如果未找到缓存，但有文件名记录，则通过文件名查找
            if (needDownload && cloudFileName) {
              for (const [localPath, fileName] of Object.entries(fileNameMap)) {
                if (fileName === cloudFileName) {
                  try {
                    // 检查文件是否存在
                    if (wx.getFileSystemManager().accessSync) {
                      wx.getFileSystemManager().accessSync(localPath)
                      console.log('通过文件名找到本地文件:', localPath)
                      userInfo.avatarUrl = localPath
                      needDownload = false

                      // 更新映射
                      tempCloudURLs[userInfo.avatarUrlCloud] = localPath
                      uni.setStorageSync('tempCloudURLs', tempCloudURLs)
                      break
                    }
                  } catch (e) {
                    console.log('文件名匹配的本地文件不存在')
                  }
                }
              }
            }
          } catch (err) {
            console.error('检查本地文件缓存失败:', err)
          }

          // 如果需要下载，则下载头像
          if (needDownload && userInfo.avatarUrlCloud) {
            console.log('需要下载头像:', userInfo.avatarUrlCloud)
            downloadFile(userInfo.avatarUrlCloud, userInfo)
          } else {
            console.log('使用本地头像:', userInfo.avatarUrl)
          }

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

/**
 * 更新用户数据库记录
 * @param userId 用户ID
 * @param userData 需要更新的用户数据
 * @returns Promise
 */
export const updateUserDatabase = (userId: string, userData: any) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      console.error('更新用户信息失败：缺少用户ID')
      return reject(new Error('缺少用户ID'))
    }

    uni.showLoading({
      mask: true,
      title: '正在保存...',
    })

    const dbname = 'UserList'
    const db = wx.cloud.database()

    db.collection(dbname)
      .doc(userId)
      .update({
        data: userData,
        success: function (res) {
          uni.hideLoading()
          if (res.errMsg === 'document.update:ok') {
            console.log('用户信息更新成功:', userData)
            resolve(res)
          } else {
            console.error('网络错误，更新失败:', res.errMsg)
            uni.showToast({
              title: '网络错误，更新失败，请重试！',
              icon: 'none',
              duration: 2000,
            })
            reject(new Error(res.errMsg))
          }
        },
        fail: function (err) {
          uni.hideLoading()
          console.error('更新用户信息失败:', err)
          uni.showToast({
            title: '更新用户信息失败',
            icon: 'none',
            duration: 2000,
          })
          reject(err)
        },
      })
  })
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const downloadFile = (url: string, userInfo: any) => {
  /* eslint-enable @typescript-eslint/no-unused-vars */
  if (!url || !url.startsWith('cloud://')) return

  return new Promise((resolve, reject) => {
    console.log('开始下载头像文件:', url)

    // 使用cacheFile云函数获取临时URL，而不是直接下载
    wx.cloud.callFunction({
      name: 'cacheFile',
      data: {
        fileID: url,
        type: 'avatar',
      },
      success: (res: any) => {
        console.log('cacheFile云函数返回结果:', res.result)

        // 检查cacheFile云函数是否返回了有效结果
        if (!res.result) {
          console.error('云函数返回结果为空')
          return reject(new Error('云函数返回结果为空'))
        }

        // 检查返回的success字段
        if (!res.result.success) {
          console.error('获取文件临时链接失败:', res.result.error || '未知错误')
          uni.showToast({
            title: '获取头像失败',
            icon: 'none',
            duration: 2000,
          })
          return reject(new Error(res.result.error || '获取临时链接失败'))
        }

        // 检查是否是本地文件
        if (res.result.isLocalFile) {
          console.log('文件已是本地路径，无需下载:', res.result.tempFileURL)

          // 更新用户信息avatarUrl为本地路径
          const userStore = useUserStore()
          userStore.setUserInfo({
            avatarUrl: res.result.tempFileURL, // 使用本地路径
          })

          // 更新本地存储
          wx.setStorageSync('userInfo', userStore.userInfo)

          // 发送下载完成事件
          uni.$emit('cloudFileDownloaded', {
            fileID: url,
            tempFilePath: res.result.tempFileURL,
          })

          return resolve(res.result.tempFileURL)
        }

        const tempFileURL = res.result.tempFileURL
        console.log('获取临时文件链接成功:', url, '->', tempFileURL)

        // 下载文件到本地临时目录
        wx.downloadFile({
          url: tempFileURL,
          success: function (res) {
            if (res.statusCode === 200) {
              const tempFilePath = res.tempFilePath
              console.log('文件已下载到临时路径:', tempFilePath)

              // 从云端文件路径提取文件名
              const cloudFileName = url.split('/').pop() || 'avatar.jpg'
              console.log('云端文件名:', cloudFileName)

              // 处理临时文件路径的辅助函数
              const handleTempFilePath = function (localFilePath: string) {
                const userStore = useUserStore()
                userStore.setUserInfo({
                  avatarUrl: localFilePath,
                  avatarUrlCloud: url,
                })

                // 更新本地存储
                wx.setStorageSync('userInfo', userStore.userInfo)

                // 保存临时URL映射
                try {
                  const tempCloudURLs = uni.getStorageSync('tempCloudURLs') || {}
                  tempCloudURLs[url] = localFilePath
                  uni.setStorageSync('tempCloudURLs', tempCloudURLs)
                } catch (err) {
                  console.error('保存临时URL映射失败:', err)
                }

                // 发送下载完成事件
                uni.$emit('cloudFileDownloaded', {
                  fileID: url,
                  tempFilePath: localFilePath,
                })

                if (userInfo.id) {
                  updateUserDatabase(userInfo.id, { avatarUrl: localFilePath })
                    .then(() => console.log('头像临时路径已同步到云存储'))
                    .catch((err) => console.error('同步头像临时路径失败:', err))
                }

                resolve(localFilePath)
              }

              // 保存文件到本地存储，并确保文件名与云端一致
              try {
                // 使用 wx.getFileSystemManager().saveFile 将临时文件保存为持久文件
                const fsm = wx.getFileSystemManager()
                fsm.saveFile({
                  tempFilePath: tempFilePath,
                  success: function (saveRes) {
                    const savedFilePath = saveRes.savedFilePath
                    console.log('文件已保存到本地:', savedFilePath)

                    // 更新用户信息中的avatarUrl为本地路径
                    const userStore = useUserStore()
                    userStore.setUserInfo({
                      avatarUrl: savedFilePath, // 使用保存后的本地路径
                      avatarUrlCloud: url, // 保留云存储路径以便将来对比
                    })

                    // 更新本地存储
                    wx.setStorageSync('userInfo', userStore.userInfo)

                    // 保存临时URL映射
                    try {
                      const tempCloudURLs = uni.getStorageSync('tempCloudURLs') || {}
                      tempCloudURLs[url] = savedFilePath
                      uni.setStorageSync('tempCloudURLs', tempCloudURLs)

                      // 保存文件名映射，便于后续比较
                      const fileNameMap = uni.getStorageSync('fileNameMap') || {}
                      fileNameMap[savedFilePath] = cloudFileName
                      uni.setStorageSync('fileNameMap', fileNameMap)
                    } catch (err) {
                      console.error('保存映射失败:', err)
                    }

                    // 发送下载完成事件
                    uni.$emit('cloudFileDownloaded', {
                      fileID: url,
                      tempFilePath: savedFilePath,
                      fileName: cloudFileName,
                    })

                    // 将本地头像路径同步到云存储
                    if (userInfo.id) {
                      const userData = {
                        avatarUrl: savedFilePath,
                        avatarFileName: cloudFileName, // 保存文件名，便于后续比较
                      }

                      updateUserDatabase(userInfo.id, userData)
                        .then(() => {
                          console.log('头像路径已同步到云存储')
                        })
                        .catch((err) => {
                          console.error('同步头像路径到云存储失败:', err)
                        })
                    }

                    resolve(savedFilePath)
                  },
                  fail: function (err) {
                    console.error('保存文件到本地失败:', err)
                    // 失败时仍使用临时文件路径
                    handleTempFilePath(tempFilePath)
                  },
                })
              } catch (err) {
                console.error('尝试保存文件失败:', err)
                // 出错时仍使用临时文件路径
                handleTempFilePath(tempFilePath)
              }
            } else {
              console.error('下载文件状态码异常:', res.statusCode)
              reject(new Error('下载头像失败: ' + res.statusCode))
            }
          },
          fail: function (err) {
            console.error('下载文件失败:', err)
            uni.showToast({
              title: '头像下载失败',
              icon: 'none',
              duration: 2000,
            })
            reject(err)
          },
        })
      },
      fail: (err) => {
        console.error('调用cacheFile云函数失败:', err)
        uni.showToast({
          title: '头像加载失败',
          icon: 'none',
          duration: 2000,
        })
        reject(err)
      },
    })
  })
}

// 辅助函数：检查专业人员状态
/* eslint-disable @typescript-eslint/no-unused-vars */
const checkProfessionalStatus = (openid: string) => {
  /* eslint-enable @typescript-eslint/no-unused-vars */
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
