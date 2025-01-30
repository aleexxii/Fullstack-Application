import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination:(req:any, file:any, cb:any) => {
        cb(null, 'uploads')
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


/*
backend
    -node_modules
    -src
        -config
        -controller
        -middleware
        -model
        -routes
        -utils
        index.ts
    -uploads
    -.env
    -.gitignore
    -package-lock.json
    -package.json
    -tsconfig.json
frontend
    -node_modules
    -public
    -src
        -api
        -assets
        -auth
        -components
        -hooks
        -pages
        -redux
        -types
        App.tsx
        index.css
        vite-env.d.ts
    eslint.config.js
    index.html
    README.md
    package-lock.json
    package.json
    tsconfig.json
    tsconfig.app.json
    tsconfig.node.json
    vite.config.ts
*/