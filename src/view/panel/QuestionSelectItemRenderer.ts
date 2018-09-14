module game {

    export class QuestionSelectItemRenderer extends eui.ItemRenderer {

        public constructor() {
            super();
            this.skinName = "QuestionSelectItemSkin";
        }

        protected createChildren(): void {
            super.createChildren();
        }

        protected dataChanged(): void {
            if (this.data.isSelected) {
                this.scaleX = this.scaleY = 0.9;
            }
        }
    }
}