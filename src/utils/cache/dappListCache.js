import { localListDataStore } from "./localListDataStore";

class DappListCache {
    static instance = null;
    dappList = [];
    dappLogos = [];
    watchListCache = [];

    constructor() {
        if (DappListCache.instance) {
            return DappListCache.instance;
        }

        DappListCache.instance = this;

        const cmpFn = (item, value) => item == value;
        const removeFn = (item, value) => item != value;
        this.watchListCache = new localListDataStore('CKBdappWatchList', cmpFn, removeFn);

        return this;
    }

    loadData = async () => {
        const response = await fetch('/dappList/dapps_list.json');
        const data = await response.json();
        const fetchPromises = data?.dappList?.map(appItem =>
            fetch(`/dappList/${appItem.path_name}/config.json`).then(res => res.json())
        );

        const dappList = await Promise.all(fetchPromises);
        this.dappList = dappList;
        this.dappLogos = this.dappList.map(item => ({
            url: item.links.official,
            name: item.project_name,
            icon: `/dappList/${item.path_name}/${item.logo_file}`,
        }));

    };

    async getDappLogos() {
        if (this.dappLogos.length === 0) {
            await this.loadData();
        }
        return this.dappLogos;
    }

    async getLogoByProjectName(projectName) {
        if (this.dappLogos.length === 0) {
            await this.loadData();
        }

        const dapp = this.dappLogos.find(item => item.name === projectName);
        
        return dapp ? dapp.icon : null;
    }

    async getDataList(isWatchList = false) {
        if (this.dappList.length === 0) {
            await this.loadData();
        }

        if (isWatchList) {
            const watchListAppNames = this.watchListCache.getDataList();
            const watchList = this.dappList.filter((dapp) => watchListAppNames.includes(dapp.project_name));

            return watchList;
        }
        else {
            return this.dappList;
        }  
    }
}

const dappListCache = new DappListCache();

export let CKBdappWatchListCache = dappListCache.watchListCache;
export default dappListCache;

export const fetchDappList = async () => {
  try {
    const response = await fetch('/dappList/dapps_list.json');
    const data = await response.json();
    return data.dappList;
  } catch (error) {
    console.error('Error fetching dapp list:', error);
    return [];
  }
};

export const fetchDappConfig = async (appItem) => {
  try {
    const response = await fetch(`/dappList/${appItem.path_name}/config.json`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching dapp config:', error);
    return null;
  }
};
