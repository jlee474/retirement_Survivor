

/**
 * Options class
 */
class Option {
   constructor (id = undefined, inputs = [], always_Assumptions = [], contingent_Assumptions = {}) {
      
      // id should match the id of the input element
      this.id = id;
      this.inputs = inputs
      this.always_Assumptions = always_Assumptions
      this.contingent_Assumptions = contingent_Assumptions
      // True means this option is selected, false means it has not. Only one option may be selected.
      this.selected = false
      
   }
   get element() {
      return document.getElementById(`${this.id}`);
   }
}


(function () {
   
   // list of all available inputs for user
   const portfolioValue = "pValue"
   const startYear = "startDate"
   const withdrawalRate = "wd_Rate"
   const inflation = "infl"
   const survival = "survival"
   const annualBaseReturn = "rReturn"
   const iterations = "trials"
   const reductionRatio = "reduction"
   const loop_Radio = "loop"

   // list of all assumptions to display
   const sP_assump = `Portfolio is 100% invested in S&P500 market index fund`
   const loop_assump = `The Market return will reset ("loop") back to the initial year after the latest known year. So for years after ${Global.LATEST_YEAR}, the annual return will mimic market years starting ${Global.INIT_YEAR} and subsequently thereto`
   const chronological_assump = `The market return will follow the historical year performance in chronological order, with a unique scenario starting at each year from ${Global.INIT_YEAR} to ${Global.LATEST_YEAR}`
   const noSP_assump = `Portfolio will return user-specified fixed % rate of return annually`
   const non_loop_assump = `For years after ${Global.LATEST_YEAR}, the annual return will be the user specified fixed annual return`
   const reduction_assump = `The annual withdrawal amount will be reduced by {{ value }} FOLLOWING a market decline year.`
   const random_assump = `The annual market return will be based on a random market year between ${Global.INIT_YEAR} and ${Global.LATEST_YEAR}, with no repeating years for a given scenario. 
                           <br> All the known market year returns encompasses ${Global.TOTAL_YEARS} years and is unlikely to exceed Survival duration. Increase the number of scenarios by adding in number of tries`
   const iteration_assump = `{{ value }} scenarios will be run. The higher the number scenarios, the more precise the average outcome will become. However too many will take longer to calculate and display results </i>`

   // Fixed Rate option
   Global.FixedRate = new Option("fixed", [   
                                             portfolioValue, 
                                             startYear, 
                                             withdrawalRate,
                                             inflation,
                                             survival,
                                             annualBaseReturn,
                                          ], 
                                          [
                                             noSP_assump,
                                          ]);
   
   // Chronological Market rate of return option
   Global.Chronological = new Option("sequential", [
                                                      portfolioValue,
                                                      startYear,
                                                      withdrawalRate,
                                                      inflation,
                                                      survival,
                                                      annualBaseReturn,
                                                      loop_Radio,
                                                      reductionRatio,
                                                   ],
                                                   [
                                                      sP_assump,
                                                      chronological_assump,
                                                   ],
                                                   {
                                                      loop_assump : loop_assump,
                                                      non_loop_assump : non_loop_assump,
                                                      reduction_assump : reduction_assump,
                                                   });

   // Random Market order option
   Global.Random = new Option("random", [
                                          portfolioValue,
                                          startYear,
                                          withdrawalRate,
                                          inflation,
                                          survival,
                                          reductionRatio,
                                          iterations,
                                       ],
                                       [
                                          sP_assump,
                                          random_assump,
                                       ],
                                       {
                                          iteration_assump : iteration_assump,
                                          reduction_assump : reduction_assump,
                                       });

   // This section initializes the inputs and sets their display settings
   let inputs = document.querySelectorAll('.inpField input');
   let inputs_always_displayed = [portfolioValue, startYear, withdrawalRate, inflation, survival]
   for (input of inputs) {
      if (!inputs_always_displayed.includes(input.id)) input.parentElement.style.display = "none";
   }

   // this section will add the event listener, display input fields, and append assumptions to the HTML
   for (option of Global.Options) {
      option.element.addEventListener('change', (evt) => {

         let optionSelected = Global.optionSelected;
         Global.reset_Add_Assumptions(optionSelected);

         // toggles the applicable input fields based on the user-selected option
         for (input of inputs) {
            if (optionSelected.inputs.includes(input.id)) {
               input.parentElement.style.display = "";
            } else input.parentElement.style.display = "none";
         }
      })
   }
})();
