import { Component, Input, OnInit } from '@angular/core';
import { isAndroid, isIOS } from 'tns-core-modules/ui/page';
import { RadListView, ListViewEventData } from 'nativescript-ui-listview';

declare var UIView;
declare var NSMutableArray;
declare var NSIndexPath;

import { DeliveryMethodOpenStatus, DeliveryMethodTimes } from '../../../services/app.models';
import { BusinessService } from '../../../services/business.service';
import { StoreStatusService } from '../../../services/store-status.service';

@Component({
  selector: 'ns-delivery-method',
  templateUrl: './delivery-method.component.html',
  styleUrls: ['./delivery-method.component.scss'],
  moduleId: module.id
})
export class DeliveryMethodComponent {

    constructor(public storeStatusService: StoreStatusService,
                public businessService: BusinessService) { }

    @Input() deliveryMethod: DeliveryMethodTimes;

    DeliveryMethodOpenStatus = DeliveryMethodOpenStatus;

    expanded = false;

    templateSelector(item: any, index: number, items: any): string {
        return item.expanded ? 'expanded' : 'default';
    }

    onItemTap(event: ListViewEventData) {
        const listView = event.object;
        const rowIndex = event.index;
        const dataItem = event.view.bindingContext;

        dataItem.expanded = !dataItem.expanded;
        if (isIOS) {
            // Uncomment the lines below to avoid default animation
            // UIView.animateWithDurationAnimations(0, () => {
            const indexPaths = NSMutableArray.new();
            indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
            listView.ios.reloadItemsAtIndexPaths(indexPaths);
            // });
        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }
    }

}
