<script lang="ts" setup>
import { ref } from 'vue'
const emit = defineEmits(['add-H5-courseware'])
const props = defineProps({
  currentTab: {
    type: Number,
    default: 0
  }
})
const coursewareList = ref([
  {
    docName: '测试h5课件',
    docUrl: 'https://tic-res-1259648581.cos.ap-shanghai.myqcloud.com/board/h5webctrl/h5web.html'
  },
  {
    docName: '测试h5课件2',
    docUrl: 'https://vueday-2021.linusb.org/1'
  }
])
const handleClick = (item) => {
  console.log('handleClick', item)
  emit('add-H5-courseware', item)
}
</script>

<template>
<div>
	<div class="custom-tab">
    <span>自定义课件{{currentTab}}</span>
  </div>
  <div v-for="item in coursewareList" :key="item.docName"
    class="course-con-list"
  >
    <div class="course-con-list_info">
      <div class="course-list_left">
        <img src="./assets/h5.png"></img>
        <div class="name" @click="handleClick(item)">{{ item.docName }}</div>
      </div>

    </div>
  </div>
</div>
</template>

<style lang="less" scoped>
.custom-tab {
  color: #fff;
  font-size: 20px;
  line-height: 35px;
  font-weight: 400;
}
.course-con-list {
    width: 100%;
    height: 50px;
    padding: 0 8px;
    box-sizing: border-box;
    cursor: pointer;
    .course-con-list_info {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #5A5A5A;
      .course-list_left {
        display: flex;
        align-items: center;
      }
      img{
        width: 20px;
        height: 20px;
      }
    }
    &.last-child {
      .course-con-list_info {
        border: none;
      }
    }

    &:hover {
      border: 2px solid #006EFF;

      .course-con-list_info {
        border-bottom: none;
      }
    }
    .name {
      max-width: 395px;
      font-size: 14px;
      color: #fff;
      align-self: center;
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
    }
  }
</style>