namespace ap {

    export class MiniGameCubeStop extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameCubeStop";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameCubeStopMediator(this));
        }

        public buttonList: eui.List;
        public leftTime: number; // 剩余尝试次数
        
		public questionId: number;
		public setQuestionId(id: number): void {
			this.questionId = id;
		}
    }
}