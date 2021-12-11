// TODO : Do a year iteration to make sure it works, the "pro-forma" function.
// TODO : Make sure calculate button does not run if not all inputs are entered
// TODO : Test the random year function iterating it many times to make sure it is accurate
// TODO : remove portoflio WdAmount checking if decimal since in all cases it should never be a decimal. double check thought.


const btnSubmit = document.getElementById('submit');
const INIT_YEAR = 1926;
const LATEST_YEAR = 2021;
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
    1926:	0.1162};
let sP500 = {};
let myPortfolio = {};

class Market {
    constructor(historical, rOr) {
        this.historical = {...historical}
        this.rOr = rOr //rOr = rate of return, supplied by user
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
        if (myResults.choose === "fixed") {
            return this.rOr;
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
    constructor(choose) {
        this.choose = choose;
        this.resultMessage = "";
        this.dHeader();
    }
    
    dHeader() {
        this.resultMessage += `<table>`
        this.resultMessage += `<thead>`
        this.resultMessage += `<tr>`
        this.resultMessage += `<th scope="col">Year</th>`
        this.resultMessage += `<th scope="col">Portfolio Beg. Value</th>`
        this.resultMessage += `<th scope="col">Withdrawals</th>`
        this.resultMessage += `<th scope="col">Portfolio Mid.Value</th>`
        this.resultMessage += `<th scope="col">Market Gains/Losses</th>`
        this.resultMessage += `<th scope="col">Portfolio Ending Value</th>`
        this.resultMessage += `<th scope="col">Hypo % W/D Rate</th>`
        this.resultMessage += `<th scope="col">Years Elapsed</th>`
        this.resultMessage += `</tr>`
        this.resultMessage += `</thead>`
        this.resultMessage += `</table>`
        document.getElementById('results').innerHTML = `${this.resultMessage}`;
        let tbody = document.createElement('tbody');

        document.querySelector(`table`).append(tbody)
    }

    append(){
        let tr = document.createElement('tr');
        tr.id = myPortfolio.currentYear;
        this.lastRow.append(tr);
        this.resultMessage = "";
        this.resultMessage += `<th scope="row">${myPortfolio.currentYear}</th>`
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.pValue, false)}</td>`
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.wdAmount, false)}</td>`
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.pValueMid, false)}</td>`
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.return, false)}</td>`
        this.resultMessage += `<td>$ ${convert2Str(myPortfolio.pValueEnd, false)}</td>`
        this.resultMessage += `<td>${convert2Str(myPortfolio.wdRateHypo, true)} </td>`
        this.resultMessage += `<td>${myPortfolio.currentYear - myPortfolio.startYr + 1}</td>`
        this.currentRow.innerHTML = this.resultMessage;
    }

    get currentRow() {
        return document.getElementById(`${myPortfolio.currentYear}`)
    }
    get lastRow() {
        return document.querySelector(`tbody`);
    }

}

/**
 * This recursive function will simulate a year of portfolio activity, append the result, simulate a year, append, etc., until the survival year has been reached. 
 */
function simulator() {
    myResults.append();
    myPortfolio.currentYear++;
    myPortfolio.pValue = myPortfolio.pValueEnd;
    if (myPortfolio.wdRate > 1) {  //is the class global scope? we shall see......
        myPortfolio.wdRate = myPortfolio.wdRate * (1 + myPortfolio.infl)
    }
    if (myPortfolio.currentYear !== myPortfolio.finalYr) simulator();
}


btnSubmit.addEventListener('click', () => { // this event handler takes all the user input fields once clicked, converts to numerical values, and stores them into classes
    let wdr = document.getElementById('wd_Rate');
    if (wdr.value.includes("%")) { // if withdrawal rate is expressed as a decimal, convert to a fixed amount
        let decimal = convert2Num(document.getElementById('wd_Rate').value, true); // convert to a calculative decimal 
        let pVal = convert2Num(document.getElementById('pValue').value, false);
        wdr.value = `$ ${convert2Str(decimal * pVal, false)}`;
    }
    rReturn = convert2Num(document.getElementById('rReturn').value, true);
    pValue = convert2Num(document.getElementById('pValue').value, false);
    infl = convert2Num(document.getElementById('infl').value, true);
    startDate = convert2Num(document.getElementById('startDate').value, false);
    withdrawalRate = convert2Num(document.getElementById('wd_Rate').value, false);
    survivalDuration = convert2Num(document.getElementById('survival').value, false);
    sP500 = new Market(HISTORICAL, rReturn);
    myPortfolio = new Portfolio(pValue, infl, startDate, withdrawalRate, survivalDuration);
    myResults = new Results(option_Selected());
    simulator();  // runs the simulation
})


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