module game {

    export class SceneDetailsWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "SceneDetailsWindow";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new SceneDetailsWindowMediator(this));
        }

        public btnBack: eui.Button;
        public sceneList: eui.List;
        public scrollGroup: eui.Scroller;
        public sceneName: string;
        public totalNum: number;
        public collectedNum: number;

        public setSceneType(type: string) {
            this.sceneName = type;
        }
    }
}