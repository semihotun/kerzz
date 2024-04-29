import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { UserFeedService } from './../../services/userFeed/user-feed.service';
import { Subject, mergeMap, retry, takeUntil, timer, } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { GetUserFeedResponse, UserFeedResponse } from 'src/app/models/userFeed/userFeedResponse';
import { GetUserFeedRequest } from 'src/app/models/userFeed/userFeedRequest';
import { GeolocationService } from 'src/app/services/geolocation/geolocation-service.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  standalone: true,
  imports: [CommonModule, CardComponent, IonicModule]
})

export class CardListComponent implements OnInit, OnDestroy {
  constructor(private userFeedService: UserFeedService,
    private toastController: ToastController,
    private geolocationService: GeolocationService
  ) { }
  data: UserFeedResponse[] = [];
  private readonly onDestroy = new Subject<void>();
  latitude!: number;
  longitude!: number;
  cardSize: number = 1;
  limit: number = 0;
  skip: number = this.cardSize;
  async ngOnInit() {
    this.getCardSize();
    await this.getGeoLocation();
  }
  getCardSize() {
    let notContentPercent = 100 - ((100 * 169) / 812);
    this.cardSize = Math.ceil(notContentPercent / ((100 * 260) / 812));
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
  }
  async getGeoLocation() {
    timer(0, 5000).pipe(
      mergeMap(async () => {
        const data = await this.geolocationService.getCurrentPosition();
        if (data) {
          this.latitude = data.latitude;
          this.longitude = data.longitude;
          this.getUserFeed();
          return true;
        } else {
          const toast = await this.toastController.create({
            message: 'Konum Bilgini açmalısın',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
          return false;
        }
      }),retry(5)).subscribe();
  }
  getRequestForUserFeed(): GetUserFeedRequest {
    let request: GetUserFeedRequest = {
      latitude: this.latitude,
      limit: this.cardSize,
      longitude: this.longitude,
      skip: this.skip
    };
    return request;
  }
  getUserFeed() {
    this.userFeedService.GetFeed(this.getRequestForUserFeed())
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (data: GetUserFeedResponse) => {
          this.data = [...this.data, ...data.response];
          this.skip = this.skip + this.cardSize;
        },
        error: async (err: HttpErrorResponse) => {
          const toast = await this.toastController.create({
            message: 'Hata oluştu: ' + err.message,
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      });
  }
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.getUserFeed();
      ev.target.complete();
    }, 500);
  }
}
