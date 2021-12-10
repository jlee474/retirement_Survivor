// TODO: Clean up the convertStr function to accept a value instead of html element, the boolean type to convert to, and the callback. see convert2num function; might be easier to create a new function and copy paste what you like, rather than try to edit the exisitng function. Reinvent the wheel so to speak.
// TODO: Stop making input field values reset the cursor every time i edit the number
// TODO: Base the inflation rate and annual return in decimal input, to keep it consistent with wd RAte. CAn format aftter selection change. 
// TODO: convert the % withdrawal rate to a fixed figure
// TODO: Prevent user from inputting multiple decimal periods.
// TODO: Fix the initial withdrawal rate if a user enters something like 1000.55



const inputField = document.querySelectorAll('input[type="text"]');
const wd_Rate = document.getElementById('wd_Rate');

for (field of inputField) { //iterates through all the input fields to add event listener

    var oValue =""; // original input value
    field.addEventListener('focus', (event) => { //when the field is focused, save the original value, this is so we can test if this original value changes
        oValue = event.target.value;
    })

    field.addEventListener("keyup", (e) => { // if there is a key stroke, check if original value changed
        oValue !== e.target.value ? convertStr(e.target, ()=>{oValue = e.target.value;}) : "";  // callback function to update the original value without having to go through 'focus' event again
    })
}


/**
 * This handler determines whether a user has input a decimal or integer, and formats the user input accordingly after the selection has changed
 */
wd_Rate.addEventListener('focusout', (evt) => {
    let target = evt.target
    let decimal = "neither";
    if (target.value <= 1) {
        target.value = target.value * 100;
        target.value = target.value.slice(0, 5) // only take the first five digits incase it is an infinite decimal
        target.value = `${target.value} %`;

    } else if (target.value > 1) {
        target.value = Number(target.value).toLocaleString();
        target.value = `$ ${target.value}`
    }
})

/**
 * 
 * @param {element} target
 * @param {Function} callback 
 * @returns function accepts an html element, formats the user-input value accordingly, and executes callback function if any
 */
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


/**
 * 
 * @param {element} str the string to be converted to a number
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


