// TODO : default option configures to the default BASED on the option selected
// TODO : fix terminology. What is iteration? What is simulation? 
// TODO : Make the result display that is on the right of the table to dynamically addjust when  table width changes i.e. expanding the table row
// TODO : Create a button/checkbox option that shows the final year result as the header instead of the inital year result as the header
// TODO : Fix loading button while waiting for results. Like please wait . . . 
// TODO : fix the n/a display on the chronological with loop check option when it returns back to the initial year 1926
// TODO : Make sure calculate button does not run if not all inputs are entered
// TODO : Add a rightside note whether portfolio failed
// TODO : Test the random year function iterating it many times to make sure it is accurate
// TODO : remove portoflio WdAmount checking if decimal since in all cases it should never be a decimal. double check thought.
// TODO : Add the new button as a separate function
// TODO : Add feature to export results to spreadsheet



const btnSubmit = document.getElementById('submit');


let sP500 = null;
let myPortfolio = null;
let myResults = null;


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
        this.historical_randomCopy = {...historical} // a copy of the object of market returns to be used for the random simulator
        this.rOr = rOr //rOr = fixed rate of rate of return, supplied by user
        this.year = parseInt(year) // the market return year, used for sequential
        this.loop = document.getElementById('loop').checked // boolean to see if loop option is checked
        this.randomYearReturnObj = {currentYear : null, randomMktYear : null, randomMktReturn : null}; // an object to keep track of random simulation
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
                if (this.year <= Global.LATEST_YEAR) {
                    return this.historical[this.year] // returns the annual S&P500 of the year this.year
                } else if (this.loop) { // if the loop option is checked
                    this.year = Global.INIT_YEAR // reset the year of the market back to the beginning
                    return this.historical[this.year]
                } else return this.rOr // if loop not checked, defaults to the fixed rate of return
            case "random":
                if (this.randomYearReturnObj.currentYear !== myPortfolio.currentYear) { // check if this function has been executed before for the current year, so this part won't repeat

                    this.randomYearReturnObj.currentYear = myPortfolio.currentYear;
                    let keys = Object.keys(this.historical_randomCopy); // an array of keys [i.e. remaining market years] in the historical_randomCopy object
                    let randomMktYear = keys [keys.length * Math.random() << 0] // get a random year in the market (remaining years). the << 0 operator rounds down to the nearest integer. easier than Math.floor
                    this.randomYearReturnObj.randomMktReturn = this.historical_randomCopy[randomMktYear]; // sets the annual market return for that random year in a permanent accesible object
                    this.randomYearReturnObj.randomMktYear = randomMktYear; // to record the information in a permanent accesible object
                    delete this.historical_randomCopy[randomMktYear] // delete the market return year after it has been picked out, so it can't be reused.
                }
                return this.randomYearReturnObj.randomMktReturn;
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
        if (startYr === undefined) {startYr = Global.INIT_YEAR;}
        if (endYr === undefined) {endYr = Global.LATEST_YEAR;}
        let range = endYr - startYr + 1;
        let returnYear = Math.floor( Math.random() * range) + startYr;
    return this.historical[returnYear];
    }

}


class Portfolio {
    constructor(pValue, infl, startDate, wdRate, survivalD, reductionRatio) {
        this.pValue = pValue;
        this.infl = infl;
        this.startYr = startDate;
        this.currentYear = startDate;
        this.survivalD = survivalD;
        this.finalYr = this.startYr + this.survivalD;
        this.wdRate = wdRate;
        this.reductionRatio = isNaN(reductionRatio) ? 0 : reductionRatio; // if reductionRatio is blank or not a number, set it equal to 0
        this.priorYrReturn === undefined; // undefined for the initial year only, cannot be 0 as 0% is a valid value.
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
        
        // to check if prior year return if exists was negative, then reduce the withdrawal rate by the user-specified amount.
        if (this.priorYrReturn === undefined) return this.wdRate;
        else if (this.priorYrReturn >= 0) return this.wdRate;
        else if (this.priorYrReturn < 0) return this.wdRate * (1 - this.reductionRatio);
        else throw error;
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
        if (this.choose === "sequential" || this.choose === "random") {
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
        if (this.initial && this.choose !== "fixed") {  // adds the buttons and side result text. to check if its the initial row with data // TODO: scalibility
            
            // this block of code adds the text result display that shows on the right side
            let spWrapEle = document.createElement('div'); //span wrap element
            let nSpan = document.createElement('span'); //nSpan abbrev. for new span
            nSpan.style.display = "none" // to prevent rendering the display until the position has been set
            nSpan.id = `span${this.scenario}-${myPortfolio.currentYear}` // if you change this ID, you will need to change the updatePassFailDisp() function accordingly
            nSpan.innerHTML = "";
            spWrapEle.append(nSpan)
            spWrapEle.classList.add('tempPlaceHolderWrapperClass'); // see CSS styling class
            nSpan.classList.add('tempPlaceHolderSpanClass') // see CSS styling class
            this.tBody.insertAdjacentElement('beforeend', spWrapEle);
            setTimeout(  ()=> { 
                spWrapEle.style.left = `${document.querySelector('tr').clientWidth + 15}px`;
            }, 0 ) // this is to defer execution of the placement of the display text until all the html contents are rendered, in order to determine the appropriate table-row width and position adjustment

            //this following section adds a button next to the table to expand/collapse (left side)
            let btnWrapEle = document.createElement('div');
            let nButton = document.createElement('button');
            nButton.id = `btn${this.scenario}-${myPortfolio.currentYear}`
            nButton.textContent = `${Global.EXPAND}`;
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

        if (this.choose === "sequential" || this.choose === "random") {
            let year = null;
            if (this.choose === "sequential") {
                year = (sP500.year > Global.LATEST_YEAR) ? "n/a" : sP500.year; // TODO: needs to be a function at the Class Market level to return the value
            } else if (this.choose === "random") year = sP500.randomYearReturnObj.randomMktYear;
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
        
        if ((this.choose === "sequential" || this.choose === "random") && !this.initial) { // if this is NOT the first row 
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
        if (this.choose === "sequential" || this.choose === "random") {
            let year = (sP500.year > Global.LATEST_YEAR) ? "n/a" : sP500.year
            let yearRoR = (sP500.year > Global.LATEST_YEAR) ? sP500.rOr : sP500.historical[sP500.year]
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


class Engine {
    constructor() {
        this.addClick();
    }
    
    
    addClick() {
        document.querySelector('#submit').addEventListener('click', this.start());
    }

    start() {
        console.log("Hello world!")
    }

}

let Start = new Engine();







btnSubmit.addEventListener('click', () => { // this event handler commences the setup of the simulation once the button is pressed. 
    console.log(performance.now())
    MASTER_RECORDS = []; 
    let table = document.querySelector('table'); 
    if (table !== null) table.remove(); // if there is an existing table, delete it. this will ensure a fresh slate. 
    // TODO : ensure all the table data if it exists, is deleted 
    setValues(0); // pass argument of 0 as it would be the first initial iteration
    simulator();  // runs the simulation
})
















/**
 * This function will simulate a year of portfolio activity, append the result, simulate a year, append, etc., until the survival year has been reached. 
 */
function simulator() {
    
    switch (myResults.choose) {

        case "fixed":
            oneWholeScenario();
            document.getElementById('caption').innerHTML = "";  // to remove the Loading result caption for fixed use cases.
            break;
    
        case "sequential":
            while (myResults.scenario + Global.INIT_YEAR < Global.LATEST_YEAR) {
                oneWholeScenario();
                myResults.appendBlank();
                myResults.scenario++;
                setValues(myResults.scenario);
            }
            setTimeout(() => { //set timeout since the result span text also has it
                updatePassFailDisp();
                console.log(performance.now()) //record log of end time for benchmark purposes
            }, 0);
            break;

        case "random":
            let iterations = convert2Num(document.getElementById('trials').value, false); // declare user-specified num trials or iterations
            if (iterations === '' || iterations === 0 || isNaN(iterations)) iterations = 1;
            while (myResults.scenario < iterations) {
                sP500.annualReturn; // initial configuration for the random scenario to set the values of random year, which depends on the Portfolio class current year.
                oneWholeScenario(); //
                myResults.appendBlank();
                myResults.scenario++;
                setValues(myResults.scenario);
            }
            setTimeout( () => { //set timeout since the result span text also has it
                updatePassFailDisp();
                console.log(performance.now()) //record log of end time for benchmark purposes
            }, 0);
            break;

        default:
            break;
    }

}


/**
 * This function goes through one whole scenario from beginning year to end year to see how well the portfolio holds
 */
function oneWholeScenario() {
    while (myPortfolio.currentYear !== myPortfolio.finalYr) { // TODO: may need to adjust this a bit to see if it fixes the last year expand button in the chronological sequence option
        myResults.append(); // appends a row of results for display output. 
        recordResult(); // records the result in the master array
        //functions to update variables for the following year
        myPortfolio.pValue = myPortfolio.pValueEnd;
        myPortfolio.priorYrReturn = sP500.annualReturn; // to keep track of the prior year return. The ordering is very important here.
        myPortfolio.currentYear++;
        myPortfolio.wdRate = myPortfolio.wdRate * (1 + myPortfolio.infl)
        if (myResults.choose === "sequential") sP500.year++;
        else if (myResults.choose === "random") sP500.annualReturn; //to update the Market object .randomYearReturnObj for the new year.
    }
}

/**
 * The purpose of this function is to update the Pass Fail results of all the scenarios
 */
function updatePassFailDisp() {
    let passFailArray = document.querySelectorAll('span.tempPlaceHolderSpanClass')
    for (element of passFailArray) {
        let iteration = element.id.slice(4); // TODO: (optional) can use regEx expression to get the span id and parse it out to just get the iteration value. implemention code: 5rew631nbqw
        iteration = iteration.slice(0, iteration.indexOf('-')); 
        iteration = parseInt(iteration);

        let lastIndex = MASTER_RECORDS[iteration].length - 1
        let portfolioEnd = MASTER_RECORDS[iteration][lastIndex].PortfolioEnd;
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

    let mktYear = "n/a" //fixed results
    let theReturn = sP500.rOr; //fixed results
    if (myResults.choose === "sequential") {
        mktYear = sP500.year;
        theReturn = sP500.annualReturn;
    } else if (myResults.choose === "random") {
        mktYear = sP500.randomYearReturnObj.randomMktYear;
        theReturn = sP500.randomYearReturnObj.randomMktReturn;
    }


    let object = {  // CREATE OBJECT HERE to be inserted based on the values below
        MktYear : mktYear,
        Return : theReturn,
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






/**
 * 
 * @param {number} iteration which iteration of the simulation. One iteration goes through an entire scenario. Not applicable if simulation is based on fixed rate of return
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
    // let numTrials = convert2Num(document.getElementById('trials').value, false);
    let reductionRatio = convert2Num(document.getElementById('reduction').value, true);

    sP500 = null; // the null values resets or "cleans up" any values lingering in the object
    sP500 = new Market(Global.HISTORICAL, rReturn, iteration + Global.INIT_YEAR);
    myPortfolio = null;
    myPortfolio = new Portfolio(pValue, infl, startDate, withdrawalRate, survivalDuration, reductionRatio);
    myResults = null;
    myResults = new Results(Global.optionSelected.id, iteration);
}


/**
 * 
 * @param {element} element the element for which the event handler will be added
 * @param {*} callback an optional callback function
 * @returns undefined. This function simply sets the event handler to the element.
 */
function expand(element, callback) {
    element.addEventListener('click', (e) => {
        if (e.target.textContent === Global.EXPAND) {
            e.target.textContent = Global.COLLAPSE;
            getAllSiblingsofType(e.target.parentNode, 'tr', arr => { // query filter all selected siblings. sending in parent node as argument because the button is actually wrapped in a div element
                for (ele of arr) {
                    ele.style.display = "table-row";
                }
            }); 
        } else if (e.target.textContent === Global.COLLAPSE) {
            e.target.textContent = Global.EXPAND;
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
        if (nElemSibling === null) break;
    }
    return (callback != undefined) ? callback(qArray) : qArray; // if callback function present, return it with the result as the argument
}


































// const HISTORICAL = {
//     2021:	0.2646,
//     2020:	0.184,
//     2019:	0.3149,
//     2018:	-0.0438,
//     2017:	0.2183,
//     2016:	0.1196,
//     2015:	0.0138,
//     2014:	0.1369,
//     2013:	0.3239,
//     2012:	0.16,
//     2011:	0.0211,
//     2010:	0.1506,
//     2009:	0.2646,
//     2008:	-0.37,
//     2007:	0.0549,
//     2006:	0.1579,
//     2005:	0.0491,
//     2004:	0.1088,
//     2003:	0.2868,
//     2002:	-0.221,
//     2001:	-0.1189,
//     2000:	-0.091,
//     1999:	0.2104,
//     1998:	0.2858,
//     1997:	0.3336,
//     1996:	0.2296,
//     1995:	0.3758,
//     1994:	0.0132,
//     1993:	0.1008,
//     1992:	0.0762,
//     1991:	0.3047,
//     1990:	-0.031,
//     1989:	0.3169,
//     1988:	0.1661,
//     1987:	0.0525,
//     1986:	0.1867,
//     1985:	0.3173,
//     1984:	0.0627,
//     1983:	0.2256,
//     1982:	0.2155,
//     1981:	-0.0491,
//     1980:	0.3242,
//     1979:	0.1844,
//     1978:	0.0656,
//     1977:	-0.0718,
//     1976:	0.2384,
//     1975:	0.372,
//     1974:	-0.2647,
//     1973:	-0.1466,
//     1972:	0.1898,
//     1971:	0.1431,
//     1970:	0.0401,
//     1969:	-0.085,
//     1968:	0.1106,
//     1967:	0.2398,
//     1966:	-0.1006,
//     1965:	0.1245,
//     1964:	0.1648,
//     1963:	0.228,
//     1962:	-0.0873,
//     1961:	0.2689,
//     1960:	0.0047,
//     1959:	0.1196,
//     1958:	0.4336,
//     1957:	-0.1078,
//     1956:	0.0656,
//     1955:	0.3156,
//     1954:	0.5262,
//     1953:	-0.0099,
//     1952:	0.1837,
//     1951:	0.2402,
//     1950:	0.3171,
//     1949:	0.1879,
//     1948:	0.055,
//     1947:	0.0571,
//     1946:	-0.0807,
//     1945:	0.3644,
//     1944:	0.1975,
//     1943:	0.259,
//     1942:	0.2034,
//     1941:	-0.1159,
//     1940:	-0.0978,
//     1939:	-0.0041,
//     1938:	0.3112,
//     1937:	-0.3503,
//     1936:	0.3392,
//     1935:	0.4767,
//     1934:	-0.0144,
//     1933:	0.5399,
//     1932:	-0.0819,
//     1931:	-0.4334,
//     1930:	-0.249,
//     1929:	-0.0842,
//     1928:	0.4361,
//     1927:	0.3749,
//     1926:	0.1162
// };
// const INIT_YEAR = parseInt( Object.keys(HISTORICAL)[0] ); // get the earliest first year in the HISTORICAL Object
// const LATEST_YEAR = parseInt( Object.keys(HISTORICAL)[Object.keys(HISTORICAL).length - 1] ); // get the latest year in the HISTORICAL Object
// const EXPAND = "+"
// const COLLAPSE = "-"
// const EXPANDALL = "Expand All ..."
// const COLLAPSEALL = "Collapse All ..."