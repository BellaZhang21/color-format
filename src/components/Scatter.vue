<template>
  <div id="scatter">
    scatter chart
  </div>
</template>

<script>

export default {
  props: ['showStatus', 'title', 'scatterData', 'palette'],
  data () {
    return {
      formatData: [],
      myChart: {},
      option: {}
    };
  },
  watch: {
    showStatus: function () {
      if (this.showStatus === 2 && Object.keys(this.scatterData).length > 0) {
        this.chartInit();
      }
    },
    scatterData: function () {
      if (this.showStatus === 2 && Object.keys(this.scatterData).length > 0) {
        this.chartInit();
      }
    },
    palette: function  () {
      if (this.palette.length > 0 && Object.keys(this.scatterData).length > 0) {
        this.option.color = this.palette;
        this.myChart.setOption(this.option);
      }
    }
  },
  mounted () {
  },
  methods: {
    chartInit () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.Echarts.init(document.getElementById('scatter'));
      let that = this;
      let option = {};
      this.formatData = this.scatterData;
      let dataSeries = Object.keys(this.formatData.data).map(e => {
        return {
          name: e,
          type: 'scatter',
          data: this.formatData.data[e]
        };
      });
      this.option = {
        title: {
          text: this.title
        },
        legend: {
          data: Object.keys(this.formatData.data)
        },
        tooltip: {
          formatter: function (params) {
            return params.seriesName + ' :<br/>'
              + that.formatData.attr[0] + ':' + params.value[0] + '<br/>'
              + that.formatData.attr[1] + ':' + params.value[1];
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // 声明一个 X 轴
        xAxis: {
          name: this.formatData.attr[0],
          min: this.formatData.xmin
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {
          name: this.formatData.attr[1],
          min: this.formatData.ymin

        },
        series: dataSeries
      };
      if (this.palette.length > 0) {
        this.option.color = this.palette;
      }
      this.myChart.setOption(this.option);
    }
    
  }
};
</script>
<style>
  #scatter{
    width: 100%;
    height: 500px;
    background: #eee;
  }
</style>
