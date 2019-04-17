import XLSX from 'xlsx';
import axios from 'axios';
import * as d3 from 'd3';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

export default {
  // excel识别
  importExcel (obj) {
    let wb;
    let rABS = false; // 是否将文件读取为二进制字符串

    if (!obj.files) {
      return;
    }
    const IMPORTFILE_MAXSIZE = 1 * 1024; // 这里可以自定义控制导入文件大小
    var suffix = obj.files[0].name.split('.')[1];
    if (suffix !== 'xls' && suffix !== 'xlsx') {
      alert('导入的文件格式不正确!');
      return;
    }
    if (obj.files[0].size / 1024 > IMPORTFILE_MAXSIZE) {
      alert('导入的表格文件不能大于1M');
      return;
    }
    var f = obj.files[0];

    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(this.fixdata(data)), {// 手动转化
            type: 'base64'
          });
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          });
        }
        // wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        // wb.Sheets[Sheet名]获取第一个Sheet的数据
        // document.getElementById('demo').innerHTML = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
        data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        resolve({
          rawData: data,
          workSheet: wb
        });
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    });
  },
  fixdata (data) { // 文件流转BinaryString
    let o = '';
    let l = 0;
    let w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
  },
  get_obj_first_value (data) {
    for (var key in data) {
      return +data[key];
    }
  },
  get_obj_first_key (data) {
    for (var key in data) {
      return key;
    }
  },
  barDataInit (chartData) {
    let raw = [];
    // 初始化x轴及第一组数据
    for (let i in chartData) {
      for (let j in chartData[i]) {
        if (+i === 0) {
          raw[j] = [];
        }
        raw[j].push(chartData[i][j] + '');
      }
    }
    let formatData = [];
    for (let i in chartData[0]) {
      raw[i].splice(0, 0, i);
      formatData.push(raw[i]);
    }
    console.log(formatData);
    return formatData;
  },
  // 折线图数据初始化
  lineDataInit (chartData) {
    let formatData = [];
    let attr = [];
    // 获取属性值
    for (let i in chartData[0]) {
      attr.push(i + '');
    }
    formatData.push(attr);
    // 获取数据
    chartData.map(e => {
      let tableData = [];
      for (let j in e) {
        tableData.push(e[j]);
      }
      formatData.push(tableData);
    });
    return formatData;
  },
  // 散点图数据初始化
  scatterDataInit (chartData) {
    let formatData = {};
    let attr = Object.keys(chartData[0]);
    let keyValue = {};
    let xmin = chartData[0][attr[1]];
    let ymin = chartData[0][attr[2]];
    let xmax = chartData[0][attr[1]];
    let ymax = chartData[0][attr[2]];
    // 获取属性值
    for (let i in chartData) {
      if (keyValue[chartData[i][attr[0]]] === undefined) {
        keyValue[chartData[i][attr[0]]] = [];
      }
      xmin = chartData[i][attr[1]] < xmin ? chartData[i][attr[1]] : xmin;
      ymin = chartData[i][attr[2]] < ymin ? chartData[i][attr[2]] : ymin;
      xmax = chartData[i][attr[1]] > xmax ? chartData[i][attr[1]] : xmax;
      ymax = chartData[i][attr[2]] > ymax ? chartData[i][attr[2]] : ymax;

      keyValue[chartData[i][attr[0]]].push([chartData[i][attr[1]], chartData[i][attr[2]]]);
    }
    xmin = Math.floor(xmin - (xmax - xmin) * 0.1);
    ymin = Math.floor(ymin - (ymax - ymin) * 0.1);
    attr.splice(0, 1);
    formatData.attr = attr;
    formatData.data = keyValue;
    formatData.xmin = xmin;
    formatData.ymin = ymin;
    // console.log(keyValue);
    return formatData;
    // formatData.push(attr);
  },
  formatDataInit (data, type) {
    let info = {};
    let temp = data.slice(1, data.length);
    info.x = temp.map(e => e[0] + '');
    let series = [];
    for (let i = 1; i < data.length; i++) {
      for (let j = 1; j < data[i].length; j++) {
        if (i === 1) {
          series.push({
            name: data[0][j],
            type: type,
            data: [data[i][j]]
          });
        } else {
          series[j - 1].data.push(data[i][j]);
        }
      }
    }
    info.series = series;
    return info;
  },
  // 配色方案获取
  paletteRec (data) {
    return axios.post('/color/makePalette', JSON.stringify(data)).then(res => {
      if (+res.status === 200) {
        let convertRGB = res.data.palette.map(e => {
          let toRGB = d3.rgb(d3.lab(e[0], e[1], e[2]));
          console.log(e, toRGB);
          toRGB.r = toRGB.r < 0 ? 0 : toRGB.r;
          toRGB.g = toRGB.g < 0 ? 0 : toRGB.g;
          toRGB.b = toRGB.b < 0 ? 0 : toRGB.b;

          return '#' + this.formatHex(toRGB.r) + this.formatHex(toRGB.g) + this.formatHex(toRGB.b);
        });
        return Promise.resolve(convertRGB);
      }
    }).then(res => {
      if (res.length > 0) {
        return Promise.resolve(res);
      }
    }).catch(err => {
      console.log(err);
    });
  },
  formatHex (num) {
    return this.prefixIntrger(Math.floor(num).toString(16), 2);
  },
  // 自动补0
  prefixIntrger (num, length) {
    return (Array(length).join('0') + num).slice(-length);
  },
  colorAdd (oldValue, newValue, data, type) {
    if (oldValue < newValue) {
      for (let i = oldValue + 1; i <= newValue; i++) {
        data += type / i;
        if (data >= 1) {
          data -= type / i;
          break;
        }
      }
    } else {
      for (let i = oldValue; i > newValue; i--) {
        data -= type / i;
        if (data <= 0) {
          data += type / i;
          break;
        }
      }
    }
    return +data.toFixed(2);
  }
};
