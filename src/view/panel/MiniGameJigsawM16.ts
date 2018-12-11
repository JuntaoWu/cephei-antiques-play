namespace ap {

    export class MiniGameJigsawM16 extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameJigsawM16";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameJigsawM16Mediator(this));
        }

        public jigsawImgGroup1: eui.Group;
        public jigsawImgGroup2: eui.Group;
        public jigsawImgGroup3: eui.Group;
        public jigsawImgGroup4: eui.Group;
        
		public questionId: number;
		public setQuestionId(id: number): void {
			this.questionId = id;
		}
    }
}