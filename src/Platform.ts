/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    env: string;
    name: string;
    appVersion: string;

    getUserInfo(): Promise<any>;

    login(): Promise<any>;

    checkForUpdate(): Promise<any>;

    getVersion(): Promise<any>;

    applyUpdate(version: string);

    getOpenDataContext();

    shareAppMessage(message?: string, query?: string, callback?: Function);

    showShareMenu();

    setStorage(key, value);

    getStorage(key);

    setStorageAsync(key, value);

    getStorageAsync(key): Promise<any>;

    getLaunchInfo();

    showPreImage(data: Array<string>);

    authorizeUserInfo(callback);

    createBannerAd(name: string, adUnitId: string, style: any);

    showBannerAd(name: string);

    hideAllBannerAds();

    createRewardedVideoAd(name: string, adUnitId: string, callback: Function, onError: Function);

    showVideoAd(name: string);

    isVideoAdDisabled(name: string);

    disableVideoAd(name: string);

    showModal(msg: string, showCancel: boolean);
}

class DebugPlatform implements Platform {

    public get env() {
        return "dev";
    }

    public get name() {
        return "DebugPlatform";
    }

    public get appVersion() {
        return "0.1.1";
    }

    public async getUserInfo() {
        return {
            nickName: "盒中闪电测试账号",
            avatarUrl: `unit(001-050)_json#hero(004)`
        };
    }

    public async login() {
        return { code: "debug-code" };
    }

    public async checkForUpdate() {
        return {
            hasUpdate: false
        };
    }

    public async getVersion() {
        return "0";
    }

    public applyUpdate() {
        return true;
    }

    public getOpenDataContext() {
        return {
            postMessage: () => { },
            createDisplayObject: () => { },
        };
    }

    public shareAppMessage(message?: string, query?: string, callback?: Function) {

    }

    public showShareMenu() {

    }

    public setStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public getStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    public setStorageAsync(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public async getStorageAsync(key): Promise<any> {
        return JSON.parse(localStorage.getItem(key));
    }

    public getLaunchInfo() {

    }

    public showPreImage(data) {
    }

    public authorizeUserInfo(callback) {

    }

    public createBannerAd(name: string, adUnitId: string, style: any) {

    }

    public showBannerAd(name: string) {

    }

    public hideAllBannerAds() {

    }

    public async createRewardedVideoAd(name: string, adUnitId: string, callback: Function, onError: Function) {

    }

    public async showVideoAd(name: string) {

    }

    public async isVideoAdDisabled(name: string) {

    }

    public async disableVideoAd(name: string) {

    }

    public showModal(msg: string, showCancel: boolean) {

    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}

declare let platform: Platform;

declare interface Window {
    platform: Platform
}
