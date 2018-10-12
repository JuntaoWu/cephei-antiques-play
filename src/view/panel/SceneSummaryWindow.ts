module game {

    export class SceneSummaryWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "SceneSummaryWindow";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new SceneSummaryWindowMediator(this));
        }

        public btnBack: eui.Button;
        public btnSceneBg: eui.Button;
        public btnScenePerson: eui.Button;
        public btnSceneProps: eui.Button;
        public collectedText: string;
        public finishText: string;
    }
}