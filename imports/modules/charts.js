const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const createChart = (id, title, data, zoom) => {
  const series = Object.values(data);

  const chart = Highcharts.chart(id, {
    title: {
      text: title,
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
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
      filename: `${id}-${Object.values(data).map(d => d.name.replace(/ /g, '_')).join('-')}`,
      buttons: {
        contextButton: {
          menuItems: ['download', 'downloadJPEG', 'downloadPDF'],
        },
        customButton: {
          y: 25,
          x: 5,
          onclick() {
            zoom(id.replace('chart_', ''));
          },
          symbol: 'url(/lupe-19.jpg)',
          symbolY: 20,
          symbolX: 20,
        },
      },
    },
  });
  return chart;
};

const getConfig = (id, title, data, zoom) => {
  const series = Object.values(data);
  return {
    isPureConfig: true,
    title: {
      text: title,
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
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
      filename: `${id}-${Object.values(data).map(d => d.name.replace(/ /g, '_')).join('-')}`,
      buttons: {
        contextButton: {
          menuItems: ['download', 'downloadJPEG', 'downloadPDF'],
        },
        customButton: {
          x: -20,
          onclick() {
            zoom(id.replace('chart_', ''));
          },
          symbol: 'url(/lupe-19.jpg)',
          symbolY: 15,
        },
      },
    },
  };
};


export {
  createChart,
  getConfig,
};
