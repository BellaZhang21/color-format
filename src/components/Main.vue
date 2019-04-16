<template>
  <div class="hello">
  <span class="el-button el-button--primary fileinput">
    数据上传
    <input type="file" @change="getData">
  </span>
  </div>
</template>

<script>
import Common from '../../common'
export default {
  name: 'Main',
  data () {
    return {
      data: []
    }
  },
  methods: {
    getData (file) {
      console.log('aaa', file.target.files)
      Common.importExcel(file.target)
    }
  }
}

</script>

<style scoped>
  .fileinput{
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .fileinput input {
    position: absolute;
    left: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
  }
</style>
