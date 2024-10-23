const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'users';

class User extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: false
        }
    }
} 

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'name'
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'user'
    },
    password:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'password'
    },
    createdDate:{
        allowNull: true,
        type: DataTypes.DATE,
        field: 'createdDate'
    },
    lastLogin:{
        allowNull: true,
        type: DataTypes.DATE,
        field: 'lastLogin'
    } 
}
  
module.exports = { User, UserSchema };