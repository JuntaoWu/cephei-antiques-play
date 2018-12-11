namespace ap {

    export class MiniGameSelect extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameSelect";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameSelectMediator(this));
        }

        public buttonList: eui.List;
        public optionsId: number;

        public setOptionsId(optionsId: number): void {
            this.optionsId = optionsId;
        }

    }
}