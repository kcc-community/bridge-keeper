module.exports = function (sequelize, DataTypes) {
    return sequelize.define("gas_price", {
        id:             {
            autoIncrement: true,
            type:          DataTypes.BIGINT.UNSIGNED,
            allowNull:     false,
            primaryKey:    true,
        },
        chain:          {
            type:      DataTypes.STRING(32),
            allowNull: false,
        },
        fastest:        {
            type:         DataTypes.DECIMAL(65, 30),
            allowNull:    false,
            defaultValue: 0,
        },
        fast:           {
            type:         DataTypes.DECIMAL(65, 30),
            allowNull:    false,
            defaultValue: 0,
        },
        maxPriorityFee: {
            type:      DataTypes.DECIMAL(65, 30),
            allowNull: true,
            field:     "max_priority_fee",
        },
        source:         {
            type:      DataTypes.STRING(128),
            allowNull: false,
        },
        status:         {
            type:      DataTypes.TINYINT.UNSIGNED,
            allowNull: true,
        },
        createTime:     {
            type:      DataTypes.DATE(3),
            allowNull: true,
            field:     "create_time",
        },
        updateTime:     {
            type:      DataTypes.DATE(3),
            allowNull: true,
            field:     "update_time",
        },
        comment:        {
            type:      DataTypes.STRING(512),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName:  "gas_price",
        timestamps: false,
        indexes:    [
            {
                name:   "PRIMARY",
                unique: true,
                using:  "BTREE",
                fields: [
                    {name: "id"},
                ],
            },
            {
                name:   "unique_chain_source",
                unique: true,
                using:  "BTREE",
                fields: [
                    {name: "chain"},
                    {name: "source"},
                ],
            },
        ],
    });
};
