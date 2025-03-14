<template>
  <view class="page" v-if="judgeApply == true">
    <view
      class="row"
      @tap="showDetail"
      :data-index="index"
      v-for="(item, index) in apply_list"
      :key="index"
    >
      <view class="collect-student">
        <view class="left">
          <view class="course-circular">
            <text>{{ item.course }}</text>
          </view>
          <view class="name">{{ item.name }}</view>
        </view>
        <view class="right">
          <image
            class="delete"
            :data-index="index"
            @tap.stop.prevent="deleteApply"
            src="/static/image/delete.png"
          />
          <view class="address">{{ item.address[0] }}区</view>
          <view>{{ item.address[1] }}</view>
          <view class="salary">{{ item.salary }}</view>
        </view>
      </view>
    </view>

    <view class="noCollect" v-if="judgeApply == false">
      <view>您还没有获得家长的申请</view>
      <view>您可以主动向家长发送申请哦</view>
    </view>
  </view>
</template>

<script>
// TODO - 引用 Bmob 相关代码
// var Bmob = require('../../utils/bmob.js');
const app = getApp()
export default {
  data() {
    return {
      apply_list: [],
      has_more: true,
      pageIndex: 0,
      judgeApply: true,
    }
  },
  onLoad: function () {
    this.applyLoad()
  },
  onReachBottom: function () {
    if (!this.data.has_more) {
      return
    }
    let pageIndex = this.data.pageIndex
    this.setData({
      pageIndex: ++pageIndex,
    })
    this.applyLoad()
  },
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 0,
      apply_list: [],
      has_more: true,
    })
    this.applyLoad()
  },
  methods: {
    applyLoad: function () {
      // TODO - Bmob 相关代码
      /*
            var page_size = 10;
            var currentUser = Bmob.User.current();
            var currentUserId = currentUser.id;
            var Apply = Bmob.Object.extend('apply');
            var queryApply = new Bmob.Query(Apply);
            queryApply.descending('createdAt');
            queryApply.skip(this.data.pageIndex * page_size);
            queryApply.limit(page_size);
            queryApply.equalTo('getApplyUser', currentUserId);
            queryApply.equalTo('delete', false);
            queryApply.include('applyStudent');
            uni.showLoading({
                title: '加载中...'
            });
            queryApply.find({
                success: function (results) {
                    uni.hideLoading();
                    console.log(results);
                    if (results.length == 0) {
                        this.setData({
                            judgeApply: false
                        });
                    } else {
                        var apply_list = this.data.apply_list;
                        var studentList = new Array();
                        var applyStudentList = new Array();
                        for (var i = 0; i < results.length; i++) {
                            studentList[i] = results[i];
                            applyStudentList[i] = studentList[i].get('applyStudent');
                        }
                        this.setData({
                            apply_list: apply_list.concat(applyStudentList)
                        });
                        console.log(results);
                        // 判断无更多数据
                        if (results.length < page_size) {
                            this.setData({
                                has_more: false
                            });
                        }
                    }
                },
                error: function (error) {
                    uni.showToast({
                        title: '网络错误',
                        image: '../../image/warn.png',
                        duration: 2000
                    });
                }
            });
            */
    },

    showDetail: function (e) {
      // TODO - Bmob 相关代码
      /*
            var currentUser = Bmob.User.current();
            var currentUserId = currentUser.id;
            var index = e.currentTarget.dataset.index;
            var objectId = this.data.apply_list[index].id;
            var Apply = Bmob.Object.extend('apply');
            var queryApply = new Bmob.Query(Apply);
            uni.navigateTo({
                url: '../studentDetail/studentDetail?showTelephone=true&showBottom=false&objectId=' + objectId
            });
            queryApply.equalTo('getApplyUser', currentUserId);
            queryApply.equalTo('applyStudent', objectId);
            queryApply.find({
                success: function (result) {
                    result[0].set('open', true);
                    result[0].save();
                },
                error: function (error) {
                    uni.showToast({
                        title: '网络错误',
                        image: '../../image/warn.png',
                        duration: 2000
                    });
                }
            });
            */
    },

    deleteApply: function (e) {
      // TODO - Bmob 相关代码
      /*
            var index = e.currentTarget.dataset.index;
            var objectId = this.data.apply_list[index].id;
            var currentUser = Bmob.User.current();
            var currentUserId = currentUser.id;
            var Apply = Bmob.Object.extend('apply');
            var queryApply = new Bmob.Query(Apply);
            queryApply.equalTo('getApplyUser', currentUserId);
            queryApply.equalTo('applyStudent', objectId);
            queryApply.find({
                success: function (result) {
                    result[0].set('delete', true);
                    result[0].save();
                    uni.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 1000
                    });
                },
                error: function (error) {}
            });
            */
    },
  },
}
</script>
<style>
@import './applyStudent.css';
</style>
