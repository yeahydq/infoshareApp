<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="max-w-md mx-auto">
    <view class="bg-blue-500 text-white text-center p-3 text-lg font-bold">首页</view>
    <view class="bg-blue-400 mt-2 p-3 flex items-center justify-between rounded-lg">
      <view class="flex items-center space-x-1 text-white">
        <text>济南市</text>
        <text class="fas fa-chevron-down"></text>
      </view>
      <input
        class="w-full bg-blue-300 px-3 py-1 rounded-lg text-white placeholder-white"
        placeholder="请输入关键字"
        type="text"
      />
      <text class="fas fa-search text-white"></text>
    </view>
    <view class="my-4 bg-white rounded-lg overflow-hidden shadow-md">
      <!-- <image
        class="w-full"
        src="https://dalleproduse.blob.core.windows.net/private/images/b1db2c73-489d-41e9-afb7-b74e5631cb4f/generated_00.png?se=2025-03-23T05%3A17%3A18Z&amp;sig=29f%2F%2BC1jE2DbmdIo6sH%2Bfd%2BAOAtH3GBACuoQtvD0iAo%3D&amp;ske=2025-03-27T12%3A46%3A41Z&amp;skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&amp;sks=b&amp;skt=2025-03-20T12%3A46%3A41Z&amp;sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&amp;skv=2020-10-02&amp;sp=r&amp;spr=https&amp;sr=b&amp;sv=2020-10-02"
        mode="widthFix"
      /> -->
      <view class="text-center py-4">
        <text class="text-blue-700 font-bold text-2xl">家教预约</text>
        <text class="text-blue-700 text-lg">小程序上线了</text>
      </view>
    </view>
    <view class="grid grid-cols-4 gap-4 text-center mt-4">
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-user text-white"></text>
        </view>
        <text class="text-sm mt-2">管理学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-teal-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-graduation-cap text-white"></text>
        </view>
        <text class="text-sm mt-2">医学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-seedling text-white"></text>
        </view>
        <text class="text-sm mt-2">农学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-red-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-cogs text-white"></text>
        </view>
        <text class="text-sm mt-2">工学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-compass text-white"></text>
        </view>
        <text class="text-sm mt-2">理学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-landmark text-white"></text>
        </view>
        <text class="text-sm mt-2">历史学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-feather text-white"></text>
        </view>
        <text class="text-sm mt-2">文学</text>
      </view>
      <view>
        <view
          class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mx-auto"
        >
          <text class="fas fa-book text-white"></text>
        </view>
        <text class="text-sm mt-2">更多</text>
      </view>
    </view>
    <view class="mt-6">
      <view class="bg-yellow-200 rounded-lg p-3 flex items-center space-x-2 shadow-md">
        <image
          class="rounded-full"
          src="https://dalleproduse.blob.core.windows.net/private/images/ca878224-5869-4e9c-b78a-c35d50d2f1fd/generated_00.png?se=2025-03-23T05%3A17%3A21Z&amp;sig=KS591FY8Oc2RNBhhZksi4YiqgfKjp3onRYndmjINpJw%3D&amp;ske=2025-03-29T00%3A59%3A19Z&amp;skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&amp;sks=b&amp;skt=2025-03-22T00%3A59%3A19Z&amp;sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&amp;skv=2020-10-02&amp;sp=r&amp;spr=https&amp;sr=b&amp;sv=2020-10-02"
          style="width: 100rpx; height: 100rpx"
          mode="aspectFit"
        />
        <view>
          <text class="text-sm font-bold">您想找什么样的老师?</text>
          <text class="text-xs">根据您的需求，快速帮您找到优质老师</text>
        </view>
        <button class="text-red-500 font-bold">帮我找</button>
      </view>
      <view class="grid grid-cols-2 gap-4 mt-4">
        <view class="bg-red-300 rounded-lg text-white p-3 text-center shadow-md">
          <text class="font-bold text-lg">在线辅导</text>
          <text class="text-sm">全国名师在线</text>
          <button class="bg-red-500 px-3 py-2 rounded mt-2">选在线老师</button>
        </view>
        <view class="bg-blue-300 rounded-lg text-white p-3 text-center shadow-md">
          <text class="font-bold text-lg">上门辅导</text>
          <text class="text-sm">名师面对面</text>
          <button class="bg-blue-500 px-3 py-2 rounded mt-2">选上门老师</button>
        </view>
      </view>
    </view>
    <view class="mt-6 text-center text-sm">
      <text>优选名师</text>
      <text class="text-blue-500 mt-2">更多</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // data properties can be added here
    }
  },
  onLoad() {
    // lifecycle hook for when the page loads
  },
  methods: {
    // methods can be added here
  },
}
</script>

<style>
page {
  background-color: #bfdbfe; /* bg-blue-200 */
  font-family: 'Roboto', sans-serif;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.grid-cols-2 {
  width: 50%;
}

.grid-cols-4 > view {
  width: 25%;
  box-sizing: border-box;
  padding: 5px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.space-x-1 > view + view {
  margin-left: 0.25rem;
}

.space-x-2 > view + view {
  margin-left: 0.5rem;
}
</style>
