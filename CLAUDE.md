# CLAUDE.md - Verzugszinsrechner

## Projektübersicht

Schweizer Verzugszinsrechner nach OR Art. 104-106. Bilingual (DE/FR), keine Backend-Abhängigkeit.

**Live:** https://verzugszinsrechner.ch

## Verfügbare Tools

| Tool | Beschreibung | Link |
|------|--------------|------|
| **Verzugszinsrechner** | Verzugszinsen nach OR Art. 104 | [verzugszinsrechner.ch/de/](https://verzugszinsrechner.ch/de/) |
| **Mahnrechner** | Mahnkosten und Inkassogebühren | [verzugszinsrechner.ch/de/mahnrechner.html](https://verzugszinsrechner.ch/de/mahnrechner.html) |

## Projektstruktur

```
verzugszinsrechner/
├── index.html              # Spracherkennung → Redirect zu /de/ oder /fr/
├── de/
│   ├── index.html          # Verzugszinsrechner (DE)
│   └── mahnrechner.html    # Mahnrechner (DE)
├── fr/
│   ├── index.html          # Intérêts moratoires (FR)
│   └── mahnrechner.html    # Calculateur de rappel (FR)
├── css/
│   └── styles.css          # Gemeinsame Styles
├── scripts/
│   ├── calculations.js     # Berechnungslogik
│   ├── app.js              # UI-Logik
│   └── pdf-export.js       # PDF-Export (jsPDF)
├── images/
│   ├── og-zins-de.png      # OG-Bild Deutsch (1200x630)
│   └── og-zins-fr.png      # OG-Bild Französisch (1200x630)
└── test.js                 # Tests (node test.js)
```

## Berechnungslogik

### Gesetzliche Grundlage

- **OR Art. 104**: Verzugszins 5% pro Jahr (gesetzlicher Satz)
- **OR Art. 105**: Weiterer Schaden
- **OR Art. 102**: Verzug des Schuldners

### Berechnungsmethode

Der Rechner verwendet die **360-Tage-Methode** (kaufmännische Zinsmethode):

```
Verzugszins = Kapital × Zinssatz × Tage ÷ 360
```

### Zinseszinsverbot (Anatocismus)

Gemäss **OR Art. 105 Abs. 3** dürfen auf Verzugszinsen keine weiteren Verzugszinsen berechnet werden.

### Mahnrechner

Berechnet zulässige Mahnkosten und zeigt rechtliche Grundlagen:

**Mahnkosten in der Schweiz:**
- **1. Mahnung**: Grundsätzlich kostenlos (Ingangsetzung des Verzugs)
- **2./3. Mahnung**: CHF 10-20 pro Mahnung als angemessen (BGer)
- **Inkassogebühren**: Nur zulässig wenn vertraglich vereinbart oder als Schadenersatz

**Rechtliche Grundlagen:**
- Mahnung als Verzugsbeginn (OR Art. 102)
- Schadenersatz bei Verzug (OR Art. 103)
- Ersatz von Inkassokosten nur bei nachgewiesenem Schaden

### Beispielrechnungen

| Kapital | Zinssatz | Tage | Verzugszins |
|---------|----------|------|-------------|
| CHF 10'000 | 5% | 30 | CHF 41.67 |
| CHF 10'000 | 5% | 90 | CHF 125.00 |
| CHF 10'000 | 5% | 365 | CHF 506.94 |

## Wichtige Funktionen

### scripts/calculations.js

| Funktion | Beschreibung |
|----------|--------------|
| `calculateDefaultInterest()` | Hauptberechnung: Verzugszins nach 360-Tage-Methode |
| `calculateCompoundInterest()` | Zinseszins (nur für Spezialfälle, da meist verboten) |
| `formatCHF()` | Formatiert Betrag als CHF |
| `formatNumber()` | Schweizer Zahlenformatierung |
| `parseSwissNumber()` | Parst Schweizer Zahlenformat |

### scripts/app.js

UI-Logik:
- Formularverarbeitung
- Datumsauswahl
- Ergebnisanzeige
- Disclaimer-Modal

### scripts/pdf-export.js

PDF-Export-Funktionalität (jsPDF):
- **VerzugszinsPdfExport**: Export für Verzugszinsberechnung
- **MahnrechnerPdfExport**: Export für Mahnkostenberechnung inkl. aller Mahnungen, Zinsen und Gesamtforderung
- Alle PDFs werden lokal im Browser erstellt (keine Serverübertragung)

## Tests

```bash
node test.js
```

Erwartet: 19/19 Tests bestanden

Testet:
- Grundlegende Zinsberechnung
- 360-Tage-Methode
- Validierung (negative Beträge, ungültige Daten)
- Formatierungsfunktionen
- Rundung auf Rappen

## Rechtliche Hinweise

### Verzugsbeginn

Der Schuldner gerät in Verzug:
1. **Bei Verfalltag**: Am Tag nach dem vereinbarten Zahlungstermin
2. **Bei Mahnung**: Am Tag nach Zugang der Mahnung (OR Art. 102)
3. **Bei Klage**: Am Tag nach Zustellung der Betreibung oder Klage

### Fedlex-Links

- [Art. 104 OR (DE)](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_104)
- [Art. 104 CO (FR)](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/fr#art_104)

## Deployment

Statische Seite, gehostet via Cloudflare Pages oder ähnlich.

Kein Build-Prozess nötig - direkt HTML/CSS/JS.

## Zusammengehörige Projekte

Dieses Projekt ist Teil einer Suite von Schweizer Rechtstools:

| Projekt | Beschreibung | URL |
|---------|--------------|-----|
| **gerichtskostenrechner** | Gerichtskosten für Zivilverfahren | [github.com/durchblick-nl/gerichtskostenrechner](https://github.com/durchblick-nl/gerichtskostenrechner) |
| **verzugszinsrechner** | Verzugszinsen nach OR 104 | [github.com/durchblick-nl/verzugszinsrechner](https://github.com/durchblick-nl/verzugszinsrechner) |
| **frist** | Fristenrechner (ZPO, OR, etc.) | [github.com/durchblick-nl/frist](https://github.com/durchblick-nl/frist) |

Alle drei Projekte:
- Bilingual (DE/FR)
- Vanilla HTML/CSS/JS (kein Framework)
- Client-side Berechnungen (kein Backend)
- Open Source

## Kontakt

[Durchblick Consultancy BV](https://durchblick.nl)
