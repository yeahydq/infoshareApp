<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人士注册' },
}
</route>

<template>
  <view class="container">
    <!-- <view class="process-bar">
      <view class="process-item active" @click="tabActive = '1'">
        <view class="process-icon">📝</view>
        <view class="process-text">基本信息</view>
      </view>
      <view class="process-item" @click="tabActive = '2'">
        <view class="process-icon">📎</view>
        <view class="process-text">上传资料</view>
      </view>
      <view class="process-item" @click="tabActive = '3'">
        <view class="process-icon">✓</view>
        <view class="process-text">完成</view>
      </view>
    </view> -->
    <wd-tabs v-model="tabActive">
      <template v-for="(item, index) in tabList" :key="index">
        <wd-tab :title="item.title" :name="item.key">
          <registerPage1 v-if="item.key === '1'"></registerPage1>
          <uploadDocuments v-if="item.key === '2'"></uploadDocuments>
        </wd-tab>
      </template>
    </wd-tabs>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import registerPage1 from './register-page1.vue'
import uploadDocuments from '../upload-documents/index.vue'

const tabActive = ref('1') // Changed to ref for reactivity

const tabList = ref([
  { key: '1', title: '📝基本信息' },
  { key: '2', title: '📎上传资料' },
  { key: '3', title: '完成' },
])
// const ruleTemplateTableActions = [
//   {
//     label: '编辑',
//     component: View,
//   },
//   {
//     label: '删除',
//     component: '<view>删除</view>',
//   },

/** 基本功能 */
// const page1 = pagesJson.pages
//   .filter((e) => e.path.startsWith('pages/demo/base') && !e.hide)
//   .map((e) => ({
//     title: handleTitle(e.style?.navigationBarTitleText),
//     path: e.path,
//   }))

const currContentList = [
  {
    title: '第一页',
    // path: 'pages/weshares/teacher-registration/register-page1',
    component: registerPage1,
  },
  {
    title: '第二页',
    // path: 'pages/weshares/upload-documents/index',
    component: uploadDocuments,
  },
  // {
  //   title: '完成',
  //   path: 'pages/demo/route-interceptor/login-model?name=feige&age=30',
  // },
  // {
  //   title: '静默登录',
  //   path: 'pages/demo/route-interceptor/login-auto?name=feige&age=30',
  // },
]

function getComponentName(key) {
  // 根据 key 返回对应的组件名
  switch (key) {
    case 'registerPage1':
      return 'registerPage1'
    case 'uploadDocuments':
      return 'uploadDocuments'
    default:
      return 'registerPage1' // 返回一个默认组件名
  }
}

// {
//   label: $t('common.edit'),
//   func: async (row) => {
//     console.log('编辑： ', row.edition_id)
//     selectedDataId.value = row.edition_id
//     let currentDetail = {}
//     // 编辑和详情模式mode均为view,组件内通过 isPreviewMode 再去区分编辑、详情
//     if (selectedDataId.value && selectedDataId.value !== -1) {
//       currentDetail = await editTemplateRef.value.getDetailByTable(selectedDataId.value)
//       if (!currentDetail.editable) {
//         return FMessage.error('没有编辑权限')
//       }
//       openEditPanel('view')
//     }
//   },
// },
// {
//   label: $t('common.delete'),
//   class: 'btn-delete',
//   func: async (row) => {
//     console.log('删除 ', row.edition_id)
//     selectedDataId.value = row.edition_id
//     let currentDetail = {}
//     if (selectedDataId.value && selectedDataId.value !== -1) {
//       currentDetail = await editTemplateRef.value.getDetailByTable(selectedDataId.value)
//       if (!currentDetail.editable) {
//         return FMessage.error('没有删除权限')
//       }
//     }
//     FModal.confirm({
//       title: $t('common.prompt'),
//       content: `确认删除中文名称为【${row.cn_name}】的标准值？`,
//       async onOk() {
//         console.log('信息', row)
//         await FRequest('api/v1/projector/standardValue/delete', {
//           edition_id: row.edition_id,
//           type: 1,
//         })
//         FMessage.success($t('toastSuccess.deleteSuccess'))
//         loadListData()
//       },
//     })
//   },
// },
</script>

<style>
@import './style.css';
</style>
