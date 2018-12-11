namespace ap {

    export class MiniGameM8_2 extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameM8_2";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameM8_2Mediator(this));
        }

        public jigsawGroup: eui.Group;
        
		public questionId: number;
		public setQuestionId(id: number): void {
			this.questionId = id;
		}
    }
}