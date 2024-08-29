"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const User_1 = __importDefault(require("../Model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).send("Invalid Credentials");
        }
        if (bcrypt_1.default.compareSync(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ token });
        }
        else {
            return res.status(401).send("Invalid Credentials");
        }
    }
    catch (err) {
        return res.status(500).send("Database error");
    }
};
exports.login = login;
