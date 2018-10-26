
module game {

    export class MiniGameInputMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameInputMediator";

        public constructor(viewComponent: any) {
            super(MiniGameInputMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.gameInput.answerInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.focusOut, this)
            // this.gameInput.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirmClick, this)
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
            if (e.target.text == this.gameInput.answer && !this.isSend) {
                e.target.text = "";
                this.sendNotification(GameProxy.PASS_MINIGAME);
                this.isSend = true;
            }
            this.gameInput.inputItemList.dataProvider = new eui.ArrayCollection(this.inputTextList);
            this.gameInput.inputItemList.itemRenderer = InputItemRenderer;
        }

        private confirmClick() {
            if (this.gameInput.answerInput.text.length > this.inputTextList.length) {
                this.gameInput.answerInput.text = this.gameInput.answerInput.text.substr(0, this.inputTextList.length);
            }
            this.inputTextList = this.inputTextList.map(i => "");
            this.gameInput.answerInput.text.split("").forEach((v, i) => {
                this.inputTextList[i] = v;
            })
            this.gameInput.inputItemList.dataProvider = new eui.ArrayCollection(this.inputTextList);
            this.gameInput.inputItemList.itemRenderer = InputItemRenderer;

            if (this.gameInput.answerInput.text == this.gameInput.answer && !this.isSend) {
                this.gameInput.answerInput.text = "";
                this.sendNotification(GameProxy.PASS_MINIGAME);
                this.isSend = true;
            }
        }

        public get gameInput(): MiniGameInput {
            return <MiniGameInput><any>(this.viewComponent);
        }
    }
}