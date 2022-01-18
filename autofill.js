
autofill = document.getElementById('autofill');
autofill.addEventListener('click', () => {
    document.getElementById('rReturn').value = "8 %"
    document.getElementById('pValue').value = "$ 1,000,000"
    document.getElementById('infl').value = "3.5 %"
    document.getElementById('startDate').value = "2021"
    document.getElementById('wd_Rate').value = "4 %"
    document.getElementById('survival').value = "60"
    document.getElementById('fixed').checked = true;
})
