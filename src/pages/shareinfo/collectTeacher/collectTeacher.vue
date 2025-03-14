<template>
  <view class="page" v-if="judgeCollect">
    <view
      class="row"
      @tap="showDetail"
      :data-index="index"
      v-for="(item, index) in collect_list"
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
            @tap.stop.prevent="deleteCollect"
            src="/static/image/delete.png"
          />
          <view class="teacher-university">{{ item.university }}</view>
          <view class="teach-course">
            <text v-for="(item, index1) in item.teach_course" :key="index1">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="noCollect" v-if="!judgeCollect">
      <view>您还没有收藏教师</view>
      <view>快去找几个合适的教师吧~</view>
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
      collect_list: [],
      has_more: true,
      pageIndex: 0,
      judgeCollect: true,
    }
  },
  onLoad: function () {
    this.collectLoad()
  },
  onReachBottom: function () {
    if (!this.data.has_more) {
      return
    }
    let pageIndex = this.data.pageIndex
    this.setData({
      pageIndex: ++pageIndex,
    })
    this.collectLoad()
  },
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 0,
      collect_list: [],
      has_more: true,
    })
    this.collectLoad()
  },
  methods: {
    collectLoad: function () {
      // TODO - Bmob 相关代码
      /*
            var page_size = 10;
            var currentUser = Bmob.User.current();
            var currentUserId = currentUser.id;
            var Collect = Bmob.Object.extend('collect');
            var queryCollect = new Bmob.Query(Collect);
            queryCollect.descending('createdAt');
            queryCollect.skip(this.data.pageIndex * page_size);
            queryCollect.limit(page_size);
            queryCollect.equalTo('currentUser', currentUserId);
            queryCollect.include('collectTeacher');
            uni.showLoading({
                title: '加载中...'
            });
            queryCollect.find({
                success: function (results) {
                    console.log(results);
                    uni.stopPullDownRefresh();
                    uni.hideLoading();
                    if (results.length == 0) {
                        this.setData({
                            judgeCollect: false
                        });
                    } else {
                        var collect_list = this.data.collect_list;
                        var teacherList = new Array();
                        var CollectTeacherList = new Array();
                        for (var i = 0; i < results.length; i++) {
                            teacherList[i] = results[i];
                            CollectTeacherList[i] = teacherList[i].get('collectTeacher');
                        }
                        this.setData({
                            collect_list: collect_list.concat(CollectTeacherList)
                        });
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
      const index = e.currentTarget.dataset.index
      const objectId = this.data.collect_list[index].id
      uni.navigateTo({
        url:
          '../teacherDetail/teacherDetail?showTelephone=false&showBottom=true&objectId=' + objectId,
      })
    },

    deleteCollect: function (e) {
      // TODO - Bmob 相关代码
      /*
            var index = e.currentTarget.dataset.index;
            var objectId = this.data.collect_list[index].id;
            var currentUser = Bmob.User.current();
            var currentUserId = currentUser.id;
            var user = Bmob.Object.extend('_User');
            var query = new Bmob.Query(user);
            var collect = Bmob.Object.extend('collect');
            var queryCollect = new Bmob.Query(collect);
            query.get(currentUserId, {
                success: function (result) {
                    result.remove('collect', objectId);
                    result.save();
                },
                error: function (error) {}
            });
            queryCollect.find({
                success: function (result) {
                    queryCollect.equalTo('collectTeacher', objectId);
                    queryCollect.equalTo('currentUser', currentUserId);
                    queryCollect.destroyAll({
                        success: function () {
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1000
                            });
                        },
                        error: function (err) {
                            // 删除失败
                        }
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
@import './collectTeacher.css';
</style>
