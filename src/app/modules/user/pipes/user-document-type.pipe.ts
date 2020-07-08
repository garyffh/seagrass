import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userDocumentType'
})
export class UserDocumentTypePipe implements PipeTransform {

    transform(value: number): string {

        switch (value) {
            case 0: return 'INV';
            case 1: return 'CRD';
            case 2: return 'PAY';

            default: return 'undefined';
        }

    }

}
