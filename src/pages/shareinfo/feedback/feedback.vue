<template>
  <view class="page">
    <form @submit="bindSubmit">
      <view class="head">
        <view class="headText">*请选择反馈类型</view>
      </view>

      <view class="choseReason">
        <view
          class="reasonItem"
          :data-index="index"
          @tap="choseReasonFun"
          :style="
            index == id ? 'background-color: #fe4c40;color:#fff' : ' background-color: #efefef;'
          "
          v-for="(item, index) in reasonList"
          :key="index"
        >
          <view @tap="falseInformation">{{ item }}</view>
        </view>
      </view>

      <view class="remark">
        <text class="remark-title">* 具体说明:</text>
        <textarea
          name="content"
          class="inputRemark"
          @blur="bindTextAreaBlur"
          maxlength="500"
          placeholder="请详细描述您遇到的问题，便于我们更好的整改"
        />
      </view>

      <text class="imageTitle">
        相关截图:
        <text style="font-size: 30rpx; color: #737373">(若无则可不上传)</text>
      </text>
      <view class="gallery">
        <view class="itemImage" v-for="(item, index) in urlArr" :key="index">
          <image
            class="thumb"
            :data-current="item"
            :style="'width: ' + 2 * image_width + 'rpx; height: ' + 2 * image_width + 'rpx'"
            :src="item.url"
          />

          <image
            class="delete"
            src="/static/image/deleteImage.png"
            :data-index="index"
            @tap="deleteFun"
          ></image>
        </view>
        <image
          class="thumb"
          :style="'width: ' + 2 * image_width + 'rpx; height: ' + 2 * image_width + 'rpx'"
          src="/static/image/upload.png"
          @tap="upImg"
        />
      </view>

      <button class="submitButton" formType="submit">提交</button>
    </form>
  </view>
</template>

<script>
// var Bmob = require('../../utils/bmob.js'); // TODO: Bmob integration
export default {
  data() {
    return {
      image_width: getApp().globalData.screenWidth / 4 - 10,
      loading: false,
      images: [],
      urlArr: [],
      reasonList: [
        '出现错误',
        '使用不方便',
        '增加功能',
        '有虚假信息',
        '界面不好看',
        '受到骚扰',
        '填写信息不完善',
        '其它问题',
      ],
      id: null,
      choseReason: '',
    }
  },
  onLoad: function () {},
  methods: {
    bindSubmit: function (e) {
      // 判断是否正在上传图片
      // if (this.data.loading) {
      // 	return;
      // }
      const reason = this.data.choseReason
      const content = e.detail.value.content
      if (!reason) {
        uni.showToast({
          title: '请选择反馈原因',
          image: '../../image/warn.png',
          duration: 2000,
        })
      } else if (!content) {
        uni.showToast({
          title: '请填写具体说明',
          image: '../../image/warn.png',
          duration: 2000,
        })
      } else {
        // 创建类和实例
        // var Feedback = Bmob.Object.extend('feedback'); // TODO: Bmob integration
        // var feedback = new Feedback(); // TODO: Bmob integration
        // feedback.set('content', content); // TODO: Bmob integration
        // feedback.set('reason', reason); // TODO: Bmob integration
        // feedback.set('images', this.data.urlArr); // TODO: Bmob integration
        // feedback.set('user', Bmob.User.current()); // TODO: Bmob integration
        // 添加数据，第一个入口参数是null
        // feedback.save(null, { // TODO: Bmob integration
        //     success: function (result) { // TODO: Bmob integration
        //         // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        //         // console.log("日记创建成功, objectId:"+result.id);

        uni.showModal({
          title: '反馈成功',
          content: '已经收到您的反馈，近期会及时回复您，请您注意查看，谢谢您让蜂鸟家教变得更好。',
          showCancel: false,
          confirmText: '我知道啦',
          confirmColor: '#fe4c40',
          success: function (res) {
            if (res.confirm) {
              uni.navigateBack()
            }
          },
        })
        //     }, // TODO: Bmob integration
        //     error: function (result, error) { // TODO: Bmob integration
        //         // 添加失败
        //         console.log('提交失败');
        //     } // TODO: Bmob integration
        // }); // TODO: Bmob integration
      }
    },

    choseReasonFun: function (e) {
      const index = e.currentTarget.dataset.index // 获取自定义的ID值
      this.setData({
        id: index,
        choseReason: this.data.reasonList[index],
      })
      console.log(this.data.id)
    },

    upImg: function () {
      uni.chooseImage({
        count: 9,
        // 默认9
        sizeType: ['compressed'],
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          uni.showNavigationBarLoading()
          this.setData({
            loading: false,
          })
          const urlArr = this.urlArr
          // var urlArr={};
          const tempFilePaths = res.tempFilePaths
          const images = this.images
          this.setData({
            images: images.concat(tempFilePaths),
          })
          const imgLength = tempFilePaths.length
          if (imgLength > 0) {
            const newDate = new Date()
            const newDateStr = newDate.toLocaleDateString()
            let j = 0
            // 如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
            for (let i = 0; i < imgLength; i++) {
              const tempFilePath = [tempFilePaths[i]]
              let extension = /\.([^.]*)$/.exec(tempFilePath[0])
              if (extension) {
                extension = extension[1].toLowerCase()
              }
              const name = newDateStr + '.' + extension // 上传的图片的别名
              // var file = new Bmob.File(name, tempFilePath); // TODO: Bmob integration
              // file.save().then( // TODO: Bmob integration
              //     function (res) { // TODO: Bmob integration
              uni.hideNavigationBarLoading()
              const url = res.url()
              console.log('第' + i + '张Url' + url)
              urlArr.push({
                url,
              })
              j++
              console.log(j, imgLength)
              this.setData({
                urlArr,
                loading: true,
              })
              // }, // TODO: Bmob integration
              // function (error) { // TODO: Bmob integration
              //     console.log(error);
              // } // TODO: Bmob integration
              // ); // TODO: Bmob integration
            }
          }
        },
      })
      console.log(this.urlArr)
    },

    deleteFun: function (e) {
      // 获取本地显示的图片数组
      const index = e.currentTarget.dataset.index
      const images = this.data.images
      const urlArr = this.data.urlArr
      urlArr.splice(index, 1)
      images.splice(index, 1)
      this.setData({
        images,
        urlArr,
      })
      console.log(this.data.urlArr)
    },

    falseInformation() {
      console.log('占位：函数 falseInformation 未声明')
    },

    bindTextAreaBlur() {
      console.log('占位：函数 bindTextAreaBlur 未声明')
    },
  },
}
</script>
<style>
@import './feedback.css';
</style>
