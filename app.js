// TODO : Convert the simulator() function from recursive to iterative. I think recursion uses too much memory
// TODO : Create a button/checkbox option that shows the final year result as the header instead of the inital year result as the header
// TODO : Make the result display that is on the right of the table to dynamically addjust when  table width changes i.e. expanding the table row
// TODO : Create loading button while waiting for results. Like please wait . . . 
// TODO : fix the n/a display on the chronological with loop check option when it returns back to the initial year 1926
// TODO : Loading results caption fix on fixed rate of return option
// TODO : Debug on chronological sequential option, the last button to expand does not work.
// TODO : Make sure calculate button does not run if not all inputs are entered
// TODO : Add a rightside note whether portfolio failed
// TODO : Test the random year function iterating it many times to make sure it is accurate
// TODO : remove portoflio WdAmount checking if decimal since in all cases it should never be a decimal. double check thought.
// TODO : Add the new button as a separate function
// TODO : Add feature to export results to spreadsheet



const btnSubmit = document.getElementById('submit');
const HISTORICAL = {
    2021:	0.2646,
    2020:	0.184,
    2019:	0.3149,
    2018:	-0.0438,
    2017:	0.2183,
    2016:	0.1196,
    2015:	0.0138,
    2014:	0.1369,
    2013:	0.3239,
    2012:	0.16,
    2011:	0.0211,
    2010:	0.1506,
    2009:	0.2646,
    2008:	-0.37,
    2007:	0.0549,
    2006:	0.1579,
    2005:	0.0491,
    2004:	0.1088,
    2003:	0.2868,
    2002:	-0.221,
    2001:	-0.1189,
    2000:	-0.091,
    1999:	0.2104,
    1998:	0.2858,
    1997:	0.3336,
    1996:	0.2296,
    1995:	0.3758,
    1994:	0.0132,
    1993:	0.1008,
    1992:	0.0762,
    1991:	0.3047,
    1990:	-0.031,
    1989:	0.3169,
    1988:	0.1661,
    1987:	0.0525,
    1986:	0.1867,
    1985:	0.3173,
    1984:	0.0627,
    1983:	0.2256,
    1982:	0.2155,
    1981:	-0.0491,
    1980:	0.3242,
    1979:	0.1844,
    1978:	0.0656,
    1977:	-0.0718,
    1976:	0.2384,
    1975:	0.372,
    1974:	-0.2647,
    1973:	-0.1466,
    1972:	0.1898,
    1971:	0.1431,
    1970:	0.0401,
    1969:	-0.085,
    1968:	0.1106,
    1967:	0.2398,
    1966:	-0.1006,
    1965:	0.1245,
    1964:	0.1648,
    1963:	0.228,
    1962:	-0.0873,
    1961:	0.2689,
    1960:	0.0047,
    1959:	0.1196,
    1958:	0.4336,
    1957:	-0.1078,
    1956:	0.0656,
    1955:	0.3156,
    1954:	0.5262,
    1953:	-0.0099,
    1952:	0.1837,
    1951:	0.2402,
    1950:	0.3171,
    1949:	0.1879,
    1948:	0.055,
    1947:	0.0571,
    1946:	-0.0807,
    1945:	0.3644,
    1944:	0.1975,
    1943:	0.259,
    1942:	0.2034,
    1941:	-0.1159,
    1940:	-0.0978,
    1939:	-0.0041,
    1938:	0.3112,
    1937:	-0.3503,
    1936:	0.3392,
    1935:	0.4767,
    1934:	-0.0144,
    1933:	0.5399,
    1932:	-0.0819,
    1931:	-0.4334,
    1930:	-0.249,
    1929:	-0.0842,
    1928:	0.4361,
    1927:	0.3749,
    1926:	0.1162
};

let sP500 = {};
let myPortfolio = {};
const INIT_YEAR = parseInt( Object.keys(HISTORICAL)[0] ); // get the earliest first year in the HISTORICAL Object
const LATEST_YEAR = parseInt( Object.keys(HISTORICAL)[Object.keys(HISTORICAL).length - 1] ); // get the latest year in the HISTORICAL Object
const EXPAND = "+"
const COLLAPSE = "-"
const EXPANDALL = "Expand All ..."
const COLLAPSEALL = "Collapse All ..."

let MASTER_RECORDS = [ ]; 
/* conceptual design of the array holding the master result records. 
let MASTER_RECORDS = [ iteration 0
                            [
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                            ],
                      iteration 1 
                            [   
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                                {row of results} {second row of results} {third row of results} {...},
                            ]
                        ] 
*/


class Market {
    constructor(historical, rOr, year) {
        this.historical = {...historical}
        this.rOr = rOr //rOr = fixed rate of rate of return, supplied by user
        this.year = parseInt(year) // the market return year
        this.loop = document.getElementById('loop').checked // boolean to see if loop option is checked
    }
    
    /**
     * returns the length of the object of annual returns
     */
    get length() {
        return Object.keys(this.historical).length
    }
    get average() {
        let sum = 0;
        let year = "";
        for (year in this.historical) {
            sum += this.historical[year];
        };
        //let avg_disp = `${parseFloat(avg * 100).toFixed(2)}%` // display avg in % pretty print
        return sum / this.length // decimal real average
    }
    get average_disp() {
        return `${parseFloat(this.average * 100).toFixed(2)}%` // returns the average in "pretty print"
    }
    get stdDeviation() {
        let difference = 0;
        let year = "";
        let average = this.average;
        for (year in this.historical) {
            difference += Math.abs( (this.historical[year] - average) );
        }
        return (difference / this.length);
    }

    get annualReturn() { //gets the annual return of the market based on the simulation option supplied by the user
        switch (myResults.choose) {
            case "fixed":
                return this.rOr;
            case "sequential":
                if (this.year <= LATEST_YEAR) {
                    return this.historical[this.year] // returns the annual S&P500 of the year this.year
                } else if (this.loop) { // if the loop option is checked
                    this.year = INIT_YEAR // reset the year of the market back to the beginning
                    return this.historical[this.year]
                } else return this.rOr // if loop not checked, defaults to the fixed rate of return
            default:
                alert("error code #dddg$15v73 in Class sP500 get annualReturn() method");
                break;
        }
    }

    /**
     * 
     * @param {number} Start Year
     * @param {number} End Year 
     * @returns {number} Returns a number 
     */
    random(startYr, endYr) {
        if (startYr === undefined) {startYr = INIT_YEAR;}
        if (endYr === undefined) {endYr = LATEST_YEAR;}
        let range = endYr - startYr + 1;
        let returnYear = Math.floor( Math.random() * range) + startYr;
    return this.historical[returnYear];
    }

}


class Portfolio {
    constructor(pValue, infl, startDate, wdRate, survivalD) {
        this.pValue = pValue;
        this.infl = infl;
        this.startYr = startDate;
        this.currentYear = startDate;
        this.survivalD = survivalD;
        this.finalYr = this.startYr + this.survivalD;
        this.wdRate = wdRate;
    }
    get pValueMid() {
        return Math.max(this.pValue - this.wdAmount, 0);
    }
    get return() {
        return this.pValueMid * sP500.annualReturn;
    }
    get pValueEnd() {
        return (this.pValueMid + this.return < 1) ? 0 : this.pValueMid + this.return;
    }
    get wdAmount() {
        if (this.wdRate <= 1) { // if withdrawal rate is expressed as decimal
            return this.pValue * this.wdRate;
        }
        else return this.wdRate;
    }
    get wdRateHypo() {
        if (this.pValue <= 0) return 0;
        else return this.wdAmount / this.pValue;
    }

}


class Results {
    constructor(choose, scenario) {
        this.choose = choose;
        this.resultMessage = "";
        this.initial = true; // to keep track of initial iteration scenario for one whole portfolio duration. A value of true means it is the first in the series. 
        this.scenario = scenario; // represents one whole round, for whenn there is more than one table 
        this.scenario === 0 ? this.dHeader() : ""; // only create the header in the first iteration. 
        this.pass = 0; // TODO : See if this should be moved to a different class eventually
    }
    
    dHeader() {
        this.resultMessage += `<table>`
        this.resultMessage += `<caption id="caption"> Loading results ... </caption>`
        this.resultMessage += `<thead>`
        this.resultMessage += `<tr>`;
        if (this.choose === "sequential") {
            this.resultMessage += `<th scope="col" class="td_small">(S&P500 <br> Year)</th>`
            this.resultMessage += `<th scope="col" class="td_small">(Pct <br>Gains/Loss)</th>`
        }
        this.resultMessage += `<th scope="col">Year</th>`
        this.resultMessage += `<th scope="col">Portfolio <br>Beg. Value</th>`
        this.resultMessage += `<th scope="col">Withdrawals</th>`
        this.resultMessage += `<th scope="col">Portfolio <br>Mid. Value</th>`
        this.resultMessage += `<th scope="col">Market <br>Gains/Losses</th>`
        this.resultMessage += `<th scope="col">Portfolio <br>End. Value</th>`
        this.resultMessage += `<th scope="col">Hypo % <br>W/D Rate</th>`
        this.resultMessage += `<th scope="col">Years <br>Elapsed</th>`
        this.resultMessage += `</tr>`
        this.resultMessage += `</thead>`
        this.resultMessage += `</table>`
        document.getElementById('results').innerHTML = `${this.resultMessage}`;
        let tbody = document.createElement('tbody');
        document.querySelector(`table`).append(tbody)
    }

    append(){
        if (this.initial && this.choose === "sequential") {  // adds the buttons and side result text. to check if its the initial row with data
            let spWrapEle = document.createElement('div');
            let nSpan = document.createElement('span');
            nSpan.style.display = "none" // to prevent rendering the display until the position has been set
            nSpan.id = `span${this.scenario}-${myPortfolio.currentYear}`
            nSpan.innerHTML = "";
            spWrapEle.append(nSpan)
            spWrapEle.classList.add('tempPlaceHolderWrapperClass'); // see CSS styling class
            nSpan.classList.add('tempPlaceHolderSpanClass') // see CSS styling class
            this.tBody.insertAdjacentElement('beforeend', spWrapEle);
            setTimeout(  ()=> { 
                spWrapEle.style.left = `${document.querySelector('tr').clientWidth + 15}px`;
            }, 0 ) // this is to defer execution of the placement of the display text until all the html contents are rendered, in order to determine the appropriate table-row width and position adjustment

            // The section below adds a new expand/collapse side button. The section above adds text result display on side

            //this following section adds a button next to the table to expand/collapse
            let btnWrapEle = document.createElement('div');
            let nButton = document.createElement('button');
            nButton.id = `btn${this.scenario}-${myPortfolio.currentYear}`
            nButton.textContent = `${EXPAND}`;
            btnWrapEle.append(nButton)
            btnWrapEle.classList.add('collapseDivBtn'); // see CSS styling class
            nButton.classList.add('collapseBtn') // see CSS styling class
            this.tBody.insertAdjacentElement('beforeend', btnWrapEle);
            expand(nButton); // function to add the event handler and functionality
        }

        let tr = document.createElement('tr'); //creating new table row
        tr.id = `${this.scenario}-${myPortfolio.currentYear}`;
        this.tBody.append(tr); //append the new table row to the end of the table body
        this.resultMessage = "";
        if (this.choose === "sequential") {
            let year = (sP500.year > LATEST_YEAR) ? "n/a" : sP500.year;  // this needs to all be handled at the Class Market level
            this.resultMessage += `<td scope="col" class="td_small">( ${year} )</th>` //Market Year
            this.resultMessage += `<td scope="col" class="td_small">${convert2Str(sP500.annualReturn,true)}</th>` // Market Gain/Loss
        }
        this.resultMessage += `<th scope="row">${myPortfolio.currentYear}</th>` // Year
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.pValue, false)}</td>` //Portofolio Beg Value
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.wdAmount, false)}</td>` //Withdrawals
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.pValueMid, false)}</td>` //Portfolio mid value
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.return, false)}</td>` // market gains/losses
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.pValueEnd, false)}</td>` // Portfolio End
        this.resultMessage += `<td>${convert2Str(myPortfolio.wdRateHypo, true)} </td>` // Hypo % W/D Rate
        this.resultMessage += `<td>${myPortfolio.currentYear - myPortfolio.startYr + 1}</td>` // Years Elapsed
        this.currentRow.innerHTML = this.resultMessage;
        
        if (this.choose === "sequential" && !this.initial) { // if this is a chronological/sequential display and not the first row 
            document.querySelector('tbody').lastElementChild.classList.add('collapsible')
        }
        this.initial = false; // after this method has run, the next run won't be the initial
    }

    appendBlank() {
        let tr = document.createElement('tr');
        tr.id = `${this.scenario}-${myPortfolio.currentYear}`;
        tr.classList.add('blankRow')
        this.tBody.append(tr);
        this.resultMessage = "";
        if (this.choose === "sequential") {
            let year = (sP500.year > LATEST_YEAR) ? "n/a" : sP500.year
            let yearRoR = (sP500.year > LATEST_YEAR) ? sP500.rOr : sP500.historical[sP500.year]
            this.resultMessage += `<td scope="col" class="td_small"></th>`
            this.resultMessage += `<td scope="col" class="td_small"></th>`
        }
        this.resultMessage += `<th scope="row"></th>`
        this.resultMessage += `<td></td>`
        this.resultMessage += `<td></td>`
        this.resultMessage += `<td></td>`
        this.resultMessage += `<td></td>`
        this.resultMessage += `<td></td>`
        this.resultMessage += `<td></td>`
        this.resultMessage += `<td></td>`
        this.currentRow.innerHTML = this.resultMessage;
        // document.querySelector('tbody').lastElementChild.classList.add('collapsible')   <-- add this if you want to collapse the blank row as well
        this.initial = true;
    }

    get currentRow() {
        return document.getElementById(`${this.scenario}-${myPortfolio.currentYear}`)
    }
    get tBody() {
        return document.querySelector(`tbody`);
    }
    get passFailRatio() {
        let str = `The portfolio has survived ${myResults.pass} times out of ${MASTER_RECORDS.length} scenarios. `;
        str += "<br>";
        str += `This gives it pass rate of ${convert2Str(myResults.pass/MASTER_RECORDS.length,true)} based on a survival duration of ${myPortfolio.survivalD} years`;
        return str;
    }
    
}

/**
 * This recursive function will simulate a year of portfolio activity, append the result, simulate a year, append, etc., until the survival year has been reached. 
 */
function simulator() {
    
    switch (myResults.choose) {

        case "fixed":
            oneWholeScenario();
            break;
    
        case "sequential":
            while (myResults.scenario + INIT_YEAR < LATEST_YEAR) { // TODO: may need to adjust this a bit to see if it fixes the last year expand button in the chronological sequence option
                oneWholeScenario();
                myResults.appendBlank();
                myResults.scenario++;
                setValues(myResults.scenario);
            }
            console.log(performance.now())
            setTimeout(() => { //set timeout since the result span text also has it
                updateResults();
            }, 0);
            break;

        default:
            break;
    }

}

function oneWholeScenario() {
    while (myPortfolio.currentYear !== myPortfolio.finalYr) { // TODO: may need to adjust this a bit to see if it fixes the last year expand button in the chronological sequence option
        myResults.append(); // appends a row of results for display output. 
        recordResult(); // records the result in the master array
        //functions to update variables for the following year
        myPortfolio.currentYear++;
        myPortfolio.pValue = myPortfolio.pValueEnd;
        myPortfolio.wdRate = myPortfolio.wdRate * (1 + myPortfolio.infl)
        if (myResults.choose === "sequential") sP500.year++;
    }
}

/**
 * The purpose of this function is to update the Pass Fail results of all the scenarios
 */
function updateResults() {
    let passFailArray = document.querySelectorAll('span.tempPlaceHolderSpanClass')
    for (element of passFailArray) {
        let id = parseInt(element.id.slice(4,6)); // TODO: need to use regEx expression to get the span id and parse it out to just get the sceenario or iteration value
        // let id = parseInt(element.id.replace( /[A-Za-z]+\K[\d]+/g, "")) //doesn't work 
        let lastIndex = MASTER_RECORDS[id].length - 1
        let portfolioEnd = MASTER_RECORDS[id][lastIndex].PortfolioEnd;
        element.style.display = ""
        element.style.fontStyle = "italic"
        if (portfolioEnd > 0) {
            element.innerHTML = "Pass"
            element.style.color = "green"
            myResults.pass++ // to keep track of how many times the portfolio survived
        } else {
            element.innerHTML = "Fail!"
            element.style.color = "red"
        }
    }
    document.getElementById('caption').innerHTML = myResults.passFailRatio; 
}


/**
 * @returns : Updates the master result array 
 */
function recordResult() {
    
    let scenario = myResults.scenario // the scenario or iteration being run
    if (typeof scenario !== "number") alert("Something may go wrong in the program. code ref 4&vv&je@687")
    MASTER_RECORDS.length < scenario + 1 ? MASTER_RECORDS[scenario] = [] : ""; // to first create the empty array space if not done so already
    let currentRow = myPortfolio.currentYear - myPortfolio.startYr; // to figure out the row of the time period year in a given scenario or iteration
    MASTER_RECORDS[scenario][currentRow] === undefined ? MASTER_RECORDS[scenario][currentRow] = {} : ""  // to create an empty object space if not done so already

    let object = {  // CREATE OBJECT HERE to be inserted based on the values below
        MktYear : sP500.year,
        Return : sP500.annualReturn,
        PortfolioYr : myPortfolio.currentYear,
        PortfolioBeg : myPortfolio.pValue,
        Withdrawal : myPortfolio.wdAmount,
        PortfolioMid : myPortfolio.pValue,
        MktGainsLoss : myPortfolio.return,
        PortfolioEnd : myPortfolio.pValueEnd,
        HypoWD : myPortfolio.wdRateHypo,
        YearsElapsed : currentRow + 1
    }

    MASTER_RECORDS[scenario][currentRow] = {...object}
}



btnSubmit.addEventListener('click', () => { // this event handler commences the setup of the simulation once the button is pressed. 
    console.log(performance.now())
    MASTER_RECORDS = []; // TODO : create a function to reset values
    setValues(0); // pass argument of 0 as it would be the first initial iteration
    simulator();  // runs the simulation
})



/**
 * 
 * @param {number} iteration which iteration of the simulation. One iteration goes through an entire scenario. Not relevant if simulation is based on fixed rate of return
 */
function setValues(iteration) {
    let wdr = document.getElementById('wd_Rate');
    if (wdr.value.includes("%")) { // if withdrawal rate is expressed as a decimal, convert to a fixed amount
        let decimal = convert2Num(document.getElementById('wd_Rate').value, true); // convert to a calculative decimal 
        let pVal = convert2Num(document.getElementById('pValue').value, false);
        wdr.value = `$ ${convert2Str(decimal * pVal, false)}`;
    }
    let rReturn = convert2Num(document.getElementById('rReturn').value, true);
    let pValue = convert2Num(document.getElementById('pValue').value, false);
    let infl = convert2Num(document.getElementById('infl').value, true);
    let startDate = convert2Num(document.getElementById('startDate').value, false);
    let withdrawalRate = convert2Num(document.getElementById('wd_Rate').value, false);
    let survivalDuration = convert2Num(document.getElementById('survival').value, false);
    sP500 = new Market(HISTORICAL, rReturn, iteration + INIT_YEAR);
    myPortfolio = new Portfolio(pValue, infl, startDate, withdrawalRate, survivalDuration);
    myResults = new Results(option_Selected(), iteration);
}


/**
 * 
 * @param {element} element the element for which the event handler will be added
 * @param {*} callback an optional callback function
 * @returns undefined. This function simply sets the event handler to the element.
 */
function expand(element, callback) {
    element.addEventListener('click', (e) => {
        if (e.target.textContent === EXPAND) {
            e.target.textContent = COLLAPSE;
            getAllSiblingsofType(e.target.parentNode, 'tr', arr => { // query filter all selected siblings. sending in parent node as argument because the button is actually wrapped in a div element
                for (ele of arr) {
                    ele.style.display = "table-row";
                }
            }); 
        } else if (e.target.textContent === COLLAPSE) {
            e.target.textContent = EXPAND;
            getAllSiblingsofType(e.target.parentNode, 'tr', arr => {
                for (ele of arr) {
                    ele.style.display = "";
                }
            });
        }
    })
    callback; //optional callback
}


/**
 * 
 * @param {element} target the element starting reference for which the sibling elements will be based
 * @param {string} tagname the tagname in string format (e.g. 'div') of the siblings to include in the query
 * @param {*} callback an optional callback function, with the result as the argument 
 * @returns an array of the SUBSEQUENT CONSECUTIVE sibling elements that match the tagname query 
 */
function getAllSiblingsofType(target, tagname, callback) {
    let qArray = []; // the array of query results
    tagname = tagname.toUpperCase();
    let nElemSibling = target.nextElementSibling;
    while (nElemSibling.tagName.toUpperCase() === tagname) {
        qArray.push(nElemSibling);
        nElemSibling = nElemSibling.nextElementSibling; // move the target down to the next element to check
    }
    return (callback != undefined) ? callback(qArray) : qArray; // if callback function present, return it with the result as the argument
}

/**
 * 
 * @returns the option user selected, as defined by the radio button
 */
function option_Selected() {
    let radioInputs = document.querySelectorAll('input[type="radio"]');
    for (input of radioInputs) {
        if (input.checked) return input.id;
    }
};