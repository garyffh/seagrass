import { Injectable } from '@angular/core';

import { AnimationCurve, DeviceType } from 'tns-core-modules/ui/enums';
import { device, screen } from 'tns-core-modules/platform';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    isTablet(): boolean {
        return device.deviceType === DeviceType.Tablet;
    }

    screenWidth(): number {
        return screen.mainScreen.widthPixels;
    }

    smallScreenWidth(): boolean {
        return screen.mainScreen.widthPixels <= 750;
    }

    animateCurrentImage(arg: any) {
        arg.nativeElement.animate({
            scale: {x: 1.2, y: 1.2},
            curve: AnimationCurve.cubicBezier(1, .02, .45, .93),
            duration: 300
        });
    }

    animatePreviousImage(arg: any) {
        arg.nativeElement.animate({
            scale: {x: 1, y: 1},
            curve: AnimationCurve.cubicBezier(1, .02, .45, .93),
            duration: 300
        });
    }

}
