const fs = require('fs');
let ejs = require('ejs');
const tempRoot = "./temp_site/"


  /**
   * @description Main function that runs ejs schema site creation 
   */
    function main() {
        let indexFolder = './';
        let schemasFolder = './_schemas/';
        let contextFolder = './_contexts/';
        let folders = [indexFolder, schemasFolder, contextFolder]
        fs.mkdirSync(tempRoot, {recursive: true});
        if (!fs.existsSync(tempRoot + "temp_schemas_collection.md")) 
            runWriteFile(tempRoot+ "temp_schemas_collection.md", " ");
        
        else if (!fs.existsSync(tempRoot + "temp_contexts_collection.md")) 
            runWriteFile(tempRoot+ "temp_contexts_collection.md", " ");
        console.log("Files Created Successfully.");
        
        for(let folder of folders){
            fs.readdirSync(folder).forEach(file => {
                let md = '';
                let md_path = '';
                let md_name = '';
                let ejsFile = '';
                let htmlFile = '';
                let typeCollection = '';
                let viewsFolder = "./views/pages/";
                let CollectionPath = "https://ucd-library.github.io/schema/";

                /* Create the following items:
                    * temp directory, 
                    * collection path variable, 
                    * ejsFile variable, 
                    * html output variable, 
                    * md variable
                */
                const regex = /\.md/g;
                if(file.match(regex)) {
                    md = folder + file;
                    md_name = file.split(".md")[0];
                    if(!indexFolder.includes(folder) ){
                        fldr = folder.split("./");
                        fs.mkdirSync(tempRoot + fldr[1] + md_name,{recursive: true});
                        htmlFile = tempRoot + fldr[1] + md_name + "/index.html";
                        if(folder.includes("/_schemas")) {
                            typeCollection = "schemas";
                            md_path = CollectionPath + "_" + typeCollection + "/" + md_name;
                            ejsFile = viewsFolder + fldr[1] + "article.ejs";
                        }else if(folder.includes("/_contexts")) {
                            typeCollection = "contexts";
                            md_path = CollectionPath + "_" + typeCollection + "/" + md_name;
                            ejsFile = viewsFolder + fldr[1] + "contexts.ejs";
                        }
                    } else {
                        htmlFile = tempRoot + "./" + md_name + ".html";
                        fldr = folder.split("./");
                        ejsFile = viewsFolder + fldr[1] + md_name + ".ejs";
                    }
                }

                //If there is an md file created, it goes to the next prompt, otherwise skipped
                if (md != "") {
                    if(typeCollection != '') createCollection(typeCollection, tempRoot, md_name, md_path);
                    addMarkdown(md, ejsFile, htmlFile);
                }    
            });
        }

        collectionIndex();
        console.log("Temp Folder Created Successfully")

    }


    function collectionIndex(){
        let schemaEJS = "./views/pages/_schemas/article.ejs";
        let contextsEJS = "./views/pages/_contexts/contexts.ejs";
        let schemaTemp = tempRoot + "temp_schemas_collection.md";
        let contextsTemp = tempRoot + "temp_contexts_collection.md";


        //contexts collection htmlFile then removes temp file
        
        addMarkdown(contextsTemp, 
                    contextsEJS, 
                    tempRoot + "_contexts/index.html");
        if(fs.existsSync(contextsTemp))
            runDeleteFile(contextsTemp);

        //schemas collection htmlFile
        addMarkdown(schemaTemp, 
                    schemaEJS, 
                    tempRoot + "_schemas/index.html");
        if(fs.existsSync(schemaTemp))
            runDeleteFile(schemaTemp);

  }

  /**
   * @description Adds the cooresponding markdown file to the ejs file and outputs HTML
   * @param {String} md - Markdown file path
   * @param {String} ejsFile - EJS file path
   * @param {String} htmlFile - Output HTML file path
   */
    function addMarkdown(md, ejsFile, htmlFile){
        fs.readFile(md, (err, inputD) => {
            if (err) throw err;
            let mdRead = inputD.toString()
        
            ejs.renderFile(ejsFile, {markdown: mdRead}, function(err, str){
            runAppendFile(htmlFile, str)

            });
        })
    }


  /**
   * @description Creates the collection pages for the site for all markdown files
   * @param {String} typeCollection - Schemas/Contexts collection folder
   * @param {String} tempRoot - Initial Temporary file path
   * @param {String} md_name - Collection Markdown Name
   * @param {String} md_path - Collection Markdown file paths
   */
    function createCollection(typeCollection, tempRoot, md_name, md_path){
        let cFile = "";
        if(typeCollection == "schemas") cFile = tempRoot + "temp_schemas_collection.md";
        else if(typeCollection == "contexts") cFile = tempRoot + "temp_contexts_collection.md";

        let cContent = '###### [' + md_name + '](' + md_path + ')\n';
        runAppendFile(cFile, cContent)
    }

  /**
   * @description Run the write file function
   * @param {String} file - File Name
   * @param {String} data - Content of the file
   */
    function runWriteFile(file, data, showFile=false){
        fs.writeFile(file, data, (err) => {
            if (err)
              console.log(err);
            else {
              if(showFile) console.log("File written successfully:", file);
            }
        });
    }

  /**
   * @description Run the append file function
   * @param {String} file - File Name
   * @param {String} data - Content of the file   
   */
   function runAppendFile(file, content, showContent=false){
        fs.appendFile(file, content, function (err) {
            if (err) throw err;
            if(showContent) console.log('Collection Line added to: ' + content);

        });
   }

     /**
   * @description Run the delete file function
   * @param {String} file - File to delete
   */
    function runDeleteFile(file){
        fs.unlinkSync(file);
    }




if (require.main === module) {
  main();
}    
