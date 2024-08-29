"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const App_1 = __importDefault(require("./App"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
App_1.default.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
