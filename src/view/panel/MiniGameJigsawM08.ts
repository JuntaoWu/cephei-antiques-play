module game {

    export class MiniGameJigsawM08 extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameJigsawM08";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameJigsawM08Mediator(this));
        }

        public jigsawImgGroup1: eui.Group;
        public jigsawImgGroup2: eui.Group;
        public jigsawImgGroup3: eui.Group;
        public jigsawImgGroup4: eui.Group;
        public jigsawImgGroup5: eui.Group;
        public jigsawImgGroup6: eui.Group;
        public jigsawImgGroup7: eui.Group;
        public jigsawImgGroup8: eui.Group;
        public jigsawImgGroup9: eui.Group;
        public step: number; //可用步数
        
		public questionId: number;
		public setQuestionId(id: number): void {
			this.questionId = id;
		}
    }
}