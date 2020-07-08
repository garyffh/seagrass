import { Injectable } from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';

import { HttpService } from './http.service';
import { StoreBanner, StoreStatus, StoreStatusFind } from './app.models';
import { StorageService } from '~/app/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class StoreBannerService {

  get bannerExists(): boolean {
    return this.fBannerExists;
  }

  get storeBannerImage(): StoreBanner {
    return this.fStoreBannerImage;
  }

  private fBannerKey: string = 'banner';
  private fBannerExists = false;

  private fStoreBannerImage: StoreBanner = null;

  private timer  = timer(5000, 600000);
  private timerSubscriber: Subscription;

  constructor(public httpService: HttpService,
              public storageService: StorageService) {

      this.fStoreBannerImage = this.storageService.getObject(this.fBannerKey);

      if (this.fStoreBannerImage !== null) {
          if (this.fStoreBannerImage.imageData) {
              this.fBannerExists = true;
          } else {
              this.fBannerExists = false;
          }

      }

      this.load();
  }

  storeBannerUpdateSource = new Subject<StoreBanner>();
  storeBannerUpdate$ = this.storeBannerUpdateSource.asObservable();

  load() {

    this.timerSubscriber = this.timer.subscribe(
      (val) => {

        this.httpService.httpGetWithModel<StoreBanner>('store-banner')
          .subscribe(
            (data: StoreBanner) => {

              if (data.imageData) {
                this.fBannerExists = true;
              } else {
                this.fBannerExists = false;
              }

              this.fStoreBannerImage = new StoreBanner(data);
              this.storageService.setObject(this.fBannerKey, this.fStoreBannerImage);

              this.storeBannerUpdateSource.next(this.fStoreBannerImage);

            }
          );
      }
    );

  }

}
