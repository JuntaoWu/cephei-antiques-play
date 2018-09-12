
module game {

    export class MiniGameFloorSwitchMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameFloorSwitchMediator";

        public constructor(viewComponent: any) {
            super(MiniGameFloorSwitchMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.floorSwitch.buttonList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
            this.floorSwitch.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public async initData() {
            
            this.dataList = [
                {name: "虎", img: "m18_1", isSelected: false}
                , {name: "虎", img: "m18_2", isSelected: false}
                , {name: "虎", img: "m18_3", isSelected: false}
                , {name: "蛇", img: "m18_4", isSelected: false}
                , {name: "蛇", img: "m18_5", isSelected: false}
                , {name: "狼", img: "m18_6", isSelected: false}
                , {name: "狼", img: "m18_7", isSelected: false}
                , {name: "鹰", img: "m18_8", isSelected: false}
                , {name: "鹰", img: "m18_9", isSelected: false}
            ];
            
            this.floorSwitch.buttonList.dataProvider = new eui.ArrayCollection(this.dataList);
            this.floorSwitch.buttonList.itemRenderer = SwitchItemRenderer;

        }

        private dataList: Array<any>;
        private selectedList: Array<any> = [];

        public selectItem() {
            console.log(this.floorSwitch.buttonList.selectedItem);
            let selectedItem = this.floorSwitch.buttonList.selectedItem;
            if (!this.selectedList.find(i => i.img == selectedItem.img)) {
                if (this.selectedList.length < 3) {
                    this.selectedList.push(this.floorSwitch.buttonList.selectedItem);
                }
                else {
                    this.selectedList.shift();
                    this.selectedList.push(this.floorSwitch.buttonList.selectedItem);
                }
            }
            else {
                let index = this.selectedList.findIndex(i => i.img == selectedItem.img);
                this.selectedList.splice(index, 1);
            }
            if (this.selectedList.length == 3) {
                let isRight = !this.selectedList.find(i => i.name != "虎");
                if (isRight) {
                    this.floorSwitch.buttonList.touchEnabled = false;
                    this.floorSwitch.buttonList.touchChildren = false;
                    this.sendNotification(GameProxy.PASS_MINIGAME);
                }
            }
            this.dataList.forEach(i => {
                i.isSelected = false;
                if (this.selectedList.find(v => v.img == i.img)) {
                    i.isSelected = true;
                }
            })

            this.floorSwitch.buttonList.dataProvider = new eui.ArrayCollection(this.dataList);
            this.floorSwitch.buttonList.itemRenderer = SwitchItemRenderer;
        }

        public get floorSwitch(): MiniGameFloorSwitch {
            return <MiniGameFloorSwitch><any>(this.viewComponent);
        }
    }
}