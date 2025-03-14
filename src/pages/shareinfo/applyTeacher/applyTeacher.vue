<template>
  <view class="page">
    <view class="page__bd">
      <view class="weui-tab">
        <view class="weui-navbar">
          <block v-for="(item, index) in tabs" :key="index">
            <view
              :id="index"
              :class="'weui-navbar__item ' + (activeIndex == index ? 'weui-bar__item_on' : '')"
              @tap="tabClick"
            >
              <view class="weui-navbar__title">{{ item }}</view>
            </view>
          </block>
          <view
            class="weui-navbar__slider"
            :style="
              'left: ' +
              sliderLeft +
              'px; transform: translateX(' +
              sliderOffset +
              'px); -webkit-transform: translateX(' +
              sliderOffset +
              'px);'
            "
          ></view>
        </view>
        <view class="weui-tab__panel">
          <view v-if="activeIndex == 0">
            <view v-if="judgeApply == true">
              <view
                class="row"
                @tap="showDetail"
                :data-index="index"
                v-for="(item, index) in apply_list"
                :key="index"
              >
                <view class="collect-teacher">
                  <view class="left">
                    <image class="teacherPhoto" :src="item.photo" />
                    <text>{{ item.teacher_name }}</text>
                  </view>
                  <view class="right">
                    <image
                      class="delete"
                      :data-index="index"
                      @tap.stop.prevent="deleteApply"
                      src="/static/image/delete.png"
                    />
                    <view class="teacher-university">{{ item.university }}</view>
                    <view class="teach-course">
                      <text v-for="(item, index1) in item.teach_course" :key="index1">
                        {{ item }}
                      </text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="noCollect" v-if="judgeApply == false">
              <view>您还没有获得教师的申请</view>
              <view>您可以主动向教师发送申请哦</view>
            </view>
          </view>
          <view v-if="activeIndex == 1">
            <view v-if="judgeSetApply == true">
              <view
                class="row"
                @tap="showDetail"
                :data-index="index"
                v-for="(item, index) in apply_set_list"
                :key="index"
              >
                <view class="collect-teacher">
                  <view class="left">
                    <image class="teacherPhoto" :src="item.photo" />
                    <text>{{ item.teacher_name }}</text>
                  </view>
                  <view class="right">
                    <image
                      class="delete"
                      :data-index="index"
                      @tap.stop.prevent="deleteApply"
                      src="/static/image/delete.png"
                    />
                    <view class="teacher-university">{{ item.university }}</view>
                    <view class="teach-course">
                      <text v-for="(item, index1) in item.teach_course" :key="index1">
                        {{ item }}
                      </text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="noCollect" v-if="judgeSetApply == false">
              <view>您还没有获得教师的申请</view>
              <view>您可以主动向教师发送申请哦</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// TODO - 引用 Bmob 相关代码
// var Bmob = require('../../utils/bmob.js');
const app = getApp()
const sliderWidth = 96
export default {
  data() {
    return {
      apply_list: [],
      apply_set_list: [],
      has_more: true,
      has_set_more: true,
      pageIndex: 0,
      judgeApply: true,
      judgeSetApply: true,
      tabs: ['我收到的申请', '我发送的申请'],
      activeIndex: '0',
      sliderOffset: 0,
      sliderLeft: 0,
    }
  },
  onLoad: function (options) {
    this.applyLoad()
    uni.getSystemInfo({
      success: function (res) {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
        })
      },
    })
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
    tabClick: function (e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id,
      })
    },

    applyLoad: function () {
      // TODO - Bmob 相关代码
      /*
            var page_size = 10;
            var currentUser = Bmob.User.current();
            var currentUserId = currentUser.id;
            var Apply = Bmob.Object.extend('apply');
            var queryApply = new Bmob.Query(Apply);
            var querySetApply = new Bmob.Query(Apply);
            queryApply.descending('createdAt');
            queryApply.skip(this.data.pageIndex * page_size);
            queryApply.limit(page_size);
            queryApply.equalTo('getApplyUser', currentUserId);
            queryApply.equalTo('delete', false);
            queryApply.include('applyTeacher');
            querySetApply.descending('createdAt');
            querySetApply.skip(this.data.pageIndex * page_size);
            querySetApply.limit(page_size);
            querySetApply.equalTo('applyUser', currentUserId);
            querySetApply.equalTo('deleteSet', false);
            querySetApply.include('applyTeacherDetail');
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
                        var teacherList = new Array();
                        var applyTeacherList = new Array();
                        for (var i = 0; i < results.length; i++) {
                            teacherList[i] = results[i];
                            applyTeacherList[i] = teacherList[i].get('applyTeacher');
                        }
                        this.setData({
                            apply_list: apply_list.concat(applyTeacherList)
                        });
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
            querySetApply.find({
                success: function (results) {
                    uni.hideLoading();
                    console.log(results);
                    if (results.length == 0) {
                        this.setData({
                            judgeSetApply: false
                        });
                    } else {
                        var apply_set_list = this.data.apply_set_list;
                        var teacherList = new Array();
                        var applyTeacherList = new Array();
                        for (var i = 0; i < results.length; i++) {
                            teacherList[i] = results[i];
                            applyTeacherList[i] = teacherList[i].get('applyTeacherDetail');
                        }
                        this.setData({
                            apply_set_list: apply_set_list.concat(applyTeacherList)
                        });
                        // 判断无更多数据
                        if (results.length < page_size) {
                            this.setData({
                                has_set_more: false
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
            console.log(this.data.apply_set_list);
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
                url: '../teacherDetail/teacherDetail?showTelephone=true&showBottom=false&objectId=' + objectId
            });
            queryApply.equalTo('getApplyUser', currentUserId);
            queryApply.equalTo('applyTeacher', objectId);
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
            queryApply.equalTo('applyTeacher', objectId);
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
@import './applyTeacher.css';
</style>
