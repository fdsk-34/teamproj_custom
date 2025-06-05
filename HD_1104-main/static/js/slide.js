document.addEventListener('DOMContentLoaded', function () {
  const images = [
    { src: '../static/img/slider/img_kimbob_1.png', link: 'login.html', dots: 1 },
    { src: '../static/img/slider/img_kimbob_2.png', link: 'login.html', dots: 2 },
    { src: '../static/img/slider/img_kimbob_5.png', link: 'login.html', dots: 3 },
    { src: '../static/img/slider/img_kimbob_12.png', link: 'login.html', dots: 4 }
  ];

  let currentIndex = 0;
  const slideImage = document.getElementById('slideImage');
  const dotsContainer = document.getElementById('sliderDots');
  let intervalId = null;

  images.forEach((image, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.setAttribute('data-dot', image.dots);
    if (index === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      const targetDot = Number(dot.getAttribute('data-dot'));
      const targetIndex = images.findIndex(img => img.dots === targetDot);
      if (targetIndex !== -1) {
        showImage(targetIndex);
      }
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function showImage(index) {
    currentIndex = index;
    slideImage.src = images[currentIndex].src;
    updateDots();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function startSlideshow() {
    intervalId = setInterval(showNextImage, 3000);
  }

  function stopSlideshow() {
    clearInterval(intervalId);
  }

  slideImage.src = images[0].src;

  slideImage.addEventListener('click', () => {
    window.location.href = images[currentIndex].link;
  });

  slideImage.addEventListener('mouseenter', stopSlideshow);
  slideImage.addEventListener('mouseleave', startSlideshow);
  dots.forEach(dot => {
    dot.addEventListener('mouseenter', stopSlideshow);
    dot.addEventListener('mouseleave', startSlideshow);
  });

  startSlideshow();
});

