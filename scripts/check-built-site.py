"""Check conversion routes, registration links and preserved existing HTML paths.

Run after Hugo: python3 scripts/check-built-site.py /absolute/build/directory
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import subprocess
import sys
import tomllib
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'public').resolve()
config = tomllib.loads(Path('hugo.toml').read_text())['params']
errors = []

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = set()
        self.canonical = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a':
            self.links.append(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')

    def handle_endtag(self, tag):
        pass

tracked = subprocess.check_output(['git', 'ls-files', 'public'], text=True).splitlines()
existing = [Path(p).relative_to('public') for p in tracked if p.endswith('.html')]
for rel in existing:
    if not (root / rel).exists():
        errors.append(f'Missing existing HTML URL: {rel}')

routes = ['index.html', 'lp/rabota-kurerom/index.html', 'start/index.html', 'privacy/index.html', 'terms/index.html', 'goroda/moskva/index.html', 'rabota_peshim_kurerom.html']
for rel in routes:
    file = root / rel
    if not file.exists():
        errors.append(f'Missing route: {rel}')
        continue
    page = Page(file.read_text())
    if not page.canonical or not page.canonical.startswith('https://kurergo.ru/'):
        errors.append(f'Incorrect canonical: {rel}')
    for a in page.links:
        href = a.get('href', '')
        if 'data-registration-cta' in a and href != config['registration_redirect_url']:
            errors.append(f'Non-central registration CTA in {rel}: {href}')
        url = urlsplit(href)
        if url.scheme or url.netloc or not url.path:
            continue
        target = unquote(url.path).lstrip('/')
        target_path = root / target
        if not (target_path.is_file() or (target_path / 'index.html').is_file()):
            errors.append(f'Broken internal link in {rel}: {href}')
    for script in re.findall(r'<script[^>]+type=[\"\']?application/ld\+json[\"\']?[^>]*>(.*?)</script>', file.read_text(), re.S):
        try:
            json.loads(script)
        except json.JSONDecodeError as e:
            errors.append(f'Invalid JSON-LD in {rel}: {e}')

redirect = (root / 'go/yandex-courier/index.html').read_text()
redirect_page = Page(redirect)
manual = next(a for a in redirect_page.links if 'data-manual-redirect' in a)
if manual.get('href') != config['referral_url']:
    errors.append('Partner URL was changed in redirect')
if 'registration_click_unique' in redirect:
    errors.append('Redirect must not emit a duplicate unique click')
ET.parse(root / 'sitemap.xml')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'OK: {len(existing)} existing HTML paths preserved; {len(routes)} representative routes, internal links, CTA targets, JSON-LD, sitemap and partner code checked.')
