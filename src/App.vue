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
              <div class="color-set" v-for="item in initPalette" @click="choosePalette(item)">
                <div class="color-block" v-for="e in item" :style="{background: e}"></div>
              </div>
            </div>
            <div class="autoColor">
              <el-input v-model="inputColor" placeholder="#000000" style="width:75%" maxlength=7 @input="checkInput"></el-input>
              <el-color-picker v-model="inputColor" @change="checkInput"></el-color-picker>
            </div>
            <el-button type="text" plain @click="changeColor">生成</el-button>
            <div class="warn" v-if="warn">输入格式错误</div>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="18">
            <div class="chartGroup">
              <Bar v-show="chartIndex === 1" :showStatus="chartIndex" :title="title" :attrNum="attrNum" 
                   :barData="chartData.barData" :palette="paletteRecColor"></Bar>
              <Scatter v-show="chartIndex === 2" :showStatus="chartIndex" :title="title" :attrNum="attrNum" 
                       :scatterData="chartData.scatterData" :palette="paletteRecColor"></Scatter>
              <LineC v-show="chartIndex === 3" :showStatus="chartIndex" :title="title" :attrNum="attrNum" 
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
      warn: false,
      attrNum: 0,
      chartData: {
        scatterData: {},
        barData: [],
        lineData: []
      },
      initPalette: [
        ['#aaa', '#999', '#666'],
        ['#00f', '#00a', '#008'],
        ['#f00', '#a00', '#800']
      ],
      paletteRecColor: []
    };
  },
  async mounted () {
    // this.rawData = sample.rawData;
    this.paletteData = sample.paletteData;
    this.$axios.post('/api/Lab/Translate', JSON.stringify({
      L: 43,
      A: 26,
      B: 18
    })).then(res => {
      console.log(res);
    });
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
        barData: this.Common.lineDataInit(this.rawData),
        lineData: this.Common.lineDataInit(this.rawData)
      };
      this.chartIndex = 0;
      // 判断数据类型,推荐合适图表
      if (Object.keys(this.rawData[0]).length === 3) {
        if (Object.keys(this.chartData.scatterData.data).length < this.rawData.length) {
          this.chartIndex = 2;
        }
      }
      if (this.chartIndex === 0) {
        if (Object.keys(this.rawData).length - 1 >= 4 || this.rawData.length >= 6) {
          this.chartIndex = 3;
        } else {
          this.chartIndex = 1;
        }
      }
      // 数据类型推荐颜色
    },
    async changeColor () {
      console.log(this.inputColor);
      this.paletteData.startPalette = [];
      if (/^#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}$/.test(this.inputColor)) {
        // this.paletteData.startPalette.push(this.hex2Lab(this.inputColor));
        let res = await this.Common.paletteRec(this.paletteData);
        console.log('res', res);
      } else {
        this.warn = true;
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
      this.warn = false;
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
