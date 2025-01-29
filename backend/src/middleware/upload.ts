import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination:(req:any, file:any, cb:any) => {
        cb(null, '../uploads/')
    },
    filename : (req:any, file:any, cb:any) =>{
        const uniqueSuffix = Date.now() + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req : any, file: any, cb : any) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true)
    }else{
        cb(new Error("only image files are allowed"), false)
    }
}

const upload = multer({storage, fileFilter})

export default upload