
module game {

    export class MiniGameInputMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameInputMediator";

        public constructor(viewComponent: any) {
            super(MiniGameInputMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.gameInput.answerInput.addEventListener(egret.Event.CHANGE, this.onChang, this)
            this.gameInput.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
        }

        public async initData() {
            this.gameInput.answerInput.text = null;
        }

        private onChang(e:egret.Event){
            console.log(e.target.text);
            if (e.target.text == this.gameInput.answer) {
                this.sendNotification(GameProxy.PASS_MINIGAME);
            }
        }

        public get gameInput(): MiniGameInput {
            return <MiniGameInput><any>(this.viewComponent);
        }
    }
}