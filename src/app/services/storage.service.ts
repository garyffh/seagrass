import { Injectable } from '@angular/core';

import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from 'tns-core-modules/application-settings';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    hasKey(key: string): boolean {
        return hasKey(key);
    }

    removeKey(key: string): void {
        remove(key);
    }

    getItem(key: string): string {
        if (hasKey(key)) {
            return getString(key);
        } else {
            return null;
        }
    }

    setItem(key: string, data: string) {
        setString(key, data);
    }

    getObject(key: string) {
        if (hasKey(key)) {
            return JSON.parse(this.getItem(key));
        } else {
            return null;
        }
    }

    setObject(key: string, object: any) {
        this.setItem(key, JSON.stringify(object));
    }

}
