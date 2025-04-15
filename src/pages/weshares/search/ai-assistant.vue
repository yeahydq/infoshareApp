<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'AI助手',
    navigationBarBackgroundColor: '#4C84FF',
    navigationBarTextStyle: 'white',
  },
}
</route>

<template>
  <view class="container">
    <!-- 头部装饰 -->
    <view class="header-decoration"></view>

    <!-- 聊天内容区域 -->
    <scroll-view
      class="chat-container"
      scroll-y
      :scroll-top="scrollTop"
      @scrolltoupper="onScrollToUpper"
      :scroll-with-animation="true"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="message-list">
        <!-- 欢迎消息 -->
        <view class="message system" v-if="messages.length === 0">
          <view class="welcome-card">
            <image class="welcome-avatar" :src="aiAvatar" />
            <view class="welcome-content">
              <text class="welcome-title">你好！我是你的AI助手</text>
              <view class="feature-item" @tap="chooseImageMethod">
                <text class="feature-icon">📷</text>
                <text class="feature-text">上传错题图片，我来帮你分析</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 消息列表 -->
        <view
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type]"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- 头像 -->
          <image class="avatar" :src="message.type === 'user' ? userAvatar : aiAvatar" />

          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 图片消息 -->
            <image
              v-if="message.contentType === 'image'"
              class="message-image"
              :src="message.content"
              mode="widthFix"
              @tap="previewImage(message.content)"
            />

            <!-- 文本消息 -->
            <text v-else class="message-text" :class="{ typing: message.isTyping }">
              {{ message.content }}
            </text>

            <!-- 识别结果 -->
            <view v-if="message.recognizedText" class="recognized-text">
              <text class="label">识别结果：</text>
              <text>{{ message.recognizedText }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-container">
      <!-- 图片上传按钮 -->
      <view class="action-button" @tap="chooseImageMethod">
        <view class="icon-wrapper">📷</view>
      </view>

      <!-- 文本输入框 -->
      <input
        class="input-field"
        v-model="inputMessage"
        placeholder="输入你的问题..."
        :disabled="isProcessing"
        @confirm="sendMessage"
      />

      <!-- 发送按钮 -->
      <view class="action-button send" :class="{ disabled: !canSend }" @tap="sendMessage">
        <view v-if="!isProcessing" class="icon-wrapper">📤</view>
        <view v-else class="loading-spinner"></view>
      </view>
    </view>

    <!-- 图片选择弹窗 -->
    <uni-popup
      v-if="showPopup"
      ref="popup"
      type="bottom"
      :mask-click="true"
      :show="true"
      @close="closePopup"
    >
      <view class="popup-content">
        <view class="popup-title">选择方式</view>
        <view class="popup-option" @tap="chooseImage('camera')">
          <view class="option-icon">📷</view>
          <text class="option-text">拍照</text>
        </view>
        <view class="popup-option" @tap="chooseImage('album')">
          <view class="option-icon">🖼️</view>
          <text class="option-text">从相册选择</text>
        </view>
        <view class="popup-option cancel" @tap="closePopup">
          <text class="option-text">取消</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

// 常量定义
const userAvatar = '/static/images/user-avatar.png' // 替换为实际的用户头像路径
const aiAvatar = '/static/images/ai-avatar.png' // 替换为实际的AI头像路径

// 组件引用
const popup = ref(null)
const scrollTop = ref(0)

// 状态变量
const inputMessage = ref('')
const messages = ref<any[]>([])
const isProcessing = ref(false)
const isRefreshing = ref(false)
const showPopup = ref(false)

// 计算属性
const canSend = computed(() => {
  return inputMessage.value.trim().length > 0 && !isProcessing.value
})

// 消息处理相关方法
const sendMessage = async () => {
  if (!canSend.value) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''

  // 添加用户消息
  addMessage({
    type: 'user',
    contentType: 'text',
    content: message,
  })

  // 添加AI响应
  await processAIResponse(message)
}

const addMessage = (message: any) => {
  messages.value.push(message)
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  const query = uni.createSelectorQuery()
  query.select('.chat-container').boundingClientRect()
  query.exec((res) => {
    if (res[0]) {
      scrollTop.value = res[0].height
    }
  })
}

// AI响应处理
const processAIResponse = async (userMessage: string) => {
  isProcessing.value = true

  // 添加AI思考中的消息
  const thinkingMessage = {
    type: 'ai',
    contentType: 'text',
    content: '思考中...',
    isTyping: true,
  }
  addMessage(thinkingMessage)

  try {
    // 调用云函数获取AI响应
    const result = await uni.cloud.callFunction({
      name: 'aiAssistant',
      data: {
        content: userMessage,
        type: 'text',
      },
    })

    // 更新消息内容
    const lastMessage = messages.value[messages.value.length - 1]
    lastMessage.content = result.result.aiResponse || '抱歉，我无法理解您的问题。'
    lastMessage.isTyping = false
  } catch (error) {
    console.error('AI响应出错:', error)
    const lastMessage = messages.value[messages.value.length - 1]
    lastMessage.content = '抱歉，我遇到了一些问题，请稍后再试。'
    lastMessage.isTyping = false

    // 显示错误提示
    uni.showToast({
      title: '服务暂时不可用',
      icon: 'none',
      duration: 2000,
    })
  } finally {
    isProcessing.value = false
  }
}

// 图片处理相关方法
const chooseImageMethod = () => {
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const chooseImage = async (sourceType: 'camera' | 'album') => {
  showPopup.value = false

  try {
    // 使用uni.chooseImage而不保存结果变量
    uni.chooseImage({
      count: 1,
      sourceType: sourceType === 'camera' ? ['camera'] : ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        // 添加图片消息
        addMessage({
          type: 'user',
          contentType: 'image',
          content: tempFilePath,
        })

        // 处理图片识别
        processImage(tempFilePath)
      },
      fail: (err) => {
        console.error('选择图片失败:', err)
        uni.showToast({
          title: '选择图片失败',
          icon: 'none',
        })
      },
    })
  } catch (error) {
    console.error('选择图片出错:', error)
    uni.showToast({
      title: '选择图片出错',
      icon: 'none',
    })
  }
}

const processImage = async (tempFilePath: string) => {
  isProcessing.value = true

  try {
    // 添加AI思考中的消息
    const thinkingMessage = {
      type: 'ai',
      contentType: 'text',
      content: '正在分析图片...',
      isTyping: true,
    }
    addMessage(thinkingMessage)

    // 将图片转为base64直接发送
    const base64 = await getImageBase64(tempFilePath)

    // 调用云函数进行图片识别和分析
    const result = await uni.cloud.callFunction({
      name: 'aiAssistant',
      data: {
        type: 'image',
        base64Image: base64,
      },
    })

    // 更新消息内容
    const lastMessage = messages.value[messages.value.length - 1]
    lastMessage.content = result.result.aiResponse || '抱歉，我无法识别这张图片。'
    lastMessage.isTyping = false
    lastMessage.recognizedText = result.result.recognizedText
  } catch (error) {
    console.error('处理图片失败:', error)

    // 如果已经添加了思考中的消息，则更新它
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].isTyping) {
      const lastMessage = messages.value[messages.value.length - 1]
      lastMessage.content = '抱歉，处理图片时出现错误，请稍后重试。'
      lastMessage.isTyping = false
    } else {
      // 否则添加新的错误消息
      addMessage({
        type: 'ai',
        contentType: 'text',
        content: '抱歉，处理图片时出现错误，请稍后重试。',
      })
    }

    // 显示错误提示
    uni.showToast({
      title: '图片处理失败',
      icon: 'none',
      duration: 2000,
    })
  } finally {
    isProcessing.value = false
  }
}

// 将图片转为base64
const getImageBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: (res) => {
        resolve(res.data as string)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 图片预览
const previewImage = (url: string) => {
  uni.previewImage({
    urls: [url],
  })
}

// 下拉刷新处理
const onRefresh = async () => {
  isRefreshing.value = true
  try {
    // 这里可以加载历史消息
    await loadHistoryMessages()
  } finally {
    isRefreshing.value = false
  }
}

// 加载历史消息
const loadHistoryMessages = async () => {
  try {
    const result = await uni.cloud.callFunction({
      name: 'getMessageHistory',
      data: {
        limit: 20,
      },
    })

    if (result.result && result.result.messages) {
      messages.value = [...result.result.messages, ...messages.value]
    }
  } catch (error) {
    console.error('加载历史消息失败:', error)
    uni.showToast({
      title: '加载历史消息失败',
      icon: 'none',
    })
  }
}

// 滚动到顶部时的处理
const onScrollToUpper = () => {
  // 可以在这里加载更多历史消息
}

// 组件挂载时加载历史消息并确保弹窗是关闭的
onMounted(() => {
  loadHistoryMessages()

  // 确保弹窗初始状态是关闭的
  showPopup.value = false
})
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f6f7f9;
}

.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 440rpx;
  background: linear-gradient(135deg, #4c84ff, #2b5cff);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.chat-container {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 30rpx;
  padding-top: 40rpx;
  overflow-y: auto;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  padding-bottom: 30rpx;
}

.message {
  display: flex;
  gap: 24rpx;
  margin-bottom: 10rpx;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  flex-shrink: 0;
  width: 88rpx;
  height: 88rpx;
  background-color: #fff;
  border: 3rpx solid #fff;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.message-content {
  position: relative;
  max-width: 70%;
  padding: 24rpx 32rpx;
  background-color: #fff;
  border-radius: 26rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.message.user .message-content {
  color: #fff;
  background: linear-gradient(135deg, #4c84ff, #2b5cff);
}

.message.user .message-content::after {
  position: absolute;
  top: 24rpx;
  right: -16rpx;
  width: 0;
  height: 0;
  content: '';
  border: 12rpx solid transparent;
  border-left-color: #4c84ff;
}

.message.ai .message-content::before {
  position: absolute;
  top: 24rpx;
  left: -16rpx;
  width: 0;
  height: 0;
  content: '';
  border: 12rpx solid transparent;
  border-right-color: #fff;
}

.message-image {
  max-width: 100%;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.message-image:active {
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
  transform: scale(0.98);
}

.message-text {
  font-size: 30rpx;
  line-height: 1.6;
  word-break: break-all;
}

.message.user .message-text {
  color: #fff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

.message.ai .message-text {
  color: #333;
}

.message-text.typing::after {
  display: inline-block;
  width: 8rpx;
  height: 8rpx;
  margin-left: 8rpx;
  vertical-align: middle;
  content: '';
  background-color: currentColor;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

@keyframes typing {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.recognized-text {
  padding-top: 20rpx;
  margin-top: 20rpx;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.recognized-text .label {
  display: block;
  margin-bottom: 8rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #666;
}

.input-container {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 20rpx;
  align-items: center;
  padding: 20rpx 24rpx;
  background-color: #fff;
  border-top: none;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  background-color: #f5f7fa;
  border-radius: 50%;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.action-button:active {
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.action-button.send {
  color: #fff;
  background: linear-gradient(135deg, #4c84ff, #2b5cff);
  box-shadow: 0 4rpx 12rpx rgba(43, 92, 255, 0.3);
}

.action-button.send.disabled {
  color: #999;
  background: #e4e6eb;
  box-shadow: none;
  opacity: 0.8;
}

.input-field {
  flex: 1;
  height: 80rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  background-color: #f5f7fa;
  border-radius: 40rpx;
  box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.input-field:focus {
  background-color: #fff;
  box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}
/* 系统消息样式 */
.system {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  margin-top: 60rpx;
}

.welcome-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.welcome-avatar {
  z-index: 3;
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 60rpx;
  background-color: #fff;
  border: 4rpx solid #fff;
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

.welcome-content {
  width: 90%;
  padding: 40rpx 30rpx;
  background-color: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

.welcome-title {
  display: block;
  margin-bottom: 40rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.feature-item {
  display: flex;
  gap: 20rpx;
  align-items: center;
  padding: 24rpx;
  background-color: #f8f9fa;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.feature-item:active {
  background-color: #f0f2f5;
  transform: scale(0.98);
}

.feature-icon {
  font-size: 48rpx;
}

.feature-text {
  font-size: 30rpx;
  color: #333;
}
/* 弹出框样式 */
.popup-content {
  padding: 40rpx 30rpx;
  background-color: #fff;
  border-top-left-radius: 36rpx;
  border-top-right-radius: 36rpx;
  box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.popup-title {
  margin-bottom: 40rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.popup-option {
  display: flex;
  gap: 30rpx;
  align-items: center;
  justify-content: flex-start;
  height: 120rpx;
  padding: 0 36rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.popup-option:active {
  background-color: #f5f7fa;
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  font-size: 44rpx;
  background: #f5f7fa;
  border-radius: 24rpx;
}

.option-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.popup-option.cancel {
  justify-content: center;
  margin-top: 24rpx;
  color: #999;
  border: none;
}
/* 加载动画 */
.loading-spinner {
  width: 44rpx;
  height: 44rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8rpx;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4rpx;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
