module game {

    export class SceneDetailsWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "SceneDetailsWindow";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new SceneDetailsWindowMediator(this));
        }

        public btnBack: eui.Button;
        public sceneList: eui.List;
        public scrollGroup: eui.Scroller;
        public type: string;
        public titleRes: string;
        public collectedText: string;

        public setSceneType(type: string) {
            this.type = type;
            if (type == SceneType.SceneBg) {
                this.titleRes = "title-scene-cg";
            }
            else if (type == SceneType.ScenePerson) {
                this.titleRes = "title-person-cg";
            }
            else {
                this.titleRes = "title-props-cg";
            }
        }
    }
}