async function getRecrgivedata(modelSplit, childs) {
    if (childs.model.tableName == (modelSplit[0]).toLowerCase() && modelSplit.length > 2) {
        return getRecrgivedata(modelSplit.slice(1), childs.include)
    } else {
        if (childs.model.tableName == (modelSplit[0]).toLowerCase()) {
            if (childs.attributes == undefined) {
                return childs.attributes = [modelSplit.slice(1)[0]];
            } else {
                return childs.attributes.push(modelSplit.slice(1)[0]);
            }
        }
    }
};
export const dbFields = (fields, attributes, joinOptions) => {
    let field = fields.split(",");
    field.forEach(value => {
        let ad = value.split(".");
        if (ad.length == 1) {
            attributes.push(ad[0]);
        } else {
            for (var key in joinOptions) {
                getRecrgivedata(ad, joinOptions[key]);
            }
        }
    })
    return { attributes, joinOptions };
};