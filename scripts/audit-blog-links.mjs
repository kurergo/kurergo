import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const blogDir = "content/blog";

const generatedTopics = [
  ["zarabotok", "seo-01-skolko-zarabatyvaet-kurier-yandex-2026-regiony"],
  ["zarabotok", "seo-02-kurier-yandex-edy-zarabotok-den-nedelya-mesyac"],
  ["zarabotok", "seo-03-peshij-kurier-yandexa-realnyj-zarabotok"],
  ["zarabotok", "seo-04-skolko-platyat-kureram-yandexa-za-odin-zakaz"],
  ["zarabotok", "seo-05-dohod-kuriera-na-velosipede-yandex"],
  ["zarabotok", "seo-06-kak-uvelichit-zarabotok-kuriera-yandexa"],
  ["zarabotok", "seo-07-skolko-zarabatyvaet-kurier-na-lichnom-avtomobile"],
  ["rabota", "seo-08-kak-stat-kurierom-yandexa-za-odin-den"],
  ["rabota", "seo-09-poshagovaya-instrukciya-ustroitsya-kurierom-yandex"],
  ["rabota", "seo-10-dokumenty-dlya-raboty-kurierom-yandexa"],
  ["rabota", "seo-11-samozanyatyj-kurier-yandexa-plyusy-minusy"],
  ["rabota", "seo-12-rabota-kurierom-yandex-eda-bez-opyta"],
  ["rabota", "seo-13-kak-bystro-projti-registraciyu-v-yandex-pro"],
  ["rabota", "seo-14-stoit-li-ustraivatsya-kurierom-yandex-2026"],
  ["vozrast", "seo-15-so-skolki-let-mozhno-rabotat-kurierom-yandexa"],
  ["vozrast", "seo-16-mozhno-li-stat-kurierom-yandexa-v-16-let"],
  ["vozrast", "seo-17-rabota-dlya-studentov-kurier-yandex-edy"],
  ["vozrast", "seo-18-podrabotka-kurierom-posle-ucheby"],
  ["otzyvy", "seo-19-rabota-kurierom-yandexa-chestnye-otzyvy"],
  ["otzyvy", "seo-20-chto-govoryat-kuriery-o-rabote-v-yandexe"],
  ["otzyvy", "seo-21-pyat-glavnyh-plyusov-raboty-kurierom-yandexa"],
  ["otzyvy", "seo-22-minusy-raboty-kurierom-yandexa"],
  ["eda", "seo-23-kak-stat-kurierom-yandex-edy-i-nachat-zarabatyvat"],
  ["eda", "seo-24-peshij-kurier-yandex-edy-instrukciya"],
  ["eda", "seo-25-skolko-zakazov-vypolnyaet-kurier-yandex-edy"],
  ["eda", "seo-26-kurier-yandex-edy-ili-samokat-gde-vyshe-dohod"],
  ["eda", "seo-27-kak-vybrat-luchshij-rajon-yandex-edy"],
  ["dostavka", "seo-28-rabota-v-yandex-dostavke-skolko-zarabotat"],
  ["dostavka", "seo-29-kurier-na-lichnom-avto-yandex-dostavka"],
  ["dostavka", "seo-30-kurier-na-velosipede-ili-avtomobile"],
  ["dostavka", "seo-31-kak-poluchat-bolshe-zakazov-yandex-dostavka"],
  ["gorod", "seo-32-rabota-kurierom-yandexa-v-moskve"],
  ["gorod", "seo-33-kurier-yandexa-v-sankt-peterburge"],
  ["gorod", "seo-34-rabota-kurierom-v-ekaterinburge"],
  ["gorod", "seo-35-kurier-yandexa-v-novosibirske"],
  ["gorod", "seo-36-rabota-kurierom-v-kazani-otzyvy"],
  ["gorod", "seo-37-skolko-zarabatyvaet-kurier-yandexa-v-krasnodare"],
  ["gorod", "seo-38-rabota-kurierom-v-nizhnem-novgorode"],
  ["gorod", "seo-39-kurier-yandexa-v-samare-vakansii-2026"],
  ["gorod", "seo-40-rabota-kurierom-v-rostove-na-donu"],
  ["gorod", "seo-41-kurier-yandexa-v-chelyabinske"],
  ["gorod", "seo-42-rabota-kurierom-v-ufe"],
  ["gorod", "seo-43-kurier-yandexa-v-omske"],
  ["gorod", "seo-44-rabota-kurierom-v-permi"],
  ["gorod", "seo-45-kurier-yandexa-v-volgograde"],
  ["gorod", "seo-46-skolko-poluchaet-kurier-yandexa-v-krasnoyarske"],
  ["conversion", "seo-47-sem-prichin-stat-kurierom-yandexa"],
  ["conversion", "seo-48-kak-zarabotat-pervye-100000-kurierom-yandexa"],
  ["conversion", "seo-49-rabota-kurierom-bez-opyta-gid-novichka"],
  ["conversion", "seo-50-kurier-yandexa-2026-polnyj-obzor-professii"],
];

const clusterBySlug = new Map(generatedTopics.map(([cluster, slug]) => [slug, cluster]));
const hubBySlug = new Map([
  ["skolko-zarabatyvaet-kurier-yandex-2026", "zarabotok"],
  ["rabota-kurierom-yandex-registraciya", "rabota"],
  ["so-skolki-let-yandex-kurier-trebovaniya", "vozrast"],
  ["yandex-kurier-otzyvy-plyusy-minusy", "otzyvy"],
  ["yandex-eda-kurier-polnyj-gid", "eda"],
  ["yandex-dostavka-kurier-avto-velo", "dostavka"],
  ["yandex-kurier-goroda-millionniki", "gorod"],
]);

for (const [slug, cluster] of hubBySlug) {
  clusterBySlug.set(slug, cluster);
}

const files = (await readdir(blogDir)).filter((file) => file.endsWith(".md") && file !== "_index.md");
const slugs = new Set(files.map((file) => file.replace(/\.md$/, "")));
const graph = new Map();
const titles = new Map();

for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  const text = await readFile(path.join(blogDir, file), "utf8");
  titles.set(slug, text.match(/^title:\s*"([^"]+)"/m)?.[1] ?? slug);
  const links = [...text.matchAll(/\]\(\/blog\/([^)#/]+)\/?\)/g)].map((match) => match[1]);
  graph.set(slug, [...new Set(links)]);
}

const broken = [];
const incoming = new Map([...slugs].map((slug) => [slug, 0]));
const incomingFrom = new Map([...slugs].map((slug) => [slug, []]));

for (const [from, links] of graph) {
  for (const to of links) {
    if (!slugs.has(to)) {
      broken.push([from, to]);
      continue;
    }
    incoming.set(to, incoming.get(to) + 1);
    incomingFrom.get(to).push(from);
  }
}

const generatedSlugs = [...clusterBySlug.keys()].filter((slug) => slug.startsWith("seo-"));
const clusterStats = {};
for (const slug of generatedSlugs) {
  const cluster = clusterBySlug.get(slug);
  const links = graph.get(slug) ?? [];
  const internal = links.filter((to) => clusterBySlug.get(to) === cluster).length;
  const cross = links.filter((to) => clusterBySlug.has(to) && clusterBySlug.get(to) !== cluster).length;
  const hub = links.filter((to) => hubBySlug.has(to)).length;
  clusterStats[cluster] ??= { pages: 0, internal: 0, cross: 0, hub: 0, outgoing: 0 };
  clusterStats[cluster].pages += 1;
  clusterStats[cluster].internal += internal;
  clusterStats[cluster].cross += cross;
  clusterStats[cluster].hub += hub;
  clusterStats[cluster].outgoing += links.length;
}

const orphanGenerated = generatedSlugs.filter((slug) => incoming.get(slug) === 0);
const lowIncomingGenerated = generatedSlugs.filter((slug) => incoming.get(slug) < 2);
const oldNoOutgoing = [...slugs].filter((slug) => !slug.startsWith("seo-") && slug !== "_index" && (graph.get(slug) ?? []).length === 0);

console.log(JSON.stringify({
  pages: slugs.size,
  broken,
  orphanGenerated: orphanGenerated.map((slug) => [slug, titles.get(slug)]),
  lowIncomingGenerated: lowIncomingGenerated.map((slug) => [slug, incoming.get(slug), titles.get(slug)]),
  oldNoOutgoing: oldNoOutgoing.map((slug) => [slug, titles.get(slug)]),
  clusterStats,
  minOutgoing: Math.min(...[...graph.values()].map((links) => links.length)),
  maxOutgoing: Math.max(...[...graph.values()].map((links) => links.length)),
  minIncoming: Math.min(...[...incoming.values()]),
  maxIncoming: Math.max(...[...incoming.values()]),
}, null, 2));
