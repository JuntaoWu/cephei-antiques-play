module game {
	export class M2 extends eui.Component implements eui.UIComponent {

		public red1: eui.Image;
		public red2: eui.Image;
		public red3: eui.Image;
		public red4: eui.Image;
		public red5: eui.Image;
		public red6: eui.Image;
		public red7: eui.Image;
		public red8: eui.Image;
		public red9: eui.Image;
		public blue1: eui.Image;
		public blue2: eui.Image;
		public blue3: eui.Image;
		public blue4: eui.Image;
		public blue5: eui.Image;
		public blue6: eui.Image;
		public blue7: eui.Image;
		public blue8: eui.Image;
		public blue9: eui.Image;
		public black1: eui.Image;
		public black2: eui.Image;
		public black3: eui.Image;
		public black4: eui.Image;
		public black5: eui.Image;
		public black6: eui.Image;
		public black7: eui.Image;
		public black8: eui.Image;
		public black9: eui.Image;
		public white1: eui.Image;
		public white2: eui.Image;
		public white3: eui.Image;
		public white4: eui.Image;
		public white5: eui.Image;
		public white6: eui.Image;
		public white7: eui.Image;
		public white8: eui.Image;
		public white9: eui.Image;
		public yellow1: eui.Image;
		public yellow2: eui.Image;
		public yellow3: eui.Image;
		public yellow4: eui.Image;
		public yellow5: eui.Image;
		public yellow6: eui.Image;
		public yellow7: eui.Image;
		public yellow8: eui.Image;
		public yellow9: eui.Image;

		public row1_1: eui.Image;
		public row1_2: eui.Image;
		public row2_1: eui.Image;
		public row2_2: eui.Image;
		public row3_1: eui.Image;
		public row3_2: eui.Image;
		public column1_1: eui.Image;
		public column1_2: eui.Image;
		public column2_1: eui.Image;
		public column2_2: eui.Image;
		public column3_1: eui.Image;
		public column3_2: eui.Image;

		public allCube: Array<any> = [];
		public record: Array<any> = [];
		public whiteCube: Array<any> = [];
		public rowList: Array<any> = [2, 58, 114, 173, 229, 285, 344, 400, 456];
		public columnList: Array<any> = [2, 58, 114, 175, 231, 287, 348, 403, 458];

		public constructor() {
			super();
			this.skinName = "M2Skin";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			this.allCube = [
				this.red1, this.red2, this.red3, this.red4, this.red5, this.red6, this.red7, this.red8, this.red9,
				this.blue1, this.blue2, this.blue3, this.blue4, this.blue5, this.blue6, this.blue7, this.blue8, this.blue9,
				this.white1, this.white2, this.white3, this.white4, this.white5, this.white6, this.white7, this.white8, this.white9,
				this.black1, this.black2, this.black3, this.black4, this.black5, this.black6, this.black7, this.black8, this.black9,
				this.yellow1, this.yellow2, this.yellow3, this.yellow4, this.yellow5, this.yellow6, this.yellow7, this.yellow8, this.yellow9
			];
			this.allCube.forEach(ele => {
				this.record.push(ele.x, ele.y);
			})
			this.whiteCube = [this.white1, this.white2, this.white3, this.white4, this.white5, this.white6, this.white7, this.white8, this.white9];

			this.row1_1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(3, -1, "row") }), this);
			this.row1_2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(3, 1, "row") }), this);
			this.row2_1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(4, -1, "row") }), this);
			this.row2_2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(4, 1, "row") }), this);
			this.row3_1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(5, -1, "row") }), this);
			this.row3_2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(5, 1, "row") }), this);
			this.column1_1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(3, -1, "column") }), this);
			this.column1_2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(3, 1, "column") }), this);
			this.column2_1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(4, -1, "column") }), this);
			this.column2_2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(4, 1, "column") }), this);
			this.column3_1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(5, -1, "column") }), this);
			this.column3_2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.moveCube(5, 1, "column") }), this);
		}

		public moveCube(i: number, n: number, direction: string) {
			this.allCube.forEach(cube => {
				if (cube.y == this.columnList[i] && direction == "row") {
					let no = this.rowList.indexOf(cube.x);
					no = (no + 9 + n) % 9;
					cube.x = this.rowList[no];
				}
				if (cube.x == this.rowList[i] && direction == "column") {
					let no2 = this.columnList.indexOf(cube.y);
					no2 = (no2 + 9 + n) % 9;
					cube.y = this.columnList[no2];
				}
			});
		}

		public isWin() {
			let iwin: boolean = true;
			this.whiteCube.forEach(cube => {
				if (this.rowList[6] > cube.x) {
					iwin = false;
				}
			});
			if (iwin) {
				ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
			}else{
				ApplicationFacade.getInstance().sendNotification(GameProxy.REDUCE_POWER);
			}
		}
	}

	export class M2Mediator extends puremvc.Mediator implements puremvc.IMediator {
		public static NAME: string = "M2Mediator";

		public constructor(viewComponent: any) {
			super(M2Mediator.NAME, viewComponent);
			super.initializeNotifier("ApplicationFacade");

		}

		public setResult() {
			this.gameM2.isWin();
		}

		public listNotificationInterests(): Array<any> {
			return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
		}

		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case GameProxy.RESET_MINIGAME:
					for (let i = 0; i++; i < 44) {
						this.gameM2.allCube[i].x = this.gameM2.record[i].x;
						this.gameM2.allCube[i].y = this.gameM2.record[i].y;
					}
					break;
				case GameProxy.CONFIRM_MINIGAME:
					this.setResult();
					break;
			}
		}

		public get gameM2(): M2 {
			return <M2><any>(this.viewComponent);
		}
	}
}
