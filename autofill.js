
autofill = document.getElementById('autofill');
autofill.addEventListener('click', () => {
    if (Global.optionSelected === null) {
        // if no option is selected, use the default option -- sequential
        var event = new Event('change');
        element = document.getElementById('sequential');
        element.checked = true;
        element.dispatchEvent(event);
    }
    document.getElementById('loop').checked = true;
    document.getElementById('trials').value = 10;
    document.getElementById('rReturn').value = "8 %"
    document.getElementById('pValue').value = "$ 1,000,000"
    document.getElementById('infl').value = "3.5 %"
    document.getElementById('startDate').value = "2022"
    document.getElementById('wd_Rate').value = "4 %"
    document.getElementById('survival').value = "60"
    Global.reset_Add_Assumptions(Global.optionSelected);
})
