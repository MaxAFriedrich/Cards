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
        if (editArray[i][0] == "") {
            editArray.splice(i, 1);

        } else if (editArray[i].length == 2) {
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
 * convert array to csv
 * @param {array} array a 2d array of all the cards
 * @returns a string of comma sperated values
 */
function arraytoCSV(array) {
    var csv;
    for (var i = 0; array.length > i; i++) {
        csv = csv + array[i][0] + "," + array[i][1] + "," + array[i][2] + "," + array[i][3] + "\n";
    }
    return csv
}

/**
 * download file from app to local client
 * @param {string} filename the name of the file to be downloaded
 * @param {string} text the content of the file to be downloaded
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * function executed by save button to download cards as csv
 */
function saveFile() {
    var array = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    var out = arraytoCSV(array);
    out = out.replace("undefined", "");
    download("download.csv", out);
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
 * executed as callback
 * used to open the csv files and put into array and edit section
 * @param {string} contents 
 */
function editFile(contents) {
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(csvtoArray(contents));
}

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
    for (var i = 0; editArray.length > i; i++) {
        if (editArray[i][0].includes("--rm")) {
            editArray.splice(i, 1);
        }
    }
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(editArray);
}
/**
 * assits in sorting of 2d arrays
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function correctsortFunction(a, b) {
    if (a[2] === b[2]) {
        return 2;
    }
    else {
        return (a[2] < b[2]) ? -1 : 1;
    }
}
/**
 * assits in sorting of 2d arrays
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function incorrectsortFunction(a, b) {
    if (a[3] === b[3]) {
        return 3;
    }
    else {
        return (a[3] < b[3]) ? -1 : 1;
    }
}
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
/**
 * how similar are two phrases?
 * @param {*} s1 
 * @param {*} s2 
 * @returns 
 */
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
/**
 * part of similarity
 * @param {*} s1 
 * @param {*} s2 
 * @returns 
 */
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
/**
 * learn, multiple coice checker
 * @param {string} answer the correct answer
 */
function multiChoice(answer) {
    var actualAns = document.getElementById("actualAnswer").innerText;
    var cards = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    for (var i = 0; cards.length > i; i++) {
        if (actualAns == cards[i][1]) {
            var ansIndex = i;
        }
    }
    if (answer == actualAns) {
        cards[ansIndex][2]++;
        $(".correct").fadeIn(100).delay(500).fadeOut(10);

    } else {
        cards[ansIndex][3]++;
        $(".wrong").fadeIn(100).delay(500).fadeOut(10);
    }
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(cards);
    learnInit();
}
/**
 * checks writen answers
 */
function answerSubmit() {
    var actualAns = document.getElementById("actualAnswer").innerText;
    var answer = document.getElementById("answer").innerText;
    var cards = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    for (var i = 0; cards.length > i; i++) {
        if (actualAns == cards[i][1]) {
            var ansIndex = i;
        }
    }
    if (similarity(answer, actualAns) >= 0.8) {
        cards[ansIndex][2]++;
        $(".correct").fadeIn(100).delay(500).fadeOut(10);

    } else {
        cards[ansIndex][3]++;
        $(".wrong").fadeIn(100).delay(500).fadeOut(10);
    }
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(cards);
    learnInit();
}
function trueOrFalse(inp,ans){
    if (ans==0){
        ans=true;
    }else{
        ans=false;
    }
    var actualAns = document.getElementById("actualAnswer").innerText;
    var cards = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    for (var i = 0; cards.length > i; i++) {
        if (actualAns == cards[i][1]) {
            var ansIndex = i;
        }
    }
    if (inp == ans) {
        cards[ansIndex][2]++;
        $(".correct").fadeIn(100).delay(500).fadeOut(10);

    } else {
        cards[ansIndex][3]++;
        $(".wrong").fadeIn(100).delay(500).fadeOut(10);
    }
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(cards);
    learnInit();
}
function flashOne(){
    var actualAns = document.getElementById("actualAnswer").innerHTML;
    document.getElementById("qaWrapper").innerHTML = `
    <h4>Flash Card</h4>
    <div id="answer">`+actualAns+`</div>
    <button id="ansOk" style="margin:auto;margin-bottom: 1rem;" onclick="flashTwo(true)">Correct</button>
    <button id="ansOk" style="margin:auto;margin-bottom: 1rem;" onclick="flashTwo(false)">Incorrect</button>
    <div style="display:none;" id="actualAnswer">`+actualAns+`</div>
    `;
}
function flashTwo(bool){
    var actualAns = document.getElementById("actualAnswer").innerText;
    var cards = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    for (var i = 0; cards.length > i; i++) {
        if (actualAns == cards[i][1]) {
            var ansIndex = i;
        }
    }
    if (bool) {
        cards[ansIndex][2]++;
        $(".correct").fadeIn(100).delay(500).fadeOut(10);

    } else {
        cards[ansIndex][3]++;
        $(".wrong").fadeIn(100).delay(500).fadeOut(10);
    }
    document.getElementById("edit-wrapper").innerHTML = editArraytoHTML(cards);
    learnInit();  
}
/**
 * itintailse learn run
 */
function learnInit() {
    var cards = editHTMLtoArray(document.getElementById("edit-wrapper").innerHTML);
    for (var i = 0; cards.length > i; i++) {
        if (cards[i][0] === "" || cards[0][1] === "") {
            cards.splice(i, 1);
        }
    }
    cards = cards.sort(correctsortFunction);
    var contenderCards = [];
    var same = true;
    for (var i = 0; cards.length > i; i++) {
        if (cards[i][2] != cards[0][2]) {
            same = false;
        }
    }
    var i = 0;
    if (same) {
        contenderCards = cards;
    } else {
        while (true) {
            if (cards[i][2] == cards[0][2]) {
                contenderCards.push(cards[i])
            } else {
                break
            }
            i++;
        }
    }
    contenderCards = shuffle(contenderCards);
    if(contenderCards.length >= 4 && cards[0][2]>=1){
        var y = Math.floor(Math.random() * 4);
    }else if (contenderCards.length >= 4) {
        var y = 3
    } else {
        var y = Math.floor(Math.random() * 3);
    }
    if (y == 0) {
        document.getElementById("qaWrapper").innerHTML = `
        <h4>Short Answer</h4>
        <div id="question">`+contenderCards[0][0]+`</div>
        <div id="answer" placeholder="Answer" contenteditable="true"></div>
        <button id="ansOk"style="margin:auto;margin-bottom: 1rem;"onclick="answerSubmit()">Okay</button>
        <div style="display:none;" id="actualAnswer">`+contenderCards[0][1]+`</div>
        `;
    } else if (y == 3) {
        x = Math.floor(Math.random() * 4);
        document.getElementById("qaWrapper").innerHTML = `
            <h4>Multiple Choice</h4>
            <div id="question">`+ contenderCards[x][0] + `</div>
            <div class="correct" id="correct"></div>
            <div class="wrong" id="wrong"></div>
            <div id="answer"><button onclick="multiChoice('` + contenderCards[0][1] + `')">` + contenderCards[0][1] + `</button>` + `<button onclick="multiChoice('` + contenderCards[1][1] + `')">` + contenderCards[1][1] + `</button>` + `<button onclick="multiChoice('` + contenderCards[2][1] + `')">` + contenderCards[2][1] + `</button>` + `<button onclick="multiChoice('` + contenderCards[3][1] + `')">` + contenderCards[3][1] + `</button></div>
            <div style="display:none;" id="actualAnswer">`+ contenderCards[x][1] + `</div>
            `;
    }else if(y==1){
        x = Math.floor(Math.random() * 2);
        document.getElementById("qaWrapper").innerHTML = `
        <h4>True or False</h4>
        <div id="question">`+contenderCards[0][0]+` <h2> is </h2>`+contenderCards[x][1]+`</div>
        <div id="answer">
            <button onclick="trueOrFalse(true,`+x+`)">True</button>
            <button onclick="trueOrFalse(false,`+x+`)">False</button>
        </div>
        <div style="display:none;" id="actualAnswer">`+ contenderCards[x][1] + `</div>
        `;

    }else if (y == 2) {
        document.getElementById("qaWrapper").innerHTML = `
        <h4>Flash Card</h4>
        <div id="question">`+contenderCards[0][0]+`</div>
        <button id="ansOk" style="margin:auto;margin-bottom: 1rem;" onclick="flashOne()">Flip Card</button>
        <div style="display:none;" id="actualAnswer">`+contenderCards[0][1]+`</div>
        `;
    }

}

/**
 * print thing
 */
function print() {
    window.print();
}

if(navigator.userAgent.match(/Android/i)){
    window.scrollTo(0,1);
}