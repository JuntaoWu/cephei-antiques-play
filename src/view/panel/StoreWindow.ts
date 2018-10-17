module game {

    export class StoreWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "StoreScreen";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new StoreWindowMediator(this));
        }

        public btnBack: eui.Button;
        public scrollGroup: eui.Scroller;
        public shoplist: eui.List;
    }
}