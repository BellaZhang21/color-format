<template>
  <div id="bar">
    bar chart
  </div>
</template>

<script>
// import echarts from 'echarts';

export default {
  props: ['showStatus', 'title', 'barData', 'palette'],
  data () {
    return {
      formatData: [],
      myChart: {},
      option: {}
    };
  },
  watch: {
    showStatus: function () {
      if (this.showStatus === 1) {
        this.chartInit();
      }
    },
    barData: function () {
      if (this.showStatus === 1 && Object.keys(this.barData).length > 0) {
        this.chartInit();
      }
    },
    palette: function () {
      if (this.showStatus === 1 && this.palette.length > 0 && Object.keys(this.barData).length > 0) {
        this.chartInit();
        this.option.color = this.palette;
        this.myChart.setOption(this.option);
      }
    }
  },
  mounted () {
    // this.drawLine();
  },
  methods: {
    chartInit () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.Echarts.init(document.getElementById('bar'));
      this.formatData = this.barData;
      if (Object.keys(this.formatData).length > 0) {
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
      }
    }
  }
};
</script>
<style>
  #bar{
    width: 100%;
    height: 500px;
    background: #eee;
  }
</style>
