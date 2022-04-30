///We can use this tool to arrange the files which are not properly arranged in a specific directory according to their extension
//1. First Activity with Node.js

const fs = require('fs')
const path = require('path')

// let input = process.argv[2]  //cmd line pe input ke form mein input lenge
// console.log(input)    
 //node js treats command line inputs as array and that array is our process array

let inputArr = process.argv.slice(2)    //slice is used to extract the commands and path we have passed
console.log(inputArr)



let command = inputArr[0]   //organize , help , tree , default   these all are the command

let types = {
    media : ["mp4", "mkv", "mp3"],
    archives : ['zip', 'rar', 'iso'],
    documents : ['docx', 'pdf', 'xlsx'],
    app : ['exe', 'dmg', 'deb']

}
switch(command){
    case 'tree' :
        treeFn()
        break;
    
    case 'organize' :
        organizeFn(inputArr[1])
        break;

    case 'help' :
        helpFn()
        break;
    default :
        console.log('PLEASE ENTER A VALID INPUT')
        break;        
}


function treeFn(dirpath){
    //console.log('Tree Function Implemented')
    if(dirpath == undefined){
        console.log("PLEASE ENTER A VALID PATH")
    }
    else{
        let doesExists = fs.existsSync(dirpath)
        if(doesExists){
            treeHelper(dirpath, " ")    
        }
    }
}

function treeHelper(dirpath, indent){
    let isFile = fs.lstatSync(dirpath).isFile()
    if(isFile){
        let fileName = path.basename(dirpath)
        console.log(indent + "|---" + fileName)
    }
    else{
        let dirName = path.basename(dirpath)
        console.log(indent + "|___" + dirName)
        let children = fs.readdirSync(dirpath)
        for(i = 0; i < children.length; i++){
            let childPath = path.join(dirpath, children[i])
            treeHelper(childPath, indent + '\t')
        }
    }

}

function organizeFn(dirpath){
    // console.log('Organize Function Implemented')
    // 1. input of a directory path

    let destPath;

    if (dirpath == undefined){
        console.log(" Please enter a directory path")
        return;
    }

    else{
            let doesExist = fs.existsSync(dirpath); //It returns true or false for the directory.
            console.log(doesExist)

            if(doesExist == true){
                        //2. create a Organized files Directory
                        destPath = path.join(dirpath, "orgnized_files")
                        if (fs.existsSync(destPath) == false){  //We will only create directory if it doesnot exits already
                            fs.mkdirSync(destPath)
                        }
                        else{
                            console.log("The File is Already Exists")
                        }
            }
            else{
                console.log("PLEASE ENTER A VALID PATH")
            }
    }
    organizerHelper(dirpath)
}

function organizeHelper(src, dest){
    let childName = fs.readdirSync(src)
    //console.log(childName)

    for(let i = 0; i < childName.length(); i++){
        let childAddress = path.join(src, childName[i])
        let isfile = fs.lstatSync(childAddress).isFile()

        if(isfile){
            let fileCategory = getcategory(childName[i])
            //console.log(childName[i] + '  belongs to  '+ fileCategory)

            sendfiles(childAddress, dest, fileCategory)
        }

    }

}

function getcategory(name) {
    let ext = path.extname(name); //We extract the extension of the file
    //console.log(ext)
    ext = ext.slice(1); //this slice will remove dot from the start of the extension name
    //console.log(ext)

    for(let type in types) {
        let cTypeArr = types[type];
        //console.log(cTypeArr)

        for(let i = 0; i < cTypeArr.length; i++){
            if(ext == cTypeArr[i] ){ //We check the extension of the file
                return type;  //We return the type of the file
            }
        }
    }
    return "others"

}

function sendfiles(srcFilePath, dest, fileCategory){
    let catPath = path.join(dest, fileCategory)

    if(fs.existsSync(catPath) == false){
        fs.mkdirSync(catPath)
    }
    let fileName = path.basename(srcFilePath)
    let destFilePath = path.join(catPath, filename)
    fs.copyFileSync(srcFilePath, destFilePath)  //copyFileSync method is used to copy the file from source to destination folder
    fs.unlinkSync(srcFilePath)  //unlinkSync method is used to remove the source file from its previous place

    console.log(fileName + "  copied to  "+ fileCategory)
}

function helpFn(){
    console.log(`List of all the commands - 
                1)Tree command - node fo.js tree <dirName>
                2) Organize - node fo.js organize <dirName>
                3) Help - node fo.js help`)
}