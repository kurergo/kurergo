const calc = document.querySelector("[data-calculator]");

if (calc) {
  const format = new Intl.NumberFormat("ru-RU");
  const fields = {
    hours: calc.elements.hours,
    days: calc.elements.days,
    rate: calc.elements.rate,
  };
  const outputs = {
    hours: calc.querySelector('[data-output="hours"]'),
    days: calc.querySelector('[data-output="days"]'),
    rate: calc.querySelector('[data-output="rate"]'),
    result: calc.querySelector("[data-result]"),
  };

  const update = () => {
    const hours = Number(fields.hours.value);
    const days = Number(fields.days.value);
    const rate = Number(fields.rate.value);
    outputs.hours.textContent = hours;
    outputs.days.textContent = days;
    outputs.rate.textContent = `${format.format(rate)} ₽`;
    outputs.result.textContent = `${format.format(hours * days * rate)} ₽`;
  };

  Object.values(fields).forEach((field) => field.addEventListener("input", update));
  update();
}

const incomeCalc = document.querySelector("[data-income-calculator]");

if (incomeCalc) {
  const format = new Intl.NumberFormat("ru-RU");
  const fields = {
    hours: incomeCalc.querySelector('input[name="hours"]'),
    days: incomeCalc.querySelector('input[name="days"]'),
    transport: incomeCalc.querySelectorAll('input[name="transport"]'),
  };
  const outputs = {
    hours: incomeCalc.querySelector('[data-calc-output="hours"]'),
    days: incomeCalc.querySelector('[data-calc-output="days"]'),
    result: incomeCalc.querySelector("[data-calc-result]"),
  };

  const updateIncomeCalc = () => {
    const hours = Number(fields.hours.value);
    const days = Number(fields.days.value);
    const rate = Number(incomeCalc.querySelector('input[name="transport"]:checked')?.value || 380);
    const monthFactor = 4.4;
    const total = Math.round(hours * days * rate * monthFactor / 100) * 100;

    outputs.hours.textContent = hours;
    outputs.days.textContent = days;
    outputs.result.textContent = format.format(total);
  };

  fields.hours.addEventListener("input", updateIncomeCalc);
  fields.days.addEventListener("input", updateIncomeCalc);
  fields.transport.forEach((field) => field.addEventListener("change", updateIncomeCalc));
  updateIncomeCalc();
}

const rabotaCalc = document.querySelector("[data-rabota-calculator]");

if (rabotaCalc) {
  const format = new Intl.NumberFormat("ru-RU");
  const fields = {
    hours: rabotaCalc.querySelector('input[name="hours"]'),
    days: rabotaCalc.querySelector('input[name="days"]'),
  };
  const outputs = {
    hours: rabotaCalc.querySelector('[data-rabota-output="hours"]'),
    days: rabotaCalc.querySelector('[data-rabota-output="days"]'),
    result: rabotaCalc.querySelector("[data-rabota-result]"),
    hero: document.querySelector("[data-rabota-hero-income]"),
  };
  const transportButtons = rabotaCalc.querySelectorAll("[data-rabota-transport]");
  let rate = Number(rabotaCalc.querySelector("[data-rabota-transport].is-active")?.dataset.rate || 520);

  const updateRabotaCalc = () => {
    const hours = Number(fields.hours.value);
    const days = Number(fields.days.value);
    const total = hours * days * rate;
    outputs.hours.textContent = hours;
    outputs.days.textContent = days;
    outputs.result.textContent = format.format(total);
    if (outputs.hero) {
      outputs.hero.textContent = format.format(total);
    }
  };

  transportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      transportButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      rate = Number(button.dataset.rate || rate);
      updateRabotaCalc();
    });
  });

  Object.values(fields).forEach((field) => field.addEventListener("input", updateRabotaCalc));
  updateRabotaCalc();
}

document.querySelectorAll("[data-rabota-slider]").forEach((slider) => {
  const track = slider.querySelector(".rabota-slider-track");
  const prev = slider.querySelector("[data-rabota-slider-prev]");
  const next = slider.querySelector("[data-rabota-slider-next]");

  if (!track || !prev || !next) {
    return;
  }

  const scrollByCard = (direction) => {
    const firstCard = track.querySelector(".rabota-slide");
    const distance = firstCard ? firstCard.getBoundingClientRect().width + 14 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));
});

const header = document.querySelector("[data-header]");

if (header) {
  const setHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", setHeader, { passive: true });
  setHeader();
}
