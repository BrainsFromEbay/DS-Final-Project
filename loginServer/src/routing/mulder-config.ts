import multer, {StorageEngine, Multer} from "multer"
import { v4 as uuidv4 } from 'uuid'
import path from "path"

const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/images')
    },
    filename: function (req, file, cb) {
      cb(null, path.parse(file.originalname).name + "_" + uuidv4() + path.extname(file.originalname))
    }
  })
  
  const upload: Multer = multer({ storage: storage })


  export default upload