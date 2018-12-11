namespace ap {
    export class shop_list extends eui.ItemRenderer {

        public pay:eui.Group;
        public pay_money:eui.Label;

        public constructor() {
            super();
            this.skinName = 'shop_list';
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new shop_listMediator(this));
        }        
    }
}
