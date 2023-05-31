import i18n from "./i18n";
import { localListDataStore } from "./localStore";


export class localeCacheInstance {
    state = {
        favoriteList:[],
        localConfig:{},
        cartRegisterList:[],
        addressBookStore: null,
        imported2RegisterCart:null,
    }

    constructor(){
        //console.log("--- localeCache constructor ---")
        this.init();
        if (window) {
            window.addEventListener('storage', this.onStoreageChanged)
        }
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new localeCacheInstance();
        }
        return this.instance;
    }

    onStoreageChanged = (event) => {
        if (event.key === 'regCartAccounts') {
            this.loadRegisterCartAccounts();
        }
        else if (event.key === 'favoriteList') {
            this.loadFavoriteList();
        }
        else if (event.key === 'localConfig') {
            this.loadLocalConfig();
        }
    }

    init = () => {
        this.loadFavoriteList();
        this.loadRegisterCartAccounts();
        this.loadLocalConfig();

        this.createAddressBookFactory();
        this.createImportedToRegAccountsFactory();
    }

    createAddressBookFactory = () => {
        const cmpFn = (item, value) => item == value;
        const removeFn = (item, value) => item != value;
        this.addressBookStore = new localListDataStore('addressBook', cmpFn, removeFn);

        /**
        const cmpFn = (item1, item2) => item1.account == item2.account;
        const removeFn = (item, value) => item.account != value;
        this.addressBookStore = new localListDataStore('addressBook', cmpFn, removeFn);

        this.addressBookStore.addItem({"account":"aaab.bit", "value":"123"});
        this.addressBookStore.addItem({"account":"aaab.bit", "value":"124"});
        this.addressBookStore.addItem({"account":"aaac.bit", "value":"125"});
        this.addressBookStore.removeItem("aaac.bit");
        */
    }

    createImportedToRegAccountsFactory = () => {
        const cmpFn = (item1, item2) => item1.account == item2.account;
        const removeFn = (item, value) => item.account != value;
        this.imported2RegisterCart = new localListDataStore('imported-reg-cart', cmpFn, removeFn);
    }

    loadFavoriteList = () => {
        let favoriteList = localStorage.getItem('favoriteList');
        if (!favoriteList) {
            favoriteList = '[]';
        }
           
        this.favoriteList = JSON.parse(favoriteList);
    }

    addToFavorite = (account) => {
        if (!this.favoriteList.includes(account)) {
            
            this.favoriteList.push(account);

            this.saveFavoriteList(this.favoriteList);

            // 没有提示过，则提醒用户，本地收藏是安全的
            if (!this.localConfig || !this.localConfig.newbie_add_favorite_tip_showed) {
                this.toast?.success(i18n.t('toast.first-add-fav-tip'), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: (this.getThemeMode() === 'theme-mode-dark') ? 'dark' : 'light',
                    progress: undefined,
                });
                this.localConfig.newbie_add_favorite_tip_showed = true;
                this.saveLocalConfig(this.localConfig);
            }
        }
    }

    removeFromArray = (arr, value) => { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

    removeFromFavorite = (account) => {
        this.favoriteList = this.removeFromArray(this.favoriteList, account);
        this.saveFavoriteList(this.favoriteList);

        // 没有提示过，则提醒用户，本地收藏是安全的
        if (!this.localConfig || !this.localConfig.newbie_remove_favorite_tip_showed) {
            this.toast?.success(i18n.t('toast.remove-from-favorite-tip'), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: (this.getThemeMode() === 'theme-mode-dark') ? 'dark' : 'light',
                progress: undefined,
            });
           
            this.localConfig.newbie_remove_favorite_tip_showed = true;
            this.saveLocalConfig(this.localConfig);
        }
    }

    clearFavorite = () => {
        this.favoriteList = [];
        this.saveFavoriteList([]);
    }

    saveFavoriteList = (favoriteList) => {
        if (favoriteList) {
            localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
        }

        this.favoriteList = favoriteList;
    }

    isFavorite = (account) => {
        if (this.favoriteList.includes(account)) {
            return true;
        }

        return false;
    }

    getFavoriteList = () => {
        return this.favoriteList;
    }

    //+ 待注册列表
    loadRegisterCartAccounts = () => {
        let cartRegisterList = localStorage.getItem('regCartAccounts');
        if (!cartRegisterList) {
            cartRegisterList = '[]';
        }
           
        this.cartRegisterList = JSON.parse(cartRegisterList);
    }

    addToRegCart = (newItem, showToast) => {
        let index = this.cartRegisterList.findIndex(item => item.account === newItem.account);
        if (index >= 0) {
            this.cartRegisterList[index] = newItem;
        }
        else {
            this.cartRegisterList.push(newItem);  
        }
        
        this.saveRegisterCartAccounts(this.cartRegisterList);

        if (showToast) {
            this.showSuccessToast(i18n.t('toast.added-account-to-reg-cart'));
        }
    }

    removeItemFromCart = (arr, account) => { 
    
        return arr.filter(function(ele){ 
            return ele.account != account;
        });
    }

    removeFromRegCart = (account) => {
        this.cartRegisterList = this.removeItemFromCart(this.cartRegisterList, account);
        this.saveRegisterCartAccounts(this.cartRegisterList);
    }

    clearRegCart = () => {
        this.cartRegisterList = [];
        this.saveRegisterCartAccounts([]);
    }

    saveRegisterCartAccounts = (cartRegisterList) => {
        if (cartRegisterList) {
            localStorage.setItem('regCartAccounts', JSON.stringify(cartRegisterList));
            window.dispatchEvent(new Event("storage"));
        }

        this.cartRegisterList = cartRegisterList;
    }

    isInRegCart = (account) => {
        let index = this.cartRegisterList.findIndex(item => item.account === account);
        if (index >= 0) {
            return true;
        }

        return false;
    }

    getRegisterCartAccounts = () => {
        return this.cartRegisterList;
    }
    //- 待注册列表

    loadLocalConfig = () => {
        let config = localStorage.getItem('localConfig');
        if (!config) {
            this.localConfig = {
                newbie_add_favorite_tip_showed: false,
                newbie_remove_favorite_tip_showed: false,
            }

            return;
        }
           
        this.localConfig = JSON.parse(config);
    }

    saveLocalConfig = (config) => {
        if (config) {
            localStorage.setItem('localConfig', JSON.stringify(config));
        }
    }

    getSessionStorageValue = (key) => {
        if (window.sessionStorage) {
            return window.sessionStorage?.getItem(key);
        }
        
        return '';
    }

    setSessionStorageValue = (key, value) => {
        if (window.sessionStorage) {
            window.sessionStorage?.setItem(key, value);
        }
    }

    getLocalStorageValue = (key) => {
        if (window.localStorage) {
            return window.localStorage?.getItem(key);
        }
        
        return '';
    }

    setLocalStorageValue = (key,value) => {
        if (window.localStorage) {
            window.localStorage?.setItem(key, value);
        }
    }

    getThemeMode = () => {
        return localStorage.getItem('themeMode', 'theme-mode-light');
    }

    setLanguage = (language) => {
        this.lang = language;
        //console.log(this.lang);
    }

    getLanguage = () => {
        return this.lang;
    }
    
    setToastHandler = (toastCallback) => {
        this.toast = toastCallback;
    }

    showSuccessToast = (content) => {
        this.toast?.success(content, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: (this.getThemeMode() === 'theme-mode-dark') ? 'dark' : 'light',
            progress: undefined,
        });
    }
}

let localCache =  localeCacheInstance.getInstance();
export let addressBookStore = localCache.addressBookStore;
export let registerCartImported = localCache.imported2RegisterCart;

export default localCache;
