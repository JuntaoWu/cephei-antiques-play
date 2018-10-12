module game {

    export class StartScreen extends eui.Component {

        public navigationBar: eui.Group;

        public constructor() {
            super();
            this.skinName = "StartScreen";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.navigationBar.y = this.stage.stageHeight - this.navigationBar.height - 20;
            
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new StartScreenMediator(this));
        }

        public btnResumeGame: eui.Button;
        public btnNewGame: eui.Button;
        public btnManage: eui.Button;
        public btnDev: eui.Button;

        public btnPicture: eui.Button;
        public btnStore: eui.Button;
        public btnShare: eui.Button;
        public btnSetting: eui.Button;
    }
}