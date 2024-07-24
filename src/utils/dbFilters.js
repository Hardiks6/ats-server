import {col, fn, literal} from "sequelize";

const Sequelize = require("sequelize");
import { Op } from "sequelize";

import db from "../models/index";

export const dbFilters = (filters) => {
    const filterOp = {};
    if (filters !== undefined) {
        console.log('filters', filters);
        Object.keys(filters).forEach(key => {
            // Check if the key is a comma-separated list
            if (key.includes(',')) {
                const keys = key.split(',');
                keys.forEach(innerKey => {
                    if (filters[key]) {
                        Object.keys(filters[key]).forEach(cond => {
                            if (cond === 'like') {
                                if (!filterOp[Op.or]) {
                                    filterOp[Op.or] = [];
                                }
                                keys.forEach(k => {
                                    const obj = {};
                                    obj[k] = { [Op.like]: `%${filters[key][cond]}%` };
                                    filterOp[Op.or].push(obj);
                                });
                            }
                        });
                    }
                });
            } else if (key.split('.').length === 1) {
                if (filters[key]) {
                    if (typeof filters[key] === 'object' && !Array.isArray(filters[key])) {
                        Object.keys(filters[key]).forEach(cond => {
                            if (cond === 'like') {
                                // Split the value by comma to handle multiple conditions
                                const likeValues = filters[key][cond].split(',');
                                filterOp[Op.or] = likeValues.map(value => ({
                                    [key]: { [Op.like]: `%${value}%` }
                                }));
                            } else if (cond === 'nin') {
                                filterOp[key] = {
                                    [Op.notIn]: Array.isArray(filters[key][cond]) ? filters[key][cond] : [filters[key][cond]]
                                };
                            } else if (cond === 'date') {
                                const startDate = new Date(filters[key][cond]);
                                const endDate = new Date(startDate); // Create a copy of startDate
                                endDate.setMonth(startDate.getMonth() + 1); // Add one month
                                endDate.setDate(0); // Set to the last day of the month

                                filterOp[key] = {
                                    [Op.between]: [startDate, endDate]
                                };
                            } else if (cond === 'range') {
                                const rangeValues = filters[key][cond].split(',');
                                if (rangeValues.length === 2) {
                                    const startDate = new Date(rangeValues[0]);
                                    startDate.setUTCHours(0, 0, 0, 0);
                                    const endDate = new Date(rangeValues[1]);
                                    endDate.setUTCHours(23, 59, 59, 999);
                                    filterOp[key] = {
                                        [Sequelize.Op.between]: [startDate, endDate]
                                    };
                                }
                            } else {
                                filterOp[key] = { [Op[cond]]: filters[key][cond] };
                            }
                        });
                    } else {
                        filterOp[key] = filters[key];
                    }
                }
            }
        });
    }
    return filterOp;
};

export const applyNestedFilters = (includeOptions, filters) => {
    Object.keys(filters).forEach(key => {
        if (key.includes('.')) {
            const keys = key.split('.');
            const model = keys[0];
            const attribute = keys.slice(1).join('.');
            
            let include = includeOptions.find(i => i.as === model);
            if (!include) {
                include = {
                    model: db[model], // Assuming db contains the model definitions
                    as: model,
                    include: [],
                    required: false,
                    where: {}
                };
                includeOptions.push(include);
            }
            
            if (keys.length > 2) {
                applyNestedFilters(include.include, { [attribute]: filters[key] });
            } else {
                include.where = include.where || {};
                include.required = true;
                if (typeof filters[key] === 'object' && !Array.isArray(filters[key])) {
                    Object.keys(filters[key]).forEach(cond => {
                        if (cond === 'like') {
                            const likeValues = filters[key][cond].split(',');
                            include.where[Op.or] = likeValues.map(value => ({
                                [keys[1]]: { [Op.like]: `%${value}%` }
                            }));
                        } else if (cond === 'nin') {
                            include.where[keys[1]] = {
                                [Op.notIn]: Array.isArray(filters[key][cond]) ? filters[key][cond] : [filters[key][cond]]
                            };
                        } else if (cond === 'date') {
                            const startDate = new Date(filters[key][cond]);
                            const endDate = new Date(startDate); // Create a copy of startDate
                            endDate.setMonth(startDate.getMonth() + 1); // Add one month
                            endDate.setDate(0); // Set to the last day of the month

                            include.where[keys[1]] = {
                                [Op.between]: [startDate, endDate]
                            };
                        } else if (cond === 'range') {
                            const rangeValues = filters[key][cond].split(',');
                            if (rangeValues.length === 2) {
                                const startDate = new Date(rangeValues[0]);
                                startDate.setUTCHours(0, 0, 0, 0);
                                const endDate = new Date(rangeValues[1]);
                                endDate.setUTCHours(23, 59, 59, 999);
                                include.where[keys[1]] = {
                                    [Op.between]: [startDate, endDate]
                                };
                            }
                        } else {
                            include.where[keys[1]] = { [Op[cond]]: filters[key][cond] };
                        }
                    });
                } else {
                    include.where[keys[1]] = filters[key];
                }
            }
        }
    });
};
