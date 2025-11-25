/**
 * Verzugszinsrechner - Application Logic
 */

let startDatePicker, endDatePicker;

// Save current language to localStorage for redirect
(function() {
    const lang = document.documentElement.lang || 'de';
    localStorage.setItem('verzugszins-lang', lang);
})();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const lang = document.documentElement.lang || 'de';

    // Flatpickr locale
    const locale = lang === 'fr' ? {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
            longhand: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        },
        months: {
            shorthand: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            longhand: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        },
    } : {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        },
        months: {
            shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        },
    };

    // Initialize date pickers
    startDatePicker = flatpickr("#startDate", {
        dateFormat: "d.m.Y",
        locale: locale
    });

    endDatePicker = flatpickr("#endDate", {
        dateFormat: "d.m.Y",
        defaultDate: new Date(),
        locale: locale
    });

    // Show disclaimer
    document.getElementById('disclaimerModal').style.display = 'block';
    document.querySelector('.container').style.pointerEvents = 'none';
    document.querySelector('.container').style.opacity = '0.5';

    // Format principal input on blur
    const principalInput = document.getElementById('principal');
    principalInput.addEventListener('blur', function() {
        const value = parseSwissNumber(this.value);
        if (!isNaN(value) && value > 0) {
            this.value = formatNumber(value, 2);
        }
    });
});

function acceptDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'none';
    document.querySelector('.container').style.pointerEvents = 'auto';
    document.querySelector('.container').style.opacity = '1';
}

function toggleCustomRate() {
    const rateType = document.getElementById('rateType').value;
    const customRateGroup = document.getElementById('customRateGroup');

    if (rateType === 'custom') {
        customRateGroup.style.display = 'block';
        document.getElementById('customRate').required = true;
    } else {
        customRateGroup.style.display = 'none';
        document.getElementById('customRate').required = false;
    }
}

// Form submission
document.getElementById('zinsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const lang = document.documentElement.lang || 'de';

    // Get principal
    const principalStr = document.getElementById('principal').value;
    const principal = parseSwissNumber(principalStr);

    if (isNaN(principal) || principal <= 0) {
        alert(lang === 'fr' ? 'Veuillez entrer un montant valide' : 'Bitte geben Sie einen gültigen Betrag ein');
        return;
    }

    // Get dates
    const startDate = startDatePicker.selectedDates[0];
    const endDate = endDatePicker.selectedDates[0];

    if (!startDate) {
        alert(lang === 'fr' ? 'Veuillez sélectionner la date de début' : 'Bitte wählen Sie das Verzugsdatum');
        return;
    }
    if (!endDate) {
        alert(lang === 'fr' ? 'Veuillez sélectionner la date de fin' : 'Bitte wählen Sie das Berechnungsdatum');
        return;
    }
    if (startDate >= endDate) {
        alert(lang === 'fr' ? 'La date de fin doit être après la date de début' : 'Das Berechnungsdatum muss nach dem Verzugsdatum liegen');
        return;
    }

    // Get interest rate
    const rateType = document.getElementById('rateType').value;
    let interestRate = 5; // Default OR Art. 104

    if (rateType === 'custom') {
        interestRate = parseFloat(document.getElementById('customRate').value);
        if (isNaN(interestRate) || interestRate <= 0) {
            alert(lang === 'fr' ? 'Veuillez entrer un taux valide' : 'Bitte geben Sie einen gültigen Zinssatz ein');
            return;
        }
    }

    // Calculate
    const result = calculateDefaultInterest(principal, startDate, endDate, interestRate);

    if (result.error) {
        alert(result.error);
        return;
    }

    displayResult(result);
});

// Globale Variable für PDF-Export
let lastCalculationResult = null;

function displayResult(result) {
    // Daten für PDF-Export speichern
    lastCalculationResult = result;

    const lang = document.documentElement.lang || 'de';
    const resultDiv = document.getElementById('result');
    const resultSummary = resultDiv.querySelector('.result-summary');

    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const locale = lang === 'fr' ? 'fr-CH' : 'de-CH';

    const labels = lang === 'fr' ? {
        title: 'Résultat du calcul',
        principal: 'Capital',
        period: 'Période',
        days: 'Nombre de jours',
        rate: 'Taux d\'intérêt',
        interest: 'Intérêts moratoires',
        total: 'Total (capital + intérêts)',
        method: 'Méthode de calcul',
        methodDesc: 'Année de 360 jours'
    } : {
        title: 'Berechnungsergebnis',
        principal: 'Kapital',
        period: 'Zeitraum',
        days: 'Anzahl Tage',
        rate: 'Zinssatz',
        interest: 'Verzugszins',
        total: 'Total (Kapital + Zins)',
        method: 'Berechnungsmethode',
        methodDesc: '360-Tage-Jahr'
    };

    resultSummary.innerHTML = `
        <h3>${labels.title}</h3>
        <div class="result-grid">
            <div class="result-row">
                <span class="result-label">${labels.principal}:</span>
                <span class="result-value">${formatCHF(result.principal)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">${labels.period}:</span>
                <span class="result-value">${result.startDate.toLocaleDateString(locale, dateOptions)} – ${result.endDate.toLocaleDateString(locale, dateOptions)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">${labels.days}:</span>
                <span class="result-value">${result.days}</span>
            </div>
            <div class="result-row">
                <span class="result-label">${labels.rate}:</span>
                <span class="result-value">${result.interestRate}% p.a.</span>
            </div>
            <div class="result-row highlight">
                <span class="result-label">${labels.interest}:</span>
                <span class="result-value">${formatCHF(result.interest)}</span>
            </div>
            <div class="result-row total">
                <span class="result-label">${labels.total}:</span>
                <span class="result-value">${formatCHF(result.total)}</span>
            </div>
        </div>
        <p class="result-method"><small>${labels.method}: ${labels.methodDesc}</small></p>
    `;

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function printResult() {
    const lang = document.documentElement.lang || 'de';
    const locale = lang === 'fr' ? 'fr-CH' : 'de-CH';
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const printDateEl = document.getElementById('printDate');
    if (printDateEl) {
        const prefix = lang === 'fr' ? 'Calculé le ' : 'Berechnet am ';
        printDateEl.textContent = prefix + new Date().toLocaleDateString(locale, dateOptions);
    }
    window.print();
}

function exportPDF() {
    if (!lastCalculationResult) {
        const lang = document.documentElement.lang || 'de';
        alert(lang === 'fr'
            ? 'Veuillez d\'abord effectuer un calcul.'
            : 'Bitte führen Sie zuerst eine Berechnung durch.');
        return;
    }

    const lang = document.documentElement.lang || 'de';

    if (typeof VerzugszinsPdfExport !== 'undefined') {
        VerzugszinsPdfExport.generatePDF(lastCalculationResult, lang);
    } else {
        printResult();
    }
}

// ============================================
// COPY & SHARE FUNCTIONS
// ============================================

function copyResultToClipboard() {
    if (!lastCalculationResult) return;

    const lang = document.documentElement.lang || 'de';
    const result = lastCalculationResult;
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const locale = lang === 'fr' ? 'fr-CH' : 'de-CH';

    let text;
    if (lang === 'fr') {
        text = `Calcul d'intérêts moratoires
Capital: ${formatCHF(result.principal)}
Période: ${result.startDate.toLocaleDateString(locale, dateOptions)} – ${result.endDate.toLocaleDateString(locale, dateOptions)}
Jours: ${result.days}
Taux: ${result.interestRate}% p.a.
Intérêts: ${formatCHF(result.interest)}
Total: ${formatCHF(result.total)}

Calculé sur verzugszinsrechner.ch`;
    } else {
        text = `Verzugszinsberechnung
Kapital: ${formatCHF(result.principal)}
Zeitraum: ${result.startDate.toLocaleDateString(locale, dateOptions)} – ${result.endDate.toLocaleDateString(locale, dateOptions)}
Tage: ${result.days}
Zinssatz: ${result.interestRate}% p.a.
Verzugszins: ${formatCHF(result.interest)}
Total: ${formatCHF(result.total)}

Berechnet auf verzugszinsrechner.ch`;
    }

    const button = document.querySelector('.copy-btn');
    ClipboardUtils.copy(text).then(success => {
        ClipboardUtils.showFeedback(button, success);
    });
}

function shareCalculation() {
    if (!lastCalculationResult) return;

    const result = lastCalculationResult;
    const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}.${m}.${y}`;
    };

    const params = {
        p: result.principal,
        s: formatDate(result.startDate),
        e: formatDate(result.endDate),
        r: result.interestRate
    };

    const button = document.querySelector('.share-btn');
    ShareUtils.shareUrl(params, button);
}

// ============================================
// URL PARAMETER HANDLING
// ============================================

function loadFromUrlParams() {
    const params = UrlParams.getAll();

    if (params.p) {
        const principal = parseFloat(params.p);
        if (!isNaN(principal)) {
            document.getElementById('principal').value = formatNumber(principal, 2);
        }
    }

    if (params.s && startDatePicker) {
        startDatePicker.setDate(params.s, false, 'd.m.Y');
    }

    if (params.e && endDatePicker) {
        endDatePicker.setDate(params.e, false, 'd.m.Y');
    }

    if (params.r) {
        const rate = parseFloat(params.r);
        if (!isNaN(rate)) {
            if (rate === 5) {
                document.getElementById('rateType').value = '5';
            } else {
                document.getElementById('rateType').value = 'custom';
                toggleCustomRate();
                document.getElementById('customRate').value = rate;
            }
        }
    }

    // Auto-calculate if all parameters present
    if (params.p && params.s && params.e) {
        setTimeout(() => {
            document.getElementById('zinsForm').dispatchEvent(new Event('submit'));
        }, 100);
    }
}

// Load URL parameters after flatpickr is initialized
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadFromUrlParams, 200);
});
