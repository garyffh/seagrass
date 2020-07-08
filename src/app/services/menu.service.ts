import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private fOrdersMenuVisible = true;

    get ordersMenuVisible(): boolean {
        return this.fOrdersMenuVisible;
    }

    set ordersMenuVisible(value: boolean) {
        this.fOrdersMenuVisible = value;
    }

}
