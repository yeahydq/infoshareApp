<template>
  <view class="page">
    <form @submit="bindSubmit">
      <view class="head">
        <view class="headText">* 请选择投诉原因</view>
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
          placeholder="请详细描述您对此家长的不满之处"
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
// TODO - 引用 Bmob 相关代码
// var Bmob = require('../../utils/bmob.js');
export default {
  data() {
    return {
      image_width: getApp().globalData.screenWidth / 4 - 10,
      loading: false,
      images: [],
      urlArr: [],
      reasonList: [
        '信息虚假',
        '中介冒充个人',
        '无故辞退教师',
        '对教师不尊重',
        '课时费问题',
        '其它问题',
      ],
      id: null,
      choseReason: '',
      objectId: '',
      role: '',
    }
  },
  onLoad: function (options) {
    this.setData({
      objectId: options.objectId,
      role: options.role,
    })
  },
  onShow: function () {},
  methods: {
    bindSubmit: function (e) {
      // 判断是否正在上传图片
      // if (this.data.loading) {
      // 	return;
      // }

      const reason = this.data.choseReason
      const title = e.detail.value.title
      const content = e.detail.value.content
      const getComplaint = this.data.objectId
      const role = this.data.role
      if (!reason) {
        uni.showToast({
          title: '请选择投诉原因',
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
        // TODO - Bmob 相关代码
        /*
                var Complaint = Bmob.Object.extend('complaint');
                var complaint = new Complaint();
                complaint.set('getComplaint', getComplaint);
                complaint.set('getComplaintRole', role);
                complaint.set('content', content);
                complaint.set('reason', reason);
                complaint.set('images', this.data.urlArr);
                complaint.set('user', Bmob.User.current());
                //添加数据，第一个入口参数是null
                complaint.save(null, {
                    success: function (result) {
                        uni.showModal({
                            title: '投诉成功',
                            content: '已经收到您的投诉，待我们核实后会对其进行下架、整改等处理，谢谢您让蜂鸟家教变得更好。',
                            showCancel: false,
                            confirmText: '我知道啦',
                            confirmColor: '#fe4c40',
                            success: function (res) {
                                if (res.confirm) {
                                    uni.navigateBack();
                                }
                            }
                        });
                    },
                    error: function (result, error) {
                        // 添加失败
                        console.log('提交失败');
                    }
                });
                */
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
            const j = 0
            // 如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
            for (let i = 0; i < imgLength; i++) {
              const tempFilePath = [tempFilePaths[i]]
              let extension = /\.([^.]*)$/.exec(tempFilePath[0])
              if (extension) {
                extension = extension[1].toLowerCase()
              }
              const name = newDateStr + '.' + extension // 上传的图片的别名
              // TODO - Bmob 相关代码
              /*
                            var file = new Bmob.File(name, tempFilePath);
                            file.save().then(
                                function (res) {
                                    uni.hideNavigationBarLoading();
                                    var url = res.url();
                                    console.log('第' + i + '张Url' + url);
                                    urlArr.push({
                                        url
                                    });
                                    j++;
                                    console.log(j, imgLength);
                                    this.setData({
                                        urlArr: urlArr,
                                        loading: true
                                    });
                                },
                                function (error) {
                                    console.log(error);
                                }
                            );
                            */
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
@import './complaintStudent.css';
</style>
