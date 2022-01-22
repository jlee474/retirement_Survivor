// TODO : fix terminology. What is iteration? What is simulation? 
// TODO : Make the result display that is on the right of the table to dynamically addjust when  table width changes i.e. expanding the table row
// TODO : Create a button/checkbox option that shows the final year result as the header instead of the inital year result as the header
// TODO : Fix loading button while waiting for results. Like please wait . . . 
// TODO : Make sure calculate button does not run if not all inputs are entered
// TODO : Add a rightside note whether portfolio failed
// TODO : Test the random year function iterating it many times to make sure it is accurate
// TODO : remove portoflio WdAmount checking if decimal since in all cases it should never be a decimal. double check thought.
// TODO : Add the new button as a separate function
// TODO : Add feature to export results to spreadsheet





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


class SP500 {
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
        switch (Engine.myResults.choose) {
            case "fixed":
                return this.rOr;
            case "sequential":
                if (this.year <= Global.LATEST_YEAR) {
                    return this.historical[this.year] // returns the annual S&P500 of the year this.year
                } else if (this.loop) { // if the loop option is checked
                    debugger;
                    alert("Once code has been refactored, this section should never run.  code: eej071") // TODO: probably delete this line of code once everything works.
                    this.year = Global.INIT_YEAR // reset the year of the market back to the beginning
                    return this.historical[this.year]
                } else return this.rOr // if loop not checked, defaults to the fixed rate of return
            case "random":
                if (this.randomYearReturnObj.currentYear !== Engine.myPortfolio.currentYear) { // check if this function has been executed before for the current year, so this part won't repeat
                    alert("Once code has been refactored, this section should never run. code: 3f7skQ") // TODO: probably delete this line of code once everything works
                    this.randomYearReturnObj.currentYear = Engine.myPortfolio.currentYear;
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

    // initialize the next year in the market based on user-set options
    newYear() {
        switch (Engine.myResults.choose) {
            case "fixed":
                return;
            case "sequential":
                // reset the year of the market back to the beginning if the loop option is checked
                if ( (this.year > Global.LATEST_YEAR) && (this.loop) )  this.year = Global.INIT_YEAR
                break;

            case "random":
                if (this.randomYearReturnObj.currentYear !== Engine.myPortfolio.currentYear) {
                    this.randomYearReturnObj.currentYear = Engine.myPortfolio.currentYear;
                    // an array of keys [i.e. remaining market years] in the historical_randomCopy object
                    let keys = Object.keys(this.historical_randomCopy);
                    // get a random year in the market (remaining years). the << 0 operator rounds down to the nearest integer. easier than Math.floor
                    let randomMktYear = keys [keys.length * Math.random() << 0]
                    // to record the information in a permanent accesible object
                    this.randomYearReturnObj.randomMktYear = randomMktYear
                    // sets the annual market return for that random year in a permanent accesible object
                    this.randomYearReturnObj.randomMktReturn = this.historical_randomCopy[randomMktYear];
                    // delete the market return year after it has been picked out, so it can't be reused.
                    delete this.historical_randomCopy[randomMktYear]
                }
                break;

            default:
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
        return this.pValueMid * Engine.sP500.annualReturn;
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
        this.initial = true; // to keep track of first year of given scenario. A value of true means it is the first year in the scenario. 
        this.scenario = scenario; // represents one whole scenario. one scenario has X (survival) years.  
        this.scenario === 0 ? this.dHeader() : ""; // only create the header in the first year. 
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
            nSpan.id = `span${this.scenario}-${Engine.myPortfolio.currentYear}` // if you change this ID, you will need to change the updatePassFailDisp() function accordingly
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
            nButton.id = `btn${this.scenario}-${Engine.myPortfolio.currentYear}`
            nButton.textContent = `${Global.EXPAND}`;
            btnWrapEle.append(nButton)
            btnWrapEle.classList.add('collapseDivBtn'); // see CSS styling class
            nButton.classList.add('collapseBtn') // see CSS styling class
            this.tBody.insertAdjacentElement('beforeend', btnWrapEle);
            this.expand(nButton); // function to add the event handler and functionality
        }

        let tr = document.createElement('tr'); //creating new table row
        tr.id = `${this.scenario}-${Engine.myPortfolio.currentYear}`;
        this.tBody.append(tr); //append the new table row to the end of the table body
        this.resultMessage = "";

        if (this.choose === "sequential" || this.choose === "random") {
            let year = null;
            if (this.choose === "sequential") {
                year = (Engine.sP500.year > Global.LATEST_YEAR) ? "n/a" : Engine.sP500.year; // TODO: REFACTOR this section
            } else if (this.choose === "random") year = Engine.sP500.randomYearReturnObj.randomMktYear;
            this.resultMessage += `<td scope="col" class="td_small">( ${year} )</th>` //Market Year
            this.resultMessage += `<td scope="col" class="td_small">${convert2Str(Engine.sP500.annualReturn,true)}</th>` // Market Gain/Loss
        }
        this.resultMessage += `<th scope="row">${Engine.myPortfolio.currentYear}</th>` // Year
        this.resultMessage += `<td>$ ${convert2Str(Engine.myPortfolio.pValue, false)}</td>` //Portofolio Beg Value
        this.resultMessage += `<td>$ ${convert2Str(Engine.myPortfolio.wdAmount, false)}</td>` //Withdrawals
        this.resultMessage += `<td>$ ${convert2Str(Engine.myPortfolio.pValueMid, false)}</td>` //Portfolio mid value
        this.resultMessage += `<td>$ ${convert2Str(Engine.myPortfolio.return, false)}</td>` // market gains/losses
        this.resultMessage += `<td>$ ${convert2Str(Engine.myPortfolio.pValueEnd, false)}</td>` // Portfolio End
        this.resultMessage += `<td>${convert2Str(Engine.myPortfolio.wdRateHypo, true)} </td>` // Hypo % W/D Rate
        this.resultMessage += `<td>${Engine.myPortfolio.currentYear - Engine.myPortfolio.startYr + 1}</td>` // Years Elapsed
        this.currentRow.innerHTML = this.resultMessage;
        
        if ((this.choose === "sequential" || this.choose === "random") && !this.initial) { // if this is NOT the first row 
            document.querySelector('tbody').lastElementChild.classList.add('collapsible')
        }
        this.initial = false; // after this method has run, the next run won't be the initial
    }

    appendBlank() {
        let tr = document.createElement('tr');
        tr.id = `${this.scenario}-${Engine.myPortfolio.currentYear}`;
        tr.classList.add('blankRow')
        this.tBody.append(tr);
        this.resultMessage = "";
        if (this.choose === "sequential" || this.choose === "random") {
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

    /**
     * 
     * @param {element} element the element for which the event handler will be added
     * @param {*} callback an optional callback function
     * @returns undefined. This function simply sets the event handler to the element.
     */
     expand(element, callback) {
        element.addEventListener('click', (e) => {
            if (e.target.textContent === Global.EXPAND) {
                e.target.textContent = Global.COLLAPSE;
                this.getAllSiblingsofType(e.target.parentNode, 'tr', arr => { // query filter all selected siblings. sending in parent node as argument because the button is actually wrapped in a div element
                    for (let ele of arr) {
                        ele.style.display = "table-row";
                    }
                }); 
            } else if (e.target.textContent === Global.COLLAPSE) {
                e.target.textContent = Global.EXPAND;
                this.getAllSiblingsofType(e.target.parentNode, 'tr', arr => {
                    for (let ele of arr) {
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
    getAllSiblingsofType(target, tagname, callback) {
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


    get currentRow() {
        return document.getElementById(`${this.scenario}-${Engine.myPortfolio.currentYear}`)
    }
    get tBody() {
        return document.querySelector(`tbody`);
    }
    get passFailRatio() {
        let str = `The portfolio has survived ${Engine.myResults.pass} times out of ${MASTER_RECORDS.length} scenarios. `;
        str += "<br>";
        str += `This gives it pass rate of ${convert2Str(Engine.myResults.pass/MASTER_RECORDS.length,true)} based on a survival duration of ${Engine.myPortfolio.survivalD} years`;
        return str;
    }
    
}


class MasterEngine {
    constructor() {
        this.sP500 = null;
        this.myPortfolio = null;
        this.myResults = null;
        this.userInputs = {};
        this.addClick();
    }
    
    addClick() {
        document.querySelector('#submit').addEventListener('click', () => this.start());
    }

    start() {
        console.log(performance.now())
        MASTER_RECORDS = []; 
        let table = document.querySelector('table'); 
        if (table !== null) table.remove(); // if there is an existing table, delete it. this will ensure a fresh slate. 
        this.grabInputs();        
        this.setValues(0); // pass argument of 0 as it would be the first initial iteration
        this.simulator();  // runs the simulation
    }

    grabInputs() {
        let wdr = document.getElementById('wd_Rate');
        if (wdr.value.includes("%")) { // if withdrawal rate is expressed as a decimal, convert to a fixed amount // TODO: Maybe remove this part since it will always be $
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
        let reductionRatio = convert2Num(document.getElementById('reduction').value, true);
        this.userInputs = {rReturn, pValue, infl, startDate, withdrawalRate, survivalDuration, reductionRatio}
    }


    /**
     * 
     * @param {number} iteration which iteration of the simulation. One iteration goes through an entire scenario. Not applicable if simulation is based on fixed rate of return
     * @param {object} inputValue the object holding all the user input values
     */
    setValues(iteration) {
        // let wdr = document.getElementById('wd_Rate');
        // if (wdr.value.includes("%")) { // if withdrawal rate is expressed as a decimal, convert to a fixed amount // TODO: Maybe remove this part since it will always be $
        //     let decimal = convert2Num(document.getElementById('wd_Rate').value, true); // convert to a calculative decimal 
        //     let pVal = convert2Num(document.getElementById('pValue').value, false);
        //     wdr.value = `$ ${convert2Str(decimal * pVal, false)}`;
        // }
        // let rReturn = convert2Num(document.getElementById('rReturn').value, true);
        // let pValue = convert2Num(document.getElementById('pValue').value, false);
        // let infl = convert2Num(document.getElementById('infl').value, true);
        // let startDate = convert2Num(document.getElementById('startDate').value, false);
        // let withdrawalRate = convert2Num(document.getElementById('wd_Rate').value, false);
        // let survivalDuration = convert2Num(document.getElementById('survival').value, false);
        // let reductionRatio = convert2Num(document.getElementById('reduction').value, true);
        // the null values resets or "cleans up" any values lingering in the object
        this.sP500 = null; 
        this.myPortfolio = null;
        this.myResults = null;
        this.sP500 = new SP500(Global.HISTORICAL, this.userInputs.rReturn, this.userInputs.iteration + Global.INIT_YEAR);
        this.myPortfolio = new Portfolio(this.userInputs.pValue, this.userInputs.infl, this.userInputs.startDate, this.userInputs.withdrawalRate, this.userInputs.survivalDuration, this.userInputs.reductionRatio);
        this.myResults = new Results(Global.optionSelected.id, iteration);
    }

    /**
     * This function will simulate a year of portfolio activity, append the result, simulate a year, append, etc., until the survival year duration has been reached. 
     */
    simulator() {
        switch (this.myResults.choose) {

            case "fixed":
                this.oneWholeScenario();
                document.getElementById('caption').innerHTML = "";  // to remove the Loading result caption for fixed use cases.
                break;
        
            case "sequential":
                while (this.myResults.scenario + Global.INIT_YEAR <= Global.LATEST_YEAR) {
                    this.oneWholeScenario();
                    this.myResults.appendBlank();
                    this.myResults.scenario++;
                    Engine.setValues(this.myResults.scenario);
                }
                setTimeout(() => { //set timeout since the result span text also has it
                    this.updatePassFailDisp();
                    console.log(performance.now()) //record log of end time for benchmark purposes
                }, 0);
                break;

            case "random":
                let iterations = convert2Num(document.getElementById('trials').value, false); // declare user-specified number iterations
                if (iterations === '' || iterations === 0 || isNaN(iterations)) iterations = 1;
                while (this.myResults.scenario < iterations) {
                    this.oneWholeScenario(); 
                    this.myResults.appendBlank();
                    this.myResults.scenario++;
                    Engine.setValues(this.myResults.scenario);
                }
                setTimeout( () => { //set timeout since the result span text also has it
                    this.updatePassFailDisp();
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
    oneWholeScenario() {
        while (this.myPortfolio.currentYear !== this.myPortfolio.finalYr) {
            this.sP500.newYear(); // initial configuration for the random scenario to set the values of random year, which depends on the Portfolio class current year.
            this.recordResult(); // records the result in the master array
            this.myResults.append(); // appends a row of results for display output. 
            //functions to update variables for the following year
            this.myPortfolio.pValue = this.myPortfolio.pValueEnd;
            this.myPortfolio.priorYrReturn = this.sP500.annualReturn; // to keep track of the prior year return. The ordering is very important here.
            this.myPortfolio.currentYear++;
            this.myPortfolio.wdRate = this.myPortfolio.wdRate * (1 + this.myPortfolio.infl)
            if (this.myResults.choose === "sequential") this.sP500.year++;
            //else if (this.myResults.choose === "random") this.sP500.annualReturn; //to update the SP500 object .randomYearReturnObj for the new year.   TODO: Delete this 
        }
    }

    /**
     * The purpose of this function is to update the Pass Fail results of all the scenarios
     */
    updatePassFailDisp() {
        let passFailArray = document.querySelectorAll('span.tempPlaceHolderSpanClass')
        for (let element of passFailArray) {
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
                this.myResults.pass++ // to keep track of how many times the portfolio survived
            } else {
                element.innerHTML = "Fail!"
                element.style.color = "red"
            }
        }
        document.getElementById('caption').innerHTML = this.myResults.passFailRatio; 
    }

    /**
     * @returns : Updates the master result array 
     */
    recordResult() {
        
        let scenario = this.myResults.scenario // the scenario or iteration being run
        if (typeof scenario !== "number") alert("Something may go wrong in the program. code ref 4&vv&je@687")
        MASTER_RECORDS.length < scenario + 1 ? MASTER_RECORDS[scenario] = [] : ""; // to first create the empty array space if not done so already
        let currentRow = this.myPortfolio.currentYear - this.myPortfolio.startYr; // to figure out the row of the time period year in a given scenario or iteration
        MASTER_RECORDS[scenario][currentRow] === undefined ? MASTER_RECORDS[scenario][currentRow] = {} : ""  // to create an empty object space if not done so already

        let mktYear = "n/a" //fixed results
        let theReturn = this.sP500.rOr; //fixed results
        if (this.myResults.choose === "sequential") {
            mktYear = this.sP500.year;
            theReturn = this.sP500.annualReturn;
        } else if (this.myResults.choose === "random") {
            mktYear = this.sP500.randomYearReturnObj.randomMktYear;
            theReturn = this.sP500.randomYearReturnObj.randomMktReturn;
        }
        let object = {  // CREATE OBJECT HERE to be inserted based on the values below
            MktYear : mktYear,
            Return : theReturn,
            PortfolioYr : this.myPortfolio.currentYear,
            PortfolioBeg : this.myPortfolio.pValue,
            Withdrawal : this.myPortfolio.wdAmount,
            PortfolioMid : this.myPortfolio.pValue,
            MktGainsLoss : this.myPortfolio.return,
            PortfolioEnd : this.myPortfolio.pValueEnd,
            HypoWD : this.myPortfolio.wdRateHypo,
            YearsElapsed : currentRow + 1
        }
        MASTER_RECORDS[scenario][currentRow] = {...object}
    }

}

let Engine = new MasterEngine();