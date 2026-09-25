// el-gadbanpsy.com.ua — общий скрипт

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Выпадающее меню "Меню" (десктоп) ---------- */
  var dropdown = document.querySelector('[data-dropdown]');
  if (dropdown) {
    var dropdownTrigger = dropdown.querySelector('.nav-dropdown__trigger');

    function closeDropdown() {
      dropdown.classList.remove('is-open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    }

    dropdownTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('is-open');
      dropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    dropdown.querySelectorAll('.nav-dropdown__panel a').forEach(function (link) {
      link.addEventListener('click', closeDropdown);
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) { closeDropdown(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDropdown(); }
    });
  }

  /* ---------- Мобильное меню (гамбургер) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileMenu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && e.target !== toggle) {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- FAQ аккордеон ---------- */
  document.querySelectorAll('.faq-item__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        var openBtn = openItem.querySelector('.faq-item__q');
        if (openBtn) { openBtn.setAttribute('aria-expanded', 'false'); }
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Видео-слайдер (ленивая загрузка iframe) ----------
     Три вертикальных Shorts про экспресс-консультацию.
     iframe для активного слайда создаётся только по клику на play,
     чтобы не грузить/не проигрывать все три ролика сразу.
     Автопрокрутка (v19) — по тому же принципу, что и у фото-слайдера:
     листает превью по кругу (бесконечно, % по длине), пауза при наведении/
     фокусе, клик по точке не отключает автопрокрутку насовсем — только
     сбрасывает таймер. Единственное отличие от фото-слайдера: как только
     реально запущено воспроизведение (создан iframe) — автопрокрутка для
     этого блока останавливается насовсем, чтобы не прерывать видео. */
  var slider = document.querySelector('[data-video-slider]');
  if (slider) {
    var screens = slider.querySelectorAll('.phone-frame__screen');
    var dots = slider.querySelectorAll('.slider-dots button');
    var caption = slider.querySelector('.slider-caption');
    var current = 0;
    var sliderTimer = null;
    var sliderAutoplayDelay = 4000;
    var sliderAutoplayStopped = false;

    function showSlide(index) {
      screens.forEach(function (screen, i) {
        screen.style.display = i === index ? 'block' : 'none';
        if (i !== index) {
          var iframe = screen.querySelector('iframe');
          if (iframe) { iframe.remove(); }
          var play = screen.querySelector('.phone-frame__play');
          if (play) { play.style.display = 'flex'; }
        }
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
      if (caption) {
        caption.textContent = screens[index].dataset.caption || '';
      }
      current = index;
    }
    function nextSlide() {
      showSlide((current + 1) % screens.length);
    }
    function startSliderAutoplay() {
      clearInterval(sliderTimer);
      sliderTimer = null;
      if (!sliderAutoplayStopped && screens.length > 1) {
        sliderTimer = setInterval(nextSlide, sliderAutoplayDelay);
      }
    }
    function stopSliderAutoplay() {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }

    slider.querySelectorAll('.phone-frame__play').forEach(function (playBtn) {
      playBtn.addEventListener('click', function () {
        var screen = playBtn.closest('.phone-frame__screen');
        var videoId = screen.dataset.videoId;
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&playsinline=1&rel=0';
        iframe.title = 'YouTube video player';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        screen.appendChild(iframe);
        playBtn.style.display = 'none';
        sliderAutoplayStopped = true;
        stopSliderAutoplay();
      });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        startSliderAutoplay();
      });
    });

    slider.addEventListener('mouseenter', stopSliderAutoplay);
    slider.addEventListener('mouseleave', startSliderAutoplay);
    slider.addEventListener('focusin', stopSliderAutoplay);
    slider.addEventListener('focusout', startSliderAutoplay);

    showSlide(0);
    startSliderAutoplay();
  }

  /* ---------- Одиночный видео-embed (напр. "Кто я") ----------
     Тоже ленивая загрузка по клику, чтобы не грузить YouTube без необходимости. */
  document.querySelectorAll('[data-video-single] .phone-frame__play').forEach(function (playBtn) {
    playBtn.addEventListener('click', function () {
      var screen = playBtn.closest('.phone-frame__screen');
      var videoId = screen.dataset.videoId;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&playsinline=1&rel=0';
      iframe.title = 'YouTube video player';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      screen.appendChild(iframe);
      playBtn.style.display = 'none';
    });
  });

  /* ---------- Слайдер «Обо мне» на главной (видео «Кто я» + фото) ----------
     v19: точки переключают между видео-рамкой и фото в общей раскладке
     (см. комментарий в style.css). Видео идёт первым слайдом. При уходе
     со слайда видео — убираем созданный iframe и возвращаем кнопку play,
     чтобы звук не продолжал играть на скрытом слайде (та же логика, что
     у слайдера Э/К выше). Автопрокрутка — тот же принцип, что у фото-
     слайдера и слайдера Э/К: листает по кругу, пауза при наведении/фокусе,
     останавливается насовсем, как только реально запущено видео. */
  document.querySelectorAll('[data-about-slider]').forEach(function (aboutSlider) {
    var aSlides = aboutSlider.querySelectorAll('.about-slider__slide');
    var aDots = aboutSlider.querySelectorAll('.slider-dots button');
    var aCurrent = 0;
    var aTimer = null;
    var aAutoplayDelay = 4000;
    var aAutoplayStopped = false;

    function showAboutSlide(index) {
      aCurrent = index;
      aSlides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
        if (i !== index) {
          var iframe = slide.querySelector('iframe');
          if (iframe) { iframe.remove(); }
          var play = slide.querySelector('.phone-frame__play');
          if (play) { play.style.display = 'flex'; }
        }
      });
      aDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function nextAboutSlide() {
      showAboutSlide((aCurrent + 1) % aSlides.length);
    }
    function startAboutAutoplay() {
      clearInterval(aTimer);
      aTimer = null;
      if (!aAutoplayStopped && aSlides.length > 1) {
        aTimer = setInterval(nextAboutSlide, aAutoplayDelay);
      }
    }
    function stopAboutAutoplay() {
      clearInterval(aTimer);
      aTimer = null;
    }

    aDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showAboutSlide(i);
        startAboutAutoplay();
      });
    });

    aboutSlider.querySelectorAll('.phone-frame__play').forEach(function (playBtn) {
      playBtn.addEventListener('click', function () {
        aAutoplayStopped = true;
        stopAboutAutoplay();
      });
    });

    aboutSlider.addEventListener('mouseenter', stopAboutAutoplay);
    aboutSlider.addEventListener('mouseleave', startAboutAutoplay);
    aboutSlider.addEventListener('focusin', stopAboutAutoplay);
    aboutSlider.addEventListener('focusout', startAboutAutoplay);

    startAboutAutoplay();
  });

  /* ---------- Фото-слайдер (страница «Обо мне») ----------
     На странице может быть больше одного такого блока (например хедер-слайдер
     + отдельный слайдер «Из практики»), поэтому инициализация — на каждый
     [data-photo-slider] по отдельности, с независимым состоянием/таймером. */
  document.querySelectorAll('[data-photo-slider]').forEach(function (photoSlider) {
    var pImgs = photoSlider.querySelectorAll('.photo-slider__frame img');
    var pDots = photoSlider.querySelectorAll('.slider-dots button');
    var pCurrent = 0;
    var pTimer = null;
    var pAutoplayDelay = 4000;

    function showPhoto(i) {
      pCurrent = i;
      pImgs.forEach(function (img, idx) { img.classList.toggle('is-active', idx === i); });
      pDots.forEach(function (dot, idx) { dot.classList.toggle('is-active', idx === i); });
    }
    function nextPhoto() {
      showPhoto((pCurrent + 1) % pImgs.length);
    }
    function startAutoplay() {
      stopAutoplay();
      if (pImgs.length > 1) {
        pTimer = setInterval(nextPhoto, pAutoplayDelay);
      }
    }
    function stopAutoplay() {
      if (pTimer) { clearInterval(pTimer); pTimer = null; }
    }

    pDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showPhoto(i);
        startAutoplay(); // клик по точке не должен насовсем останавливать автопрокрутку — просто сбрасывает таймер
      });
    });

    // Пауза при наведении/фокусе — чтобы автопрокрутка не мешала разглядывать фото или пользоваться точками с клавиатуры
    photoSlider.addEventListener('mouseenter', stopAutoplay);
    photoSlider.addEventListener('mouseleave', startAutoplay);
    photoSlider.addEventListener('focusin', stopAutoplay);
    photoSlider.addEventListener('focusout', startAutoplay);

    startAutoplay();
  });

  /* ---------- Лайтбокс галерей (сертификаты, скриншоты отзывов) ----------
     Общая фабрика: один и тот же паттерн (сетка миниатюр-кнопок + общий
     .lightbox с prev/next/close) используется для нескольких независимых
     галерей на разных страницах — вызывается один раз на каждый lightboxId. */
  function initLightbox(lightboxId, dataAttr) {
    var lightbox = document.getElementById(lightboxId);
    if (!lightbox) { return; }

    var lbImg = lightbox.querySelector('.lightbox__img');
    var lbCaption = lightbox.querySelector('.lightbox__caption');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[' + dataAttr + '-full]'));
    var index = 0;

    function open(i) {
      index = i;
      var btn = buttons[i];
      lbImg.src = btn.getAttribute(dataAttr + '-full');
      lbCaption.textContent = btn.getAttribute(dataAttr + '-caption') || '';
      lightbox.classList.add('is-open');
    }
    function close() {
      lightbox.classList.remove('is-open');
      lbImg.src = '';
    }
    function showRelative(delta) {
      index = (index + delta + buttons.length) % buttons.length;
      open(index);
    }

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });
    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { showRelative(-1); });
    lightbox.querySelector('.lightbox__next').addEventListener('click', function () { showRelative(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { close(); }
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { close(); }
      if (e.key === 'ArrowLeft') { showRelative(-1); }
      if (e.key === 'ArrowRight') { showRelative(1); }
    });
  }

  initLightbox('certLightbox', 'data-cert');
  initLightbox('reviewLightbox', 'data-review');

});
