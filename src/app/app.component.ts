import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonContent, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private platform:Platform) {
    StatusBar.setBackgroundColor({color:'#ffffff'});
  }
  ngOnInit() {
  }
}