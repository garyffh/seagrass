import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { TNSPlayer } from 'nativescript-audio';

export enum AppSound {
    none,
    message,
    driverDelivery,
    userPickup
}

@Injectable({
    providedIn: 'root'
})
export class SoundService {

    private userHubSubscription: Subscription = null;

    constructor() {

        this.sound1.debug = false;
        this.sound1.initFromFile({
                audioFile: '~/sounds/Sound1.mp3',
                loop: false
            });

        this.sound2.debug = false;
        this.sound2.initFromFile({
            audioFile: '~/sounds/Sound2.mp3',
            loop: false
        });

        this.sound3.debug = false;
        this.sound3.initFromFile({
            audioFile: '~/sounds/Sound3.mp3',
            loop: false
        });

        this.sound4.debug = false;
        this.sound4.initFromFile({
            audioFile: '~/sounds/Sound4.mp3',
            loop: false
        });

        this.sound5.debug = false;
        this.sound5.initFromFile({
            audioFile: '~/sounds/Sound5.mp3',
            loop: false
        });

        this.sound6.debug = false;
        this.sound6.initFromFile({
            audioFile: '~/sounds/Sound6.mp3',
            loop: false
        });

    }

    sound1: TNSPlayer = new TNSPlayer();
    sound2: TNSPlayer = new TNSPlayer();
    sound3: TNSPlayer = new TNSPlayer();
    sound4: TNSPlayer = new TNSPlayer();
    sound5: TNSPlayer = new TNSPlayer();
    sound6: TNSPlayer = new TNSPlayer();

    playSound(soundId: AppSound) {

        switch (soundId) {

            case AppSound.message: {
                this.sound1.play();
                break;
            }

            case AppSound.driverDelivery: {
                this.sound2.play();
                break;
            }

            case AppSound.userPickup: {
                this.sound4.play();
                break;
            }

        }

    }

}
