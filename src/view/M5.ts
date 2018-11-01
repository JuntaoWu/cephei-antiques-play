module game {
	export class M5 extends eui.Component implements eui.UIComponent {

		public Start: eui.Image;
		public End: eui.Image;
		public cube1: eui.Image;
		public cube2: eui.Image;
		public cube3: eui.Image;
		public cube4: eui.Image;
		public cube5: eui.Image;
		public cube6: eui.Image;
		public cube7: eui.Image;
		public cube8: eui.Image;
		public cube9: eui.Image;
		public cube10: eui.Image;
		public cube11: eui.Image;
		public Group: eui.Group;

		public moveCube: Array<eui.Image> = [];
		public allCube: Array<eui.Image> = [];
		public record: Array<any> = [];

		public constructor() {
			super();
			this.skinName = "M5Skin";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
			ApplicationFacade.getInstance().registerMediator(new M5Mediator(this));
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.moveCube = [this.cube1, this.cube2, this.cube3, this.cube4, this.cube5, this.cube6, this.cube7, this.cube8, this.cube9, this.cube10, this.cube11];
			this.moveCube.forEach(element => {
				this.record.push({ x: element.x, y: element.y });
			});
			this.allCube = [this.cube1, this.cube2, this.cube3, this.cube4, this.cube5, this.cube6, this.cube7, this.cube8, this.cube9, this.cube10, this.cube11, this.Start, this.End];
			this.moveCube.forEach(cube => {
				cube.addEventListener(egret.TouchEvent.TOUCH_BEGIN, ((e) => { this.touchBegin(cube, e) }), this);
				cube.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
			});
		}

		public touchPointBegin_x: number;
		public touchPointBegin_y: number;
		public nowCube: eui.Image;
		public touchBegin(cube: eui.Image, e: egret.TouchEvent) {
			this.nowCube = cube;
			this.touchPointBegin_x = e.stageX;
			this.touchPointBegin_y = e.stageY;
		}

		public touchPointEnd_x: number;
		public touchPointEnd_y: number;
		public X: number;
		public Y: number;
		public touchEnd(e: egret.TouchEvent) {
			this.X = e.stageX - this.touchPointBegin_x;
			this.Y = e.stageY - this.touchPointBegin_y;
			if (Math.abs(this.X) > Math.abs(this.Y)) {
				if (this.X > 0) {
					let canmove: boolean = this.allCube.some(cube => (cube.x == (this.nowCube.x + 120) && cube.y == this.nowCube.y));
					if (this.nowCube.x != 360 && !canmove) {
						this.nowCube.x += 120;
					}
				} else {
					let canmove: boolean = this.allCube.some(cube => (cube.x == (this.nowCube.x - 120) && cube.y == this.nowCube.y));
					if (this.nowCube.x != 0 && !canmove) {
						this.nowCube.x -= 120;
					}
				}
			} else if (Math.abs(this.X) < Math.abs(this.Y)) {
				if (this.Y > 0) {
					let canmove: boolean = this.allCube.some(cube => (cube.y == (this.nowCube.y + 120) && cube.x == this.nowCube.x));
					if (this.nowCube.y != 360 && !canmove) {
						this.nowCube.y += 120;
					}
				} else {
					let canmove: boolean = this.allCube.some(cube => (cube.y == (this.nowCube.y - 120) && cube.x == this.nowCube.x));
					if (this.nowCube.y != 0 && !canmove) {
						this.nowCube.y -= 120;
					}
				}
			}
		}

		public isWin() {
			if (this.cube7.x == 0 && this.cube7.y == 120 && this.cube3.x == 120 && this.cube3.y == 240 && this.cube2.x == 240 && this.cube2.y == 240 && this.cube10.x == 360 && this.cube10.y == 240) {
				if (this.cube8.x == 120 && this.cube8.y == 120 && this.cube9.x == 360 && this.cube9.y == 120) {
					ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
				} else if (this.cube9.x == 120 && this.cube9.y == 120 && this.cube8.x == 360 && this.cube8.y == 120) {
					ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
				}
			} else {
				ApplicationFacade.getInstance().sendNotification(GameProxy.REDUCE_POWER);
			}
		}
		
		public questionId: number;
		public setQuestionId(id: number): void {
			this.questionId = id;
		}
	}

	export class M5Mediator extends puremvc.Mediator implements puremvc.IMediator {
		public static NAME: string = "M5Mediator";

		public constructor(viewComponent: any) {
			super(M5Mediator.NAME, viewComponent);
			super.initializeNotifier("ApplicationFacade");

		}

		public setResult() {
			this.gameM5.isWin();
		}

		public listNotificationInterests(): Array<any> {
			return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
		}

		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
            if (this.gameM5.questionId != data) {
                return;
            }
			switch (notification.getName()) {
				case GameProxy.RESET_MINIGAME:
					for (let i = 0; i < 11; i++) {
						this.gameM5.moveCube[i].x = this.gameM5.record[i].x;
						this.gameM5.moveCube[i].y = this.gameM5.record[i].y;
					}
					break;
				case GameProxy.CONFIRM_MINIGAME:
					this.setResult();
					break;
			}
		}

		public get gameM5(): M5 {
			return <M5><any>(this.viewComponent);
		}
	}
}
