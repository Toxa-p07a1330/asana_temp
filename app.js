let fs = require('fs')
filename = "C:\\Users\\User\\Desktop\\for_sell\\asana\\Заявки.html";
fs.readFile(filename, 'utf8', function(err, data) {
    console.log('OK: ' + filename);
    let textTable = restTable(data)
    let rowArray = convertToRowArray(textTable);
    let clearRowArray = getClearArr(rowArray);
    let getFormattedTicked = getFormat(clearRowArray)
    let getUnSolver = getUnsolved(getFormattedTicked);
    createTasks(getUnSolver);

});
let restTable = (dataString)=>{
    let str = dataString.substr(dataString.indexOf("table"));
    str = str.substr(0, str.indexOf("/table")-1);
    return str;
}
let convertToRowArray = (text)=>{
    let arr = text.split("<tr");
    return arr;
}
let getClearArr = (arr)=>{
    let clear = [];
    for (let i of arr){
        if (i.indexOf("<br>Имя: <br>")===-1 && i.indexOf("Имя:")!==-1)
            clear.push(i);
    }
    return clear;
}

let getUnsolved = (arr)=>{
    let unsolved = arr.filter((value)=>{
        return value.length === 6;
    });
    console.log(unsolved);
    return unsolved;
}
let getFormat = (rowArr)=>{
    let formatted = rowArr.map((value)=>{
        value = value.substr(value.indexOf("заявка"));
        value = value.replace("</div></td><td class=\"s25\" dir=\"ltr\">", "<br>");
        value = value.split("br");
        value[value.length-1] = value[value.length-1].substr(0, value[value.length-1].indexOf("<"));
        value = value.map((value1, index, array)=>{
            return value1.replace("<", "").replace(">", "");
        })
        return value;
    });
    return formatted;
}
let createTasks = (tasks)=>{
    let asana = require('asana');

    let my_access_token ="9999"; //todo get from ENV variable
    let workspaceId = "9999";   //todo replace
    let client = asana.Client.create().useAccessToken(my_access_token);


    for (let i of tasks){
        let newTask = {
            name: "New task",
            description:JSON.stringify(i)
        };
        client.tasks.createInWorkspace(workspaceId, newTask);
    }

}
