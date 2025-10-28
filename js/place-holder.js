document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    if(!img.src || img.src.includes('placeholder')){
      img.src = `https://source.unsplash.com/random/800x600/?kenya,travel,nature&sig=${Math.floor(Math.random()*1000)}`;
    }
  });
});
