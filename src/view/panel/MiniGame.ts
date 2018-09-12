module game {

    export class MiniGame extends eui.Component {

        public constructor() {
            super();
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        private _miniGame: any;
        public addMiniGame(className: string = ""): void {
            var clazz = egret.getDefinitionByName(className);
            this._miniGame = new clazz();
            this.addChild(this._miniGame);
        }

        public addMiniGameObject(displayObject: egret.DisplayObject): void {
            this.addChild(displayObject);
        }

        public clearStage() {
            this.removeChildren();
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameMediator(this));
        }

    }
}