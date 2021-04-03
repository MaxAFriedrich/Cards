/**
 * data array to store the cards
 */
dataArray = [];
/**
 * set the height of the learnsection to full screen
 */
function innit() {
    document.getElementById("learn").style.height = `${window.innerHeight}px`;
}
/**
 * converts the html from the edit section to an useable array
 * @param {string} contents html to be parsed 
 * @returns {array} 2d array of the cards, size agnistic
 */
function editHTMLtoArray(contents) {
    contents = contents.replace(/(\<div class\=\"edit-row\"\>)|(\<\/div\>)|(    )|\n/g, ``);
    contents = contents.split(`<div class="edit-question" placeholder="Question" contenteditable="true">`);
    contents.shift();
    for (var i = 0; contents.length > i; i++) {
        contents[i] = contents[i].split(`<div class="edit-answer" placeholder="Answer" contenteditable="true">`);
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
        output = output + `<div class="edit-row"><div class="edit-question" placeholder="Question" contenteditable="true">` + contents[i][0] + `</div><div class="edit-answer" placeholder="Answer" contenteditable="true">` + contents[i][1] + `</div></div>`;
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
        editFill(contents);
    };
    reader.readAsText(file);
}

/**
 * execited as callback
 * used to open the csv files and put into array and edit section
 * @param {string} contents 
 */
function editFill(contents) {
    dataArray = csvtoArray(contents);
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(dataArray);
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
    //TODO check the displayed data against the dataArray
    var contents = document.getElementById("edit-wrapper").innerHTML;
    contents = contents.replace(/,/g, " ");
    document.getElementById("edit-wrapper").innerHTML = contents;
    editArray = editHTMLtoArray(contents);
    if (editArray[editArray.length - 1][0] != "" | editArray[editArray.length - 1][1] != "") {
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