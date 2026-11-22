import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');

function harness({ storage = new Map(), blocked = false, eligibility = false, calculator = false, queued = false } = {}) {
  const events = new Map();
  const calls = [];
  const scripts = [];
  const node = (extra = {}) => ({ hidden: true, addEventListener(name, fn) { this[name] = fn; }, ...extra });
  const check = node({ open: false });
  const result = node({ textContent: '' });
  const form = node({ elements: { age: { value: 'adult' }, transport: { value: 'walking' }, city: { value: 'private city value' } }, querySelector: () => result });
  const outputs = Object.fromEntries(['hours', 'days', 'result', 'net'].map(key => [key, node({ textContent: '' })]));
  const calc = node({
    elements: { hours: {value:'5'}, days: {value:'5'}, expenses: {value:'3000'}, tax: {value:'4'} },
    querySelector(selector) {
      if (selector.includes(':checked')) return {value:'380'};
      if (selector.includes('"hours"')) return outputs.hours;
      if (selector.includes('"days"')) return outputs.days;
      return selector.includes('-net') ? outputs.net : outputs.result;
    }
  });
  const nodes = {
    '[data-eligibility-check]': eligibility ? check : null,
    '[data-eligibility-form]': eligibility ? form : null,
    '[data-eligibility-form] [name="transport"]': eligibility ? form.elements.transport : null,
    '[data-income-calculator]': calculator ? calc : null,
  };
  const document = {
    body: {dataset: {metrikaId:'109618174', registrationClickGoal:'registration_cta_click', landingVariant:'test-v1'}},
    querySelector: selector => nodes[selector] || null,
    createElement: () => ({}),
    head: {append: tag => scripts.push(tag)},
    addEventListener: (name, fn) => events.set(name, fn)
  };
  const window = queued ? {} : { ym: (...args) => calls.push(args) };
  const sessionStorage = {
    getItem(key) { if (blocked) throw Error('blocked'); return storage.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw Error('blocked'); storage.set(key, value); },
    removeItem(key) { if (blocked) throw Error('blocked'); storage.delete(key); }
  };
  vm.runInNewContext(source, {document, window, sessionStorage, location: {origin:'https://kurergo.ru', pathname:'/lp/rabota-kurerom/'}, Intl, Date});
  const click = () => events.get('click')({target:{closest:()=>({dataset:{cta:'hero'},hasAttribute: name => name === 'data-registration-cta'})}});
  const goals = name => calls.filter(args => args[1] === 'reachGoal' && args[2] === name);
  return {calls, scripts, click, goals, storage, form, check, result, calc, outputs, window};
}

test('analytics starts immediately without a stored decision or user action', () => {
  const h = harness();
  assert.equal(h.scripts.length, 1);
  assert.match(h.scripts[0].src, /metrika\/tag\.js\?id=109618174$/);
  assert.equal(h.scripts[0].async, true);
  const init = h.calls.find(args => args[1] === 'init');
  assert.equal(init[2].webvisor, false);
  h.click();
  assert.equal(h.goals('registration_cta_click').length, 1);
});

test('legacy stored decisions do not prevent automatic analytics', () => {
  for (const value of ['declined', 'accepted']) {
    const h = harness({storage:new Map([['kg:analytics', value]])});
    assert.equal(h.scripts.length, 1);
    h.click();
    assert.equal(h.goals('registration_click_unique').length, 1);
  }
});

test('early clicks queue safely while the analytics library is loading or blocked', () => {
  const h = harness({queued:true});
  h.click(); h.click();
  const queued = h.window.ym.a.map(args => Array.from(args));
  assert.equal(queued.filter(args => args[1] === 'init').length, 1);
  assert.equal(queued.filter(args => args[2] === 'registration_cta_click').length, 2);
  assert.equal(queued.filter(args => args[2] === 'registration_click_unique').length, 1);
});

test('every click is measured, unique conversion occurs once across pages in the same tab', () => {
  const h = harness();
  h.click(); h.click();
  assert.equal(h.goals('registration_cta_click').length, 2);
  assert.equal(h.goals('registration_click_unique').length, 1);
  assert.equal(h.scripts.length, 1);
  const nextPage = harness({storage:h.storage});
  nextPage.click();
  assert.equal(nextPage.goals('registration_cta_click').length, 1);
  assert.equal(nextPage.goals('registration_click_unique').length, 0);
});

test('blocked storage does not break registration or in-page deduplication', () => {
  const h = harness({blocked:true});
  h.click(); h.click();
  assert.equal(h.goals('registration_cta_click').length, 2);
  assert.equal(h.goals('registration_click_unique').length, 1);
});

test('unknown city and every age/transport combination require official verification', () => {
  const h = harness({eligibility:true});
  for (const age of ['under18', 'adult']) {
    for (const transport of ['walking', 'bike', 'car']) {
      h.form.elements.age.value = age;
      h.form.elements.transport.value = transport;
      h.form.submit({preventDefault(){}});
      assert.equal(h.result.hidden, false);
      assert.match(h.result.textContent, /нет подтверждённых актуальных данных/);
      assert.match(h.result.textContent, /официальной анкете/);
    }
  }
  assert.equal(h.goals('eligibility_check_completed').length, 6);
  assert.ok(!JSON.stringify(h.calls).includes('private city value'));
  assert.ok(!JSON.stringify([...h.storage]).includes('private city value'));
});

test('calculator subtracts user-entered expenses and tax, and supports a negative balance', () => {
  const h = harness({calculator:true});
  const numeric = text => Number(text.replace(/\s/g, ''));
  assert.equal(numeric(h.outputs.result.textContent), 41800);
  assert.equal(numeric(h.outputs.net.textContent), 37128);
  h.calc.elements.expenses.value = '50000';
  h.calc.input();
  assert.equal(numeric(h.outputs.net.textContent), -9872);
});
