import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    private iconMap: Map<string, number> = new Map<string, number>([
        ['arrow-left', 0xf060],
        ['star', 0xf005],
        ['up-arrow', 0xf106],
        ['down-arrow', 0xf107],
        ['circle', 0xf10c],
        ['filled-circle', 0xf111],
        ['basket', 0xf291],
        ['menu', 0xf0c9],
        ['close', 0xf00d],
        ['add', 0xf196]
    ]);

    getIconString(iconName: string): string {
        return String.fromCharCode(this.iconMap.get(iconName));
    }

}
