//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace ap {

    export class Main extends eui.UILayer {

        private loadingView: ApLoadingUI;

        protected createChildren(): void {
            super.createChildren();
            Object.entries = typeof Object.entries === 'function' ? Object.entries : obj => Object.keys(obj).map(k => [k, obj[k]] as [string, any]);

            egret.lifecycle.addLifecycleListener((context) => {
                // custom lifecycle plugin
            })

            egret.lifecycle.onPause = () => {
                egret.ticker.pause();
            }

            egret.lifecycle.onResume = () => {
                egret.ticker.resume();
            }

            //inject the custom material parser
            //注入自定义的素材解析器
            let assetAdapter = new AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


            this.runGame().catch(e => {
                console.log(e);
            })
        }

        private async retryAuthorize() {
            const userInfo = await AccountAdapter.loadUserInfo();
            if (userInfo && userInfo.userId) {
                this.createGameScene();
            }
            else {
                await this.retryAuthorize();
            }
        }

        private async runGame() {
            await this.loadResource();
            this.loadingView.groupLoading.visible = false;

            if (platform.name == "wxgame") {
                await AccountAdapter.login();
                await this.retryAuthorize();
            }
            else if (platform.name == "DebugPlatform") {
                let anonymousToken = platform.getStorage("ap-anonymoustoken");
                await AccountAdapter.login({ token: anonymousToken });
                this.createGameScene();
            }
            else {
                // note: we should use "token" rather than "ap-token" because we're inside the union native package.
                // and we won't override this "token" value after login.
                let token = await platform.getSecurityStorageAsync("token");
                await AccountAdapter.login({ token: token });
                this.createGameScene();
            }
        }

        private async loadResource() {
            try {
                const checkVersionResult: any = await AccountAdapter.checkForUpdate();

                if (checkVersionResult.hasUpdate) {
                    platform.applyUpdate(checkVersionResult.version);
                }
                await RES.loadConfig("ap.res.json", `${ap.Constants.ResourceEndpoint}resource/`);
                await this.loadTheme();

                await RES.loadGroup("loading", 1);
                this.loadingView = new ApLoadingUI();
                this.stage.addChild(this.loadingView);

                await RES.loadGroup("preload", 0, this.loadingView);
                RES.loadGroup("lazyload", 0);
            }
            catch (e) {
                console.error(e);
            }
        }

        private loadTheme() {
            return new Promise((resolve, reject) => {
                // load skin theme configuration file, you can manually modify the file. And replace the default skin.
                //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                let theme = new eui.Theme("resource/ap.thm.json", this.stage);
                theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                    resolve();
                }, this);

            })
        }

        private textfield: egret.TextField;
        /**
         * 创建场景界面
         * Create scene interface
         */
        protected createGameScene(): void {
            egret.Tween.get(this.loadingView).to({ alpha: 0 }, 1500).call(() => {
                this.stage.removeChild(this.loadingView);
            });

            const appContainer = new ap.AppContainer();
            this.addChild(appContainer);

            ap.ApplicationFacade.getInstance().startUp(appContainer);
        }
        /**
         * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
         * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
         */
        private createBitmapByName(name: string): egret.Bitmap {
            let result = new egret.Bitmap();
            let texture: egret.Texture = RES.getRes(name);
            result.texture = texture;
            return result;
        }

        /**
         * 点击按钮
         * Click the button
         */
        private onButtonClick(e: egret.TouchEvent) {
            let panel = new eui.Panel();
            panel.title = "Title";
            panel.horizontalCenter = 0;
            panel.verticalCenter = 0;
            this.addChild(panel);
        }
    }
}

