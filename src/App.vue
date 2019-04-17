<template>
  <div id="app" ref="body">
    <!-- <img src="https://cdn.dribbble.com/users/2111138/screenshots/4730226/icon4_dribbble.gif" class="logo" ref="logo"> -->
    <span class="el-button el-button--primary fileinput" ref="btn">
      数据上传
      <input type="file" @change="getData">
    </span>
    <!-- <div class="colorBlock" v-if="colorPalette"
      v-for="(item, index) in colorPalette" v-bind:key="index"
      :style="{background: 'rgb('+ item[0] + ', '+ item[1] +', '+ item[2] + ')'}">
    </div> -->
    <!-- 图表 -->
    <div class="chart" v-show="showChart" ref="chart">
      <div class="catalog">
        <el-row class="tac">
          <el-col :span="4" class="list">
            <div class="type">
              <h5>图表类型</h5>
              <el-menu
                class="el-menu-vertical-demo"
                @select="menuSelect">
                <el-menu-item index="1" active>
                  <span slot="title">柱状图</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span slot="title">散点图</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <span slot="title">折线图</span>
                </el-menu-item>
              </el-menu>
            </div>
            <div class="palette">
              <div class="color-set" v-for="(item, index) in initPalette" v-bind:key="index" @click="choosePalette(item)">
                <div class="color-block" v-for="(e, idx) in item" v-bind:key="idx" :style="{background: e}"></div>
              </div>
            </div>
            <el-radio v-model="radio" label="1">pair preference</el-radio>
            <el-radio v-model="radio" label="2">perceptual distance</el-radio>
            <div class="autoColor">
              <el-input v-model="inputColor" placeholder="#000000" style="width:75%" maxlength=7 @input="checkInput"></el-input>
              <el-color-picker v-model="inputColor" @change="checkInput"></el-color-picker>
            </div>
            <el-button type="text" plain @click="changeColor">生成</el-button>
            <div class="warn">{{warn}}</div>
            <div class="slider">
              <el-slider v-if="chartIndex === 1" v-model="barSize" @change="optimizeColor" :min="10" :max="40"></el-slider>
              <el-slider v-if="chartIndex === 2" v-model="pointSize" @change="optimizeColor" :min="3" :max="40"></el-slider>
              <el-slider v-if="chartIndex === 3" v-model="lineSize" @change="optimizeColor" :min="1" :max="15"></el-slider>
            </div>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="18">
            <div class="chartGroup">
              <Bar v-show="chartIndex === 1" :showStatus="chartIndex" :title="title"
                   :barData="chartData.barData" :palette="paletteRecColor"></Bar>
              <Scatter v-show="chartIndex === 2" :showStatus="chartIndex" :title="title"
                       :scatterData="chartData.scatterData" :palette="paletteRecColor"></Scatter>
              <LineC v-show="chartIndex === 3" :showStatus="chartIndex" :title="title"
                     :lineData="chartData.lineData" :palette="paletteRecColor"></LineC>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <Table :tableData="rawData" v-if="showChart"></Table>
  </div>
</template>

<script>
import Table from './components/Table';
import Bar from './components/Bar';
import LineC from './components/Line';
import Scatter from './components/Scatter';
import sample from '../static/data.json';
import * as d3 from 'd3';

export default {
  name: 'App',
  components: {
    Table,
    Bar,
    LineC,
    Scatter
  },
  data () {
    return {
      rawData: [],
      formatData: [],
      workSheet: {},
      title: '',
      chartIndex: 0, //  1:bar 2:scatter 3:line
      showChart: true,
      paletteData: {},
      showColorP: false,
      inputColor: '#aaa',
      warn: '',
      radio: '1',
      barSize: 20,
      lineSize: 4,
      pointSize: 10,
      chartData: {
        scatterData: {},
        barData: [],
        lineData: []
      },
      initPalette: [],
      paletteRecColor: []
    };
  },
  async mounted () {
    console.log('test:', d3.hsl('#abcabc'), d3.rgb(d3.hsl('#abcabc')));
    // this.rawData = sample.rawData;
    this.paletteData = sample.paletteData;
  },
  methods: {
    // 数据上传
    async getData (file) {
      let res = await this.Common.importExcel(file.target);
      this.rawData = res.rawData;
      this.workSheet = res.workSheet;
      this.title = this.workSheet.SheetNames[0];
      this.showChart = this.rawData.length > 0;
      // 数据格式化
      this.chartData = {
        scatterData: this.Common.scatterDataInit(this.rawData),
        barData: this.Common.formatDataInit(this.Common.lineDataInit(this.rawData), 'bar'),
        lineData: this.Common.formatDataInit(this.Common.lineDataInit(this.rawData), 'line')
      };
      this.paletteData.paletteSize = Object.keys(this.rawData[0]).length - 1;
      let rawPalette = sample.paletteInit;
      this.initPalette = [];
      for (let i = 0; i < rawPalette.length; i++) {
        this.initPalette.push(rawPalette[i].slice(0, this.paletteData.paletteSize));
      }
      console.log(this.initPalette);
      this.chartIndex = 0;
      // 判断数据类型,推荐合适图表
      if (Object.keys(this.rawData[0]).length === 3) {
        if (Object.keys(this.chartData.scatterData.data).length < this.rawData.length) {
          this.chartIndex = 2;
        }
      }
      if (this.chartIndex === 0) {
        if (Object.keys(this.rawData[0]).length - 1 >= 4 || this.rawData.length >= 6) {
          this.chartIndex = 3;
        } else {
          this.chartIndex = 1;
        }
      }
      this.warn = '';
      // 数据类型推荐颜色
    },
    async changeColor () {
      this.paletteData.startPalette = [];
      if (+this.paletteData.paletteSize > 0) {
        if (this.radio === '1') {
          this.paletteData.weights.ciede2000 = 0.1;
          this.paletteData.weights.pairPreference = 0.9;
        } else if (this.radio === '2') {
          this.paletteData.weights.pairPreference = 0.1;
          this.paletteData.weights.ciede2000 = 0.9;
        }
        if (/^#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}$/.test(this.inputColor)) {
          this.paletteData.startPalette.push(this.hex2Lab(this.inputColor));
          let res = await this.Common.paletteRec(this.paletteData);
          console.log('res', res);
          this.paletteRecColor = res;
        } else {
          this.warn = '颜色格式输入错误';
        }
      } else {
        this.warn = '请先加载数据';
      }
    },
    // 标志大小改变优化颜色
    optimizeColor (e) {
      let chartDetail = {};
      if (this.rawData.length > 0) {
        if (this.chartIndex === 1) {
          // bar
          chartDetail = this.Echarts.init(document.getElementById('bar'));
          let option = chartDetail.getOption();
          let oldSize = 0;
          for (let i = 0; i < option.series.length; i++) {
            oldSize = option.series[i].barWidth;
            console.log(oldSize);
            option.series[i].barWidth = e + '%';
          }
          if (oldSize) {
            oldSize = +oldSize.replace('%', '');
            option.color = option.color.map(item => {
              let hsl = d3.hsl(item);
              hsl.s = +this.Common.colorAdd(oldSize, e, hsl.s, 0.09);
              hsl.l = +this.Common.colorAdd(oldSize, e, hsl.l, 0.09);
              let toRGB = d3.rgb(hsl);
              return '#' + this.Common.formatHex(toRGB.r) + this.Common.formatHex(toRGB.g) + this.Common.formatHex(toRGB.b);
            });
          }
          chartDetail.setOption(option);
        } else if (this.chartIndex === 2) {
          // scatter
          chartDetail = this.Echarts.init(document.getElementById('scatter'));
          let option = chartDetail.getOption();
          let oldSize = 0;
          for (let i = 0; i < option.series.length; i++) {
            oldSize = option.series[i].symbolSize;
            option.series[i].symbolSize = +e;
          }
          option.color = option.color.map(item => {
            let hsl = d3.hsl(item);
            hsl.s = +this.Common.colorAdd(oldSize, e, hsl.s, 0.1);
            hsl.l = +this.Common.colorAdd(oldSize, e, hsl.l, 0.1);
            let toRGB = d3.rgb(hsl);
            return '#' + this.Common.formatHex(toRGB.r) + this.Common.formatHex(toRGB.g) + this.Common.formatHex(toRGB.b);
          });
          chartDetail.setOption(option);
        } else if (this.chartIndex === 3) {
          // line
          let lineChartDetail = this.Echarts.init(document.getElementById('line'));
          let option = lineChartDetail.getOption();
          let oldSize = 0;
          for (let i = 0; i < option.series.length; i++) {
            oldSize = option.series[i].lineStyle.width;
            option.series[i].lineStyle.width = +e;
            option.series[i].symbolSize = +e + 1;
          }
          option.color = option.color.map(item => {
            let hsl = d3.hsl(item);
            hsl.s = +this.Common.colorAdd(oldSize, e, hsl.s, 0.09);
            hsl.l = +this.Common.colorAdd(oldSize, e, hsl.l, 0.09);
            let toRGB = d3.rgb(hsl);
            return '#' + this.Common.formatHex(toRGB.r) + this.Common.formatHex(toRGB.g) + this.Common.formatHex(toRGB.b);
          });
          lineChartDetail.setOption(option);
        }
      } else {
        this.warn = '请导入数据';
      }
    },
    hex2Lab (color) {
      let temp = d3.lab(d3.rgb(color));
      return [Math.round(temp.l), Math.round(temp.a), Math.round(temp.b)];
    },
    choosePalette (item) {
      this.paletteRecColor = item;
    },
    checkInput (e) {
      this.warn = '';
    },
    // 可视化类型选择
    menuSelect (index) {
      this.chartIndex = +index;
    }
  }
};
</script>

<style src="../static/index.css">
</style>
