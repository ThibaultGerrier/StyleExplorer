const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

export default class Chart {
  constructor(config) {
    this.htmlId = config.htmlId;
    this.featureId = config.featureId;
    this.title = config.title;
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
    // console.log(this.data);
    // console.log(this.nGrams);
  }

  updateChart() {
    switch (this.type) {
      case 'line':
        this.lineChart();
        break;
      case 'boxplot':
        this.boxplot();
        break;
      case 'column':
        this.columnChart();
        break;
      default:
        console.log('Unknown chart type', this.type);
    }
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
          this.updateChart();
        } else {
          alert('Cannot go further up');
        }
      },
    };
    const previousNGram = {
      text: 'Decrease N',
      onclick: () => {
        if (this.curNGram > this.minNGram) {
          this.curNGram -= 1;
          this.setData();
          this.updateChart();
        } else {
          alert('Cannot go further down');
        }
      },
    };
    const removeWhiteSpace = {
      text: 'Without white space',
      onclick: () => {
        this.curWithWhiteSpace = !this.curWithWhiteSpace;
        this.updateChart();
      },
    };
    const addWhiteSpace = {
      text: 'With white space',
      onclick: () => {
        this.curWithWhiteSpace = !this.curWithWhiteSpace;
        this.updateChart();
      },
    };
    const toBoxPlot = {
      text: 'To a Boxplot',
      onclick: () => {
        this.boxplot();
      },
    };
    const toLineChart = {
      text: 'To a Line-chart',
      onclick: () => {
        this.lineChart();
      },
    };
    const extraCombi = {
      text: 'Add combination',
      onclick: () => {
        this.wordCount += 1;
        this.columnChart();
      },
    };
    const removeCombi = {
      text: 'Remove combination',
      onclick: () => {
        if (this.wordCount > 1) {
          this.wordCount -= 1;
          this.columnChart();
        } else {
          alert('Cannot remove more combinations');
        }
      },
    };
    const buttons = ['separator', 'downloadJPEG', 'downloadPDF'];

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
        if (this.withWhiteSpace) {
          buttons.unshift('separator');
          if (this.curWithWhiteSpace) {
            buttons.unshift(removeWhiteSpace);
          } else {
            buttons.unshift(addWhiteSpace);
          }
        }
        if (this.isGroupedNGram) {
          buttons.unshift('separator');
          buttons.unshift(previousNGram);
          buttons.unshift(nextNGram);
        }
        break;
      default:
        console.log('Unknown chart type', this.type);
    }

    const that = this;
    return {
      chart: {
        type,
      },
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
  }

  boxplot() {
    this.type = 'boxplot';
    const categories = Object.values(this.data).map(doc => doc.name);
    const outliers = [];
    // const meanofValues = 10;

    function mean(data) {
      const len = data.length;
      let sum = 0;
      for (let i = 0; i < len; i += 1) {
        sum += parseFloat(data[i]);
      }
      return (sum / len);
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
    const sortAndSlice = (a, extra) =>
      Object.entries(a)
        .sort(([, av], [, bv]) => bv - av)
        .slice(0, extra ? this.wordCount + extra : this.wordCount)
        .reduce((o, [k, v]) => {
          const i = {};
          i[k] = v;
          o.push(i);
          return o;
        }, []);
    const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);
    const avg = arr => sum(arr) / arr.length;

    const occPerDoc = {};
    Object.values(this.data).forEach((doc) => {
      const occ = {};
      Object.entries(doc.data).forEach(([key, value]) => {
        if (this.curWithWhiteSpace || !key.includes(' ')) {
          occ[key] = avg(value);
        }
      });
      occPerDoc[doc.id] = sortAndSlice(occ, 5);
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
    best = sortAndSlice(best);
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

  lineChart() {
    this.type = 'line';
    const series = [];
    Object.values(this.data).forEach((doc) => {
      const values = doc.data;
      const mappedData = [];
      values.forEach((p, i) => {
        mappedData.push([(i / (values.length - 1)) * 100, p]);
      });
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
    this.colors[docId].color = color;
  }

  switchSize() {
    this.isBig = !this.isBig;
    this.updateLabelLegend();
  }

  resetChart() {
    switch (this.type) {
      case 'line':
        this.lineChart();
        break;
      case 'boxplot':
        this.boxplot();
        break;
      case 'column':
        this.columnChart();
        break;
      default:
        console.log('Unknown chart type', this.type);
    }
  }

  create() {
    this.chart = Highcharts.chart(this.htmlId, this.options);
  }
}
