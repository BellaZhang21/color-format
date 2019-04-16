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
      if (this.barData.length > 0) {
        this.chartInit();
      }
    },
    palette: function  () {
      if (this.palette.length > 0 && this.barData.length > 0) {
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
      if (this.formatData.length > 0) {
        let num = this.formatData[0].length-1;
        let barSeries = [];
        while (num--) {
          barSeries.push({type: 'bar'});
        }
        let tipItem = [];
        for (let i = 1; i < this.formatData.length; i++) {
          tipItem.push(this.formatData[i][0]);
        }
        this.option = {
          title: {
            text: this.title
          },
          legend: {},
          tooltip: {
            data: tipItem
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          dataset: {
            // 提供一份数据。
            source: this.formatData
          },
          // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
          xAxis: {type: 'category'},
          // 声明一个 Y 轴，数值轴。
          yAxis: {},
          // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
          series: barSeries
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
