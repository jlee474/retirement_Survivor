let resultMessage;

function dHeader(choose = undefined) {
   resultMessage += `<table>`
   resultMessage += `<caption id="caption"> Loading results ... </caption>`
   resultMessage += `<thead>`
   resultMessage += `<tr>`;
   if (choose === "sequential" || choose === "random") {
      resultMessage += `<th scope="col" class="td_small">(S&P500 <br> Year)</th>`
      resultMessage += `<th scope="col" class="td_small">(Pct <br>Gains/Loss)</th>`
   }
   resultMessage += `<th scope="col">Year</th>`
   resultMessage += `<th scope="col">Portfolio <br>Beg. Value</th>`
   resultMessage += `<th scope="col">Withdrawals</th>`
   resultMessage += `<th scope="col">Portfolio <br>Mid. Value</th>`
   resultMessage += `<th scope="col">Market <br>Gains/Losses</th>`
   resultMessage += `<th scope="col">Portfolio <br>End. Value</th>`
   resultMessage += `<th scope="col">Hypo % <br>W/D Rate</th>`
   resultMessage += `<th scope="col">Years <br>Elapsed</th>`
   resultMessage += `</tr>`
   resultMessage += `</thead>`
   resultMessage += `</table>`

   // document.getElementById('results').innerHTML = `${resultMessage}`;
   // let tbody = document.createElement('tbody');
   // document.querySelector(`table`).append(tbody)
}

dHeader();
console.log(resultMessage);



