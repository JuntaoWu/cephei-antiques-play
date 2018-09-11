module game {

    export class GameScreen extends eui.Component {

        public constructor() {
            super();
            this.skinName = "GameScreenSkin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.initData();
        }

        private _questions: Map<string, any>;
		public get questions(): Map<string, any> {
			if (!this._questions) {
				this._questions = new Map(Object.entries(RES.getRes("question_json")));
			}
			return this._questions;
		}

        public answerInput: eui.TextInput;
        public question: any;
        public description: string;
        public id: number = 1;
        public showInput: boolean;
        public showSelect: boolean;
        public showResult: boolean;
        public selectList: eui.List;

        public initData() {
            this.showInput = this.showSelect = this.showResult = false;
            this.question = { ...this.questions.get(this.id.toString()) };
            this.description = this.question.description;
            if (this.question.type == "填空") {
                this.showInput = true;
            }
            else if (this.question.type == "选择") {
                
                this.selectList.dataProvider = new eui.ArrayCollection(this.question.select);
                this.selectList.itemRenderer = QuestionSelectItemRenderer;
                this.showSelect = true;
            }
            console.log(this.id);
        }

        public onClick() {
            console.log(this.id);
            if (this.question.type == "填空") {
                if (this.answerInput.text != this.question.answer) {
                    return;
                }
            }
            else if (this.question.type == "选择") {
                console.log(this.selectList.selectedItem)
                if (this.selectList.selectedItem != this.question.answer) {
                    return;
                }
            }
            if (!this.showResult) {
                this.description = this.question.right;
                this.showResult = true;
                return;
            }
            if (this.question.next != "over") {
                this.id = this.question.next;
                this.initData();
            }
        }
    }
}