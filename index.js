const express = require('express');
const upload = require('express-fileupload');
const util = require('util');
const bodyParser = require('body-parser')
const serveIndex = require('serve-index')
module.exports.fileInfo ={
    fileStuff:'',
    received:''
};
let i=0;
// const receivedSize = require('./node_modules/busboy/lib/types/multipart')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(upload(debug=true));

app.use(
    '/uploads',
    express.static('uploads'),
    serveIndex('uploads', { icons: true })
  )


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

app.post('/getFileInfo',(req,res)=>{
    let j=0;
    let temp=[]
    this.i=undefined
    console.log(JSON.parse(req.body.key))
  temp=JSON.parse(req.body.key)
  temp=temp.value
    this.fileInfo.fileStuff = temp;
    res.send('OK')
})

app.get('/checkstatus',(req,res)=>{
    // console.log(receivedSize.uploadedSize)
    if(i>=this.fileInfo.fileStuff.length||i===undefined){
        return
    }
    i=this.i;
    let total = this.fileInfo.fileStuff[i].fileSize;
    total = parseInt(total)
    let partial = this.received;
    let percent = partial/total;
    percent=parseInt(percent*100);
    console.log('Total ',total,' Partial ',partial)
    // if(percent==100){
    //     console.log('Increementing I')
    //     i++;
    // }
    console.log('PERCENT',percent)
    // let percent = (this.fileInfo.fileStuff.fileSize/this.fileInfo.received)*100;
    if(percent==Infinity){
        res.send('Infinity');
    }
    else if(percent==NaN){
        res.send('Not a Number')
    }
    else{
        res.send({percent:percent.toString(),filenumber:i});  
    }
})

app.post('/',async (req,res)=>{
    console.log("Inside File Uploader")
    if(req.files){
        let response='';
        response+='<ul>';
        if(req.files.file.length>0){
            var files=req.files.file;
            for(let i=0;i<files.length;i++){
                let filename=files[i].name;
                console.log("Filename :",filename);
                await progressInfo(files[i])
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
        await progressInfo(file)
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

function progressInfo(file){
    let filesize= file.size;
    let chucnksize = file.data.length;
    let percentuploaded = 0;
    while(percentuploaded<90){
        percentuploaded = (filesize/chucnksize)*100;
        console.log(percentuploaded)
    }
}

app.listen(5000);
