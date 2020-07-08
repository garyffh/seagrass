import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { UserGuardService } from '~/app/services/user-guard.service';

const routes = [
    {path: '', redirectTo: 'initial', pathMatch: 'full'},
    {path: 'initial', loadChildren: '~/app/modules/initial/initial.module#InitialModule'},
    {path: 'main', loadChildren: '~/app/modules/main/main.module#MainModule'},
    {path: 'cart', loadChildren: '~/app/modules/cart/cart.module#CartModule'},
    {path: 'trading-hours', loadChildren: '~/app/modules/trading-hours/trading-hours.module#TradingHoursModule'},
    {path: 'delivery-areas', loadChildren: '~/app/modules/delivery-areas/delivery-areas.module#DeliveryAreasModule'},
    {path: 'sign-in', loadChildren: '~/app/modules/sign-in/sign-in.module#SignInModule'},
    {
        path: 'user',
        loadChildren: '~/app/modules/user/user.module#UserModule',
        canLoad: [UserGuardService],
        canActivate: [UserGuardService]
    },
    {
        path: 'driver',
        loadChildren: '~/app/modules/driver/driver.module#DriverModule',
        canLoad: [UserGuardService],
        canActivate: [UserGuardService]
    }
];

@NgModule({
    imports: [
        RouterModule,
        NativeScriptRouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [
        RouterModule,
        NativeScriptRouterModule
    ]
})
export class AppRoutingModule {
}
