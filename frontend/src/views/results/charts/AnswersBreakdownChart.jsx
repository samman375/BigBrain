import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import * as echarts from 'echarts';
import { zip } from 'lodash'
const useStyles = makeStyles(theme => ({
  chart: {
    height: '400px',
    width: '100%'
  }
}));

const reduceResults = (results) => {
  const correct = results.length ? results[0].answers.map(_ => 0) : [];
  const wrong = results.length ? results[0].answers.map(_ => 0) : [];
  const xLabels = results.length
    ? results[0].answers.map((_, idx) => `Question ${idx + 1}`)
    : []
  for (const result of results) {
    result.answers.forEach((val, idx) => {
      if (val.correct) {
        correct[idx] += 1;
      } else {
        wrong[idx] += 1;
      }
    });
  }

  return {
    correct, wrong, xLabels
  };
}

/**
 * @returns {echarts.EChartsOption}
 */
const makeChartOptions = (data) => {
  const total = zip(data.correct, data.wrong).map((v) => v[0] + v[1]);
  const percentageFormatter = (array, idx) => {
    return (array[idx] / total[idx] * 100).toFixed(2) + '%';
  }
  return {
    title: {
      text: 'Answers Breakdown',
      textStyle: {
        fontFamily: 'Roboto'
      }
    },
    series: [
      {
        type: 'bar',
        name: 'Wrong',
        color: '#e57373',
        data: data.wrong,
        label: {
          show: true,
          formatter: p => percentageFormatter(data.correct, p.dataIndex),
          position: 'top'
        }
      },
      {
        type: 'bar',
        name: 'Correct',
        data: data.correct,
        label: {
          show: true,
          formatter: p => percentageFormatter(data.correct, p.dataIndex),
          position: 'top'
        }
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.xLabels
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      name: 'Questions',
      nameGap: 24
    },
  };
};

const AnswersBreakdownChart = (props) => {
  const classes = useStyles()
  useEffect(() => {
    const drawCharts = () => {
      const chartData = reduceResults(props.results);
      const chart = echarts.init(
        document.querySelector('#answers-breakdown-chart')
      );
      const chartOptions = makeChartOptions(chartData);
      chart.setOption(chartOptions);
      return chart;
    }

    const chart = drawCharts();
    return chart.dispose;
  }, []);
  return (
    <div className={classes.chart} id='answers-breakdown-chart' />
  );
};

AnswersBreakdownChart.propTypes = {
  results: PropTypes.array
}

export default AnswersBreakdownChart;
