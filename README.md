# Курьерский сайт на Hugo

Современный лендинг для привлечения курьеров в Яндекс Еду с SEO-блогом и готовым деплоем на GitHub Pages.

## Где менять ссылку регистрации

Партнерская ссылка вынесена в `hugo.toml`:

```toml
[params]
  referral_url = "https://reg.eda.yandex.ru/..."
```

Все CTA-кнопки на сайте используют это значение.

## Локальный запуск

```bash
hugo server -D
```

## Сборка

```bash
hugo --gc --minify
```

## GitHub Pages

Workflow находится в `.github/workflows/hugo.yml`. После push в ветку `main` GitHub Actions установит Hugo, соберет сайт и опубликует его в GitHub Pages.

## Блог

Статьи лежат в `content/wiki/`. Для новой статьи можно создать Markdown-файл с front matter:

```md
---
title: "Название статьи"
date: 2026-06-02
description: "SEO-описание"
keywords: ["ключ", "ключевая фраза"]
---
```
