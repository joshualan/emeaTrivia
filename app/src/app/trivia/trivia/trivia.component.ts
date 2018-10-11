import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

import { routeAnimations, TitleService } from '@app/core';

import { progress } from "@progress/jsdo-core";
import { DataSource } from "@progress/jsdo-angular";

const serviceURI = 'https://oemobiledemo.progress.com/OEMobileDemoServices';
const catalogURI = 'https://oemobiledemo.progress.com/OEMobileDemoServices/static/SportsService.json';

@Component({
  selector: 'anms-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss'],
  animations: [routeAnimations]
})
export class TriviaComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  hasScores: boolean = true;

  dataSource;

  defaultPages = [
    { link: 'quiz', label: 'Quiz' },
    { link: 'scores', label: 'Scores' }
  ];

  pages = this.defaultPages.slice();

  constructor(
    private router: Router,
    private titleService: TitleService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.subscribeToRouterEvents();

    progress.data.getSession({
      serviceURI: serviceURI,
      catalogURI: catalogURI,
      authenticationModel: 'anonymous'
    }).then(() => {
      let foo ;
      foo = progress.data;
      
      this.hasScores = typeof foo.ServicesManager._resources.HighScore !== "undefined";
      this.hasScores = true;
      // foo.ServicesManager._resources.forEach(element => {
      //   if (element.name === "Score") {
      //     this.hasScores = false;
      //   }
      // });

      // this.hasScores = false;
    }); 
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToRouterEvents() {
    this.titleService.setTitle(
      this.router.routerState.snapshot.root,
      this.translate
    );
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivationEnd) => event.snapshot),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(snapshot =>
        this.titleService.setTitle(snapshot, this.translate)
      );
  }
}
