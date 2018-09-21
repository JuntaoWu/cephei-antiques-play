module game {

    export class MiniGameInput extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameInput";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameInputMediator(this));
        }

        public answerInput: eui.TextInput;
        public inputItemList: eui.List;
        public answer: string;
        public btnConfirm: eui.Button;

        public setAnswer(str: string): void {
            this.answer = str;
        }
    }
}