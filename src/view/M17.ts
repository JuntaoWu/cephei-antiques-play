module game {
	export class M17 extends eui.Component implements eui.UIComponent {

		public di: eui.Image;
		public jian: eui.Image;
		public mao: eui.Image;
		public ji: eui.Image;

		public wuqi: Array<eui.Image> = [];
		public record: Array<any> = [];

		public constructor() {
			super();
			this.skinName = "M17";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			this.wuqi = [this.di, this.jian, this.mao, this.ji];
			this.wuqi.forEach(ele => {
				this.record.push(ele.x, ele.y);
				ele.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (() => { this.begin(ele) }), this);
				ele.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
				ele.addEventListener(egret.TouchEvent.TOUCH_END,this.end,this);
			});
		}

		public this_wuqi: eui.Image;
		public begin(ele: eui.Image) {
			this.this_wuqi = ele;
		}

		public move(e: egret.TouchEvent) {
			this.this_wuqi.x = e.stageX;
			this.this_wuqi.y = e.stageY;
		}

		public end(e:egret.TouchEvent){
			
		}

	}

	export class M17Mediator extends puremvc.Mediator implements puremvc.IMediator {
		public static NAME: string = "M17Mediator";

		public constructor(viewComponent: any) {
			super(M17Mediator.NAME, viewComponent);
			super.initializeNotifier("ApplicationFacade");

		}

		public setResult() {

		}

		public listNotificationInterests(): Array<any> {
			return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
		}

		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case GameProxy.RESET_MINIGAME:

					break;
				case GameProxy.CONFIRM_MINIGAME:
					this.setResult();
					break;
			}
		}

		public get gameM17(): M17 {
			return <M17><any>(this.viewComponent);
		}
	}
}