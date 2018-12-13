/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */

namespace ap {

    export declare interface Platform {

        env: string;
        name: string;
        appVersion: string;
        isConnected: boolean;

        getUserInfo(): Promise<UserInfo>;

        authorizeUserInfo(imageUrl?: string): Promise<UserInfo>;

        login(): Promise<any>;

        getVersion(): Promise<any>;

        applyUpdate(version: string);

        getOpenDataContext();

        onNetworkStatusChange(callback: Function);

        onResume: Function;

        registerOnResume(callback: Function);

        resume();

        showToast(message: string);

        setStorage(key, data);

        getStorage(key);

        setStorageAsync(key, data);

        getStorageAsync(key);

        setSecurityStorageAsync(key, data);

        getSecurityStorageAsync(key);

        playVideo(src: string);

        showModal(message: string, confirmText?: string, cancelText?: string): Promise<any>;

        showLoading(message?: string);

        hideLoading();

        shareAppMessage(message?: string, imageUrl?: string, query?: string, callback?: Function);

        showShareMenu(imageUrl?: string);

        showPreImage(data: any, index?: any);

        createBannerAd(name: string, adUnitId: string, style: any);

        showBannerAd(name: string);

        hideAllBannerAds();

        createRewardedVideoAd(name: string, adUnitId: string, callback: Function, onError: Function);

        showVideoAd(name: string);

        isVideoAdDisabled(name: string);

        disableVideoAd(name: string);

        navigateToMiniProgram();
    }

    export class DebugPlatform implements Platform {

        public get env(): string {
            return "dev";
        }

        public get name(): string {
            return "DebugPlatform";
        }

        public get appVersion(): string {
            return "0.5.0";
        }

        public isConnected: boolean = true;

        public async getUserInfo() {
            return { nickName: CommonData.logon && CommonData.logon.unionId || "username" };
        }

        public async authorizeUserInfo() {
            return { nickName: CommonData.logon && CommonData.logon.unionId || "username" };
        }

        public async login() {
            return { code: "anonymous", token: "" };
        }

        public async getVersion() {

        }

        public getOpenDataContext() {
            return {
                postMessage: () => { },
                createDisplayObject: () => { },
            };
        }

        public showShareMenu() {

        }

        public getLaunchInfo() {

        }

        public createRewardedVideoAd() {

        }

        public showVideoAd() {

        }

        public isVideoAdDisabled() {
            return true;
        }

        public disableVideoAd() {

        }

        public applyUpdate() {
            return true;
        }

        public onNetworkStatusChange(callback: Function) {

        }

        public onResume: Function;

        public registerOnResume(callback: Function) {

        }

        public resume() {

        }

        public showToast(message: string) {
            console.log(message);
        }

        public setStorage(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }

        public getStorage(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        public async setStorageAsync(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }

        public async getStorageAsync(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        public async setSecurityStorageAsync(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }

        public async getSecurityStorageAsync(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        public playVideo() {
            return {};
        }

        public showPreImage(data, index?) {

        }

        public async showModal(message: string, confirmText?: string, cancelText?: string): Promise<any> {
            return { confirm: false, cancel: true };
        }

        public showLoading() {
            return true;
        }

        public hideLoading() {
            return true;
        }

        public shareAppMessage() {

        }

        public createBannerAd(name: string, adUnitId: string, style: any) {

        }

        public showBannerAd(name: string = "bottom") {

        }

        public hideAllBannerAds() {

        }

        public navigateToMiniProgram() {

        }
    }

    // todo: in the wrapped project, the platform had been declared in the child lib project alreay.
    export let platform: Platform;
    platform = window["platform"] || new DebugPlatform();

}
