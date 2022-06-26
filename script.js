'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  e.preventDefault();
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

console.log(document.documentElement);

//Scrolling Effect
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // OLD WAY OF SCROLLING

  const s1coords = section1.getBoundingClientRect();
  const Yoffset = window.pageYOffset;

  window.scrollTo({
    left: s1coords.left,
    top: s1coords.top + Yoffset,
    behavior: 'smooth',
  });

  // NEW WAY OF SCROLLING

  // section1.scrollIntoView({behavior:"smooth"})
});

// Event delegation for scrolling from nav links

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching if user clicked on nav link(any one)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //Relative url by getAttribute
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component

const tabs = document.querySelectorAll('.operations__tab');

const tabContainer = document.querySelector('.operations__tab-container');

const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); //closest will find the closest element with the class name operations__tab, so if we click on span--> it will give parent element, if we click on button, it will return itself
  //Guard Clause
  if (!clicked) return;
  //First remove active class from all button
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active content area
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu Fade Animation

const nav = document.querySelector('.nav');

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

//It will not work

// nav.addEventListener('mouseover'handleHover(e,0.5){ 

// })

// It will work

// nav.addEventListener('mouseover', function (e) {  //mouseenter doesn't bubble
//   handleHover(e, 0.5);
// });

nav.addEventListener('mouseover',handleHover.bind(0.5));


nav.addEventListener('mouseout', handleHover.bind(1));


//Sticky Navigation
//OLD WAY 

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll',function(e){
 
//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky')
//   else nav.classList.remove('sticky')
// })

// Learning Observer API 

// const obsCallback = function(entries,observer){
//   entries.forEach(entry =>{
//     console.log(entry)
//   })
// }

// const obsOptions = {
//   root : null,
//   // threshold : 0.1;
//   threshold : [0.1,0.2];
// }
// const observer = new IntersectionObserver(obsCallback,obsOptions);
// observer.observe(section1);

// EFFICIENT WAY OF STICKY NAV USING INTERSECTION OBSERVER
const header = document.querySelector('.header');

const stickyNav = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
};

const headerObserver = new IntersectionObserver(stickyNav,{
  root:null,
  threshold:0,
  rootMargin:'-90px', // Margin before nav appears before exiting the header, you can use nav.getBoundingClientRect().height for dynamic size calculation;
});

headerObserver.observe(header);



// Reveal sections
const allSections = document.querySelectorAll('section')
const revealSection = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection,{
  root:null,
  threshold:0.15,
})

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})


// Lazy Loading image

const imgTargets = document.querySelectorAll('img[data-src]'); // Selecting all images which contains data-src property

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src

  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // We are removing blur only after the image is loaded succesfully
  });


  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));


//Slider

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(  // We are creating dots by adding html element given below as the last child always i.e 'beforend'
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active')); // First we remove active dots, then set the dot active which is clicked

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

// The logic for goToSlide function works as follows : 
// The function will accept the slide number (starting from zero) then for every slide it will move that slide
//  in X axis according to the slide number.. e.g if slide(0) is passed the transform property will set the images
//  as  0%, 100%, 200%,  if slide 1 is passed then it will set as -100%,0%,100% like that.  

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) { // checks for max number of slides.. if reached we will revert back to slide(0)
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //Initlialising required funnction as start
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  
  // So that we can move slider with keyboard arrow keys 
  document.addEventListener('keydown', function (e) { 
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
