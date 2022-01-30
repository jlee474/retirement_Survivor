// TODO : Fix the withdrawals so it doesn't withdrawal more than the portfolio beginning amount 
// TODO : Fix the S&P500 year and Pct gains Loss column, no need to add parenthesis.
// TODO : Make the scrolling faster, improve performance. Try using some sort of setTimeout for the style.display change on all the elements so it does it all at once, instead of for each element?

// TODO : Refactor the Results class to display based on the master_records array, use a function to test if the existing and new code results are equal before switching over.
// TODO : Create a button/checkbox option that shows the final year result as the header instead of the inital year result as the header
// TODO : Make the result display that is on the right of the table to dynamically addjust when  table width changes i.e. expanding the table row
// TODO : Fix loading button while waiting for results. Like please wait . . . 
// TODO : Reorder the tablet result for the other options so that it is more readable, i.e. mkt year and mkt return.
// TODO : THe mid-portfolio value-- do something with it so it stands back.
// TODO : Scroll down will make the table header sticky to the top
// TODO : Test the random year function iterating it many times to make sure it is accurate
// TODO : Add the new button as a separate function
// TODO : Add feature to export results to spreadsheet
// TODO : Performance improvement suggestions https://stackoverflow.com/questions/8640692/slow-response-when-the-html-table-is-big





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
                    alert("Once code has been refactored, this section should never run.  code: eej071") // TODO: probably delete this line of code once everything works.
                } else return this.rOr // if loop not checked, defaults to the fixed rate of return
            case "random":
                if (this.randomYearReturnObj.currentYear !== Engine.myPortfolio.currentYear) { // check if this function has been executed before for the current year, so this part won't repeat
                    alert("Once code has been refactored, this section should never run. code: 3f7skQ") // TODO: probably delete this line of code once everything works
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
        
        let table = this.createEle('table');
        let caption = this.createEle('caption', {id: "caption"}, "Loading results ...", true);
        let thead = this.createEle('thead');
        let tr = this.createEle('tr');
        let th0a = "";
        let th0b = "";
        if (this.choose === "sequential" || this.choose === "random") {
            th0a = this.createEle('th', {scope:"col", class:"td_small"},'(S&P500 <br> Year)', false);
            th0b = this.createEle('th', {scope:"col", class:"td_small"},'(Pct <br>Gains/Loss)', false);
        }
        let th1 = this.createEle('th', {scope: 'col'}, 'Year', true);
        let th2 = this.createEle('th', {scope: 'col'}, 'Portfolio <br>Beg. Value', false);
        let th3 = this.createEle('th', {scope: 'col'}, 'Withdrawals', true)
        let th4 = this.createEle('th', {scope: 'col'}, 'Portfolio <br>Mid. Value', false)
        let th5 = this.createEle('th', {scope: 'col'}, 'Market <br>Gains/Losses', false)
        let th6 = this.createEle('th', {scope: 'col'}, 'Portfolio <br>End. Value', false)
        let th7 = this.createEle('th', {scope: 'col'}, 'Hypo % <br>W/D Rate', false)
        let th8 = this.createEle('th', {scope: 'col'}, 'Years <br>Elapsed', false)
        
        tr.append(th0a, th0b, th1, th2, th3, th4, th5, th6, th7, th8)
        thead.append(tr);
        table.append(caption, thead);
        document.getElementById('results').append(table);
        let tbody = document.createElement('tbody');
        document.querySelector(`table`).append(tbody)
    }


    createTblRow(elementArray){
        if (this.initial && this.choose !== "fixed") {  // adds the buttons and side result text. to check if its the initial row with data
            // this block of code adds the text result display that shows on the right side
            let spWrapEle = this.createEle('div', {class: "tempPlaceHolderWrapperClass"});
            let nSpan = this.createEle('span', {style: "display: none", id: `span${this.scenario}-${Engine.myPortfolio.currentYear}`, class: "tempPlaceHolderSpanClass"}, "", true);
            spWrapEle.append(nSpan)
            elementArray.push(spWrapEle);

            // this is to defer execution of the placement of the display text until all the html contents are rendered, in order to determine the appropriate table-row width and position adjustment
            setTimeout(  ()=> { 
                spWrapEle.style.left = `${document.querySelector('tr').clientWidth + 15}px`;
            }, 0 )

            //this following section adds a button next to the table to expand/collapse (left side)
            let btnWrapEle = this.createEle('div', {class: "collapseDivBtn"});
            let nButton = this.createEle('button', {id: `btn${this.scenario}-${Engine.myPortfolio.currentYear}`, class: 'collapseBtn'}, `${Global.EXPAND}`, true)
            btnWrapEle.append(nButton)
            elementArray.push(btnWrapEle);
            // function to add the event handler and functionality // TODO: Caution check if this still will work with the refactoring or if order is important.....
            this.expand(nButton);
        }

        // the following section appends the results of a given year as a table row
        let tr = this.createEle('tr', {id:`${this.scenario}-${Engine.myPortfolio.currentYear}`})

        // for sequential and random options: if this is NOT the first row, add a collapsible class tag. Else, add an initIndex class tag
            // for the class tags that are applicable, make sure the description matches exactly with the master_records array
        if ((this.choose === "sequential" || this.choose === "random") && !this.initial) {
            tr.classList.add('collapsible');
        } else if ((this.choose === "sequential" || this.choose === "random") && this.initial) {
            tr.classList.add('init_Index')
        }

        let td0a = "";
        let td0b = "";
        if (this.choose === "sequential" || this.choose === "random") {
            // TODO: clean up this part getting the market return year, especially for random. 
            let year = null;
            if (this.choose === "sequential")  year = Engine.sP500.year;
            else if (this.choose === "random")  year = Engine.sP500.randomYearReturnObj.randomMktYear;
            td0a = this.createEle('td', {scope: "col", class: "td_small MktYear"},`(${year})`, true);
            td0b = this.createEle('td', {scope: "col", class: "td_small Return"},`${Global.convert2Str(Engine.sP500.annualReturn,true)}`, true);
        };
        
        let th = this.createEle('th', {scope: "row", class: "PortfolioYr"}, `${Engine.myPortfolio.currentYear}`,true) // Year
        let td1 = this.createEle('td', {class: "PortfolioBeg"}, `$ ${Global.convert2Str(Engine.myPortfolio.pValue, false)}`, true); //Portofolio Beg Value
        let td2 = this.createEle('td', {class: "Withdrawal"}, `$ ${Global.convert2Str(Engine.myPortfolio.wdAmount, false)}`, true); //Withdrawals
        let td3 = this.createEle('td', {class: "td_small PortfolioMid"}, `$ ${Global.convert2Str(Engine.myPortfolio.pValueMid, false)}`, true); //Portfolio mid value
        let td4 = this.createEle('td', {class: "MktGainsLoss"}, `$ ${Global.convert2Str(Engine.myPortfolio.return, false)}`, true);  //market gains/losses
        let td5 = this.createEle('td', {class: "PortfolioEnd"}, `$ ${Global.convert2Str(Engine.myPortfolio.pValueEnd, false)}`, true);  //Portfolio End
        let td6 = this.createEle('td', {class: "HypoWD"}, `${Global.convert2Str(Engine.myPortfolio.wdRateHypo, true)}`,true);  //Hypo % W/D Rate
        let td7 = this.createEle('td', {class: "YearsElapsed"}, `${Engine.myPortfolio.currentYear - Engine.myPortfolio.startYr + 1}`,true); //Years Elapsed
        
        tr.append(td0a, td0b, th, td1, td2, td3, td4, td5, td6, td7);
        elementArray.push(tr);
        // after this method has run, the next run won't be the initial
        this.initial = false; 
        return elementArray;
    }

    createBlankRow(elementArray) {
        let tr = this.createEle('tr', {id: `${this.scenario}-${Engine.myPortfolio.currentYear}`, class: "blankRow"})
        let td0a = "";
        let td0b = "";
        if (this.choose === "sequential" || this.choose === "random") {
            td0a = this.createEle("td", {scope: "col", class: "td_small"});
            td0b = this.createEle("td", {scope: "col", class: "td_small"});
        }
        let th = this.createEle('th', {scope:"row"});
        let td1 = this.createEle('td');
        let td2 = this.createEle('td');
        let td3 = this.createEle('td');
        let td4 = this.createEle('td');
        let td5 = this.createEle('td');
        let td6 = this.createEle('td');
        let td7 = this.createEle('td');
        tr.append(td0a, td0b, th, td1, td2, td3, td4, td5, td6, td7);
        elementArray.push(tr);
        // document.querySelector('tbody').lastElementChild.classList.add('collapsible')   <-- add this if you want to collapse the blank row as well

        this.initial = true;
        
        return elementArray;
    }

    appendResults(elementArray) {
        this.tBody.append(...elementArray);
    }


    /**
     * 
     * @param {element} element the element for which the event handler will be added
     * @param {*} callback an optional callback function
     * @returns undefined. This function simply sets the event handler to the element.
     */
    expand(element, callback) {
        element.addEventListener('click', (e) => {
            let target = e.target;
            if (target.textContent === Global.EXPAND) {
                target.textContent = Global.COLLAPSE;
                this.getAllSiblingsofType(target.parentNode, 'tr', arr => { // query filter all selected siblings. sending in parent node as argument because the button is actually wrapped in a div element
                    for (let ele of arr) {
                        ele.style.display = "table-row";

                        // this checks if it's the initial index row to change the values 
                        if (ele.classList.contains("init_Index")) {
                            this.tempCompare(ele, "expand");
                        }
                    }
                }); 
            } else if (target.textContent === Global.COLLAPSE) {
                target.textContent = Global.EXPAND;
                this.getAllSiblingsofType(target.parentNode, 'tr', arr => {
                    for (let ele of arr) {
                        ele.style.display = "";

                        // this checks if it's the initial index row to change the values 
                        if (ele.classList.contains("init_Index")) {
                            this.tempCompare(ele, "collapse");
                        }
                    }
                });
            }

            // this section will move the Pass/Fail display when the table size changes
            let spans = document.getElementsByClassName('tempPlaceHolderWrapperClass')
            for (let span of spans) {
                span.style.left = `${document.querySelector('tr').clientWidth + 15}px`
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

    /**
     * 
     * @param {string} element type in string format
     * @param {object} attributes element attributes, such as {<attribute type> : <attribute value>}
     * @param {string} text content inside the html element, text content or innerHTML  
     * @param {boolean} textOrInner true = textContent. false = innerHTML. use innerHTML if it includes tags like <br>
     * @returns an HTML element with the properties specified in the argument
     */
    createEle(element, attributes={}, text = undefined, textOrInner=true) {
        let newEle = document.createElement(element);
        let keys = Object.keys(attributes);
        if (keys.length > 0) {
            for (let key of keys) {
                newEle.setAttribute(key, attributes[key])
            }
        }
        if (text !== undefined) {
            if (textOrInner)  newEle.textContent = text;
            else newEle.innerHTML = text;
        }
        return newEle;
    }


    /**
     * This method name is temporary, it will be used to edit the initial table row values upon expand or collapse
     * @param {HTMLHtmlElement} element the element that represents the initial row of a given scenario
     * @param {string} action must contain "expand" or "collapse" depending on the action that called this method
     */
    tempCompare(element, action=null) {
        if (action === null) alert("method call in class Results.tempCompare() is missing argument action. Ref code: 8036752")
        let id = element.id;
        let iteration = id.slice(0, id.indexOf('-'));
        let PortfolioYr = id.slice(id.indexOf('-') + 1);
        let masterRecIndex = [...Engine.master_records[iteration]]
        for (let child of element.children) {
            
            // to create a standard array of the class lists of elements, since some may contain multiple classes
            let classList = [...child.classList];
            for (let singleClass of classList) {
                let decimal = null;
                let activateSwitch = true; 
                switch (singleClass) {
                    case "MktYear": 
                        break;
                    case "Return":
                        decimal = true;
                        break;
                    case "PortfolioYr":
                        break;
                    case "Withdrawal":
                        decimal = false;
                        break;
                    case "PortfolioMid":
                        decimal = false;
                        break;
                    case "MktGainsLoss":
                        decimal = false;
                        break;
                    case "PortfolioEnd":
                        decimal = false;
                        break;
                    case "HypoWD":
                        decimal = true;
                        break;
                    case "YearsElapsed":
                        break;
                    default:
                        // if none of the above, activateSwitch is false;
                        activateSwitch = false;
                        break;
                }
                if (activateSwitch) {
                    let masterRecIndexValue = "";
                    if (action === "expand") {
                        masterRecIndexValue = masterRecIndex[0][singleClass];
                        this.editContent(child, masterRecIndexValue, decimal)
                    }
                    else if (action === "collapse") {
                        Engine.summarizeInitRowData(masterRecIndex, singleClass, result => this.editContent(child, result, decimal));
                    }
                }

            }
        }
    }

    /**
     * This function edits the textContent of the element being passed in
     * @param {element} element that contains the textContent to be replaced
     * @param {number} repContent the textContent to be replaced, in numerical format (not string)
     * @param {boolean} decimal true means value is expressed as decimal or %; false means $ 
     */
    editContent(element, repContent, decimal = null) {
        if (repContent === Global.TRUNCATED) {
            element.textContent = repContent;
        } else if (repContent !== null) {
            if (decimal === true)  repContent = Global.convert2Str(repContent, true)
            else if (decimal === false)  repContent = `$ ${Global.convert2Str(repContent, false)}`
            else repContent = `${repContent}`; // to "stringify"
            element.textContent = repContent;
        }
        console.log("test how many times this method is being called")















    }


    get currentRow() {
        return document.getElementById(`${this.scenario}-${Engine.myPortfolio.currentYear}`)
    }
    get tBody() {
        return document.querySelector(`tbody`);
    }
    get passFailRatio() {
        let str = `The portfolio has survived ${Engine.myResults.pass} times out of ${Engine.master_records.length} scenarios. `;
        str += "<br>";
        str += `This gives it pass rate of ${Global.convert2Str(Engine.myResults.pass/Engine.master_records.length,true)} based on a survival duration of ${Engine.myPortfolio.survivalD} years`;
        return str;
    }
    
}


class MasterEngine {
    constructor() {
        this.sP500 = null;
        this.myPortfolio = null;
        this.myResults = null;
        this.master_records = [];
        this.userInputs = {};
        this.addClick();
    }
    
    addClick() {
        document.querySelector('#submit').addEventListener('click', () => this.start());
    }

    start() {
        console.log(performance.now())
        this.master_records = [];
        let table = document.querySelector('table'); 
        if (table !== null) table.remove(); // if there is an existing table, delete it. this will ensure a fresh slate. 
        this.grabInputs();
        if (this.inputValidator()) { // make sure inputs are correct
            this.setValues(0); // pass argument of 0 as it would be the first initial iteration
            this.simulator();  // runs the simulation
        }
    }

    grabInputs() {
        let wdr = document.getElementById('wd_Rate');
        if (wdr.value === "") wdr.value = `$ ${Global.convert2Str(0, false)}`;
        if (wdr.value.includes("%")) { // if withdrawal rate is expressed as a decimal, convert to a fixed amount //
            let decimal = Global.convert2Num(document.getElementById('wd_Rate').value, true); // convert to a calculative decimal 
            let pVal = Global.convert2Num(document.getElementById('pValue').value, false);
            wdr.value = `$ ${Global.convert2Str(decimal * pVal, false)}`;
        }
        let withdrawalRate = Global.convert2Num(document.getElementById('wd_Rate').value, false);
        let rReturn = Global.convert2Num(document.getElementById('rReturn').value, true);
        if (isNaN(rReturn)) {
            rReturn = 0;
            document.getElementById('rReturn').value = Global.convert2Str(0, true);
        }
        let pValue = Global.convert2Num(document.getElementById('pValue').value, false);
        let infl = Global.convert2Num(document.getElementById('infl').value, true);
        if (isNaN(infl)) {
            infl = 0;
            document.getElementById('infl').value = Global.convert2Str(0, true);
        }
        let startDate = Global.convert2Num(document.getElementById('startDate').value, false);
        if (startDate === "" || isNaN(startDate)) {
            startDate = new Date().getFullYear();
            document.getElementById('startDate').value = startDate;
        }
        let survivalDuration = Global.convert2Num(document.getElementById('survival').value, false);
        let reductionRatio = Global.convert2Num(document.getElementById('reduction').value, true);
        this.userInputs = {rReturn, pValue, infl, startDate, withdrawalRate, survivalDuration, reductionRatio}
    }

    inputValidator() {
        // TODO: add the constraints. for instance, in the random option, should not be able to set a survival duration in excess of 96 years
        let validated = false;
        let target = null;
        if (Global.optionSelected === null) {
            alert("You must first select an option");
        } else if (this.userInputs.pValue <= 0 || isNaN(this.userInputs.pValue)) {
            alert("You must have a starting Portfolio value");
            target = document.getElementById('pValue');
        } else if (this.userInputs.survivalDuration <= 0 || isNaN(this.userInputs.survivalDuration)) {
            alert("You must have a survival duration");
            target = document.getElementById('survival');
        } else validated = true;

        if (target !== null) {
            target.focus();
            target.selectionStart = 0
            target.selectionEnd = -1
        }

        return validated;
    }


    /**
     * 
     * @param {number} iteration which iteration of the simulation. One iteration goes through an entire scenario. Not applicable if simulation is based on fixed rate of return
     * @param {object} inputValue the object holding all the user input values
     */
    setValues(iteration) {
        // the null declaration ensures any previous objects are destroyed or 'cleaned'
        this.sP500 = null; 
        this.myPortfolio = null;
        this.myResults = null;
        this.sP500 = new SP500(Global.HISTORICAL, this.userInputs.rReturn, iteration + Global.INIT_YEAR);
        this.myPortfolio = new Portfolio(this.userInputs.pValue, this.userInputs.infl, this.userInputs.startDate, this.userInputs.withdrawalRate, this.userInputs.survivalDuration, this.userInputs.reductionRatio);
        this.myResults = new Results(Global.optionSelected.id, iteration);
    }

    /**
     * This function will simulate a year of portfolio activity, append the result, simulate a year, append, etc., until the survival year duration has been reached. 
     */
    simulator() {
        
        // resultsToAppend = a collection of result elements to append to MyResults.tBody
        let resultsToAppend = [] // note as an array object, it can be passed in and edited by other .methods(), since it is passing by REFERENCE the array in memory, not the copied value.
        switch (this.myResults.choose) {

            case "fixed":
                this.oneWholeScenario(resultsToAppend);
                document.getElementById('caption').textContent = "";  // to remove the Loading result caption for fixed use cases.
                this.myResults.appendResults(resultsToAppend);
                break;
        
            case "sequential":
                while (this.myResults.scenario + Global.INIT_YEAR <= Global.LATEST_YEAR) {
                    this.oneWholeScenario(resultsToAppend);
                    this.myResults.createBlankRow(resultsToAppend);
                    this.myResults.scenario++;
                    this.setValues(this.myResults.scenario);
                }

                setTimeout(() => { //set timeout since the result span text also has it
                    this.fixInitialRowResult(resultsToAppend);
                    this.myResults.appendResults(resultsToAppend);
                    this.updatePassFailDisp();
                    console.log(performance.now()) //record log of end time for benchmark purposes
                }, 0);
                break;

            case "random":
                let iterations = Global.convert2Num(document.getElementById('trials').value, false); // declare user-specified number iterations
                if (iterations === '' || iterations === 0 || isNaN(iterations)) iterations = 1;
                while (this.myResults.scenario < iterations) {
                    this.oneWholeScenario(resultsToAppend); 
                    this.myResults.createBlankRow(resultsToAppend);
                    this.myResults.scenario++;
                    this.setValues(this.myResults.scenario);
                }

                setTimeout( () => { //set timeout since the result span text also has it
                    this.fixInitialRowResult(resultsToAppend);
                    this.myResults.appendResults(resultsToAppend);
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
    oneWholeScenario(resultsToAppend) {

        while (this.myPortfolio.currentYear !== this.myPortfolio.finalYr) {
            this.sP500.newYear(); // initial configuration for the random scenario to set the values of random year, which depends on the Portfolio class current year.
            this.recordResult(); // records the result in the master array
            this.myResults.createTblRow(resultsToAppend); // appends a row of results for display output. 
            //functions to update variables for the following year
            this.myPortfolio.pValue = this.myPortfolio.pValueEnd;
            this.myPortfolio.priorYrReturn = this.sP500.annualReturn; // to keep track of the prior year return. The ordering is very important here.
            this.myPortfolio.currentYear++;
            this.myPortfolio.wdRate = this.myPortfolio.wdRate * (1 + this.myPortfolio.infl)
            if (this.myResults.choose === "sequential") this.sP500.year++;
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
            let lastIndex = this.master_records[iteration].length - 1
            let portfolioEnd = this.master_records[iteration][lastIndex].PortfolioEnd;
            element.style.display = ""
            element.style.fontStyle = "italic"
            if (portfolioEnd > 0) {
                element.textContent = "Pass"
                element.style.color = "green"
                this.myResults.pass++ // to keep track of how many times the portfolio survived
            } else {
                element.textContent = "Fail!"
                element.style.color = "red"
            }
        }

        // innerHTML, b/c textcontent won't work in rendering html formatting like <br>
        document.getElementById('caption').innerHTML = this.myResults.passFailRatio; 
    }


    /**
     * This method calculates summary for a column based on the scenario array of the master_record
     * @param {Array} scenarioIndex the master record with the iteration array index
     * @param {string} colName the column name, i.e. Return, PortfolioYr, Withdrawal, etc.
     * @param {function anonymous (result) {
         
     }} an optional callback function with the result passed in as the argument
     * @returns the result in numerical format
     */
    summarizeInitRowData(scenarioIndex, colName, callback = undefined) {
        let result = null;
        switch (colName) {
            case "MktYear":
                // only truncate the market year column for random option
                if (this.myResults.choose === "random")  result = Global.TRUNCATED;
                break;
            case "Return":
            case "PortfolioYr":
            case "PortfolioMid":
            case "HypoWD":
                result = Global.TRUNCATED
                break;
            case "Withdrawal":
            case "MktGainsLoss":
                // calculates the total sum from each array index value
                for (let i of scenarioIndex) {
                    result += i[colName];
                }
                break;
            case "PortfolioEnd":
            case "YearsElapsed":
                // get the last index in the array
                result = scenarioIndex[scenarioIndex.length - 1][colName]
                break;
            default:
                break;
        }
        if (callback === undefined) return result;
        else return callback(result);
    }

    /**
     * This method will fix the initial row display result to show the relevant ending values, instead of the initial values. 
     * @param {Array} resultsToAppend 
     * @returns the Array
     */
    fixInitialRowResult(resultsToAppend) {
        console.log("Implement this feature here. ref code: 62dd873")
        
        // TODO: Implement this part. it will take the elements in the results to and replace the first row for each scenario.
        //  might be able to combine with the MyResults.tempCompare( "collapse") function as it performs similarly i think, or at least the subfunction within it ??? 






























        


    }


    /**
     * @returns : Updates the master result array 
     */
    recordResult() {
        
        let scenario = this.myResults.scenario // the scenario or iteration being run
        if (typeof scenario !== "number") alert("Something may go wrong in the program. code ref 4&vv&je@687")
        this.master_records.length < scenario + 1 ? this.master_records[scenario] = [] : ""; // to first create the empty array space if not done so already
        let currentRow = this.myPortfolio.currentYear - this.myPortfolio.startYr; // to figure out the row of the time period year in a given scenario or iteration
        this.master_records[scenario][currentRow] === undefined ? this.master_records[scenario][currentRow] = {} : ""  // to create an empty object space if not done so already

        let mktYear = "n/a" //fixed results
        let theReturn = this.sP500.rOr; //fixed results
        if (this.myResults.choose === "sequential") {
            mktYear = this.sP500.year;
            theReturn = this.sP500.annualReturn;
        } else if (this.myResults.choose === "random") {
            mktYear = this.sP500.randomYearReturnObj.randomMktYear; // TODO : Refactor this code and clean it up
            theReturn = this.sP500.annualReturn; // TODO:  Refactor this code and clean it up
        }
        let object = {  // CREATE OBJECT HERE to be inserted based on the values below
            MktYear : mktYear,
            Return : theReturn,
            PortfolioYr : this.myPortfolio.currentYear,
            PortfolioBeg : this.myPortfolio.pValue,
            Withdrawal : this.myPortfolio.wdAmount,
            PortfolioMid : this.myPortfolio.pValueMid,
            MktGainsLoss : this.myPortfolio.return,
            PortfolioEnd : this.myPortfolio.pValueEnd,
            HypoWD : this.myPortfolio.wdRateHypo,
            YearsElapsed : currentRow + 1
        }
        this.master_records[scenario][currentRow] = {...object}
    }

}

let Engine = new MasterEngine();







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
