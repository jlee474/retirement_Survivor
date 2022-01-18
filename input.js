// TODO: New Class for each module type. Class will have its own base set of assumptions?
// TODO: Feature to add start and stop years
// TODO: Center align everything
// TODO: Finish adding the assumptions feature as user clicks buttons 
// TODO: Prevent user from inputting multiple decimal periods.
// TODO: Assumptions description from Random--mention that it won't repeat the same market return year, it will only use it once.
// TODO: delete multiple zeros, i.e. as of this year yyyy --> try entering in 0001
// TODO: Inflation rate -- try entering in 0.089 and removing focus, and refocus. average annual return, try 0.058 

// my regex function that needs work in eliminating trailing zeros /[0^.]+$|/g  sort of works but it also eliminates 0 without decimal, like 3500 -> 35


const optionLoop = document.getElementById('loop');



/**
 * To add focus out event listeners on the input fields to format them on, during, and after user interaction
 */
(function () {

    const inputFields = document.querySelectorAll('input[type="text"]');

    for (field of inputFields) {

        // declare variable in the applicable scope
        var oValue = ""

        // eventlistener when the user input field is in the focus
        field.addEventListener('focus', (event) => { 
            
            let target = event.target;
            //when the field is focused, save the original value, this is so we can test if this original value changes
            oValue = target.value;
            let id = target.id;
            
            // to bring the applicable fields into "edit" mode, similar to Excel and user editing cell data
            switch (id) {
                case "pValue":
                case "wd_Rate":
                case "infl":
                case "rReturn":
                case "reduction":
                    if (target.value.includes("%")) {
                        target.value = convert2Num(target.value, true);
                    } else if (target.value.includes("$")) {
                        target.value = convert2Num(target.value, false)
                    }
                    break;
                default:
                    break;
            }

            target.selectionStart = 0
            target.selectionEnd = -1
        })
    
        // if there is a key stroke, check if original value changed
        field.addEventListener("keyup", (e) => { 
            let target = e.target;
            if (oValue !== target.value) {
                inputValidator(target, () => {
                    // callback function to update the original value without having to go through 'focus' event again
                    oValue = e.target.value;
                })
            }
        })

        // Add formatting conditions when the user input focus has shifted out i.e. move to next field
        field.addEventListener('focusout', (evt) => {
            let target = evt.target;

            switch (target.id) {
              
                // for cases that can only be $, never a % decimal
                case "pValue":
                    // in all cases remove any preceding 0's, e.g. 001234 => 1234 || 00.1234 => .1234
                    target.value = target.value.replace( /^0/g,""); 
                    target.value = "$ "+ convert2Str(target.value, false); 
                    break;
              
                // for cases that can be either $ or % decimal
                case "wd_Rate":  
                    // if not a number, first format as number
                    // TODO: May not need this first if statement, it will always be formatted as a number here because of the "edit mode"
                    if (typeof target.value === 'string' || isNaN(target.value)) { 
                        if (target.value.includes("%")) {
                            target.value = convert2Num(target.value, true);
                        } else if (target.value.includes("$")) {
                            target.value = convert2Num(target.value, false)
                        }
                    }
                    if (target.value <= 1) {
                        target.value = convert2Str(target.value, true)
                    } else if (target.value > 1) {
                        // to remove decimals
                        target.value = parseInt(target.value) 
                        target.value = Number(target.value).toLocaleString();
                        target.value = `$ ${target.value}`
                    } else {
                        alert(`Error! code ref: 3dwqgUJ52634, target.value = ${target.vale}`);
                        target.value = ""
                    }
                    break;

                // for cases that can be only % decimal
                case 'infl':
                case 'rReturn':
                case 'reduction':
                    if (target.value !== "") {
                        if (typeof target.value === 'string' || isNaN(target.value)) {
                            // if target is a string but still formatted as a numerical value ...
                            if (!target.value.includes('%')) {
                                target.value = parseFloat(target.value)
                                if (isNaN(target.value)) target.value = "";
                                target.value = convert2Str(target.value, true)
                            }
                        }
                    }
                    break;

                // for cases that can only be integer, non-currency
                case 'survival':
                case 'trials':
                case 'startDate':
                    evt.target.value = evt.target.value.replace( /^0/g,""); // removes any preceding 0's, e.g. 001234 => 1234 || 00.1234 => .1234
                    break;

                default:
                    break;
            }
        })
    }

})();


/**
 * This function formats user input dynamically as it is being typed. 
 * @param {element} target The html element with the active input field 
 * @param {function} callback An optional callback function
 */
function inputValidator(target, callback) {  
    let cursorSindex = target.selectionStart; //to keep all cursor unchanged after formatting done
    let cursorEindex = target.selectionEnd;
    length = target.value.length;
    switch (target.id) {
        case "pValue":
            target.value = target.value.replace( /[^0-9]/g,""); //remove anything not numerical value, or comma. note: without the /g I get some weird NaN value that is sticky.
            break;
        case "trials":
        case "startDate":
            target.value = target.value.replace( /[^0-9]/g,""); //remove anything not numerical value, or comma. note: without the /g I get some weird NaN value that is sticky.
            if (target.value.toString().length > 4) { // to limit the value to 4 digits 
                if (cursorSindex > 5) cursorSindex = 5;  // this is just incase the user types it in too fast and the number of digits is greater than 5
                target.value = target.value.slice(0, cursorSindex - 1) + target.value.slice(cursorSindex, 5)
            }
            break;
        case "survival": target.value = target.value.replace( /[^0-9]/g,""); //remove anything not numerical value, or comma. note: without the /g I get some weird NaN value that is sticky.
            if (target.value.toString().length > 3) { // to limit the value to 3 digits since we don't want more than 999 years
                if (cursorSindex > 4) cursorSindex = 4;  // this is just incase the user types it in too fast and the number of digits is greater than 3
                target.value = target.value.slice(0, cursorSindex - 1) + target.value.slice(cursorSindex, 4)
            }
            break;
        case "reduction": 
        case "infl":
        case "rReturn":
        case "wd_Rate":
            target.value = target.value.replace( /[^0-9.]/g ,""); //remove anything not numerical value or decimal
            break;
        default:
            alert(`Switch default activated. ${target.id}`)
            break;
    }
    let offset = target.value.length - length;
    target.selectionStart = cursorSindex + offset;
    target.selectionEnd = cursorEindex + offset;
    callback;
}



/**
 * @param {number} number the number to be converted or formatted for pretty display 
 * @param {boolean} decimal true means number is a decimal form, false means integer generally
 * @param {Function} callback an optional callback function, passing in the return result as an argument
 * @returns a value formatted for pretty display and/or callback if passed in
 */
function convert2Str(number, decimal, callback) {  // this after. it will format the input after user has typed it and selection has changed. 
    let result = ""
    if (decimal) {
        result = `${(number * 100)}`.slice(0, 6) // only take the first six digits incase it is an infinite decimal
        result = result.replace( /(((?<=(\.|,)\d*?[1-9])0+$)|(\.|,)0+$)/g, "") // a very complicated regex that removes any trailing zeroes after the decimal. had to find it online. https://stackoverflow.com/questions/26299160/using-regex-how-do-i-remove-the-trailing-zeros-from-a-decimal-number
        result = `${result} %`;
    } else {
        number = Math.round(number); // round to the nearest integer
        result = Number(number).toLocaleString() //adds a thousandth separator
    }
    return callback === undefined ? result : callback(result);
}


/**
 * @param {string} str the string to be converted to a number
 * @param {boolean} decimal true means value should be converted to a decimal (i.e. for values expressed in %). False means we are just formatting an integer
 * @param {Function} callback an optional callback function
 * @returns a value formatted for numerical calculations
 */
function convert2Num(str, decimal = false, callback) {
    // decimal === undefined ? false : true; // if decimal is not passed in as argument
    let number = 0;
    if (decimal) {
        number = parseFloat(  str.replace(/[^0-9.]/g, ""))/100; // removes all commas, $ and returns decimal
    }
    else number = parseInt(str.replace(/[^0-9.]/g, "")) // should remove all commas and return integer
    return callback === undefined ? number : callback(number);
}



/**
 * To add the assumptions. Need to revamp this. 
 */
optionLoop.addEventListener('change', (e) => {
    let target = e.target; // TODO: test to make sure it is only applicable when the chronological sequence option is checked. 
    
    let li_exists = document.getElementById('loopAssumption');

    if (document.getElementById('sequential').checked) { // this button should only be checked if the Chronological Sequential option is selected
    
        let li = document.createElement('li');
        li.id = "loopAssumption";
        li.style.fontStyle = "italic";

        if (target.checked) li.textContent = `(Chronological Sequence only) The Market return will reset ("loop") back to the initial year after the latest known year. So for years after ${LATEST_YEAR}, the annual return will mimic market years starting ${INIT_YEAR} and subsequently thereto`;
        else li.textContent = `(Chronological Sequence only) For years after ${LATEST_YEAR}, the annual return will be the user specified fixed rate of return `
        
        if (li_exists !== null) li_exists.textContent = li.textContent // if there is an existing list item just replace the text content
        else document.querySelector('#assumptions ul').append(li);
    } else if (li_exists !== null) li_exists.remove();
}) 
















// DEPRECATED FUNCTIONS //

/**
 * 
 * @param {element} target
 * @param {Function} callback 
 * @returns function accepts an html element, formats the user-input value accordingly, and executes callback function if any
 *//*
 function convertStr (target, callback) {
    if (target.className === "currency" || target.id === "startDate" || target.id === "survival") { //format for currency $ and year
        target.value = target.value.replace( /[^0-9]/g,""); //remove anything not numerical value. Note: [^0-9.] note: without the /g I get some weird NaN value that is sticky.
        if (target.className === "currency") {
            target.value = Number(target.value).toLocaleString(); //adds a thousandth separator
        } else if (target.id === "startDate") {
            if (target.value.toString().length > 4) {
                let cursorIndex = target.selectionStart;
                if (cursorIndex > 5) cursorIndex = 5;  // this is just incase the user types it in too fast and the number of digits is greater than 5
                target.value = target.value.slice(0, cursorIndex - 1) + target.value.slice(cursorIndex, 5) // deletes last typed character by referencing where the cursor is, and slicing the bit before, and the bit after, and concatenating the two slices together
            }
        }
    } else {
        target.value = target.value.replace( /[^0-9.]/g ,""); //remove anything not numerical value or decimal
        if (target.id === "infl" || target.id === "rReturn") {
            if (target.value !== "") {
                target.value = `${target.value} %`;
                target.selectionStart -= 2;  // this will bring the cursor back to position, instead of at the end
                target.selectionEnd = target.selectionStart;
            }
        } 
    }
    
    target.value = target.value.replace( /^0/g,""); // in all cases remove any preceding 0's, e.g. 001234 => 1234 || 00.1234 => .1234
    
    if (callback === undefined) {
        return;
    } else callback();
}
*/