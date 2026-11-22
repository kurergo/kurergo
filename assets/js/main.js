(() => {
  "use strict";
  const body = document.body;
  const counterId = Number(body.dataset.metrikaId);
  // Only the unique-click marker is stored for the current tab session.
  const session = {
    get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); return true; } catch { return false; } }
  };
  let uniqueClicked = session.get("kg:registration-click") === "1";
  let analyticsLoaded = false;
  const pageContext = () => ({
    landing_url: location.origin + location.pathname,
    region: body.dataset.pageRegion || "unspecified",
    variant: body.dataset.landingVariant || "conversion-v1",
    transport: (document.querySelector("[data-eligibility-check]")?.open && document.querySelector('[data-eligibility-form] [name="transport"]')?.value) || body.dataset.pageTransport || "unspecified"
  });
  const goal = (name, params = {}) => {
    if (typeof window.ym === "function") {
      window.ym(counterId, "reachGoal", name, { ...pageContext(), ...params });
    }
  };
  const loadAnalytics = () => {
    if (analyticsLoaded || !counterId) return;
    analyticsLoaded = true;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
    document.head.append(tag);
    // Start on page load. Session replay remains disabled.
    window.ym(counterId, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false, params: pageContext() });
  };
  loadAnalytics();

  // One registration event per physical activation; /go/ emits only its separate diagnostic goal.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.hasAttribute("data-registration-cta")) {
      const params = { placement: link.dataset.cta || "registration", time: new Date().toISOString() };
      goal(body.dataset.registrationClickGoal || "registration_cta_click", params);
      if (!uniqueClicked) {
        uniqueClicked = true;
        session.set("kg:registration-click", "1");
        goal("registration_click_unique", params);
      }
    } else if (link.hasAttribute("data-help-link")) goal("help_opened", { destination: link.pathname });
    else if (link.dataset.cta === "city") goal("city_click", { city: link.dataset.city });
  });

  const check = document.querySelector("[data-eligibility-check]");
  check?.addEventListener("toggle", () => { if (check.open) goal("eligibility_check_opened"); });
  const eligibility = document.querySelector("[data-eligibility-form]");
  const eligibilitySubmit = eligibility?.querySelector('button[type="submit"]');
  if (eligibilitySubmit) eligibilitySubmit.disabled = false;
  eligibility?.addEventListener("submit", (event) => {
    event.preventDefault();
    const age = eligibility.elements.age.value;
    const transport = eligibility.elements.transport.value;
    const result = eligibility.querySelector("[data-eligibility-result]");
    const ageNote = age === "under18" ? "Для несовершеннолетних могут действовать дополнительные ограничения и требования к согласию представителя. Не считайте возможность подключения подтверждённой. " : "Категория «18 лет и старше» сама по себе не подтверждает допуск. ";
    const transportNote = transport === "car" ? "Отдельно проверьте требования к водителю, автомобилю и документам. " : transport === "bike" ? "Уточните требования к велосипеду и экипировке до оплаты аренды. " : "Уточните доступность пешей доставки, расстояния и допустимую нагрузку. ";
    result.textContent = ageNote + transportNote + "У нас нет подтверждённых актуальных данных для вашего города. Проверьте возраст, город и формат в официальной анкете по кнопке регистрации. Ответы не отправлены и не сохранены.";
    result.hidden = false;
    goal("eligibility_check_completed", { result: "official_check_required", transport });
  });

  const calc = document.querySelector("[data-income-calculator]");
  if (calc) {
    const format = new Intl.NumberFormat("ru-RU");
    const update = () => {
      const hours = Number(calc.elements.hours.value);
      const days = Number(calc.elements.days.value);
      const rate = Number(calc.querySelector('[name="transport"]:checked')?.value || 380);
      const total = Math.round(hours * days * rate * 4.4 / 100) * 100;
      const expenses = Math.max(0, Number(calc.elements.expenses?.value) || 0);
      const tax = Math.min(100, Math.max(0, Number(calc.elements.tax?.value) || 0));
      calc.querySelector('[data-calc-output="hours"]').textContent = hours;
      calc.querySelector('[data-calc-output="days"]').textContent = days;
      calc.querySelector("[data-calc-result]").textContent = format.format(total);
      const net = calc.querySelector("[data-calc-net]");
      if (net) net.textContent = format.format(Math.round(total * (1 - tax / 100) - expenses));
    };
    calc.addEventListener("input", update);
    calc.addEventListener("change", () => goal("calculator_change"));
    calc.addEventListener("submit", (event) => event.preventDefault());
    update();
  }
  const header = document.querySelector("[data-header]");
  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", scrollY > 8);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }
})();
