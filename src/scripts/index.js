'use strict'

const container = document.querySelector('.fliper-container')
const wrapper = document.querySelector('.fliper-wrapper')
let slides = document.querySelectorAll('.fliper-slide')

const btnPrev = document.querySelector('.fliper-button-prev')
const btnNext = document.querySelector('.fliper-button-next')

const pagination = document.querySelector('.fliper-pagination')

const sliderProps = {
  infinite: true,
  slidesToShow: 4,
  slidesToScrool: 2,
  autoplay: true,
  pauseOnHover: true,
  speed: 1,
  autoplaySpeed: 2000,
}

//
const infinity = sliderProps.infinite
const slidesToShow = sliderProps.slidesToShow
const slidesToScroll = sliderProps.slidesToScrool

// 
let slideWidth = container.clientWidth / slidesToShow
const slidesCount = slides.length

let numSlide = slidesToShow
let currentSlide = slidesToShow

// 
let slideId

// clones
let firstClone
let lastClone

let nextClonesCount = slidesToShow
let prevClonesCount = slidesToShow

function makeClones() {
  for (let i = 1; i <= nextClonesCount; i++) {
    firstClone = slides[i - 1].cloneNode(true)
    firstClone.id = `next-clone${slidesCount + i}`
    wrapper.append(firstClone)
  }

  for (let i = 1; i <= prevClonesCount; i++) {
    lastClone = slides[slides.length - i].cloneNode(true)
    lastClone.id = `prev-clone${1 - i}`
    wrapper.prepend(lastClone)
  }
}


// init
function init() {
  slides = document.querySelectorAll('.fliper-slide')
  pagination.textContent = `${currentSlide} / ${slidesCount}`

  // width for every slide
  slides.forEach((slide) => {
    slide.style.minWidth = slideWidth.toFixed(1) + 'px'
    slide.style.height = 'auto'
  })

  if (infinity) {
    makeClones()
    wrapper.style.transition = `none`
    numSlide += prevClonesCount
    wrapper.style.transform = `translateX(${-slideWidth * prevClonesCount}px)`
  }

  if (sliderProps.autoplay) {
    startSlide()

    if (sliderProps.pauseOnHover) {
      container.addEventListener('mouseenter', () => {
        clearInterval(slideId)
      })

      container.addEventListener('mouseleave', startSlide)
    }
  }
}

window.addEventListener('resize', init)
init()


// btns
btnNext.addEventListener('click', () => {
  moveToRight()
})

btnPrev.addEventListener('click', () => {
  moveToLeft()
})

// functions
function setPosition() {
  wrapper.style.transform = `translateX(${-slideWidth * (numSlide - slidesToShow)}px)`
}

function moveToRight() {
  slides = document.querySelectorAll('.fliper-slide')
  // блок небажаних натисків кнопки
  if (numSlide >= slides.length) return;
  wrapper.style.transition = `${sliderProps.speed}s ease`

  numSlide += slidesToScroll
  // якщо ми скролимо > 1 слайду, а залишився лише один слайд і тепер треба на нього один раз проскролити
  if (slidesCount < numSlide && infinity === false) {
    numSlide = slidesCount
  }

  if (numSlide > slidesCount + prevClonesCount + nextClonesCount && infinity === true) {
    numSlide = slidesCount + prevClonesCount + nextClonesCount
  }
  setPosition()

  // pagination
  if (numSlide - prevClonesCount > slidesCount) {
    currentSlide = numSlide - prevClonesCount - slidesCount
  } else {
    currentSlide = numSlide - prevClonesCount
  }

  pagination.textContent = `${currentSlide} / ${slidesCount}`
}

function moveToLeft() {
  slides = document.querySelectorAll('.fliper-slide')
  // блок небажаних натисків кнопки
  if (numSlide <= slidesToShow) return;
  wrapper.style.transition = `${sliderProps.speed}s ease`

  numSlide -= slidesToScroll

  // якщо ми скролимо > 1 слайду, а залишився лише один слайд і тепер треба на нього один раз проскролити
  if (numSlide < slidesToShow && infinity === false) {
    numSlide = slidesToShow
  }

  if (numSlide < slidesToShow && infinity === true) {
    numSlide = slidesToShow
  }
  setPosition()

  // pagination
  if (numSlide <= slidesToShow + prevClonesCount - slidesToShow) {
    currentSlide = slidesCount
  } else {
    currentSlide = numSlide - prevClonesCount
  }

  pagination.textContent = `${currentSlide} / ${slidesCount}`
}


// transitionend
wrapper.addEventListener('transitionend', () => {
  slides = document.querySelectorAll('.fliper-slide')

  if (slides[numSlide - 1].id === `next-clone${slidesCount + nextClonesCount}`) {
    wrapper.style.transition = 'none';

    numSlide = prevClonesCount + slidesToShow;
    wrapper.style.transform = `translateX(${-slideWidth * (numSlide - slidesToShow)}px)`
  }

  if (slides[numSlide - 1].id === `prev-clone${-prevClonesCount + slidesToShow}`) {
    wrapper.style.transition = 'none';

    numSlide = slides.length - prevClonesCount;
    wrapper.style.transform = `translateX(${-slideWidth * (numSlide - slidesToShow)}px)`
  }
});


// autoplay
function startSlide() {
  slideId = setInterval(() => {
    if (slidesCount < numSlide && infinity === false) {
      clearInterval(slideId)
    }

    moveToRight()
  }, sliderProps.autoplaySpeed);
};


