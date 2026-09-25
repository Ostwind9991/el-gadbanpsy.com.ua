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
     чтобы не грузить/не проигрывать все три ролика сразу. */
  var slider = document.querySelector('[data-video-slider]');
  if (slider) {
    var screens = slider.querySelectorAll('.phone-frame__screen');
    var dots = slider.querySelectorAll('.slider-dots button');
    var caption = slider.querySelector('.slider-caption');
    var current = 0;

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
      });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { showSlide(i); });
    });

    showSlide(0);
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

  /* ---------- Фото-слайдер (страница «Обо мне») ---------- */
  var photoSlider = document.querySelector('[data-photo-slider]');
  if (photoSlider) {
    var pImgs = photoSlider.querySelectorAll('.photo-slider__frame img');
    var pDots = photoSlider.querySelectorAll('.slider-dots button');
    function showPhoto(i) {
      pImgs.forEach(function (img, idx) { img.classList.toggle('is-active', idx === i); });
      pDots.forEach(function (dot, idx) { dot.classList.toggle('is-active', idx === i); });
    }
    pDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { showPhoto(i); });
    });
  }

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
