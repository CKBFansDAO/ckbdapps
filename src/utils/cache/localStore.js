export class localListDataStore {
    state = {
        key:'',
        comparison: null,
        removeFilter: null,
        listData:[],
    }

    constructor(key, cmpFn, removeFn){
        //console.log("--- localeCache constructor ---")
        //console.log(removeFn);
        this.key = key;
        this.comparison = cmpFn;
        this.removeFilter = removeFn;
        this.reloadListData(key);
    }

    reloadListData = (key) => {
        let list = localStorage.getItem(key);
        if (!list) {
            list = '[]';
        }
           
        this.listData = JSON.parse(list);
    }

    addItem = (newItem) => {

        let index = this.listData.findIndex(item => this.comparison(item, newItem));
        if (index >= 0) {
            this.listData[index] = newItem;
        }
        else {
            this.listData.push(newItem);  
        }

        /*
        if (!this.listData.includes(newItem)) {
            
            this.listData.push(newItem);

            this.saveListData(this.listData);
        }*/
        this.saveListData(this.listData);
    }

    removeFromArray = (arr, value) => { 
        return arr.filter(ele => this.removeFilter(ele, value));
        /*return arr.filter(function(ele){ 
            return this.removeFilter(ele, value);
        });*/
    }

    removeItem = (item) => {
        this.listData = this.removeFromArray(this.listData, item);
        this.saveListData(this.listData);
    }

    clear = () => {
        this.listData = [];
        this.saveListData([]);
    }

    saveListData = (list) => {
        if (list) {
            localStorage.setItem(this.key, JSON.stringify(list));
        }

        this.listData = list;
    }

    hasItem = (value) => {
    /*    let index = this.listData.findIndex(this.comparison);
        if (index >= 0) {
            this.cartRegisterList[index] = newItem;
        }
        else {
            this.cartRegisterList.push(newItem);  
        }
*/
        //console.log(value);
        let index = this.listData.findIndex(item => this.comparison(item, value));
        if (index >= 0) {
            return true;
        }

        return false;

        /*
        if (this.listData.includes(item)) {
            return true;
        }

        return false;*/
    }

    getDataList = () => {
        return this.listData;
    }

}