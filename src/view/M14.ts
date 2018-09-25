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
				{ x: 451.5, y: 250, ro: 0 },
				{ x: 271.5, y: 100, ro: 0 },
				{ x: 86.5, y: 100, ro: 0 },
				{ x: 451.5, y: 100, ro: 0 },
				{ x: 86.5, y: 250, ro: 0 },
				{ x: 631.5, y: 250, ro: 0 },
				{ x: 631.5, y: 100, ro: 0 },
				{ x: 271.5, y: 250, ro: 0 }
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
		private record(img: eui.Image) {
			this.first_img = img;
			this.first_img.parent.addChild(this.first_img);
			this.first_img_x = img.x;
			this.first_img_y = img.y;
		}

		private rotate(img: eui.Image) {
			img.rotation = img.rotation == 0 ? 180 : 0;
		}

		private move(s: egret.TouchEvent) {
			this.first_img.x = s.stageX;
			this.first_img.y = (s.stageY - 90 - 64.5);
		}

		private second_img_x: number;
		private second_img_y: number;
		private ischang: boolean = false;
		private transposition(s: egret.TouchEvent) {
			this.ischang = false;
			if (this.first_img.x == this.first_img_x && this.first_img.y == this.first_img_y) {
				this.first_img.rotation = this.first_img.rotation == 0 ? 180 : 0;
			}

			this.paperList.forEach(ele => {
				if ((ele.x - 86.5) <= s.stageX && s.stageX <= (ele.x + 86.5) && (ele.y - 64.5) <= (s.stageY - 90) && (s.stageY - 90) <= (ele.y + 64.5) && ele != this.first_img) {
					this.first_img.x = ele.x;
					this.first_img.y = ele.y;
					ele.x = this.first_img_x;
					ele.y = this.first_img_y;
					this.ischang = true;
					// egret.Tween.get(ele).to({ x: this.first_img_x, y: this.first_img_y }, 1000);				
				}
			});

			if (!this.ischang) {
				this.first_img.x = this.first_img_x;
				this.first_img.y = this.first_img_y;
			}

			this.iswin();
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