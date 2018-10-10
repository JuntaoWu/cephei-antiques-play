
module game {

    export class EffectManager {

        public static playEffect(effect: string) {
            let target = (this as any) as egret.DisplayObject;
            switch (effect) {
                case "放大":
                    EffectManager.beBig(target);
                    break;
                case "渐变消失":
                    EffectManager.disappear(target);
                    break;
                case "渐变出现":
                    EffectManager.gradualShow(target);
                    break;
                case "头晕目眩":
                    EffectManager.vagueImage(target as eui.Image);
                    break;
                case "睁眼":
                    EffectManager.gradualShow2(target as eui.Image);
                    break;
            }
        }
 
        //放大
        public static beBig(target) {
            egret.Tween.get(target).to({scaleX: 1, scaleY: 1}, 100);
        }

        //渐变消失
        public static disappear(target) {
            egret.Tween.get(target).to({alpha: 0}, 800).call(() => {
                target.parent && target.parent.removeChild(target);
            });
        }

        //渐变出现
        public static gradualShow(target) {
            target.alpha = 0;
            egret.Tween.get(target).to({alpha: 1}, 800);
        }

        //睁眼效果
        public static gradualShow2(target: egret.DisplayObject) {
            var m = new egret.Shape();
            target.parent.addChild(m);
            m.x = target.width / 2;
            m.y = target.height / 2;
            let n = target.width;
            let intervalId = egret.setInterval(() => {
                m.graphics.beginFill(0xffffff);
                m.graphics.drawCircle(0, 0, target.width - n)
                m.graphics.endFill();
                target.mask = m;
                n -= 20;
            }, this, 20);
            egret.setTimeout(() => {
                target.parent.removeChild(m);
                egret.clearInterval(intervalId);
            }, this, 1000)
        }

        //头晕目眩(场景图重影模糊)
        public static vagueImage(target: eui.Image) {
            let img = new eui.Image();
            img.width = target.width;
            img.height = target.height;
            img.source = target.source;
            img.alpha = 0.3;
            let n = target.parent.getChildIndex(target) + 1;
            target.parent.addChildAt(img, n);
            egret.Tween.get(img, {"loop":true}).to({x: -10, y: -10, rotation: 1}, 500).to({x: 10, y: 10,rotation: -1}, 1000).to({x: 0, y: 0, rotation: 0}, 500);
            egret.setTimeout(() => {
                egret.Tween.removeTweens(img);
                target.parent.removeChild(img);
            }, this, 4000)
        }
    }
}
