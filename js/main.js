/* main.js — global behavior: video swap, audio toggle, booking & rewards client logic */

/* ========= small helpers ========= */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

/* ========= year filler for all pages ========= */
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  $$('[id^="year"]').forEach(el => el.textContent = y);
});

/* ========= video swapping for nav links that carry data-video ========= */
function setupVideoSwap() {
  const video = $('#bg-video');
  if(!video) return;
  const navLinks = $$('a[data-video]');
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const v = a.dataset.video;
      if (!v) return;
      // crossfade
      video.style.opacity = 0;
      setTimeout(()=> {
        // set new source; we assume files are in media/videos/ when relative
        const src = (v.includes('/') || v.startsWith('http')) ? v : `media/videos/${v}`;
        // replace source
        while (video.firstChild) video.removeChild(video.firstChild);
        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.load();
        video.play().catch(()=>{/* autoplay policy may block on some browsers */});
        video.style.opacity = 1;
      }, 700);
    });
  });
}
setupVideoSwap();

/* ========= ambient audio toggle ========= */
(function audioToggle(){
  const audio = $('#bg-audio');
  const btn = document.getElementById('audio-toggle');
  if(!btn || !audio) return;
  // persist audio on/off
  const pref = localStorage.getItem('km_audio') || 'off';
  if(pref === 'on') { audio.volume = 0.25; audio.play().catch(()=>{}); btn.textContent = '🔊'; } else btn.textContent = '🔈';
  btn.addEventListener('click', ()=>{
    const on = localStorage.getItem('km_audio') !== 'on';
    localStorage.setItem('km_audio', on ? 'on' : 'off');
    if(on){ audio.volume = 0.25; audio.play().catch(()=>{}); btn.textContent='🔊'; } else { audio.pause(); btn.textContent='🔈'; }
  });
})();

/* ========= Search box (basic) ========= */
(function searchBox(){
  const input = $('#nav-search');
  if(!input) return;
  input.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      const q = input.value.trim();
      if(!q) return;
      // attempt to redirect to a matching place page if exists
      const map = {
        'diani':'places/diani.html',
        'maasai':'places/maasai-mara.html',
        'maasai mara':'places/maasai-mara.html',
        'mount kenya':'places/mount-kenya.html'
      };
      const slug = q.toLowerCase();
      if(map[slug]) location.href = map[slug];
      else alert('No exact match in demo. Try "Diani" or "Maasai".');
    }
  });
})();

/* ========= Booking system (localStorage) ========= */
(function bookingSystem(){
  // store bookings under 'km_bookings', points under 'km_points'
  function getBookings(){ return JSON.parse(localStorage.getItem('km_bookings')||'[]'); }
  function saveBooking(b){ const arr = getBookings(); arr.push(b); localStorage.setItem('km_bookings', JSON.stringify(arr)); }
  function getPoints(){ return Number(localStorage.getItem('km_points')||0); }
  function setPoints(n){ localStorage.setItem('km_points', String(n)); updatePointsUI(); }
  function addPoints(n){ setPoints(getPoints()+n); }

  // update bookings list UI on booking page
  function refreshBookingsList(){
    const listEl = $('.bookings-list');
    if(!listEl) return;
    const arr = getBookings();
    if(!arr.length){ listEl.innerHTML = '<p>No bookings yet.</p>'; return; }
    listEl.innerHTML = '<h3>Your Bookings</h3>';
    arr.slice().reverse().forEach(b=>{
      const div = document.createElement('div');
      div.className = 'booking-card';
      div.innerHTML = `<strong>${b.destination}</strong> — ${b.days} day(s) — KES ${b.total} <br><small>${b.startDate} • Airline: ${b.airline} • Hotel cat: ${b.hotelLabel}</small>`;
      listEl.appendChild(div);
    });
  }

  function updatePointsUI(){
    const el = $('#points-count');
    if(el) el.textContent = getPoints();
  }

  // on booking page: estimate & confirm
  const form = document.getElementById('booking-form');
  if(form){
    const dest = $('#destination'), start = $('#start-date'), days = $('#days'), hotel = $('#hotel'), airline = $('#airline');
    const estBox = $('#estimate'), estTotal = $('#est-total'), estSummary = $('#est-summary');

    // helper price calc: base flight + hotel per night
    function calcTotal(){
      // base flight cost (KES)
      const baseFlight = 15000; // placeholder
      const hotelRate = Number(hotel.value); // passed as 50,100,200 -> thousands base (we'll multiply)
      const nights = Math.max(1, Number(days.value||1));
      const subtotal = baseFlight + (hotelRate * 1000 * nights);
      // small per-destination modifier
      const modifier = (dest.value.includes('Maasai') ? 1.15 : dest.value.includes('Diani') ? 1.05 : 1.0);
      const total = Math.round(subtotal * modifier);
      return { total, breakdown: { baseFlight, hotelRate, nights, modifier } };
    }

    $('#estimate-btn')?.addEventListener('click', ()=>{
      const { total, breakdown } = calcTotal();
      estTotal.textContent = total.toLocaleString();
      estSummary.textContent = `${dest.value || 'Chosen destination'} • ${breakdown.nights} nights • base flight KES ${breakdown.baseFlight.toLocaleString()}`;
      estBox.hidden = false;
    });

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      // validate
      if(!dest.value || !start.value || !days.value){ alert('Please fill required fields.'); return; }
      const { total } = calcTotal();
      const booking = {
        id: 'BK' + Date.now(),
        destination: dest.value,
        startDate: start.value,
        days: Number(days.value),
        airline: airline.value,
        hotelLabel: hotel.options[hotel.selectedIndex].text,
        total
      };
      saveBooking(booking);
      // award points: simple 1 point per 1000 KES
      const pts = Math.max(10, Math.round(total/1000));
      addPoints(pts);
      alert(`Booking saved — you earned ${pts} points!`);
      // refresh UI
      refreshBookingsList();
      updatePointsUI();
      // hide estimate after booking
      $('#estimate') && ($('#estimate').hidden = true);
    });
  }

  // redemption on rewards page
  const btn100 = $('#redeem-100'), btn250 = $('#redeem-250'), msg = $('#redeem-msg');
  if(btn100) btn100.addEventListener('click', ()=>{
    let pts = getPoints();
    if(pts >= 100){ pts -= 100; setPoints(pts); msg.textContent = 'Redeemed: souvenir coupon created (demo)'; } else msg.textContent = 'Not enough points';
  });
  if(btn250) btn250.addEventListener('click', ()=>{
    let pts = getPoints();
    if(pts >= 250){ pts -= 250; setPoints(pts); msg.textContent = 'Redeemed: 10% off next booking (demo)'; } else msg.textContent = 'Not enough points';
  });

  // initialize lists & points display on load
  document.addEventListener('DOMContentLoaded', ()=>{
    refreshBookingsList();
    updatePointsUI();
  });
})();

/* ========= contact form (client-side demo) ========= */
(function contactForm(){
  const form = $('#contact-form');
  if(!form) return;
  const msg = $('#contact-msg');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const cname = $('#cname').value.trim();
    const cemail = $('#cemail').value.trim();
    const cmessage = $('#cmessage').value.trim();
    if(!cname || !cemail || !cmessage){ msg.textContent = 'Please fill all fields.'; return; }
    // store messages locally (demo)
    const inbox = JSON.parse(localStorage.getItem('km_msgs') || '[]');
    inbox.push({ id:'M'+Date.now(), name:cname,email:cemail,message:cmessage, date:new Date().toISOString() });
    localStorage.setItem('km_msgs', JSON.stringify(inbox));
    msg.textContent = 'Thanks — message saved (demo).';
    form.reset();
    setTimeout(()=> msg.textContent = '', 3200);
  });

  // Smooth scroll for navbar links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });

    // Video swap
    const videoSrc = link.getAttribute('data-video');
    if (videoSrc) {
      const bgVideo = document.getElementById('bg-video');
      bgVideo.src = videoSrc;
      bgVideo.play();
    }
  });
});

// Scroll animations
const sections = document.querySelectorAll('section');
const options = { threshold: 0.1 };
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('fade-in');
    }
  });
}, options);

sections.forEach(section => observer.observe(section));

// Navbar active section
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    if(scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight){
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`nav a[href="#${section.id}"]`);
      if(activeLink) activeLink.classList.add('active');
    }
  });
});

})();
