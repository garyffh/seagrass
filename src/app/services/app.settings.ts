import { Injectable } from '@angular/core';
import { systemSettings } from '../../config/system-settings';

export class SystemSettings {

    constructor(value: SystemSettings) {
        this.clientId = value.clientId;
        this.webSiteUrl = value.webSiteUrl;
        this.url = value.url;
        this.apiUrl = value.apiUrl;
    }

    clientId: string;
    webSiteUrl: string;
    url: string;
    apiUrl: string;
}

export function initializeAppSettings(appSettings: AppSettings) {
    return () => appSettings.load();
}

@Injectable()
export class AppSettings {

    system: SystemSettings = null;

    load() {
        this.system = new SystemSettings(systemSettings);
    }

}
