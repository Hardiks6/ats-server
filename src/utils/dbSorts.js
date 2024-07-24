export const dbSorts = (sorts) => {
    const sortOrder = [];
    if (sorts != undefined) {
        let sort = sorts.split(",");
        sort.forEach(value => {
            let splitSort = value.split("-");
            let tmpArray = [];
            tmpArray.push(splitSort[splitSort.length - 1]);
            tmpArray.push(splitSort.length > 1 ? "DESC" : "ASC");
            sortOrder.push(tmpArray);
        });
        return sortOrder;
    }
}