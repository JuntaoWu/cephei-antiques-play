namespace ap {

    export class QuestionSelectItemRenderer extends eui.ItemRenderer {

        public constructor() {
            super();
            this.skinName = "QuestionSelectItemSkin";
        }

        protected createChildren(): void {
            super.createChildren();
        }

        public fontSize: number;

        protected dataChanged(): void {
            this.fontSize = 40;
            if (this.data.option.length > 15) {
                this.fontSize = 32;
            }
            if (this.data.isSelected) {
                this.scaleX = this.scaleY = 0.9;
            }
        }
    }
}