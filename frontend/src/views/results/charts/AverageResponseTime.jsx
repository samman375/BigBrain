import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { mean, zipWith } from 'lodash';
import * as echarts from 'echarts';
import { makeStyles } from '@material-ui/core';

const timeStrDiff = (strX, strY) => {
  const dateX = new Date(strX);
  const dateY = new Date(strY);
  return (dateX - dateY) / 1000;
}
const useStyles = makeStyles({
  chart: {
    height: '400px'
  }
})
const reduceResults = (results) => {
  const xLabels = results.length
    ? results[0].answers.map((_, idx) => `Question ${idx + 1}`)
    : []
  const playersResponseTime = results.map(res => {
    return res.answers.map(answer => timeStrDiff(
      answer.answeredAt,
      answer.questionStartedAt
    ))
  })
  const data = zipWith(...playersResponseTime, (...group) => {
    return mean(group)
  })
  return { data, xLabels }
}
/** @returns {echarts.EChartsOption} */
const createChartOptions = (data) => {
  return {
    title: {
      text: 'Average Response Time'
    },
    series: {
      type: 'line',
      data: data.data
    },
    xAxis: {
      type: 'category',
      data: data.xLabels,
    },
    yAxis: {
      type: 'value',
      name: 'Response time (s)'
    },
    tooltip: {
      trigger: 'axis'
    }
  }
}

function AverageResponseTimeChart (props) {
  const classes = useStyles();
  useEffect(() => {
    const drawCharts = () => {
      const avgTimes = reduceResults(props.results);
      const options = createChartOptions(avgTimes);
      const chart = echarts.init(
        document.querySelector('#average-response-time')
      );
      chart.setOption(options);
      return chart;
    };
    const chart = drawCharts();
    return () => {
      chart.dispose();
    };
  }, []);
  return <div id='average-response-time' className={classes.chart}/>;
}

AverageResponseTimeChart.propTypes = {
  results: PropTypes.array.isRequired
}

export default AverageResponseTimeChart;
