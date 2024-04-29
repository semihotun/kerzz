import { CommonModule } from '@angular/common';
import { Component, Input, } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BannerType } from 'src/app/models/enums/bannerType';
import { UserFeedResponse, Image } from 'src/app/models/userFeed/userFeedResponse';
import { GeolocationService } from 'src/app/services/geolocation/geolocation-service.service';
import { LocationModel } from 'src/app/models/geoLocation/locationModel';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CardComponent {
  constructor(private geolocationService: GeolocationService) { }
  @Input() data!: UserFeedResponse;
  @Input() lati!: UserFeedResponse;
  @Input() myCoordinate!: LocationModel;
  ngOnInit() {
  }
  getBannerImage(data: Image[]) {
    return data.find(item => item.itemType === BannerType.StoreBanner)?.base64;
  }
  calculateDistance() {
    let calculateData: LocationModel = {
      latitude: this.data.location.coordinates[0],
      longitude: this.data.location.coordinates[1]
    };
    return this.geolocationService.calculateDistance(this.myCoordinate, calculateData)
  }
}
