import { Injectable } from '@angular/core';
import * as geolib from 'geolib';
import { Geolocation } from '@capacitor/geolocation';
import { LocationModel } from './../../models/geoLocation/locationModel';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private locationAccuracy: LocationAccuracy) {
  }

  async getCurrentPosition(): Promise<LocationModel | null> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location != 'granted') {
          throw new Error('Hata');
        }
      }
    } catch (error) {
      return null;
    }
    if (Capacitor.getPlatform() == 'android') {
      this.enableGps();
    }
    let options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true
    }
    const position = await Geolocation.getCurrentPosition(options);
    let data: LocationModel = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
    return data;
  }
  async enableGps() {
    const canRequest = await this.locationAccuracy.canRequest();
    if (canRequest) {
      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    }
  }
  openSettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }
  calculateDistance(coord1: LocationModel, coord2: LocationModel): number {
    let distanceInMeters = geolib.getDistance(
      { latitude: coord1.latitude, longitude: coord1.longitude },
      { latitude: coord2.latitude, longitude: coord2.longitude },
    );
    return distanceInMeters / 1000;
  }
}