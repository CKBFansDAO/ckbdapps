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
        const response = await fetch('/dappList/event_list.json');
        const data = await response.json();

        // 获取当前时间
        const currentTime = new Date();

        // 自定义排序函数
        const customSort = (a, b) => {
            const currentTime = new Date(); // 获取当前时间
            const startA = new Date(a.start_at);
            const startB = new Date(b.start_at);
            const endA = new Date(a.end_at);
            const endB = new Date(b.end_at);

            // 正在进行的活动排在前面
            if (startA <= currentTime && currentTime < endA) {
                return -1;
            } else if (startB <= currentTime && currentTime < endB) {
                return 1;
            }

            // 已经过期的活动排在后面
            if (currentTime >= endA && currentTime >= endB) {
                return endB - endA;
            }

            // 还未开始的活动，按照开始时间排序
            return startB - startA;
        };
         
        // 使用自定义排序函数对数据进行排序
        const sortedData = data.sort(customSort);
        this.eventList = sortedData;
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

export const fetchEventList = async () => {
  try {
    const response = await fetch('/dappList/event_list.json');
    const data = await response.json();
    return data.eventList;
  } catch (error) {
    console.error('Error fetching event list:', error);
    return [];
  }
};
