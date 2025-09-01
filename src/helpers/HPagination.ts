export default class HPagination {
    static getOffset = (page: number, limit: number): number => {
        return (page * limit) - limit
    }

    static getNextPage = (page: number, limit: number, total: number): number | null => {
        if ((total / limit) > page) {
            return page + 1
        }
        return null
    }

    static getPreviousPage = (page: number): number | null => {
        if (page <= 1) {
            return null
        }

        return page - 1
    }
}