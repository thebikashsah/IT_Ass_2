const express=require('express');

const bodyParser=require('body-parser');
const fs=require('fs');
const fileUpload = require('express-fileupload');
const archiver = require('archiver');

let lists = [];
let lists2 = [];


const app=express();
const port=3000 || process.env.PORT;

app.use(fileUpload());

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

app.post("/",function(req,res){
    console.log(req.body);
    // console.log(req.files);
    if(req.body.text_submit){
        // append data to the file in new line
        let textData=req.body.text;
        fs.appendFile(__dirname+'/public/data/text_data/data.txt',textData+'\n',function(err){
            if(err) throw err;
            console.log(' [ SERVER ] : Data saved to file');
        });
        res.render("success", { variable: "Text Data" });
        // accept the error if cannot save data to file
    }else if(req.body.img_submit){
        // save image to img_data folder use multer and add new image to the database
        let sampleFile = req.files.img;
        // console.log(sampleFile);
        let uploadPath = __dirname + '/public/data/img_data/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function(err) {
            if (err)
            return res.status(500).send(err);

            res.render("success", { variable: "Image Data" });
        });

    }else if(req.body.download){
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=folder.zip');

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.pipe(res);

        archive.directory(__dirname+"public/data", false);

        archive.finalize();
    }else if(req.body.view){
       

        
            const filePath = __dirname + "/public/data/text_data/data.txt";

            fs.readFile(filePath, "utf8", (err, data) => {
            if (err) throw err;

            const lines = data.split("\n");

            for (let i = 0; i < lines.length; i++) {
                lists.push(lines[i]);
            }

        
        });
        // Now get image files names and push them to lists2 array
        fs.readdir(__dirname + "/public/data/img_data", (err, files) => {
            files.forEach(file => {
                // console.log(__dirname + "/public/data/img_data/"+file);
                lists2.push("data/img_data/"+file);
            });
        });
        // render the see.ejs then send lists and lists2 to it
        
        res.render("see",{lists:lists,lists2:lists2});
        // res.render("see",{lists:lists,lists2:lists2});

        // res.render("see",{lists:lists});
        lists = [];
        lists2 = [];
        
    }
});

app.listen(port,function(){
    console.log(` [ SERVER ] : Server running on port: ${port}`);
});