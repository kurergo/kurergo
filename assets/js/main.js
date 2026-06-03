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

const header = document.querySelector("[data-header]");

if (header) {
  const setHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", setHeader, { passive: true });
  setHeader();
}
