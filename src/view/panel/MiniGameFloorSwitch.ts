module game {

    export class MiniGameFloorSwitch extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameFloorSwitch";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameFloorSwitchMediator(this));
        }

        public buttonList: eui.List;
    }
}