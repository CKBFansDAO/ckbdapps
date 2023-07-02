class DappListCache {
    static instance = null;
    dappList = [];
    dappLogos = [];

    constructor() {
        if (DappListCache.instance) {
            return DappListCache.instance;
        }

        DappListCache.instance = this;

        return this;
    }

    loadData = async () => {
        const response = await fetch('../dappList/dapps_list.json');
        const data = await response.json();
        const fetchPromises = data?.dappList?.map(appItem =>
            fetch(`../dappList/${appItem.path_name}/config.json`).then(res => res.json())
        );

        const dappList = await Promise.all(fetchPromises);
        this.dappList = dappList;
        this.dappLogos = this.dappList.map(item => ({
            url: item.links.official,
            name: item.project_name,
            icon: `../dappList/${item.path_name}/${item.logo_file}`,
        }));

    };

    async getDappLogos() {
        if (this.dappLogos.length === 0) {
            await this.loadData();
        }
        return this.dappLogos;
    }

    async getDataList() {
        if (this.dappList.length === 0) {
            await this.loadData();
        }
        return this.dappList;
    }
}

const dappListCache = new DappListCache();
export default dappListCache;