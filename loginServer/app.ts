import express, {Express} from "express"
import path from "path"
import router from "./src/routing/index"
 import mongoose ,{Connection} from 'mongoose'
import morgan from "morgan"
import dotenv from "dotenv"
import cors ,{CorsOptions,} from "cors"

dotenv.config()

const app: Express = express()
const port:number = parseInt(process.env.PORT as string)

 const corsOptions: CorsOptions = {
     origin: 'http://localhost:3002',
     optionsSuccessStatus: 200
 }
 app.use(cors(corsOptions));


 const mongoDB: string = "mongodb://127.0.0.1:27017/ProkkisDB";
 mongoose.connect(mongoDB);
 mongoose.Promise = Promise;
 const db: Connection = mongoose.connection;

 db.on("error", console.error.bind(console, "MongoDB connection error"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "../public")));
//app.use((req, res, next) => {
//    if (req.originalUrl === "/api/register") {
//        return next();
//    }
//    express.json()(req, res, next);
//});
app.use(morgan("dev"));
app.use("/", router);



app.listen(port, () =>{
    console.log(`Login Server running on port ${port}`);
});