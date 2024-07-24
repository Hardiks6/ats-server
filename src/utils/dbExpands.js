import db from "../models/index";

const getModelInclude = (parent, childs, paranoid) => {
    if (childs && childs.length > 0) {
        return {
            model: db[parent],
            as: parent,
            include: [getModelInclude(childs[0], childs.slice(1))],
            paranoid: paranoid,
            required: false,
        };
    }
    return {
        model: db[parent],
        as: parent,
        include: [],
        paranoid: paranoid,
        required: false,
    };
};

export const dbExpands = (expand, paranoid) => {
    const join = expand.split(",");
    return join.map(element => {
        const s = element.trim();
        if (s.indexOf(".") > 0) {
            const joins = s.split(".");
            return getModelInclude(joins[0], joins.slice(1), paranoid);
        } else {
            return getModelInclude(s, undefined, paranoid);
        }
    });
};
