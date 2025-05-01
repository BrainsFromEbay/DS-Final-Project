"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./src/routing/index"));
// import mongoose ,{Connection} from 'mongoose'
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// import cors ,{CorsOptions,} from "cors"
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
// const corsOptions: CorsOptions = {
//     origin: 'http://localhost:3002',
//     optionsSuccessStatus: 200
// }
// app.use(cors(corsOptions));
// const mongoDB: string = "mongodb://127.0.0.1:27017/ProkkisDB";
// mongoose.connect(mongoDB);
// mongoose.Promise = Promise;
// const db: Connection = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((req, res, next) => {
    if (req.originalUrl === "/api/register") {
        return next();
    }
    express_1.default.json()(req, res, next);
});
app.use("/", index_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
