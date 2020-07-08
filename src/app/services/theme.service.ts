import { Injectable } from '@angular/core';
import { StorageService } from '~/app/services/storage.service';

const nsThemes = require('@proplugins/nativescript-themes');

const brownCssText = require('~/themes/brown.scss');
const greenCssText = require('~/themes/green.scss');
const greyCssText = require('~/themes/grey.scss');
const pinkCssText = require('~/themes/ruby.scss');
const purpleCssText = require('~/themes/purple.scss');
const orangeCssText = require('~/themes/orange.scss');
const blueCssText = require('~/themes/blue.scss');

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private fAppliedTheme: string = null;
    private fThemeStorageKey = 'theme';

    private applyTheme(theme: string): void {
        if (this.fAppliedTheme === null || (this.fAppliedTheme !== theme)) {

            this.fAppliedTheme = theme;

            if (theme === 'brown') {
                nsThemes.applyThemeCss(brownCssText, 'brown.scss');
            } else if (theme === 'green') {
                nsThemes.applyThemeCss(greenCssText, 'green.scss');
            } else if (theme === 'grey') {
                nsThemes.applyThemeCss(greyCssText, 'grey.scss');
            } else if (theme === 'pink') {
                nsThemes.applyThemeCss(pinkCssText, 'pink.scss');
            } else if (theme === 'purple') {
                nsThemes.applyThemeCss(purpleCssText, 'purple.scss');
            } else if (theme === 'orange') {
                nsThemes.applyThemeCss(orangeCssText, 'orange.scss');
            } else {
                nsThemes.applyThemeCss(blueCssText, 'blue.scss');
            }
        }
    }

    constructor(public storageService: StorageService) {
    }

    applySavedAppTheme() {
        let theme: string = this.storageService.getItem(this.fThemeStorageKey);
        if (theme === null) {
           theme = 'blue';
        }

        this.applyTheme(theme);
    }

    applyAppTheme(theme: string) {

        const savedTheme: string = this.storageService.getItem(this.fThemeStorageKey);
        if (savedTheme === null) {
            this.storageService.setItem(this.fThemeStorageKey, theme);
        } else if (savedTheme !== theme) {
            this.storageService.setItem(this.fThemeStorageKey, theme);
        }

        this.applyTheme(theme);
    }
}
