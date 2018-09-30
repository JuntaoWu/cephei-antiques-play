module game {
	export class M14 extends eui.Component implements eui.UIComponent {

		public no1: eui.Image;
		public no2: eui.Image;
		public no3: eui.Image;
		public no4: eui.Image;
		public no5: eui.Image;
		public no6: eui.Image;
		public no7: eui.Image;
		public no8: eui.Image;
		public win: eui.Label;

		public paperList: Array<eui.Image> = [];
		public recordList: Array<any> = [];
		public answerList: Array<any> = [];

		public constructor() {
			super();
			this.skinName = "M14Skin";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			this.paperList = [this.no1, this.no2, this.no3, this.no4, this.no5, this.no6, this.no7, this.no8];
			this.answerList = [
				{ x: 450.5, y: 250, ro: 0 },
				{ x: 270.5, y: 100, ro: 0 },
				{ x: 85.5, y: 100, ro: 0 },
				{ x: 450.5, y: 100, ro: 0 },
				{ x: 85.5, y: 250, ro: 0 },
				{ x: 630.5, y: 250, ro: 0 },
				{ x: 630.5, y: 100, ro: 0 },
				{ x: 270.5, y: 250, ro: 0 }
			];

			this.paperList.forEach(ele => {
				// ele.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.rotate(ele) }), this);
				ele.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (() => { this.record(ele) }), this);
				ele.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
				ele.addEventListener(egret.TouchEvent.TOUCH_END, this.transposition, this);
			});
		}

		private first_img_x: number;
		private first_img_y: number;
		private first_img: eui.Image;
		private is_touch_begin: boolean = false;
		private record(img: eui.Image) {
			if (this.is_move_end) {
				this.first_img = img;
				this.first_img.parent.addChild(this.first_img);
				this.first_img_x = img.x;
				this.first_img_y = img.y;
				this.is_move_end = false;
				this.is_touch_begin = true;
			}
		}

		private is_touch_move: boolean = false;
		private move(s: egret.TouchEvent) {
			if (this.is_touch_begin) {
				this.first_img.x = s.stageX;
				this.first_img.y = (s.stageY - 90 - 64.5);
				this.is_touch_move = true;
			}
		}

		private second_img_x: number;
		private second_img_y: number;
		private ischang: boolean = false;
		private transposition(s: egret.TouchEvent) {
			if (this.is_touch_move) {
				this.is_touch_begin = false;
				this.ischang = false;
				if (this.first_img.x == this.first_img_x && this.first_img.y == this.first_img_y) {
					this.first_img.rotation = this.first_img.rotation == 0 ? 180 : 0;
				} else {
					this.paperList.forEach(ele => {
						// if ((ele.x - 84.5) <= s.stageX && s.stageX <= (ele.x + 84.5) && (ele.y - 64.5) <= (s.stageY - 180) && (s.stageY - 180) <= (ele.y + 64.5) && ele != this.first_img) {
						if (Math.abs(this.first_img.x - ele.x) <= 84.5 && Math.abs(this.first_img.y - ele.y) <= 64.5 && this.first_img != ele) {
							// this.first_img.x = ele.x;
							// this.first_img.y = ele.y;
							egret.Tween.get(this.first_img).to({ x: ele.x, y: ele.y }, 300);
							// ele.x = this.first_img_x;
							// ele.y = this.first_img_y;
							egret.Tween.get(ele).to({ x: this.first_img_x, y: this.first_img_y }, 300);
							this.ischang = true;
						}
					});
				}

				if (!this.ischang) {
					// this.first_img.x = this.first_img_x;
					// this.first_img.y = this.first_img_y;
					egret.Tween.get(this.first_img).to({ x: this.first_img_x, y: this.first_img_y }, 300);
				}
				egret.setTimeout(this.move_end, this, 300);
				this.iswin();
				this.is_touch_move = false;
			}
		}

		private is_move_end: boolean = true;
		private move_end() {
			this.is_move_end = true;
		}

		private ww: boolean = true;
		private iswin() {
			this.ww = true;
			this.paperList.forEach(ele => {
				let no = this.paperList.indexOf(ele);
				if (ele.x != this.answerList[no].x || ele.y != this.answerList[no].y || ele.rotation != this.answerList[no].ro) {
					this.ww = false;
				}
			});

			if (this.ww) {
				this.win.parent.addChild(this.win);
				this.win.visible = true;
				ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
			}
		}
	}
}