import { iosVhFix } from './utils/ios-vh-fix';
import { initModals } from './modules/modals/init-modals';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  // Видеоплеер

  // получаем все элементы
  const videoEl = document.querySelectorAll('video')[0];
  const playBtn = document.querySelector('.gym__video-button');
  const vidControls = document.querySelector('.gym__video-controls');
  playBtn.style.backgroundImage = 'url(../img/video_button.svg)';

  // если браузер может воспроизводить видео удаляем класс
  videoEl.addEventListener('canplaythrough', function () {
    vidControls.classList.remove('visually-hidden');
  }, false);
  // запускам или останавливаем воспроизведение
  playBtn.addEventListener('click', function () {
    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  }, false);

  videoEl.addEventListener('play', function () {

    playBtn.style.backgroundImage = 'none';
  }, false);

  videoEl.addEventListener('pause', function () {

    playBtn.style.backgroundImage = 'url(../img/video_button.svg)';
  }, false);

  videoEl.addEventListener('ended', function () {
    videoEl.currentTime = 0;
  }, false);

  // Tabs

  class ItcTabs {
    constructor(target, config) {
      const defaultConfig = {};
      this._config = Object.assign(defaultConfig, config);
      this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll('.season-tickets__tabs-button');
      this._elPanels = this._elTabs.querySelectorAll('.season-tickets__tabs-panel');
      this._eventShow = new Event('tab.itc.change');
      this._init();
      this._events();
    }
    _init() {
      this._elTabs.setAttribute('role', 'tablist');
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute('role', 'tab');
        this._elPanels[index].setAttribute('role', 'tabpanel');
      });
    }
    show(elLinkTarget) {
      const elPaneTarget = this._elPanels[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector('.season-tickets__tabs-button--active');
      const elPanelShow = this._elTabs.querySelector('.season-tickets__tabs-panel--show');
      if (elLinkTarget === elLinkActive) {
        return;
      }

      if (elLinkActive) {
        elLinkActive.classList.remove('season-tickets__tabs-button--active');
      }

      if (elPanelShow) {
        elPanelShow.classList.remove('season-tickets__tabs-panel--show');
      }
      elLinkTarget.classList.add('season-tickets__tabs-button--active');
      elPaneTarget.classList.add('season-tickets__tabs-panel--show');
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();
    }
    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      if (elLinkTarget) {
        this.show(elLinkTarget);
      }
    }
    _events() {
      this._elTabs.addEventListener('click', (e) => {
        const target = e.target.closest('.season-tickets__tabs-button');
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }
  }

  // инициализация .tabs как табов
  new ItcTabs('.season-tickets__tabs');


  // Slider

  // eslint-disable-next-line no-new
  new Swiper('.trainer__slider', {
    // Стрелки
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Бесконечная прокрутка
    loop: true,

    // Адаптивность
    breakpoints: {
      1200: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
    },
  });

  // eslint-disable-next-line no-new, no-undef
  new Swiper('.reviews__slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 1,
    spaceBetween: 100,
    loop: true,
  });

  // Валидация телефона

  let phoneInputs = document.querySelectorAll('[type="tel"]');

  let getInputNumbersValue = function (input) {
    return input.value.replace(/\D/g, '');
  };

  let onPhoneInput = function (e) {
    let input = e.target;
    let inputNumbersValue = getInputNumbersValue(input);
    let formattedInputValue = '';
    let selectionStart = input.selectionStart;


    if (!inputNumbersValue) {
      input.value = '';
      return;
    }

    if (input.value.length !== selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
        input.value = inputNumbersValue;
      }
      return;
    }

    if (inputNumbersValue.indexOf(inputNumbersValue[0]) > -1) {
      formattedInputValue += inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
  };

  let onPhoneKeyDown = function (e) {
    let inputValue = e.target.value.replace(/\D/g, '');
    if (e.keyCode === 8 && inputValue.length === 1) {
      e.target.value = '';
    }
  };

  let onPhonePaste = function (e) {
    let pasted = e.clipboardData || window.clipboardData;
    let input = e.target;
    let inputNumbersValue = getInputNumbersValue(input);

    if (pasted) {
      let pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
      }
    }
  };

  for (let phoneInput of phoneInputs) {
    phoneInput.addEventListener('keydown', onPhoneKeyDown);
    phoneInput.addEventListener('input', onPhoneInput, false);
    phoneInput.addEventListener('paste', onPhonePaste, false);
  }


  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
