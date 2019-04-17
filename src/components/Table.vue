<template>
<div class="test">
  <el-table
    :data="tableData"
    border
    class="table">
    <el-table-column
      v-for="(item, index) in propName"
      v-bind:key="index"
      :prop="item"
      :label="item">
    </el-table-column>
  </el-table>
</div>

</template>

<script>
export default {
  name: 'Table',
  props: ['tableData'],
  data () {
    return {
    };
  },
  computed: {
    propName: function () {
      let res = [];
      if (this.tableData.length > 0) {
        for (let i in this.tableData[0]) {
          res.push(i);
        }
        // this.propName = [...this.propName];
      }
      return res;
    }
  },
  mounted () {
    // console.log('table', this.tableData);
  }
};
</script>
<style>
  .table{
    /* width: 80%; */
    margin-top: 30px;
    margin-bottom: 60px;
  }
  .test{
    width: 80%;
  }
</style>
