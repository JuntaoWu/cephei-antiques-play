namespace ap {

    export class InputItemRenderer extends eui.ItemRenderer {

        public constructor() {
            super();
            this.skinName = "InputItemSkin";
        }

        private buttonImg: eui.Image;

        protected createChildren(): void {
            super.createChildren();
        }

        protected dataChanged(): void {
        }
    }
}