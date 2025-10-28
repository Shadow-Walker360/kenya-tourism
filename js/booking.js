const bookingForm = document.querySelector('.booking-form');

if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const name = bookingForm.querySelector('input[name="name"]').value;
    const email = bookingForm.querySelector('input[name="email"]').value;

    if(!name || !email){
      alert("Please fill in required fields!");
      return;
    }

    // Simulate reward points
    const rewardPoints = Math.floor(Math.random() * 100) + 1;
    alert(`Booking successful! You earned ${rewardPoints} reward points! 🎉`);

    bookingForm.reset();
  });
}
