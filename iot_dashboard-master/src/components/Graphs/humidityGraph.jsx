import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js";
import lo from "lodash";
//var Chart = require('chart.js');

import axios from "axios";
import Button from "../CustomButtons/Button.js";

import { HUMIDITY_WEEK, HUMIDITY_LAST24 } from "../Constant/constants.jsx";
var serverUrl = null;
const http = axios.create({ baseUrl: serverUrl });

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  padding: 30,
  margintop: 20,
  height: 100,
};

const myLabs = [];
const myDats = [4.5, 5.0, 6.0, 3.1, 5.6];

const myChartData = (labs, dats) => {
  return {
    labels: labs,
    datasets: [
      {
        label: "Graph for Humidity data recorded",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(255,255,255,0.4)",
        borderColor: "rgba(255,255,255,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: dats,
      },
    ],
  };
};

let lineChart;

class humidityGraph extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 5, labels: myLabs, data: myDats };
    this.chartRef = null;
    this.getHumidity = this.getHumidity.bind(this);
  }

  createChart = (labels, data) => {
    let ctx = document.getElementById("bar_l3_chart").getContext("2d");
    if (this.chartRef == null) {
      lineChart = new Chart(ctx, {
        type: "line",
        data: myChartData(labels, data),
      });
      this.chartRef = lineChart;
      //console.log(this.chartRef.data.labels);
    }
  };

  updateChart = (labels, data) => {
    console.log(this.chartRef.data);
    this.chartRef.data.labels = labels; //lo.takeRight(labels,5);
    console.log(this.chartRef.data.datasets[0]);
    this.chartRef.data.datasets.forEach((dataset) => {
      dataset.data = data;
    });
    this.chartRef.update();
  };

  componentDidMount() {
    this.createChart(this.state.labels, this.state.data);
  }
  componentWillMount() {
    axios
      .get(HUMIDITY_LAST24)
      .then((response) => {
        var hrsBtnSelected = document.getElementById("hum24hrs");
        hrsBtnSelected.style.opacity = "0.5";
        this.updateGraph(response.data);
      })
      .catch((err) => console.log(err));
  }
  updateGraph = (resData) => {
    console.log(resData);
    const { counter, labels, data } = this.state;
    const labellist = [];
    const datalist = [];
    Object.keys(resData).map((key, i) => {
      //console.log("inside updateGraph");
      // console.log(resData[key].fetcheddata.createdTime);
      const larr = resData[key].fetcheddata.createdTime;
      const darr = resData[key].fetcheddata.value;
      labellist.push(larr);
      datalist.push(darr);
      console.log(data);
    });
    this.setState({ data: datalist });
    this.setState({ labels: labellist });
    this.updateChart(this.state.labels, this.state.data);
    console.log("updategraph method");
  };
  getHumidity(arg) {
    //API request to fetch data
    const info = { pressure: "pressure" };
    if (arg === "Week") {
      console.log(arg === "Week");
      serverUrl = HUMIDITY_WEEK;
    } else {
      serverUrl = HUMIDITY_LAST24;
    }
    console.log(serverUrl);
    axios
      .get(serverUrl)
      .then((response) => {
        if (serverUrl === HUMIDITY_LAST24) {
          var hrsBtnSelected = document.getElementById("hum24hrs");
          hrsBtnSelected.style.opacity = "0.5";
          var weekBtnSelected = document.getElementById("humLastWeek");
          weekBtnSelected.style.opacity = "1";
        } else {
          var weekBtnSelected = document.getElementById("humLastWeek");
          weekBtnSelected.style.opacity = "0.5";
          var hrsBtnSelected = document.getElementById("hum24hrs");
          hrsBtnSelected.style.opacity = "1";
        }
        this.updateGraph(response.data);
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div /* style={styles} */>
        <div>
          {" "}
          <canvas id="bar_l3_chart" width="400" height="300"></canvas>{" "}
        </div>
        <div>
          {" "}
          <Button
            className="pull-left Buttonfont"
            id="humLastWeek"
            onClick={this.getHumidity.bind(this, "Week")}
            style={{ backgroundColor: "white" }}
          >
            Last Week Graph
          </Button>
          <Button
            className="pull-right Buttonfont"
            id="hum24hrs"
            onClick={this.getHumidity.bind(this, "Last")}
            style={{ backgroundColor: "white" }}
          >
            Last 24hrs Graph
          </Button>
        </div>
      </div>
    );
  }
}

export default humidityGraph;
