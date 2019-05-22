import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import {Http} from "@angular/http";
import {ApiEndpoints} from '../app.endpoints';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'spline',
      height: 700
    },
    title: {
      text: 'WEEKLY RETENTION CURVE CHARTS'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '<b>x: </b>' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          ' <br> <b>y: </b>' + this.y.toFixed(2);
      }
    },
      xAxis:{
          categories:[]
      },
    series: [
        {
            name: '',
            data: [75, 0, 47, 28, 0]
        },
        {
            name: '',
            data: [159, 0, 0, 148, 11]
        },
        {
            name: '',
            data: [62, 0, 0, 0, 56]
        },
        {
            name: '',
            data: [43, 0, 0, 0]
        }]
  }
  private http: any;
  subscription: Subscription;
  xList: Array<String> = [];
  yList: Array<number> = [];
  ouetArrayList: Array<any> = [];

  constructor(http: Http)
  {
      this.http = http;
      let request = this.http.get(ApiEndpoints.ENDPOINT.VIEW_GRAPH).subscribe(response => {

          if (response.status === 200 ) {
               let increment = 0;
              response.json().data.forEach(row => {

                  this.xList.push(row['date']);

                  this.yList.push(row['size']);
                  this.yList.push(row['w1']);
                  this.yList.push(row['w2']);
                  this.yList.push(row['w3']);
                  this.yList.push(row['w4']);
                  this.ouetArrayList.push(this.yList);
                  this.options.series[0]['data'] = this.yList;
                  this.options.series[increment]['name'] = row['date'];
                  console.log(increment);
                  this.yList = [];
                  increment++;
              });
               this.options.xAxis.categories = this.xList;
               // this.options.series[0]['name'] = this.xList;
               Highcharts.chart('container', this.options);
          } else {
              console.log(response);
          }
      });
  }

  ngOnInit(){
    // Set 10 seconds interval to update data again and again
    const source = interval(10000);


    /*this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
      data => {
        const updated_normal_data = [];
        const updated_abnormal_data = [];
        data.forEach(row => {
          const temp_row = [
            new Date(row.timestamp).getTime(),
            row.value
          ];
          row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
        });
        this.options.series[0]['data'] = updated_normal_data;
        this.options.series[1]['data'] = updated_abnormal_data;
        Highcharts.chart('container', this.options);
      },
      error => {
        console.log('Something went wrong.');
      })
    );*/
  }

  getApiResponse(url) {

    /*return this.http.get<any>(url, {})
      .toPromise().then(res => {
        return res;
      });*/
  }
}

