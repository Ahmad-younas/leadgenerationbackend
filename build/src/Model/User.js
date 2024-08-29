"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DbConnection_1 = require("../DbConnection");
class User extends sequelize_1.Model {
    _id;
    get id() {
        return this._id;
    }
    _username;
    get username() {
        return this._username;
    }
    set username(value) {
        this._username = value;
    }
    _password;
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    _role;
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        get() {
            return this.id;
        },
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        get() {
            return this.username;
        },
        set(value) {
            this.username = value;
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        get() {
            return this.password;
        },
        set(value) {
            this.password = value;
        },
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        get() {
            return this.role;
        },
        set(value) {
            this.role = value;
        },
    },
}, {
    sequelize: DbConnection_1.sequelize,
    tableName: "users",
    timestamps: false,
});
exports.default = User;
