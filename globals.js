class globe {
   constructor() {
      this.HISTORICAL = {
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
         1926:	0.1162
     };
      this.INIT_YEAR = parseInt( Object.keys(this.HISTORICAL)[0] ); // get the earliest first year in the HISTORICAL Object
      this.LATEST_YEAR = parseInt( Object.keys(this.HISTORICAL)[Object.keys(this.HISTORICAL).length - 1] ); // get the latest year in the HISTORICAL Object
      this.TOTAL_YEARS = this.LATEST_YEAR - this.INIT_YEAR + 1;
      this.EXPAND = "+"
      this.COLLAPSE = "-"
      this.EXPANDALL = "Expand All ..."
      this.COLLAPSEALL = "Collapse All ..."
      this.TRUNCATED = " ... "
      this.FixedRate = {}
      this.Chronological = {}
      this.Random = {}
   }

   get Options() {
      return [this.FixedRate, this.Chronological, this.Random]
   }

   get optionSelected() {

      // this filter finds the option.id that matches the evt.target.id (user clicked) and returns the array of filtered [option elements] and stores into optionSelected variable. 
         // https://flexiple.com/javascript-filter-array/#:~:text=The%20JavaScript%20filter%20array%20function%20is%20used%20to%20filter%20an,returns%20the%20values%20that%20pass.
      let optionSelected = this.Options.filter( option => option.element.checked);
      if (optionSelected.length > 1) {
         alert("error code: 35Vqw7 -- more than one option has been selected. This is not possible.");
      } else if (optionSelected.length === 1) {
         // since the filter returns an array, remove the array
         return optionSelected[0];
      } 
      return null;
   }


   reset_Add_Assumptions(optionSelected) {
      let assumptions = document.getElementsByClassName('dynamic_assump')
      // has to be done this way because removing items in the array while looping over the same array creates unintended results
      while (assumptions.length > 0) {
         assumptions[0].remove();
      }

      // populates the appropriate assumptions for the user-selected option
      for (let assumption of optionSelected.always_Assumptions) {
         this.appendAssumption(assumption);
      }
      
      // this section appends contingent assumptions
      let cont_assumptions = Object.keys(optionSelected.contingent_Assumptions) 
      for (let cont_assumption of cont_assumptions) {
         let add = false;
         let value = null;
         switch (cont_assumption) {
            case "loop_assump":
               if (document.getElementById('loop').checked) add = true;
               break;
            case "non_loop_assump":
               if (!document.getElementById('loop').checked) add = true;
               break;
            case "reduction_assump":
               value = document.getElementById('reduction').value;
               if (value != "") add = true;
               break;
            case "iteration_assump":
               value = document.getElementById('trials').value;
               if (value > 0) add = true;
               break;
            default:
               break;
         }
         if (add) this.appendAssumption(optionSelected.contingent_Assumptions[cont_assumption], value);
      }
   }

   appendAssumption(assumption, value = null) {
      const appendLoc = document.querySelector('#assumptions ul');
      let li = document.createElement('li');
      li.classList.add('dynamic_assump');
      if (value != null) {
         assumption = assumption.replace("{{ value }}", value)
      }
      li.innerHTML = assumption;
      appendLoc.append(li)
   }


   /**
    * @param {number} number the number to be converted or formatted for pretty display 
    * @param {boolean} decimal true means number is a decimal form, false means integer generally
    * @param {Function} callback an optional callback function, passing in the return result as an argument
    * @returns a value formatted for pretty display and/or callback if passed in
    */
   convert2Str(number, decimal, callback) {  // this after. it will format the input after user has typed it and selection has changed. 
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
   convert2Num(str, decimal = false, callback) {
      // decimal === undefined ? false : true; // if decimal is not passed in as argument
      let number = 0;
      if (decimal) {
         number = parseFloat(  str.replace(/[^0-9.]/g, ""))/100; // removes all commas, $ and returns decimal
      }
      else number = parseInt(str.replace(/[^0-9.]/g, "")) // should remove all commas and return integer
      return callback === undefined ? number : callback(number);
   }

}

const Global = new globe()


