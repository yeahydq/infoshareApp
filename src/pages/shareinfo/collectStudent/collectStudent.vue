<template>
  <view class="page">
    <view v-if="judgeCollect">
      <view
        class="row"
        @tap="showDetail"
        :data-index="index"
        v-for="(item, index) in collect_list"
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
              @tap.stop.prevent="deleteCollect"
              src="/static/image/delete.png"
            />
            <view class="address">{{ item.address[0] }}区</view>
            <view>{{ item.address[1] }}</view>
            <view class="salary">{{ item.salary }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="noCollect" v-if="!judgeCollect">
      <view>您还没有收藏家教</view>
      <view>快去找几个合适的家教吧~</view>
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
    if (!this.has_more) {
      return
    }
    this.pageIndex++
    this.collectLoad()
  },
  onPullDownRefresh: function () {
    this.pageIndex = 0
    this.collect_list = []
    this.has_more = true
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
            queryCollect.skip(this.pageIndex * page_size);
            queryCollect.limit(page_size);
            queryCollect.equalTo('currentUser', currentUserId);
            queryCollect.include('collectStudent');
            uni.showLoading({
                title: '加载中...'
            });
            queryCollect.find({
                success: function (results) {
                    console.log(results);
                    uni.stopPullDownRefresh();
                    uni.hideLoading();
                    if (results.length == 0) {
                        this.judgeCollect = false;
                    } else {
                        var collect_list = this.collect_list;
                        var studentList = new Array();
                        var CollectStudentList = new Array();
                        for (var i = 0; i < results.length; i++) {
                            studentList[i] = results[i];
                            CollectStudentList[i] = studentList[i].get('collectStudent');
                        }
                        this.collect_list = collect_list.concat(CollectStudentList);
                        if (results.length < page_size) {
                            this.has_more = false;
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
      const objectId = this.collect_list[index].id
      uni.navigateTo({
        url:
          '../studentDetail/studentDetail?showTelephone=false&showBottom=true&objectId=' + objectId,
      })
    },

    deleteCollect: function (e) {
      // TODO - Bmob 相关代码
      /*
            var index = e.currentTarget.dataset.index;
            var objectId = this.collect_list[index].id;
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
                    queryCollect.equalTo('collectStudent', objectId);
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
@import './collectStudent.css';
</style>
