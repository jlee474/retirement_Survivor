let myVar = 5
let myArray = ["cat", "woman", "camera", "dog"];

console.log(`(BEFORE FUNCTION) myVar = ${myVar}. myArray = ${myArray.join(", ")}`)

function testing(myVar, myArray) {
   myVar = myVar + 2;
   myArray.push("cigar")
}

testing(myVar, myArray);

console.log(`(AFTER FUNCTION) myVar = ${myVar}. myArray = ${myArray.join(", ")}`)