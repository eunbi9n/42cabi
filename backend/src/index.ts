import express from 'express'
import path from 'path'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
// import cors from 'cors'
import {getUserList} from './app'

function makeServer(){
    const app = express();
    const port = process.env.PORT || 4242;

    // const list:Array<string> = [
    //     "https://cabi.42cadet.kr"
    // ]
    // app.use(
    //     cors({
    //         origin: function (origin, callback){
    //             if (!origin || list.indexOf(origin) >= 0) {
    //                 callback(null, true)
    //             } else {
    //                 callback(new Error("Not allowed by CORS"))
    //             }
    //         },
    //         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //         credentials: true,
    //     })
    // );

    const swaggerSpec = YAML.load(path.join(__dirname, '../api/swagger.yaml'));
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.listen(port, ()=>console.log(`Listening on port ${port}`));
    
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    // getUserList();
}



makeServer();
