// TODO: set the display of the simulation as none. so it will not display anything other than the universal options I guess.
// TODO: add the constraints. for instance, in the random option, should not be able to set a survival duration in excess of 96 years

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
   const non_loop_assump = `(Chronological Sequence only) For years after ${Global.LATEST_YEAR}, the annual return will be the user specified fixed rate of return`
   const reduction_assump = `The annual withdrawal amount will be reduced by {{ % }} FOLLOWING a market decline year.`
   const random_assump = `The annual market return will be based on a random market year between ${Global.INIT_YEAR} and ${Global.LATEST_YEAR}, with no repeating years for a given scenario. 
                           <br> All the known market year returns encompasses ${Global.TOTAL_YEARS} years and is unlikely to exceed Survival duration. Increase the number of scenarios by adding in number of tries`
   const iteration_assump = `One scenario will run a case for {{ duration }} years. <br><i>The higher the number tries, the more precise the average outcome will become. However too many tries will take longer to calculate and display results </i>`

   // Fixed Rate option
   const FixedRate = new Option("fixed", [   
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
   const Chronological = new Option("sequential", [
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
   const Random = new Option("random", [
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
                                          iteration_assump,
                                       });

   
   // this section will add the event listener and append to the HTML
   let options = [FixedRate, Chronological, Random];
   const appendLoc = document.querySelector('#assumptions ul')


   for (option of options) {
      option.element.addEventListener('click', (evt) => {

         let assumptions = document.getElementsByClassName('dynamic_assump')
         // has to be done this way because removing items in the array while looping over the same array creates unintended results
         while (assumptions.length > 0) {
            assumptions[0].remove();
         }
         
         // this filter finds the option.id that matches the evt.target.id (user clicked) and returns the array of filtered [option elements] and stores into optionSelected variable. 
            // https://flexiple.com/javascript-filter-array/#:~:text=The%20JavaScript%20filter%20array%20function%20is%20used%20to%20filter%20an,returns%20the%20values%20that%20pass.
         let optionSelected = options.filter( option => (option.id === evt.target.id) )
         // since the filter returns an array, remove the array, since it should always return 1 result
         optionSelected = optionSelected[0];

         for (assumption of optionSelected.always_Assumptions) {
            let li = document.createElement('li');
            li.classList.add('dynamic_assump');
            li.innerHTML = assumption;
            appendLoc.append(li)
         }

      })
   }
   
})();

