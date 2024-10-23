const { Model, DataTypes } = require('sequelize');

const SECTION_TABLE = 'sections';

class Section extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SECTION_TABLE,
            modelName: 'Section',
            timestamps: false
        }
    }
}

const SectionSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    dt: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'dt'
    },
    city: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'city'
    },
    section: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'section'
    }
}

module.exports = { Section, SectionSchema };