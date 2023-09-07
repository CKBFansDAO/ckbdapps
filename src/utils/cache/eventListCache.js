
class EventListCache {
    static instance = null;
    eventList = [];
    
    constructor() {
        if (EventListCache.instance) {
            return EventListCache.instance;
        }

        EventListCache.instance = this;

        return this;
    }

    loadData = async () => {
        const response = await fetch('../dappList/event_list.json');
        const data = await response.json();
        
        this.eventList = data;
    };

    async getDataList() {
        if (this.eventList.length === 0) {
            await this.loadData();
        }

        return this.eventList;
    }
}

const eventListCache = new EventListCache();

export default eventListCache;