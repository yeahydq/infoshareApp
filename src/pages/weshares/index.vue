<template>
  <view class="container">
    <!-- 城市选择 -->
    <view class="city-selector">
      <view class="city-content" @tap="toggleCityPicker">
        <text class="city-name">{{ currentCity || '选择城市' }}</text>
        <text class="iconfont icon-arrow-down"></text>
      </view>
      <view class="location-btn" @tap="handleLocation">
        <text class="iconfont icon-location"></text>
        <text>定位</text>
      </view>
    </view>

    <!-- 城市选择器弹窗 -->
    <uni-popup
      ref="cityPicker"
      type="bottom"
      :show="isCityPickerVisible"
      @change="toggleCityPicker"
    >
      <view class="city-picker">
        <view class="city-picker-header">
          <text>选择城市</text>
          <text class="iconfont icon-close" @tap="toggleCityPicker"></text>
        </view>
        <scroll-view scroll-y class="city-list">
          <view
            v-for="city in cityList"
            :key="city"
            class="city-item"
            :class="{ active: city === currentCity }"
            @tap="selectCity(city)"
          >
            {{ city }}
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <view class="address-section" @tap="handleAddressSelect">
      <view class="address-content">
        <view class="location-icon">
          <text class="iconfont icon-location"></text>
        </view>
        <view class="address-info">
          <view class="address-text">
            <text class="current-address">{{ currentAddress || '请选择地址' }}</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <text class="address-detail">{{ addressDetail || '点击选择详细地址' }}</text>
        </view>
      </view>
      <view class="address-actions">
        <view class="action-item" @tap.stop="handleLocation">
          <text class="iconfont icon-location"></text>
          <text>重新定位</text>
        </view>
        <view class="action-item" @tap.stop="handleAddressChange">
          <text class="iconfont icon-edit"></text>
          <text>切换地址</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface LocationData {
  latitude: number
  longitude: number
  speed: number
  accuracy: number
  altitude: number
  verticalAccuracy: number
  horizontalAccuracy: number
}

interface AddressComponent {
  nation: string
  province: string
  city: string
  district: string
  street: string
  street_number: string
}

interface AddressResult {
  status: number
  result: {
    address: string
    address_component: AddressComponent
    formatted_addresses: {
      recommend: string
      rough: string
    }
  }
}

// 城市相关
const currentCity = ref('')
const isCityPickerVisible = ref(false)
const cityList = ref<string[]>([
  '北京市',
  '上海市',
  '广州市',
  '深圳市',
  '杭州市',
  '成都市',
  '武汉市',
  '西安市',
  '南京市',
  '重庆市',
  '天津市',
  '苏州市',
  '长沙市',
  '青岛市',
  '大连市',
  '厦门市',
  '济南市',
  '合肥市',
  '郑州市',
  '昆明市',
])

// 地址相关
const currentAddress = ref('')
const addressDetail = ref('')
const latitude = ref(0)
const longitude = ref(0)

// 获取当前位置
const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve(res as LocationData)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 根据经纬度获取地址信息
const getAddressFromLocation = async (latitude: number, longitude: number) => {
  try {
    const res = await uni.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=YOUR_MAP_KEY`,
      method: 'GET',
    })

    if (res.statusCode === 200) {
      const data = res.data as AddressResult
      if (data.status === 0) {
        const address = data.result
        currentCity.value = address.address_component.city
        currentAddress.value = address.address_component.city
        addressDetail.value = address.address
        return address
      }
    }
    throw new Error('获取地址信息失败')
  } catch (error) {
    console.error('获取地址信息失败:', error)
    throw error
  }
}

// 处理定位
const handleLocation = async () => {
  try {
    uni.showLoading({ title: '定位中...' })
    const location = await getCurrentLocation()
    latitude.value = location.latitude
    longitude.value = location.longitude
    await getAddressFromLocation(latitude.value, longitude.value)
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '定位失败，请检查定位权限',
      icon: 'none',
    })
  }
}

// 显示/隐藏城市选择器
const toggleCityPicker = () => {
  isCityPickerVisible.value = !isCityPickerVisible.value
}

// 选择城市
const selectCity = (city: string) => {
  currentCity.value = city
  isCityPickerVisible.value = false
  // 这里可以触发城市变更事件
}

// 处理地址选择
const handleAddressSelect = () => {
  uni.navigateTo({
    url: '/weshares/address/select',
  })
}

// 处理地址切换
const handleAddressChange = () => {
  uni.navigateTo({
    url: '/weshares/address/list',
  })
}

// 页面加载时获取位置
onMounted(async () => {
  try {
    await handleLocation()
  } catch (error) {
    console.error('初始化定位失败:', error)
  }
})

// 监听城市变化
watch(currentCity, (newCity) => {
  // 这里可以处理城市变更后的逻辑
  console.log('城市已更改为:', newCity)
})
</script>

<style lang="scss" scoped>
// 基础 iconfont 样式
.iconfont {
  margin-right: 8rpx;
  font-family: 'iconfont' !important;
  font-size: 28rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 特定场景的 iconfont 样式
.city-content .iconfont {
  font-size: 24rpx;
  color: #999;
}

.location-btn .iconfont {
  font-size: 28rpx;
  color: #007aff;
}

.location-icon .iconfont {
  font-size: 32rpx;
  color: #666;
}

.address-text .iconfont {
  margin-left: 8rpx;
  font-size: 28rpx;
}

.action-item .iconfont {
  margin-right: 8rpx;
  font-size: 28rpx;
}

.city-picker-header .iconfont {
  font-size: 32rpx;
  color: #999;
}

.container {
  padding: 20rpx;
}

.city-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .city-content {
    display: flex;
    gap: 10rpx;
    align-items: center;

    .city-name {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .location-btn {
    display: flex;
    gap: 8rpx;
    align-items: center;
    padding: 10rpx 20rpx;
    background-color: #f0f9ff;
    border-radius: 30rpx;

    text {
      font-size: 24rpx;
      color: #007aff;
    }
  }
}

.address-section {
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .address-content {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .location-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60rpx;
      height: 60rpx;
      margin-right: 20rpx;
      background-color: #f0f9ff;
      border-radius: 30rpx;
    }

    .address-info {
      flex: 1;

      .address-text {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;

        .current-address {
          margin-right: 10rpx;
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
      }

      .address-detail {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .address-actions {
    display: flex;
    gap: 30rpx;
    justify-content: flex-end;
    padding-top: 20rpx;
    border-top: 1rpx solid #f5f5f5;

    .action-item {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #666;
    }
  }
}

.city-picker {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;

  .city-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .city-list {
    max-height: 60vh;

    .city-item {
      padding: 24rpx 0;
      font-size: 28rpx;
      color: #333;
      border-bottom: 1rpx solid #f5f5f5;

      &.active {
        color: #007aff;
      }
    }
  }
}
</style>
