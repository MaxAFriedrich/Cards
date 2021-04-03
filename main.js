dataArray=[];
function innit() {
    document.getElementById("learn").style.height = `${window.innerHeight}px`;
}
function editHTMLtoArray(contents) {
    contents = contents.replace(/(\<div class\=\"edit-row\"\>)|(\<\/div\>)|(    )|\n/g, ``);
    contents = contents.split(`<div class="edit-question" placeholder="Question" contenteditable="true">`);
    contents.shift();
    for (var i = 0; contents.length > i; i++) {
        contents[i] = contents[i].split(`<div class="edit-answer" placeholder="Answer" contenteditable="true">`);
    }
    return contents
}
function editArraytoHTML(contents) {
    var output = "";
    for (var i = 0; contents.length > i; i++) {
        output = output + `<div class="edit-row"><div class="edit-question" placeholder="Question" contenteditable="true">` + contents[i][0] + `</div><div class="edit-answer" placeholder="Answer" contenteditable="true">` + contents[i][1] + `</div></div>`;
    }
    return output
}
function csvtoArray(csv){
    editArray=csv.split("\n");
    for (var i=0;editArray.length>i;i++){
        editArray[i]=editArray[i].split(",");
    }
    return editArray
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        editFill(contents);
    };
    reader.readAsText(file);
}

function editFill(contents){
    dataArray=csvtoArray(contents);
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(dataArray);
}
//TODO saveCards Function
//TODO importCSV function(put in modal box or something)
//TODO learn functions
function edited() {
    //TODO check the displayed data against the dataArray
    var contents = document.getElementById("edit-wrapper").innerHTML;
    contents=contents.replace(/,/g," ");
    document.getElementById("edit-wrapper").innerHTML=contents;
    editArray = editHTMLtoArray(contents);
    if (editArray[editArray.length-1][0] != "" | editArray[editArray.length-1][1] != "") {
            document.getElementById("edit-wrapper").innerHTML = document.getElementById("edit-wrapper").innerHTML + `<div class="edit-row"><div class="edit-question" placeholder="Question" contenteditable="true"></div><div class="edit-answer" placeholder="Answer" contenteditable="true"></div></div>`
    }

    /*<div class="edit-wrapper" id="edit-wrapper" onkeyup="edited()">
            <div class="edit-row">
                <div class="edit-question" placeholder="Question" contenteditable="true">question 1</div>
                <div class="edit-answer" placeholder="Answer" contenteditable="true">answer 1</div>
            </div>
            <div class="edit-row">
                <div class="edit-question" placeholder="Question" contenteditable="true">question 2</div>
                <div class="edit-answer" placeholder="Answer" contenteditable="true">answer 2</div>
            </div>
            <div class="edit-row">
                <div class="edit-question" placeholder="Question" contenteditable="true">question 3</div>
                <div class="edit-answer" placeholder="Answer" contenteditable="true">answer 3</div>
            </div>
            <div class="edit-row">
                <div class="edit-question" placeholder="Question" contenteditable="true">question 4</div>
                <div class="edit-answer" placeholder="Answer" contenteditable="true">answer 4</div>
            </div>
        </div> */
}