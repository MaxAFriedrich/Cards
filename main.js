/**
 * set the height of the learnsection to full screen
 */
function innit() {
    document.getElementById("learn").style.height = `${window.innerHeight}px`;
}
/**
 * converts the html from the edit section to an useable array
 * @param {string} contents html to be parsed 
 * @returns {array} 2d array of the cards, with four columns per row
 */
function editHTMLtoArray(contents) {
    contents = contents.replace(/(\<div class\=\"edit-row\"\>)|(\<\/div\>)|(    )|\n|(\<\/span\>)/g, ``);
    contents = contents.split(`<div class="edit-question" placeholder="Question" contenteditable="true">`);
    contents.shift();
    for (var i = 0; contents.length > i; i++) {
        contents[i] = contents[i].replace(/(\<div class\=\"edit\-answer\" placeholder\=\"Answer\" contenteditable\=\"true\"\>)|(\<span class\=\"edit-correct\"\>)|(\<span class\=\"edit-wrong\"\>)/g, `,`);
        contents[i] = contents[i].split(",");
        contents[i][2] = parseInt(contents[i][2]);
        contents[i][3] = parseInt(contents[i][3]);
    }
    return contents
}
/**
 * converts a array of cards to a string of html that can be put in the edit section
 * @param {array} contents array of all the cards
 * @returns the html string
 */
function editArraytoHTML(contents) {
    var output = "";
    for (var i = 0; contents.length > i; i++) {
        output = output + `<div class="edit-row"><div class="edit-question" placeholder="Question" contenteditable="true">` + contents[i][0] + `</div><div class="edit-answer" placeholder="Answer" contenteditable="true">` + contents[i][1] + `</div><span class="edit-correct">` + contents[i][2].toString() + `</span><span class="edit-wrong">` + contents[i][3].toString() + `</span></div>`;
    }
    return output
}
/**
 * parses csvs to a array
 * @param {string} csv a string of comma seprated values
 * @returns 2d array
 */
function csvtoArray(csv) {
    editArray = csv.split("\n");
    for (var i = 0; editArray.length > i; i++) {
        editArray[i] = editArray[i].split(",");
        if (editArray[i].length == 2) {
            editArray[i].push(0);
            editArray[i].push(0);
        } else if (editArray[i].length == 4) {
            editArray[i][2] = parseInt(editArray[i][2]);
            editArray[i][3] = parseInt(editArray[i][3]);
        } else {
            console.error("CSV to Array error: unexpected number of row values");
        }
    }
    return editArray
}

/**
 * opens a csv file and converts it to a string of it's contents
 * @param {*} e object that consits of all file
 * @returns to callback - string of contents
 */
function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        editFile(contents);
    };
    reader.readAsText(file);
}

/**
 * ececuted as callback
 * used to open the csv files and put into array and edit section
 * @param {string} contents 
 */
function editFile(contents) {
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(csvtoArray(contents));
}


//TODO saveCards Function
//TODO importCSV function(put in modal box or something)
//TODO learn functions


/**
 * a function that is called when the edit section is edited
 *  - replaces comas with spaces
 *  - adds new cards automaticly
 *  - passes new cards to data array
 */
function edited() {
    var contents = document.getElementById("edit-wrapper").innerHTML;//get contents
    var a = contents;
    contents = contents.replace(/,/g, " ");//remove commas
    if (a != contents) {
        document.getElementById("edit-wrapper").innerHTML = contents;//write contents back
    }
    //check if new card needed
    var editArray = editHTMLtoArray(contents);
    if (editArray[editArray.length - 1][0] != "" | editArray[editArray.length - 1][1] != "") {
        document.getElementById("edit-wrapper").innerHTML = document.getElementById("edit-wrapper").innerHTML + `            <div class='edit-row'>
        <div class='edit-question' placeholder='Question' contenteditable='true'></div>
        <div class='edit-answer' placeholder='Answer' contenteditable='true'></div>
        <span class="edit-correct">0</span>
        <span class="edit-wrong">0</span>
    </div>`;
    }
    //check if card needs removal
    var editArray = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    var a = editArray;
    for (var i = 0; editArray.length > i; i++) {
        if (editArray[i][0].includes("--rm")) {
            editArray.splice(i, 1);
        }
    }
    if (editArray != a) {
        document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(editArray);
    }
}