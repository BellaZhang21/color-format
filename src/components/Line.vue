<template>
  <div id="line">
    line chart
  </div>
</template>

<script>
// import echarts from 'echarts';

export default {
  props: ['showStatus', 'title', 'lineData', 'palette'],
  data () {
    return {
      formatData: [],
      myChart: {},
      option: {}
    };
  },
  watch: {
    showStatus: function () {
      if (this.showStatus === 3 && Object.keys(this.lineData).length > 0) {
        this.chartInit();
      }
    },
    palette: function () {
      if (this.showStatus === 3 && this.palette.length > 0 && Object.keys(this.lineData).length > 0) {
        console.log('line palette change');
        this.chartInit();
      }
    }
  },
  mounted () {
    // this.drawLine();
  },
  methods: {
    async chartInit () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.Echarts.init(document.getElementById('line'));
      // 数据格式化
      this.formatData = this.lineData;
      // let num = this.formatData[0].length - 1;
      // let seriesData = [];
      // while (num--) {
      //   seriesData.push({
      //     type: 'line'
      //   });
      // }
      this.option = {
        title: {
          text: this.title
        },
        legend: {},
        tooltip: {},
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // dataset: {
        //   // 提供一份数据。
        //   source: this.formatData
        // },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {
          type: 'category',
          data: this.formatData.x
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.formatData.series
      };
      if (this.palette.length > 0) {
        this.option.color = this.palette;
      }
      this.myChart.setOption(this.option);
      // size: 4
    }
  }
};
</script>
<style>
  #line{
    width: 100%;
    height: 500px;
  }
</style>
