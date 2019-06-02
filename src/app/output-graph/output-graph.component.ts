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
            data: []
        },
        {
            name: '',
            data: []
        },
        {
            name: '',
            data: []
        },
        {
            name: '',
            data: []
        }
        ]
  };

  private http: any;
  subscription: Subscription;
  xList: Array<String> = [];
  yList: Array<number> = [];
  outArrayList: Array<any> = [];

  constructor(http: Http)
  {
      this.http = http;
      this.http.get(ApiEndpoints.ENDPOINT.VIEW_GRAPH).subscribe(response => {

          if (response.status === 200 ) {
               let increment = 0;
              response.json().data.forEach(row => {

                  this.xList.push(row['date']);
                  this.yList.push(row['size']);
                  this.yList.push(parseInt(row['w1']));
                  this.yList.push(parseInt(row['w2']));
                  this.yList.push(parseInt(row['w3']));
                  this.yList.push(parseInt(row['w4']));
                  this.outArrayList.push(this.yList);
                  this.options.series[increment]['data'] = this.yList;
                  this.options.series[increment]['name'] = row['date'];
                  // console.log(this.options.series[0]['data']);
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

