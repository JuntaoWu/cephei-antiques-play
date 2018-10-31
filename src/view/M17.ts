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
			ApplicationFacade.getInstance().registerMediator(new M17Mediator(this));
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			this.wuqi = [this.di, this.jian, this.mao, this.ji];
			this.wuqi.forEach(ele => {
				this.record.push({ x: ele.x, y: ele.y });
				ele.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (() => { this.begin(ele) }), this);
				ele.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
				ele.addEventListener(egret.TouchEvent.TOUCH_END, this.end, this);
				ele.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.end, this);
			});
		}

		public this_wuqi: eui.Image;
		public begin(ele: eui.Image) {
			this.this_wuqi = ele;
		}

		public move(e: egret.TouchEvent) {
			this.this_wuqi.x = e.stageX - 15;
			this.this_wuqi.y = e.stageY - 120;
		}

		public end(e: egret.TouchEvent) {
			if (e.stageX - 15 > 200 && e.stageX - 15 < 308 && e.stageY - 120 > 320 && e.stageY - 120 < 428) {
				this.this_wuqi.x = 254;
				this.this_wuqi.y = 374;
			} else if (e.stageX - 15 > 400 && e.stageX - 15 < 508 && e.stageY - 120 > 320 && e.stageY - 120 < 428) {
				this.this_wuqi.x = 454;
				this.this_wuqi.y = 374;
			} else {
				let aa = this.wuqi.indexOf(this.this_wuqi);
				this.this_wuqi.x = this.record[aa].x;
				this.this_wuqi.y = this.record[aa].y;
			}
		}

	}

	export class M17Mediator extends puremvc.Mediator implements puremvc.IMediator {
		public static NAME: string = "M17Mediator";

		public constructor(viewComponent: any) {
			super(M17Mediator.NAME, viewComponent);
			super.initializeNotifier("ApplicationFacade");

		}

		public setResult() {
			if (this.gameM17.di.x == 254 && this.gameM17.di.y == 374 && this.gameM17.jian.x == 454 && this.gameM17.jian.y == 374) {
				ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
			} else {
				ApplicationFacade.getInstance().sendNotification(GameProxy.REDUCE_POWER);
			}
		}

		public listNotificationInterests(): Array<any> {
			return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
		}

		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case GameProxy.RESET_MINIGAME:
					for (let i = 0; i < 3; i++) {
						this.gameM17.wuqi[i].x = this.gameM17.record[i].x;
						this.gameM17.wuqi[i].y = this.gameM17.record[i].y;
					}
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