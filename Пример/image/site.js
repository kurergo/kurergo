(function () {
  "use strict";

  var RUB = new Intl.NumberFormat("ru-RU");
  var TRANSPORT_RATE = {
    auto: 445,
    velo: 390,
    walk: 350
  };
  var REFERRAL_BONUS = 45000;
  var WEEKS_IN_MONTH = 4;

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function formatRub(value) {
    return RUB.format(Math.max(0, Math.round(value))) + " ₽";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function initSmoothScroll() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute("href");
      if (!id || id === "#") return;

      var target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function initCalculator() {
    var calculator = document.querySelector("#calculator .calculator__wrapper");
    if (!calculator || calculator.dataset.siteReady === "true") return;
    calculator.dataset.siteReady = "true";

    var state = {
      transport: "auto",
      day: 6,
      hour: 8,
      referrals: 1
    };

    function setSlider(slider, value) {
      var min = Number(slider.dataset.min || 0);
      var max = Number(slider.dataset.max || 100);
      var counterId = slider.dataset.counter;
      var nextValue = clamp(Math.round(value), min, max);
      var percent = max === min ? 0 : ((nextValue - min) / (max - min)) * 100;

      state[counterId] = nextValue;
      slider.dataset.value = String(nextValue);

      var track = slider.querySelector(".slider__track");
      var thumb = slider.querySelector(".slider__thumb");
      var counter = counterId ? slider.querySelector("#" + counterId) : null;

      if (track) track.style.width = percent + "%";
      if (thumb) thumb.style.left = percent + "%";
      if (counter) counter.textContent = String(nextValue);
    }

    function valueFromPointer(slider, clientX) {
      var rect = slider.getBoundingClientRect();
      var min = Number(slider.dataset.min || 0);
      var max = Number(slider.dataset.max || 100);
      var ratio = rect.width ? (clientX - rect.left) / rect.width : 0;
      return min + clamp(ratio, 0, 1) * (max - min);
    }

    function calculateIncome() {
      var rate = TRANSPORT_RATE[state.transport] || TRANSPORT_RATE.auto;
      var workIncome = state.day * state.hour * rate * WEEKS_IN_MONTH;
      var referralIncome = state.referrals * REFERRAL_BONUS;
      return workIncome + referralIncome;
    }

    function renderIncome() {
      var referralIncome = state.referrals * REFERRAL_BONUS;
      var total = calculateIncome();
      var income = calculator.querySelector("#income");
      var referral = calculator.querySelector(".refferal-income");
      var count = calculator.querySelector(".refferal-count");

      if (income) income.textContent = formatRub(total);
      if (referral) referral.textContent = "+ " + formatRub(referralIncome);
      if (count) count.textContent = String(state.referrals);

      document.querySelectorAll(".js_income").forEach(function (node) {
        node.innerHTML = "доход до&nbsp;" + formatRub(total).replace(" ", "&nbsp;") + " <span class=\"note1\">в&nbsp;месяц</span>";
        node.style.visibility = "visible";
        node.style.opacity = "1";
      });
    }

    calculator.querySelectorAll(".slider__container").forEach(function (slider) {
      var initial = Number(slider.dataset.initial || slider.dataset.min || 0);
      setSlider(slider, initial);

      function update(clientX) {
        setSlider(slider, valueFromPointer(slider, clientX));
        renderIncome();
      }

      slider.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        slider.classList.add("slider__container--grabbing");
        slider.setPointerCapture(event.pointerId);
        update(event.clientX);
      });

      slider.addEventListener("pointermove", function (event) {
        if (!slider.classList.contains("slider__container--grabbing")) return;
        update(event.clientX);
      });

      slider.addEventListener("pointerup", function (event) {
        slider.classList.remove("slider__container--grabbing");
        if (slider.hasPointerCapture(event.pointerId)) {
          slider.releasePointerCapture(event.pointerId);
        }
      });
    });

    calculator.querySelectorAll(".transport-button").forEach(function (button) {
      button.addEventListener("click", function () {
        calculator.querySelectorAll(".transport-button").forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        state.transport = button.dataset.tableId || "auto";
        renderIncome();
      });
    });

    var minus = calculator.querySelector(".minus-btn");
    var plus = calculator.querySelector(".plus-btn");

    if (minus) {
      minus.addEventListener("click", function () {
        state.referrals = clamp(state.referrals - 1, 0, 10);
        renderIncome();
      });
    }

    if (plus) {
      plus.addEventListener("click", function () {
        state.referrals = clamp(state.referrals + 1, 0, 10);
        renderIncome();
      });
    }

    renderIncome();
  }

  function initFaq() {
    document.querySelectorAll(".lc-spoiler-item__header").forEach(function (header) {
      if (header.dataset.siteReady === "true") return;
      header.dataset.siteReady = "true";

      header.addEventListener("click", function () {
        var item = header.closest(".lc-spoiler-item");
        var panelId = header.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : item && item.querySelector(".lc-spoiler-item__text");
        var isOpen = item && item.classList.toggle("lc-spoiler-item_open");

        header.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (panel) panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
      });

      header.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          header.click();
        }
      });
    });

    var faqButton = document.getElementById("faq-button");
    var faq = document.getElementById("faq");
    if (faqButton && faq && faqButton.dataset.siteReady !== "true") {
      faqButton.dataset.siteReady = "true";
      faqButton.addEventListener("click", function () {
        faq.classList.toggle("closed");
        faqButton.classList.toggle("closed");
      });
    }
  }

  function initCarousels() {
    document.querySelectorAll(".carousel").forEach(function (carousel) {
      if (carousel.dataset.siteReady === "true") return;
      var track = carousel.querySelector(".carousel__track");
      if (!track) return;
      carousel.dataset.siteReady = "true";

      var viewport = carousel.querySelector(".carousel__viewport") || carousel;
      var dots = Array.from(carousel.querySelectorAll(".carousel__dot"));
      var offset = 0;
      var drag = null;
      var suppressClick = false;

      track.style.willChange = "transform";
      track.style.transitionProperty = "transform";
      track.style.transitionDuration = "300ms";
      track.style.touchAction = "pan-y";
      track.style.cursor = "grab";

      function step() {
        var first = track.querySelector(".carousel__item");
        return first ? first.getBoundingClientRect().width + 24 : 320;
      }

      function maxOffset() {
        return Math.max(0, track.scrollWidth - viewport.clientWidth);
      }

      function updateDots() {
        if (!dots.length) return;
        var max = maxOffset();
        var index = max ? Math.round((offset / max) * (dots.length - 1)) : 0;
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      function moveTo(nextOffset, animated) {
        offset = clamp(nextOffset, 0, maxOffset());
        track.style.transitionDuration = animated === false ? "0ms" : "300ms";
        track.style.transform = "translateX(" + -offset + "px)";
        track.scrollLeft = offset;
        updateDots();
      }

      var prev = carousel.querySelector(".carousel__nav.prev");
      var next = carousel.querySelector(".carousel__nav.next");

      if (prev) {
        prev.addEventListener("click", function () {
          moveTo(offset - step(), true);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          moveTo(offset + step(), true);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          var max = maxOffset();
          moveTo(dots.length > 1 ? (max * index) / (dots.length - 1) : 0, true);
        });
      });

      track.addEventListener("pointerdown", function (event) {
        if (event.target.closest("button")) return;
        drag = {
          startX: event.clientX,
          startOffset: offset,
          moved: false
        };
        suppressClick = false;
        track.style.cursor = "grabbing";
        track.style.transitionDuration = "0ms";
        if (track.setPointerCapture) track.setPointerCapture(event.pointerId);
      });

      track.addEventListener("pointermove", function (event) {
        if (!drag) return;
        if (Math.abs(event.clientX - drag.startX) > 5) {
          drag.moved = true;
          suppressClick = true;
        }
        moveTo(drag.startOffset - (event.clientX - drag.startX), false);
      });

      function finishDrag(event) {
        if (!drag) return;
        drag = null;
        track.style.cursor = "grab";
        track.style.transitionDuration = "300ms";
        if (track.releasePointerCapture && event && track.hasPointerCapture && track.hasPointerCapture(event.pointerId)) {
          track.releasePointerCapture(event.pointerId);
        }
      }

      track.addEventListener("pointerup", finishDrag);
      track.addEventListener("pointercancel", finishDrag);
      track.addEventListener(
        "click",
        function (event) {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        },
        true
      );

      window.addEventListener("resize", function () {
        moveTo(offset, false);
      });

      moveTo(0, false);
    });
  }

  function initLcSwipers() {
    document.querySelectorAll(".lc-swiper").forEach(function (slider) {
      if (slider.dataset.siteReady === "true") return;

      var container = slider.querySelector(".swiper-container");
      var wrapper = slider.querySelector(".swiper-wrapper");
      if (!container || !wrapper) return;

      var slides = Array.from(wrapper.querySelectorAll(".swiper-slide")).filter(function (slide) {
        return !slide.classList.contains("swiper-slide-duplicate");
      });
      if (!slides.length) return;

      slider.dataset.siteReady = "true";

      var dots = Array.from(slider.querySelectorAll(".lc-carousel__dot, .swiper-pagination-bullet"));
      var prev = slider.querySelector(".swiper-button-prev, .lc-carousel-arrow_direction_prev");
      var next = slider.querySelector(".swiper-button-next, .lc-carousel-arrow_direction_next");
      var index = 0;
      var drag = null;
      var suppressClick = false;

      wrapper.style.transitionProperty = "transform";
      wrapper.style.transitionDuration = "300ms";
      wrapper.style.touchAction = "pan-y";
      wrapper.style.cursor = "grab";

      function offsetFor(slideIndex) {
        return slides[slideIndex] ? slides[slideIndex].offsetLeft : 0;
      }

      function nearestIndex(offset) {
        var bestIndex = 0;
        var bestDistance = Infinity;
        slides.forEach(function (slide, slideIndex) {
          var distance = Math.abs(slide.offsetLeft - offset);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = slideIndex;
          }
        });
        return bestIndex;
      }

      function setTransform(offset, animated) {
        wrapper.style.transitionDuration = animated === false ? "0ms" : "300ms";
        wrapper.style.transform = "translate3d(" + -offset + "px, 0px, 0px)";
      }

      function updateState() {
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("swiper-slide-active", slideIndex === index);
          slide.classList.toggle("swiper-slide-prev", slideIndex === index - 1);
          slide.classList.toggle("swiper-slide-next", slideIndex === index + 1);
        });

        dots.forEach(function (dot, dotIndex) {
          var active = dotIndex === index;
          dot.classList.toggle("swiper-pagination-bullet-active", active);
          dot.classList.toggle("lc-carousel__dot_active", active);
          dot.setAttribute("aria-pressed", active ? "true" : "false");
        });
      }

      function moveTo(slideIndex, animated) {
        index = clamp(slideIndex, 0, slides.length - 1);
        setTransform(offsetFor(index), animated);
        updateState();
      }

      if (prev) {
        prev.addEventListener("click", function () {
          moveTo(index - 1, true);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          moveTo(index + 1, true);
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          moveTo(dotIndex, true);
        });
      });

      wrapper.addEventListener("pointerdown", function (event) {
        if (event.target.closest("button")) return;
        drag = {
          startX: event.clientX,
          startOffset: offsetFor(index),
          currentOffset: offsetFor(index)
        };
        suppressClick = false;
        wrapper.style.cursor = "grabbing";
        wrapper.style.transitionDuration = "0ms";
        if (wrapper.setPointerCapture) wrapper.setPointerCapture(event.pointerId);
      });

      wrapper.addEventListener("pointermove", function (event) {
        if (!drag) return;
        var delta = event.clientX - drag.startX;
        if (Math.abs(delta) > 5) suppressClick = true;
        drag.currentOffset = clamp(drag.startOffset - delta, offsetFor(0), offsetFor(slides.length - 1));
        setTransform(drag.currentOffset, false);
      });

      function finishDrag(event) {
        if (!drag) return;
        var targetIndex = nearestIndex(drag.currentOffset);
        drag = null;
        wrapper.style.cursor = "grab";
        moveTo(targetIndex, true);
        if (wrapper.releasePointerCapture && event && wrapper.hasPointerCapture && wrapper.hasPointerCapture(event.pointerId)) {
          wrapper.releasePointerCapture(event.pointerId);
        }
      }

      wrapper.addEventListener("pointerup", finishDrag);
      wrapper.addEventListener("pointercancel", finishDrag);
      wrapper.addEventListener(
        "click",
        function (event) {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        },
        true
      );

      window.addEventListener("resize", function () {
        moveTo(index, false);
      });

      moveTo(0, false);
    });
  }

  function revealDynamicText() {
    document.querySelectorAll(".js_city, #js_city, .js_title, #js_title").forEach(function (node) {
      node.style.visibility = "visible";
      node.style.opacity = "1";
    });
  }

  ready(function () {
    initSmoothScroll();
    initCalculator();
    initFaq();
    initCarousels();
    initLcSwipers();
    revealDynamicText();
  });
})();
