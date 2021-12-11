// TODO: Stop making input field values reset the cursor every time i edit the number in WD RATE
// TODO: The inflation and wdRate need to go to edit mode when user edits, in order to retain the decimal and % after edit is complete. because it will change the value when user edits a digit
// TODO: Prevent user from inputting multiple decimal periods.
// TODO: Fix the initial withdrawal rate if a user enters something like 1000.55 and focus out/focus in/focus out
// my regex function that needs work in eliminating trailing zeros /[0^.]+$|/g  sort of works but it also eliminates 0 without decimal, like 3500 -> 35


const inputField = document.querySelectorAll('input[type="text"]');
const wd_Rate = document.getElementById('wd_Rate');
const pct = [document.getElementById('infl'), document.getElementById('rReturn')];


for (field of inputField) { //iterates through all the input fields to add event listener

    var oValue =""; // original input value
    field.addEventListener('focus', (event) => { //when the field is focused, save the original value, this is so we can test if this original value changes
        oValue = event.target.value;
    })

    field.addEventListener("keyup", (e) => { // if there is a key stroke, check if original value changed
        oValue !== e.target.value ? inputValidator(e.target, ()=>{oValue = e.target.value;}) : "";  // callback function to update the original value without having to go through 'focus' event again
    })
}


/**
 * This handler determines whether a user has input a decimal or integer, and formats the user input accordingly after the selection has changed
 */
wd_Rate.addEventListener('focusout', (evt) => {
    let target = evt.target
    if (typeof target.value === 'string' || isNaN(target.value)) { // if not a number, first format as number
        if (target.value.includes("%")) {
            target.value = convert2Num(target.value, true);
        } else if (target.value.includes("$")) {
            target.value = convert2Num(target.value, false)
        }
    } 
    if (target.value <= 1) {
        target.value = convert2Str(target.value, true)
    } else if (target.value > 1) {
        target.value = Number(target.value).toLocaleString();
        target.value = `$ ${target.value}`
    } else alert(`Error! code ref: 3dwqgUJ52634, target.value = ${target.vale}`);
})

/**
 * This handler formats the user input decimal as a pretty display in pct% 
 */
for (element of pct) {
    element.addEventListener('focusout', (evt) => {
        let target = evt.target
        if (typeof target.value === 'string' || isNaN(target.value)) { 
            if (!target.value.includes('%')) { // if target is a string but still formatted as a numerical value ...
                target.value = parseFloat(target.value)
                target.value = convert2Str(target.value, true)
            }
        }
    })
}




function inputValidator(target, callback) {  // this first. it will basically fix the input as the user is typing it in.
    target.value = target.value.replace( /^0/g,""); // in all cases remove any preceding 0's, e.g. 001234 => 1234 || 00.1234 => .1234
    let cursorSindex = target.selectionStart; //to keep all cursor unchanged after formatting done
    let cursorEindex = target.selectionEnd;
    switch (target.id) {
        case "pValue":
            target.value = target.value.replace( /[^0-9]/g,""); //remove anything not numerical value, or comma. note: without the /g I get some weird NaN value that is sticky.
            target.value = convert2Str(target.value, false);
            break;
        case "startDate":
            target.value = target.value.replace( /[^0-9]/g,""); //remove anything not numerical value, or comma. note: without the /g I get some weird NaN value that is sticky.
            if (target.value.toString().length > 4) { // to limit the value to 4 digits since it is a year
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
        case "infl":
        case "rReturn":
        case "wd_Rate":
            target.value = target.value.replace( /[^0-9.]/g ,""); //remove anything not numerical value or decimal
            break;
        default:
            alert(`Switch default activated. ${target.id}`)
            break;
    }
    target.selectionStart = cursorSindex;
    target.selectionEnd = cursorEindex;
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
function convert2Num(str, decimal, callback) {
    decimal === undefined ? false : true; // if decimal is not passed in as argument
    let number = 0;
    if (decimal) {
        number = parseFloat(  str.replace(/[^0-9.]/g, ""))/100; // removes all commas, $ and returns decimal
    }
    else number = parseInt(str.replace(/[^0-9]/g, "")) // should remove all commas and return integer
    return callback === undefined ? number : callback(number);
}


















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