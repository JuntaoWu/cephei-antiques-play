
module game {

    export class EffectManager {

        public static playEffect(effect: string) {
            let target = (this as any) as egret.DisplayObject;
            switch (effect) {
                case "放大":
                    EffectManager.beBig(target);
                    break;
                case "消失":
                    EffectManager.disappear2(target);
                    break;
                case "渐变消失":
                    EffectManager.disappear(target);
                    break;
                case "渐变出现":
                    EffectManager.gradualShow(target);
                    break;
                case "头晕目眩":
                    EffectManager.vagueImage(target);
                    break;
                case "睁眼":
                    EffectManager.gradualShow2(target);
                    break;
                case "晃动":
                    EffectManager.shakeTarget(target);
                    break;
                case "剧烈抖动":
                    EffectManager.shakeTargetSevere(target);
                    break;
                case "渐亮":
                    EffectManager.gradualClear(target);
                    break;
                case "放大一下消失":
                    EffectManager.beBigAndDisappear(target);
                    break;
                case "由模糊变清晰":
                    EffectManager.vagueToClear(target);
                    break;
                case "画面慢慢变模糊变黑":
                    EffectManager.gradualVague(target);
                    break;
            }
        }
 
        //放大
        public static beBig(target: egret.DisplayObject) {
            egret.Tween.get(target).to({scaleX: 1.2, scaleY: 1.2}, 100);
        }

        //渐变消失
        public static disappear(target: egret.DisplayObject) {
            egret.Tween.get(target).to({alpha: 0}, 800);
        }

        //渐亮
        public static gradualClear(target: egret.DisplayObject) {
            target.alpha = 0.8;
            egret.Tween.get(target).to({alpha: 1}, 800);
        }

        //放大一下消失
        public static beBigAndDisappear(target: egret.DisplayObject) {
            egret.Tween.get(target).to({scaleX: 1.2, scaleY: 1.2}, 100).to({alpha: 0}, 500);
        }

        //消失
        public static disappear2(target: egret.DisplayObject) {
            target.alpha = 0;
        }

        //渐变出现
        public static gradualShow(target: egret.DisplayObject) {
            target.alpha = 0;
            egret.Tween.get(target).to({alpha: 1}, 800);
        }

        //剧烈抖动
        public static shakeTargetSevere(target: egret.DisplayObject) {
            egret.Tween.get(target, {"loop": true}).to({x: -10}, 200).to({x: 10}, 400).to({x: 0}, 200);
            egret.setTimeout(() => {
                egret.Tween.removeTweens(target);
                target.x = 0;
            }, this, 4000)    
        }

        //晃动
        public static shakeTarget(target: egret.DisplayObject) {
            egret.Tween.get(target, {"loop": true}).to({x: -10}, 500).to({x: 10}, 1000).to({x: 0}, 500);
            egret.setTimeout(() => {
                egret.Tween.removeTweens(target);
                target.x = 0;
            }, this, 4000)    
        }


        //睁眼效果
        public static gradualShow2(target: egret.DisplayObject) {
            var m = new egret.Shape();
            m.touchEnabled = false;
            target.touchEnabled = false;
            m.name = "added";
            (target as eui.Group).addChild(m);
            m.x = target.width / 2;
            m.y = target.height / 2;
            let n = target.width;
            let intervalFun = () => {
                egret.setTimeout(() => {
                    m.graphics.beginFill(0xffffff);
                    m.graphics.drawCircle(0, 0, target.width - n);
                    m.graphics.endFill();
                    target.mask = null;
                    target.mask = m;
                    n -= 8;
                    if (target.width - n < 1.5 * target.width) {
                        intervalFun();
                    }
                    else {
                        target.mask = null;
                        m.parent && m.parent.removeChild(m);
                    }
                }, this, 20)
            }
            intervalFun();
            target.alpha = 0;
            egret.setTimeout(() => {
                egret.Tween.get(target).to({alpha: 1}, 2500);
            }, this, 400)
        }

        //头晕目眩(场景图重影模糊)
        public static vagueImage(obj) {
            let target = obj as eui.Image;
            let img = new eui.Image();
            img.width = target.width;
            img.height = target.height;
            img.source = target.source;
            img.alpha = 0.3;
            let n = target.parent.getChildIndex(target) + 1;
            img.name = "added";
            target.parent.addChildAt(img, n);
            egret.Tween.get(img, {"loop":true}).to({x: -10, y: -10, rotation: 1}, 500).to({x: 10, y: 10,rotation: -1}, 1000).to({x: 0, y: 0, rotation: 0}, 500);
            egret.setTimeout(() => {
                egret.Tween.removeTweens(img);
                img.parent && img.parent.removeChild(img);
            }, this, 4000)
        }

        // 由模糊变清晰
        public static vagueToClear(obj) {
            let target = obj as eui.Image;
            let img = new eui.Image();
            img.width = target.width;
            img.height = target.height;
            img.source = target.source;
            img.x = img.y = 2;
            img.alpha = 0.8;
            let n = target.parent.getChildIndex(target) + 1;
            img.name = "added";
            target.parent.addChildAt(img, n);
            egret.Tween.get(img).to({alpha: 0, x: 0, y: 0}, 1000).call(() => {
                img.parent && img.parent.removeChild(img);
            });
        }

        // 画面慢慢变模糊变黑
        public static gradualVague(obj) {
            let target = obj as eui.Image;
            let img = new eui.Image();
            img.width = target.width;
            img.height = target.height;
            img.source = target.source;
            img.x = img.y = 5;
            img.alpha = 0;
            let n = target.parent.getChildIndex(target) + 1;
            img.name = "added";
            target.parent.addChildAt(img, n);
            egret.Tween.get(img).to({alpha: 0.6}, 2000).to({alpha: 0}, 2000);
            egret.Tween.get(target).to({alpha: 0}, 4000).call(() => {
                img.parent && img.parent.removeChild(img);
            });
        }
    }
}
