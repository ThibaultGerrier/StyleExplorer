/* eslint-disable max-len */
import { Bert } from 'meteor/themeteorchef:bert';

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/wordcloud')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);
const avg = arr => sum(arr) / arr.length;
const getAverages = (obj) => {
  const ret = {};
  Object.entries(obj).forEach(([k, v]) => {
    ret[k] = avg(v);
  });
  return ret;
};
const sortAndSlice = (a, sliceCount) =>
  Object.entries(a)
    .sort(([, av], [, bv]) => bv - av)
    .slice(0, sliceCount)
    .reduce((o, [k, v]) => {
      const i = {};
      i[k] = v;
      o.push(i);
      return o;
    }, []);

export default class Chart {
  constructor(config) {
    this.htmlId = config.htmlId;
    this.featureId = config.featureId;
    this.title = config.title;
    this.description = config.description;
    this.dimension = config.dimension;
    this.data = config.data;
    this.onZoomClick = config.onZoomClick;
    this.unit = config.unit;
    this.isBig = false;
    this.wordCount = 7;
    this.colors = config.colors;
    this.withWhiteSpace = config.withWhiteSpace;
    this.curWithWhiteSpace = true;
    this.nGrams = config.nGrams;
    // {123: {id:123, name:hello, data:{ 2:{ab:[],...}, 3: {abc:[],...} },
    this.curNGram = Number(config.curNGram);
    this.maxNGram = Number(config.maxNGram);
    this.minNGram = Number(config.curNGram);
    this.isGroupedNGram = config.isGroupedNGram;
    this.curDocIndex = 0;
    [this.curDocId] = Object.keys(config.data);
    this.docCound = Object.keys(config.data).length;
    this.wordCloudMaxEntries = 50;
    this.pieChartMaxEntries = 50;
  }

  setData() {
    const data = {};
    Object.entries(this.data).forEach(([k, v]) => {
      data[k] = v;
      data[k].data = this.nGrams[k].data[this.curNGram.toString()];
    });
    this.data = data;
  }

  getDefaultOptions(type) {
    const nextNGram = {
      text: 'Increase N',
      onclick: () => {
        if (this.curNGram < this.maxNGram) {
          this.curNGram += 1;
          this.setData();
          this.resetChart();
        } else {
          Bert.alert('Cannot go further up', 'warning');
        }
      },
    };
    const previousNGram = {
      text: 'Decrease N',
      onclick: () => {
        if (this.curNGram > this.minNGram) {
          this.curNGram -= 1;
          this.setData();
          this.resetChart();
        } else {
          Bert.alert('Cannot go further down', 'warning');
        }
      },
    };
    const removeWhiteSpace = {
      text: 'Without white space',
      onclick: () => {
        this.curWithWhiteSpace = !this.curWithWhiteSpace;
        this.resetChart();
      },
    };
    const addWhiteSpace = {
      text: 'With white space',
      onclick: () => {
        this.curWithWhiteSpace = !this.curWithWhiteSpace;
        this.resetChart();
      },
    };
    const toBoxPlot = {
      text: 'To a Boxplot',
      onclick: () => {
        this.resetChart('boxplot');
      },
    };
    const toLineChart = {
      text: 'To a line chart',
      onclick: () => {
        this.resetChart('line');
      },
    };
    const toColumnChart = {
      text: 'To a column chart',
      onclick: () => {
        this.resetChart('column');
      },
    };
    const toWordCloud = {
      text: 'To a word cloud',
      onclick: () => {
        this.resetChart('wordcloud');
      },
    };
    const toPieChart = {
      text: 'To a pie chart',
      onclick: () => {
        this.resetChart('pie');
      },
    };
    const extraCombi = {
      text: 'Add combination',
      onclick: () => {
        this.wordCount += 1;
        this.resetChart();
      },
    };
    const removeCombi = {
      text: 'Remove combination',
      onclick: () => {
        if (this.wordCount > 1) {
          this.wordCount -= 1;
          this.resetChart();
        } else {
          Bert.alert('Cannot remove more combinations', 'warning');
        }
      },
    };
    const nextDocument = {
      text: 'Next document',
      onclick: () => {
        if (this.curDocIndex < this.docCound - 1) {
          this.curDocIndex += 1;
        } else {
          this.curDocIndex = 0;
        }
        this.curDocId = Object.values(this.data)[this.curDocIndex].id;
        this.resetChart();
      },
    };
    const previousDocument = {
      text: 'Previous document',
      onclick: () => {
        if (this.curDocIndex > 0) {
          this.curDocIndex -= 1;
        } else {
          this.curDocIndex = this.docCound - 1;
        }
        this.curDocId = Object.values(this.data)[this.curDocIndex].id;
        this.resetChart();
      },
    };

    const description = {
      text: ' About this feature',
      onclick: () => {
        // no better idea without overkilling (modal maybe?)
        alert(this.description);
      },
    };

    const buttons = ['separator', 'downloadJPEG', 'downloadPDF', description];

    switch (this.type) {
      case 'line':
        buttons.unshift(toBoxPlot);
        break;
      case 'boxplot':
        buttons.unshift(toLineChart);
        break;
      case 'column':
        buttons.unshift(removeCombi);
        buttons.unshift(extraCombi);
        buttons.unshift('separator');
        if (this.withWhiteSpace) {
          if (this.curWithWhiteSpace) {
            buttons.unshift(removeWhiteSpace);
          } else {
            buttons.unshift(addWhiteSpace);
          }
          buttons.unshift('separator');
        }
        if (this.isGroupedNGram) {
          buttons.unshift(previousNGram);
          buttons.unshift(nextNGram);
          buttons.unshift('separator');
        }
        buttons.unshift(toWordCloud);
        buttons.unshift(toPieChart);
        break;
      case 'wordcloud':
        buttons.unshift(previousDocument);
        buttons.unshift(nextDocument);
        buttons.unshift('separator');
        if (this.withWhiteSpace) {
          if (this.curWithWhiteSpace) {
            buttons.unshift(removeWhiteSpace);
          } else {
            buttons.unshift(addWhiteSpace);
          }
          buttons.unshift('separator');
        }
        if (this.isGroupedNGram) {
          buttons.unshift(previousNGram);
          buttons.unshift(nextNGram);
          buttons.unshift('separator');
        }
        buttons.unshift(toColumnChart);
        buttons.unshift(toPieChart);
        break;
      case 'pie':
        buttons.unshift(previousDocument);
        buttons.unshift(nextDocument);
        buttons.unshift('separator');
        if (this.withWhiteSpace) {
          if (this.curWithWhiteSpace) {
            buttons.unshift(removeWhiteSpace);
          } else {
            buttons.unshift(addWhiteSpace);
          }
          buttons.unshift('separator');
        }
        if (this.isGroupedNGram) {
          buttons.unshift(previousNGram);
          buttons.unshift(nextNGram);
          buttons.unshift('separator');
        }
        buttons.unshift(toColumnChart);
        buttons.unshift(toWordCloud);
        break;
      default:
        console.log('Unknown chart type', this.type);
    }

    const that = this;
    const options = {
      title: {
        text: this.title,
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        filename: `${this.htmlId}-${Object.values(this.data).map(d => d.name.replace(/ /g, '_')).join('-')}`,
        buttons: {
          contextButton: {
            menuItems: buttons,
          },
          customButton: {
            y: 25,
            x: 5,
            onclick() {
              that.onZoomClick(that.htmlId.replace('chart_', ''), that);
            },
            symbol: 'url(/lupe-19.jpg)',
            symbolY: 20,
            symbolX: 20,
          },
        },
      },
    };
    if (type) {
      options.chart = {
        type,
      };
    }
    return options;
  }

  lineChart() {
    this.type = 'line';
    const series = [];
    Object.values(this.data).forEach((doc) => {
      const values = doc.data;
      const mappedData = [];
      if (values.length === 1) {
        mappedData.push([0, values[0]]);
        mappedData.push([100, values[0]]);
      } else {
        values.forEach((p, i) => {
          mappedData.push([(i / (values.length - 1)) * 100, p]);
        });
      }
      series.push({
        id: doc.id,
        name: doc.name,
        data: mappedData,
        color: this.colors[doc.id].color,
        label: {
          enabled: false,
        },
      });
    });

    const options = this.getDefaultOptions('line');
    options.legend = {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      enabled: false,
    };
    options.xAxis = {
      crosshair: true,
      title: {
        text: 'Document completion (paragraphs)',
      },
    };
    options.tooltip = {
      headerFormat: '<span>{point.x:.3f}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
      footerFormat: '</table>',
      useHTML: true,
    };
    options.plotOptions = {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 0,
      },
    };
    options.series = series;
    options.responsive = {
      rules: [{
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
        },
      }],
    };
    this.setOptions(options);
  }

  boxplot() {
    this.type = 'boxplot';
    const categories = Object.values(this.data).map(doc => doc.name);
    const outliers = [];

    function mean(data) {
      const len = data.length;
      let s = 0;
      for (let i = 0; i < len; i += 1) {
        s += parseFloat(data[i]);
      }
      return (s / len);
    }

    function numSort(a, b) {
      return a - b;
    }

    function getPercentile(dataSrc, percentile) {
      const data = dataSrc.slice(); // copy by value
      data.sort(numSort);
      const index = (percentile / 100) * data.length;
      let result;
      if (Math.floor(index) === index) {
        result = (data[(index - 1)] + data[index]) / 2;
      } else {
        result = data[Math.floor(index)];
      }
      return result;
    }

    function getBoxValues(data, x, color, doc) {
      const nx = typeof x === 'undefined' ? 0 : x;
      const boxData = {};
      const out = {
        name: 'Outlier',
        type: 'scatter',
        color,
        tooltip: {
          pointFormat: 'Value: {point.y:.3f}',
        },
        data: [],
        id: `${doc.id}-outliers`,
        marker: {
          symbol: 'circle',
        },
      };
      // const min = Math.min(...data);
      // const max = Math.max(...data);
      const q1 = getPercentile(data, 25);
      const median = getPercentile(data, 50);
      const q3 = getPercentile(data, 75);
      const iqr = q3 - q1;
      const lowerFence = q1 - (iqr * 1.5);
      const upperFence = q1 + (iqr * 1.5);

      for (let i = 0; i < data.length; i += 1) {
        if (data[i] < lowerFence || data[i] > upperFence) {
          out.data.push([nx, data[i]]);
        }
      }
      boxData.values = {
        x: nx,
        low: lowerFence,
        q1,
        median,
        q3,
        high: upperFence,
        color,
        key: doc.name,
        id: doc.id,
      };
      outliers.push(out);
      return boxData;
    }

    const boxData = [];
    const meanData = [];
    let boxValues;
    Object.values(this.data).forEach((doc, i) => {
      const { data } = doc;

      boxValues = getBoxValues(data, i, this.colors[doc.id].color, doc);
      boxData.push(boxValues.values);
      meanData.push([i, mean(data)]);
    });
    // console.log(meanData);
    // console.log(boxData);
    // console.log(outliers);
    const series = [];

    series.push({
      id: 'outliers',
      name: 'Outliers',
      type: 'scatter',
      color: '#0000ff',
      marker: {
        enabled: true,
        radius: 2,
        fillColor: 'transparent',
        lineColor: 'rgba(40,40,56,0.5)',
        lineWidth: 1,
      },
      data: boxValues.outliers,
    });

    const options = this.getDefaultOptions('boxplot');
    options.xAxis = {
      categories,
    };

    options.yAxis = {
      title: {
        text: 'Values',
      },
    };

    options.series = [{
      data: boxData,
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">●</span> <b> {point.key}</b><br/>' +
        'Maximum: {point.high:.3f}<br/>' +
        'Upper quartile: {point.q3:.3f}<br/>' +
        'Median: {point.median:.3f}<br/>' +
        'Lower quartile: {point.q1:.3f}<br/>' +
        'Minimum: {point.low:.3f}<br/>',
        footerFormat: '',
        useHTML: true,
        shared: true,
      },
    }];

    options.series = options.series.concat(outliers);

    this.setOptions(options);
  }

  columnChart() {
    this.type = 'column';

    const occPerDoc = {};
    Object.values(this.data).forEach((doc) => {
      const occ = {};
      Object.entries(doc.data).forEach(([key, value]) => {
        if (this.curWithWhiteSpace || !key.includes(' ')) {
          occ[key] = avg(value);
        }
      });
      occPerDoc[doc.id] = sortAndSlice(occ, this.wordCount + 5);
    });

    let best = {};
    Object.values(occPerDoc).forEach((occ) => {
      occ.forEach((val) => { // val 1 key value pair
        const [word, value] = Object.entries(val)[0];
        if (!best[word]) {
          best[word] = value;
        } else {
          best[word] += value;
        }
      });
    });
    best = sortAndSlice(best, this.wordCount);
    const categories = [];
    best.forEach((pair) => {
      categories.push(Object.keys(pair)[0]);
    });

    const series = [];
    Object.values(this.data).forEach((doc) => {
      const data = [];
      categories.forEach((cat) => {
        if (doc.data[cat]) {
          data.push(avg(doc.data[cat]));
        } else {
          data.push(0.0);
        }
      });
      series.push({
        id: doc.id,
        name: doc.name,
        data,
        color: this.colors[doc.id].color,
      });
    });

    const options = this.getDefaultOptions('column');

    if (this.isGroupedNGram) {
      options.subtitle = {
        text: `N = ${this.curNGram}`,
        style: {
          fontSize: '1.2em',
        },
      };
    }

    options.xAxis = {
      categories,
      crosshair: true,
    };

    options.yAxis = {
      min: 0,
    };
    options.tooltip = {
      headerFormat: '<span>{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
      footerFormat: '</table>',
      useHTML: true,
      shared: true,
    };
    options.plotOptions = {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    };
    options.series = series;
    this.setOptions(options);
  }

  wordcloud() {
    this.type = 'wordcloud';
    const data = [];
    sortAndSlice(getAverages(this.data[this.curDocId].data), this.wordCloudMaxEntries).forEach((entry) => {
      const [key, value] = Object.entries(entry)[0];
      data.push({
        name: key,
        weight: value,
      });
    });
    const series = [{
      type: 'wordcloud',
      data,
      name: 'Occurrences',
    }];
    const options = this.getDefaultOptions();
    options.subtitle = {
      text: this.data[this.curDocId].name,
      style: {
        color: this.colors[this.curDocId].color,
        fontSize: '1.2em',
      },
    };
    options.series = series;
    this.setOptions(options);
  }

  pieChart() {
    this.type = 'pie';
    const data = [];
    sortAndSlice(getAverages(this.data[this.curDocId].data), this.pieChartMaxEntries).forEach((entry) => {
      const [key, value] = Object.entries(entry)[0];
      data.push({
        name: key,
        y: value,
      });
    });
    const series = [{
      name: this.data[this.curDocId].name,
      colorByPoint: true,
      data,
    }];

    const options = this.getDefaultOptions('pie');
    options.tooltip = {
      pointFormat: '{series.name}: <b>{point.percentage:.3f}%</b>',
    };
    options.subtitle = {
      text: `Distribution for top ${this.pieChartMaxEntries}: ${this.data[this.curDocId].name}`,
      style: {
        color: this.colors[this.curDocId].color,
        fontSize: '1.2em',
      },
    };
    options.plotOptions = {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          format: '<b>{point.name}</b>: {point.percentage:.3f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
          },
          filter: {
            property: 'percentage',
            operator: '>',
            value: 2,
          },
        },
      },
    };
    // console.log(options);
    // console.log(JSON.stringify(options));
    options.series = series;
    this.setOptions(options);
  }

  setOptions(options) {
    this.options = options;
    if (this.chart && this.options) {
      this.create();
      this.updateLabelLegend();
    }
  }

  updateLabelLegend() {
    if (this.type === 'line') {
      this.chart.series.forEach((s, i) => {
        this.chart.series[i].update({ label: { enabled: this.isBig } });
      });
      this.options.series.forEach((s, i) => {
        this.options.series[i].label.enabled = this.isBig;
      });
    }
    if (this.type === 'line' || this.type === 'column') {
      this.chart.update({ legend: { enabled: this.isBig } });
      this.options.legend.enabled = this.isBig;
    }
    if (this.type === 'pie') {
      this.chart.update({ plotOptions: { pie: { dataLabels: { enabled: this.isBig } } } });
    }
  }

  setColor(docId, color) {
    const series = this.chart.get(docId);
    const seriesOutliers = this.chart.get(`${docId}-outliers`);
    if (series && series.color) {
      series.update({ color });
    }
    if (seriesOutliers && seriesOutliers.color) {
      seriesOutliers.update({ color });
    }
    if (this.chart.subtitle.textStr) {
      this.chart.subtitle.update({ style: { color } });
    }
    this.colors[docId].color = color;
  }

  switchSize() {
    this.isBig = !this.isBig;
    this.updateLabelLegend();
  }

  resetChart(type) {
    switch (type || this.type) {
      case 'line':
        this.lineChart();
        break;
      case 'boxplot':
        this.boxplot();
        break;
      case 'column':
        this.columnChart();
        break;
      case 'wordcloud':
        this.wordcloud();
        break;
      case 'pie':
        this.pieChart();
        break;
      default:
        console.log('Unknown chart type', this.type);
    }
  }

  create() {
    this.chart = Highcharts.chart(this.htmlId, this.options);
  }
}
