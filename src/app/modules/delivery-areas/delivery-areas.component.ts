import { Component, ChangeDetectorRef, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebView, LoadEventData } from 'tns-core-modules/ui/web-view';
import { AppSettings } from '~/app/services/app.settings';
import { BusinessService } from '~/app/services/business.service';

@Component({
    selector: 'ns-delivery-areas',
    templateUrl: './delivery-areas.component.html',
    styleUrls: ['./delivery-areas.component.scss'],
    moduleId: module.id
})
export class DeliveryAreasComponent implements OnInit {

    constructor(public appSettings: AppSettings,
                public businessService: BusinessService,
                public changeDetectorRef: ChangeDetectorRef) {

        this.webViewSrc = appSettings.system.webSiteUrl + 'app-delivery-areas';

    }

    @ViewChild('deliveryWebView', { read: ElementRef, static: true}) webViewRef: ElementRef;
    webViewSrc: string;
    loaded = false;
    errorLoading = false;
    failMessage: string;

    onLoadWebView(view: DeliveryAreasComponent) {

        const webview: WebView = view.webViewRef.nativeElement;

        return webview.on(WebView.loadFinishedEvent, (event: LoadEventData) => {

            if (!view.loaded) {
                view.loaded = true;

                if (event.error) {
                    view.failMessage = event.error;
                }

                view.changeDetectorRef.detectChanges();
            }

        });
    }

    ngOnInit() {

        this.onLoadWebView(this);

    }

}
