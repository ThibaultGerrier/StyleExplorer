const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);

export default class Chart {
  constructor(config) {
    this.htmlId = config.htmlId;
    this.title = config.title;
    this.dimension = config.dimension;
    this.data = config.data;
    this.onZoomClick = config.onZoomClick;
    this.unit = config.unit;
    this.isBig = false;
    this.chart = {};
    this.wordCount = 7;
    this.colors = config.colors;
  }

  columnChart() {
    const sortAndSlice = a =>
      Object.entries(a)
        .sort(([, av], [, bv]) => bv - av)
        .slice(0, this.wordCount)
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
        occ[key] = avg(value);
      });
      occPerDoc[doc.id] = sortAndSlice(occ);
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
        color: this.colors[doc.id],
      });
    });

    const that = this;
    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: this.title,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories,
        crosshair: true,
      },
      yAxis: {
        min: 0,
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
        footerFormat: '</table>',
        useHTML: true,
        shared: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series,
      credits: {
        enabled: false,
      },
      exporting: {
        filename: `${this.htmlId}-${Object.values(this.data).map(d => d.name.replace(/ /g, '_')).join('-')}`,
        buttons: {
          contextButton: {
            menuItems: ['download', 'downloadJPEG', 'downloadPDF'],
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
    this.setOptions(options);
  }

  lineChart() {
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
        color: this.colors[doc.id],
        label: {
          enabled: false,
        },
      });
    });

    const that = this;
    const options = {
      chart: {
        type: 'line',
      },
      title: {
        text: this.title,
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        enabled: false,
      },
      xAxis: {
        crosshair: true,
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.x:.3f}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
        footerFormat: '</table>',
        useHTML: true,
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 0,
        },
      },
      series,
      responsive: {
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
      },
      credits: {
        enabled: false,
      },
      exporting: {
        filename: `${this.htmlId}-${Object.values(this.data).map(d => d.name.replace(/ /g, '_')).join('-')}`,
        buttons: {
          contextButton: {
            menuItems: ['download', 'downloadJPEG', 'downloadPDF'],
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
    this.setOptions(options);
  }

  setOptions(options) {
    if (this.chart && this.options) {
      this.chart.update(options);
    }
    this.options = options;
  }

  switchSize() {
    this.isBig = !this.isBig;
    this.chart.series.forEach((s, i) => {
      this.chart.series[i].update({ label: { enabled: this.isBig } });
    });
    this.options.series.forEach((s, i) => {
      this.options.series[i].label.enabled = this.isBig;
    });
    this.chart.update({ legend: { enabled: this.isBig } });
    this.options.legend.enabled = this.isBig;
  }

  create() {
    this.chart = Highcharts.chart(this.htmlId, this.options);
  }
}
