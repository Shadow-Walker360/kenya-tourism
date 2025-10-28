// Datepicker for booking
document.querySelectorAll('input[type="date"]').forEach(input => {
  const today = new Date().toISOString().split('T')[0];
  input.setAttribute('min', today);
});

// Format currency
function formatCurrency(amount){
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
}

// Example usage: show estimated trip cost
const costEl = document.querySelector('.estimated-cost');
if(costEl){
  costEl.textContent = formatCurrency(Math.floor(Math.random()*50000)+10000);
}
    input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const q = input.value.trim();
      if(q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
    });
    