"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Admin_1 = __importDefault(require("./Routes/Admin"));
const Employee_1 = __importDefault(require("./Routes/Employee"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:3001/api/recruiter/getpostedJob", // Replace with the origin of your Flutter app
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/admin", Admin_1.default);
app.use("/api/Employee", Employee_1.default);
exports.default = app;
