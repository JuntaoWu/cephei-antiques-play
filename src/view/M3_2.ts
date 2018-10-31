module game {
	export class M3_2 extends eui.Component implements eui.UIComponent {

		public bright: eui.Group;
		public turnOffLight: eui.Button;
		public turnOnLight: eui.Button;
		public word1: eui.Scroller;
		public word2: eui.Scroller;
		public word3: eui.Scroller;
		public word4: eui.Scroller;
		public wordList1: eui.List;
		public wordList2: eui.List;
		public wordList3: eui.List;
		public wordList4: eui.List;

		public constructor() {
			super();
			this.skinName = "M3_2Skin";
			this.once(egret.Event.ADDED_TO_STAGE, this.onLoad, this);
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			let dataArr: any[] = [
				{ image: 'word_ren' },
				{ image: 'word_xin' },
				{ image: 'word_guo' },
				{ image: 'word_shi' }
			]
			let euiArr: eui.ArrayCollection = new eui.ArrayCollection(dataArr);
			this.wordList1.dataProvider = euiArr;
			this.wordList2.dataProvider = euiArr;
			this.wordList3.dataProvider = euiArr;
			this.wordList4.dataProvider = euiArr;
			this.wordList1.itemRenderer = wordList;
			this.wordList2.itemRenderer = wordList;
			this.wordList3.itemRenderer = wordList;
			this.wordList4.itemRenderer = wordList;

			this.word1.verticalScrollBar = null;
			this.word2.verticalScrollBar = null;
			this.word3.verticalScrollBar = null;
			this.word4.verticalScrollBar = null;

			this.word1.addEventListener(eui.UIEvent.CHANGE_END, (() => this.stoptouch(this.word1)), this);
			this.word2.addEventListener(eui.UIEvent.CHANGE_END, (() => this.stoptouch(this.word2)), this);
			this.word3.addEventListener(eui.UIEvent.CHANGE_END, (() => this.stoptouch(this.word3)), this);
			this.word4.addEventListener(eui.UIEvent.CHANGE_END, (() => this.stoptouch(this.word4)), this);
			this.turnOffLight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.turn, this);
			this.turnOnLight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.turn, this);
		}

		public stoptouch(word: eui.Scroller) {
			if (-70 < word.viewport.scrollV && word.viewport.scrollV < 70) {
				word.viewport.scrollV = 0;
			} else if (70 < word.viewport.scrollV && word.viewport.scrollV < 210) {
				word.viewport.scrollV = 140;
			} else if (210 < word.viewport.scrollV && word.viewport.scrollV < 350) {
				word.viewport.scrollV = 280;
			} else if (350 < word.viewport.scrollV && word.viewport.scrollV < 490) {
				word.viewport.scrollV = 420;
			}
		}

		public isWin() {
			if (this.word1.viewport.scrollV == 0 && this.word2.viewport.scrollV == 420 && this.word3.viewport.scrollV == 280 && this.word4.viewport.scrollV == 140) {
				ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
			}else{
				ApplicationFacade.getInstance().sendNotification(GameProxy.REDUCE_POWER);
			}
		}

		public turn() {
			this.bright.visible = this.bright.visible ? false : true;
		}

		public timeOnEnterFrame: number = 0;
		public onLoad(event: egret.Event) {
			this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		}

		public onEnterFrame(e: egret.Event) {
			var now = egret.getTimer();
			var time = this.timeOnEnterFrame;
			var pass = now - time;
			this.timeOnEnterFrame = egret.getTimer();
			this.wordLoop(this.word1);
			this.wordLoop(this.word2);
			this.wordLoop(this.word3);
			this.wordLoop(this.word4);
		}

		public wordLoop(word: eui.Scroller) {
			if (word.viewport.scrollV < -70) {
				word.viewport.scrollV = 490;
			}
			if (word.viewport.scrollV > 490) {
				word.viewport.scrollV = -70;
			}
		}
	}

	export class M3_2Mediator extends puremvc.Mediator implements puremvc.IMediator {
		public static NAME: string = "M3_2Mediator";

		public constructor(viewComponent: any) {
			super(M3_2Mediator.NAME, viewComponent);
			super.initializeNotifier("ApplicationFacade");

		}

		public setResult() {
			this.gameM3_2.isWin();
		}

		public listNotificationInterests(): Array<any> {
			return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
		}

		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case GameProxy.RESET_MINIGAME:
					this.gameM3_2.word1.viewport.scrollV = 0;
					this.gameM3_2.word2.viewport.scrollV = 0;
					this.gameM3_2.word3.viewport.scrollV = 0;
					this.gameM3_2.word4.viewport.scrollV = 0;
					this.gameM3_2.bright.visible = false;
					break;
				case GameProxy.CONFIRM_MINIGAME:
					this.setResult();
					break;
			}
		}

		public get gameM3_2(): M3_2 {
			return <M3_2><any>(this.viewComponent);
		}
	}
}
