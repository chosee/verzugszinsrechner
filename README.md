# Schweizer Verzugszinsrechner | Calculateur d'intérêts moratoires

🇩🇪 [Deutsch](#deutsch) | 🇫🇷 [Français](#français)

---

<a name="deutsch"></a>
## 🇩🇪 Deutsch

Berechne Verzugszinsen und Mahnkosten nach Schweizer Recht.

**[verzugszinsrechner.ch](https://verzugszinsrechner.ch)**

### Verfügbare Tools

| Tool | Beschreibung | Link |
|------|--------------|------|
| **Verzugszinsrechner** | Verzugszinsen nach OR Art. 104 | [/de/](https://verzugszinsrechner.ch/de/) |
| **Mahnrechner** | Mahnkosten und Inkassogebühren | [/de/mahnrechner.html](https://verzugszinsrechner.ch/de/mahnrechner.html) |

### Was ist Verzugszins?

Wer eine Geldschuld nicht rechtzeitig bezahlt, schuldet dem Gläubiger **Verzugszinsen**. Diese entschädigen für die verzögerte Zahlung.

### Gesetzlicher Zinssatz

Der **gesetzliche Verzugszins** beträgt **5% pro Jahr** (OR Art. 104 Abs. 1). Dieser Zinssatz gilt automatisch, wenn:
- Keine andere Vereinbarung besteht
- Keine höheren vertraglichen Zinsen vereinbart wurden

### Wann beginnt der Verzug?

Der Schuldner gerät in Verzug:
1. **Bei Verfalltag**: Am Tag nach dem vereinbarten Zahlungstermin
2. **Bei Mahnung**: Am Tag nach Zugang der Mahnung (OR Art. 102)
3. **Bei Klage**: Am Tag nach Zustellung der Betreibung oder Klage

### Berechnungsmethode

Der Rechner verwendet die **360-Tage-Methode** (kaufmännische Zinsmethode):

```
Verzugszins = Kapital × Zinssatz × Tage ÷ 360
```

### Zinseszinsverbot

Gemäss **OR Art. 105 Abs. 3** dürfen auf Verzugszinsen keine weiteren Verzugszinsen berechnet werden (Anatocismus-Verbot).

### Beispielrechnung

| Kapital | Zinssatz | Tage | Verzugszins |
|---------|----------|------|-------------|
| CHF 10'000 | 5% | 30 | CHF 41.67 |
| CHF 10'000 | 5% | 90 | CHF 125.00 |
| CHF 10'000 | 5% | 365 | CHF 506.94 |

---

<a name="français"></a>
## 🇫🇷 Français

Calculez les intérêts moratoires et frais de rappel selon le droit suisse.

**[verzugszinsrechner.ch](https://verzugszinsrechner.ch)**

### Outils disponibles

| Outil | Description | Lien |
|-------|-------------|------|
| **Intérêts moratoires** | Intérêts selon CO art. 104 | [/fr/](https://verzugszinsrechner.ch/fr/) |
| **Calculateur de rappel** | Frais de rappel et d'encaissement | [/fr/mahnrechner.html](https://verzugszinsrechner.ch/fr/mahnrechner.html) |

### Qu'est-ce que l'intérêt moratoire?

Celui qui ne paie pas une dette d'argent à temps doit au créancier des **intérêts moratoires**. Ils compensent le retard de paiement.

### Taux légal

Le **taux légal** des intérêts moratoires est de **5% par an** (CO art. 104 al. 1). Ce taux s'applique automatiquement si:
- Aucun autre accord n'existe
- Aucun taux contractuel plus élevé n'a été convenu

### Quand commence la demeure?

Le débiteur est en demeure:
1. **À l'échéance**: Le jour suivant la date de paiement convenue
2. **Par mise en demeure**: Le jour suivant la réception (CO art. 102)
3. **Par action**: Le jour suivant la notification de la poursuite ou de l'action

### Méthode de calcul

Le calculateur utilise la **méthode des 360 jours** (méthode commerciale):

```
Intérêt = Capital × Taux × Jours ÷ 360
```

### Interdiction de l'anatocisme

Selon **CO art. 105 al. 3**, il n'est pas dû d'intérêts moratoires sur les intérêts moratoires.

### Exemple de calcul

| Capital | Taux | Jours | Intérêts |
|---------|------|-------|----------|
| CHF 10'000 | 5% | 30 | CHF 41.67 |
| CHF 10'000 | 5% | 90 | CHF 125.00 |
| CHF 10'000 | 5% | 365 | CHF 506.94 |

---

## Technologie | Technologie

```
verzugszinsrechner/
├── index.html           # Spracherkennung / Détection de langue
├── de/
│   ├── index.html       # Verzugszinsrechner (DE)
│   └── mahnrechner.html # Mahnrechner (DE)
├── fr/
│   ├── index.html       # Intérêts moratoires (FR)
│   └── mahnrechner.html # Calculateur de rappel (FR)
├── css/styles.css       # Gemeinsame Styles / Styles partagés
├── scripts/
│   ├── calculations.js  # Berechnungslogik / Logique de calcul
│   ├── app.js           # UI-Logik / Logique UI
│   └── pdf-export.js    # PDF-Export (jsPDF)
├── images/              # OG-Bilder / Images OG (1200x630)
└── test.js              # Tests (node test.js)
```

- Vanilla HTML/CSS/JavaScript (kein Framework)
- Bilingue DE/FR avec détection automatique
- Aucun backend – calculs côté client
- PDF-Export direkt im Browser (keine Datenübertragung)
- Open Source

## Tests

```bash
node test.js  # 19/19 Tests bestanden / tests réussis
```

## Gesetzliche Grundlagen | Base légale

- **OR Art. 104**: Verzugszins / Intérêts moratoires
- **OR Art. 105**: Weiterer Schaden / Dommage supplémentaire
- **OR Art. 102**: Verzug des Schuldners / Demeure du débiteur

Fedlex-Links:
- [Art. 104 OR (DE)](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_104)
- [Art. 104 CO (FR)](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/fr#art_104)

## Haftungsausschluss | Avertissement

Dieser Rechner dient nur zur Orientierung. Für verbindliche Berechnungen konsultieren Sie einen Rechtsanwalt.

Ce calculateur sert uniquement d'orientation. Pour des calculs contraignants, consultez un avocat.

## Lizenz | Licence

MIT

---

[Durchblick Consultancy BV](https://durchblick.nl) • [Source Code](https://github.com/durchblick-nl/verzugszinsrechner)
