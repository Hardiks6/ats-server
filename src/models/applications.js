'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class applications extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.application_roles, {foreignKey: 'application_id', as: 'application_roles', onDelete: 'CASCADE'})
        }
    }

    applications.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        client_id: {
            type: DataTypes.STRING
        },
        client_secret: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        tableName: 'applications',
        timestamps: false
    });
    return applications;
}