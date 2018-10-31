
module game {

    export class MiniGameInputMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameInputMediator";

        public constructor(viewComponent: any) {
            super(MiniGameInputMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.gameInput.answerInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.focusOut, this)
            this.gameInput.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public async initData() {
            this.gameInput.answerInput.textDisplay.size = 45;
            this.gameInput.answerInput.text = null;
            this.isSend = false;
            this.inputTextList = [];
            for (let i = 0; i < this.gameInput.answer.length; i++) {
                this.inputTextList.push("");
            }
            let tLayout: eui.TileLayout = new eui.TileLayout();
            tLayout.horizontalGap = 20;
            tLayout.verticalGap = 20;
            tLayout.orientation = "columns";
            tLayout.requestedColumnCount = this.gameInput.answer.length < 7 ? this.gameInput.answer.length : 4;
            this.gameInput.inputItemList.layout = tLayout;
            this.gameInput.inputItemList.dataProvider = new eui.ArrayCollection(this.inputTextList);
            this.gameInput.inputItemList.itemRenderer = InputItemRenderer;
        }

        public inputTextList: Array<string>;
        public isSend: boolean = false;

        private focusOut(e: egret.Event) {
            if (e.target.text.length > this.inputTextList.length) {
                e.target.text = e.target.text.substr(0, this.inputTextList.length);
            }
            this.inputTextList = this.inputTextList.map(i => "");
            e.target.text.split("").forEach((v, i) => {
                if (i < this.inputTextList.length) {
                    this.inputTextList[i] = v;
                }
            })
            this.gameInput.inputItemList.dataProvider = new eui.ArrayCollection(this.inputTextList);
            this.gameInput.inputItemList.itemRenderer = InputItemRenderer;
        }

        private setResult() {
            let textInput = this.inputTextList.join("");
            if (textInput == this.gameInput.answer && !this.isSend) {
                this.sendNotification(GameProxy.PASS_MINIGAME);
                this.isSend = true;
            }
            else {
                this.sendNotification(GameProxy.REDUCE_POWER);
                this.gameInput.answerInput.text = "";
            }
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            if (this.gameInput.questionId != data) {
                return;
            }
            switch (notification.getName()) {
                case GameProxy.RESET_MINIGAME:
                    this.gameInput.answerInput.text = null;
                    this.inputTextList = this.inputTextList.map(i => "");
                    this.gameInput.inputItemList.dataProvider = new eui.ArrayCollection(this.inputTextList);
                    this.gameInput.inputItemList.itemRenderer = InputItemRenderer;
                    break;
                case GameProxy.CONFIRM_MINIGAME:
                    this.setResult();
                    break;
            }
        }

        public get gameInput(): MiniGameInput {
            return <MiniGameInput><any>(this.viewComponent);
        }
    }
}