
module game {

    export class MiniGameSelectMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameSelectMediator";

        public constructor(viewComponent: any) {
            super(MiniGameSelectMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.gameSelect.buttonList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
            this.gameSelect.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
        }

        private _selectOptions: Map<string, any>;
		public get selectOptions(): Map<string, any> {
			if (!this._selectOptions) {
				this._selectOptions = new Map(Object.entries(RES.getRes("select-options_json")));
			}
			return this._selectOptions;
		}

        public optionsItem: any;
        public options: any;

        public async initData() {
            this.optionsItem = this.selectOptions.get(this.gameSelect.optionsId.toString());
            this.options = this.optionsItem.options.map(i => {
                return { option: i, isSelected: false }
            });
            this.gameSelect.buttonList.dataProvider = new eui.ArrayCollection(this.options);
            this.gameSelect.buttonList.itemRenderer = QuestionSelectItemRenderer;
        }

        public selectItem() {
            this.options.forEach(i => {
                i.isSelected = i.option == this.gameSelect.buttonList.selectedItem.option;
            })
            this.gameSelect.buttonList.dataProvider = new eui.ArrayCollection(this.options);
            this.gameSelect.buttonList.itemRenderer = QuestionSelectItemRenderer;
            
            if (this.gameSelect.buttonList.selectedItem.option == this.optionsItem.answer) {
                if (this.optionsItem.next) {
                    this.gameSelect.optionsId = this.optionsItem.next;
                    this.initData();
                }
                else {
                    this.sendNotification(GameProxy.PASS_MINIGAME);
                }
            }
        }

        public get gameSelect(): MiniGameSelect {
            return <MiniGameSelect><any>(this.viewComponent);
        }
    }
}