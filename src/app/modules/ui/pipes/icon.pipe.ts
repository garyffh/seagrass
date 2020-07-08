import { Pipe, PipeTransform } from '@angular/core';
import { IconService } from '../../../services/icon.service';

@Pipe({name: 'icon'})
export class IconPipe implements PipeTransform {
    constructor(private iconService: IconService) {}
    transform(value: string): string {
        return this.iconService.getIconString(value);
    }
}
