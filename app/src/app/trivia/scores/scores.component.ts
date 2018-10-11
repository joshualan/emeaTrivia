import { Component, OnInit } from '@angular/core';

import { environment as env } from '@env/environment';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import { progress } from "@progress/jsdo-core";
import { DataSource } from "@progress/jsdo-angular";

import {
  trigger,
  style,
  transition,
  animate,
  state
} from '@angular/animations';

const serviceURI = 'https://oemobiledemo.progress.com/OEMobileDemoServices/';
const catalogURI = 'https://oemobiledemo.progress.com/OEMobileDemoServices/static/SportsService.json';

interface Score {
  comment?: string;
  score: number;
  name: string;
}

@Component({
  selector: 'anms-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  versions = env.versions;

  public scores: Score[];

  public dataSource: DataSource;

  // debug var
  public foo: string;

  ngOnInit() {
    progress.data.getSession({
      serviceURI: serviceURI,
      catalogURI: catalogURI,
      authenticationModel: 'anonymous'
    }).then(() => {
      this.dataSource = new DataSource({
        jsdo: new progress.data.JSDO({ name: 'Warehouse' })
      });

      return this.dataSource.read().toPromise();
    }).then(() => {
      this.refreshScores();
    });
  }

  constructor() {
  }

  refreshScores() {
    this.scores = [];

    this.dataSource.read().toPromise().then(() => {

      // grab the questions from the backend and translate them to something we can parse
      let data = this.dataSource.getData();

      data.forEach(element => {
        if (element["Address"] === "EMEA") {
          this.scores.push({
            score: element["Country"],
            name: element["WarehouseName"],
            comment: element["Comments"]
          });
        }
      });

      function compare(a,b) {
        if (Number(a.score) > Number(b.score))
          return -1;
        if (Number(a.score) < Number(b.score))
          return 1;
        return 0;
      }
      
      this.scores.sort(compare);
    });
  }


}
