const metrikaId = 109618174;

const reachGoal = (goal, params = {}) => {
  if (typeof window.ym === "function") {
    window.ym(metrikaId, "reachGoal", goal, params);
  }
};

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
    const total = Math.round((hours * days * rate * monthFactor) / 100) * 100;

    outputs.hours.textContent = hours;
    outputs.days.textContent = days;
    outputs.result.textContent = format.format(total);
  };

  fields.hours.addEventListener("input", updateIncomeCalc);
  fields.days.addEventListener("input", updateIncomeCalc);
  fields.transport.forEach((field) => field.addEventListener("change", updateIncomeCalc));
  incomeCalc.addEventListener("input", () => reachGoal("calculator_click"));
  incomeCalc.addEventListener("change", () => reachGoal("calculator_click"));
  updateIncomeCalc();
}

document.querySelectorAll("[data-cta]").forEach((link) => {
  link.addEventListener("click", () => {
    const cta = link.dataset.cta;
    const goals = {
      hero: "hero_click",
      sticky: "sticky_click",
      calculator: "calculator_click",
      final: "final_click",
      city: "city_click",
    };
    reachGoal(goals[cta] || `${cta}_click`, {
      city: link.dataset.city || undefined,
      audience: link.dataset.audience || document.querySelector("[data-audience]")?.dataset.audience || undefined,
    });
  });
});

const chatDialog = document.querySelector("[data-chat-dialog]");
const chatForm = document.querySelector("[data-chat-form]");
const chatStatus = document.querySelector("[data-chat-status]");

document.querySelectorAll("[data-chat-open]").forEach((button) => {
  button.addEventListener("click", () => {
    reachGoal("chat_open", {
      audience: button.dataset.audience || document.querySelector("[data-audience]")?.dataset.audience || undefined,
    });
    if (chatDialog?.showModal) {
      chatDialog.showModal();
    }
  });
});

document.querySelectorAll("[data-chat-close]").forEach((button) => {
  button.addEventListener("click", () => chatDialog?.close());
});

if (chatDialog) {
  chatDialog.addEventListener("click", (event) => {
    if (event.target === chatDialog) {
      chatDialog.close();
    }
  });
}

if (chatForm) {
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const webhook = chatForm.dataset.chatWebhook?.trim();
    const submit = chatForm.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(chatForm).entries());

    if (!webhook) {
      chatStatus.textContent = "Форма готова. Добавьте chat_webhook_url в CMS, чтобы отправлять заявки в n8n.";
      return;
    }

    submit.disabled = true;
    chatStatus.textContent = "Отправляем...";

    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          source: window.location.href,
          event: "chat_open",
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      reachGoal("chat_submit", { city: payload.city });
      chatStatus.textContent = "Заявка отправлена. Скоро с вами свяжутся.";
      chatForm.reset();
    } catch (error) {
      chatStatus.textContent = "Не удалось отправить заявку. Попробуйте перейти к регистрации напрямую.";
    } finally {
      submit.disabled = false;
    }
  });
}

const header = document.querySelector("[data-header]");

if (header) {
  const setHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", setHeader, { passive: true });
  setHeader();
}
