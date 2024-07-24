'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class application_roles extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.applications, {foreignKey: 'application_id', as: 'applications'});
            this.hasMany(models.users, {foreignKey: 'application_role_id', as: 'users'});
        }
    }

    application_roles.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'applications',
                key: 'id'
            }
        },
        role: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        tableName: 'application_roles',
        paranoid: true
    });
    return application_roles;
}