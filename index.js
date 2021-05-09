const express = require('express');
const upload = require('express-fileupload');
const util = require('util');

const serveIndex = require('serve-index')


const app = express();

app.use(upload(debug=true));

app.use(
    '/uploads',
    express.static('uploads'),
    serveIndex('uploads', { icons: true })
  )


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

app.post('/',async (req,res)=>{
    if(req.files){
        let response='';
        response+='<ul>';
        if(req.files.file.length>0){
            var files=req.files.file;
            for(let i=0;i<files.length;i++){
                let filename=files[i].name;
                console.log("Filename :",filename);
                let moveFile=util.promisify(files[i].mv);
                await moveFile('./uploads/'+filename)
                .then(err=>{
                    if(err){
                        response+='<li><h1>Failed to upload this file '+filename+'</h1></li>';
                        //res.send("<h1>Failed to upload"+err+"</h1>");
                    }
                    else{
                        response+='<li><h1>Upload success '+filename+'</h1></li>';
                        //res.send("<h1>Upload success</h1>");
                    }
                })
                .catch(err=>{
                    console.log("Error inside promify function !!!");
                })
                // files[i].mv('./uploads/'+filename,(err)=>{
                //     if(err){
                //         response+='<li><h1>Failed to upload this file '+filename+'</h1></li>';
                //         //res.send("<h1>Failed to upload"+err+"</h1>");
                //         console.log("File moved Failed ");
                //     }
                //     else{
                //         response+='<li><h1>Upload success '+filename+'</h1></li>';
                //         //res.send("<h1>Upload success</h1>");
                //         console.log("File move success");
                //     }
                // });
            }
            response+='</ul>';
            res.send(response);
        }
        else{
        console.log(req.files);
        let file=req.files.file;
        let filename=file.name;
        console.log("Filename :",filename);
        let moveFile=util.promisify(file.mv);
        await moveFile('./uploads/'+filename)
        .then(err=>{
            if(err){
                res.send("<h1>Failed to upload"+err+"</h1>");
            }
            else{
                res.send("<h1>Upload success</h1>");
            }

        })
        .catch(err=>{
            res.send("<h1>Failed to upload "+err+"</h1>");            
        })
        // file.mv('./uploads/'+filename,(err)=>{
        //         if(err){
        //             res.send("<h1>Failed to upload"+err+"</h1>");
        //         }
        //         else{
        //             res.send("<h1>Upload success</h1>");
        //         }
        // });
    }
    }
});

app.listen(5000);
