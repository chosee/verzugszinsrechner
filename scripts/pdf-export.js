/**
 * Verzugszinsrechner - PDF Export
 * Generiert professionelle PDF-Dokumente mit jsPDF
 */

const VerzugszinsPdfExport = {
    generatePDF(data, lang = 'de') {
        if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            console.error('jsPDF nicht geladen');
            window.print();
            return;
        }

        const { jsPDF } = window.jspdf || window;
        const doc = new jsPDF();
        const texts = this.getTexts(lang);

        const primaryColor = [63, 96, 111];
        const accentColor = [204, 92, 83];

        let y = 20;

        // Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(texts.title, 15, 15);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(texts.subtitle, 15, 22);

        doc.text(`${texts.date}: ${this.formatDate(new Date(), lang)}`, 195, 15, { align: 'right' });

        y = 40;

        // Eingabedaten
        doc.setTextColor(0, 0, 0);
        y = this.addSectionHeader(doc, texts.inputData, y, primaryColor);

        const inputLines = [
            [texts.principal, this.formatCHF(data.principal)],
            [texts.startDate, this.formatDate(data.startDate, lang)],
            [texts.endDate, this.formatDate(data.endDate, lang)],
            [texts.rate, `${data.interestRate}% p.a.`],
            [texts.days, `${data.days} ${lang === 'fr' ? 'jours' : 'Tage'}`]
        ];

        y = this.addTable(doc, inputLines, 15, y);
        y += 10;

        // Ergebnis
        y = this.addSectionHeader(doc, texts.result, y, primaryColor);

        // Verzugszins
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, y, 180, 35, 3, 3, 'F');

        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(texts.interest, 25, y + 10);

        doc.setFontSize(14);
        doc.setTextColor(...accentColor);
        doc.text(this.formatCHF(data.interest), 190, y + 10, { align: 'right' });

        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.text(texts.total, 25, y + 25);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(this.formatCHF(data.total), 190, y + 25, { align: 'right' });

        y += 45;

        // Berechnungsdetails
        y = this.addSectionHeader(doc, texts.calculation, y, primaryColor);

        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');

        const formula = lang === 'fr'
            ? `${this.formatCHF(data.principal)} x ${data.interestRate}% x ${data.days} / 360 = ${this.formatCHF(data.interest)}`
            : `${this.formatCHF(data.principal)} x ${data.interestRate}% x ${data.days} / 360 = ${this.formatCHF(data.interest)}`;

        doc.text(texts.method + ': ' + texts.methodDesc, 15, y);
        y += 6;
        doc.text(texts.formula + ': ' + formula, 15, y);

        y += 15;

        // Rechtliche Grundlagen
        y = this.addSectionHeader(doc, texts.legalBasis, y, primaryColor);

        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);

        const legalLines = lang === 'fr' ? [
            'CO Art. 104: Taux d\'intérêt moratoire de 5% par an',
            'CO Art. 105: Dommages supplémentaires',
            'CO Art. 105 al. 3: Interdiction des intérêts composés'
        ] : [
            'OR Art. 104: Verzugszins von 5% pro Jahr',
            'OR Art. 105: Weiterer Schaden',
            'OR Art. 105 Abs. 3: Zinseszinsverbot'
        ];

        legalLines.forEach(line => {
            doc.text(line, 15, y);
            y += 5;
        });

        y += 10;

        // Footer
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.text(texts.disclaimer, 15, y);
        doc.text('verzugszinsrechner.ch - ' + texts.footerInfo, 15, y + 4);

        const filename = `Verzugszins_${this.formatDateFile(new Date())}.pdf`;
        doc.save(filename);
    },

    addSectionHeader(doc, title, y, color) {
        doc.setFillColor(...color);
        doc.rect(15, y, 3, 7, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 22, y + 5);
        return y + 12;
    },

    addTable(doc, rows, x, y) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        rows.forEach(row => {
            doc.text(row[0], x, y);
            doc.setFont('helvetica', 'bold');
            doc.text(row[1], 190, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            y += 6;
        });
        return y;
    },

    formatCHF(amount) {
        return 'CHF ' + amount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    formatDate(date, lang) {
        if (!date) return '-';
        if (typeof date === 'string') date = new Date(date);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString(lang === 'fr' ? 'fr-CH' : 'de-CH', options);
    },

    formatDateFile(date) {
        if (!date) date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    getTexts(lang) {
        if (lang === 'fr') {
            return {
                title: 'Calcul d\'intérêts moratoires',
                subtitle: 'Selon le CO suisse Art. 104',
                date: 'Date',
                inputData: 'Données saisies',
                principal: 'Capital',
                startDate: 'Début du retard',
                endDate: 'Date de calcul',
                rate: 'Taux d\'intérêt',
                days: 'Nombre de jours',
                result: 'Résultat',
                interest: 'Intérêts moratoires:',
                total: 'Total (capital + intérêts):',
                calculation: 'Détails du calcul',
                method: 'Méthode',
                methodDesc: 'Année de 360 jours',
                formula: 'Formule',
                legalBasis: 'Base légale',
                disclaimer: 'Ce document sert uniquement d\'orientation. Pas de conseil juridique.',
                footerInfo: 'Calculateur d\'intérêts moratoires selon le CO suisse'
            };
        }
        return {
            title: 'Verzugszinsberechnung',
            subtitle: 'Nach Schweizer OR Art. 104',
            date: 'Datum',
            inputData: 'Eingabedaten',
            principal: 'Kapital',
            startDate: 'Verzugsbeginn',
            endDate: 'Berechnungsdatum',
            rate: 'Zinssatz',
            days: 'Anzahl Tage',
            result: 'Ergebnis',
            interest: 'Verzugszins:',
            total: 'Total (Kapital + Zins):',
            calculation: 'Berechnungsdetails',
            method: 'Methode',
            methodDesc: '360-Tage-Jahr',
            formula: 'Formel',
            legalBasis: 'Rechtliche Grundlagen',
            disclaimer: 'Dieses Dokument dient nur zur Orientierung. Keine Rechtsberatung.',
            footerInfo: 'Verzugszinsrechner nach Schweizer Obligationenrecht'
        };
    }
};

/**
 * Mahnrechner PDF Export
 */
const MahnrechnerPdfExport = {
    generatePDF(data, lang = 'de') {
        if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            console.error('jsPDF nicht geladen');
            window.print();
            return;
        }

        const { jsPDF } = window.jspdf || window;
        const doc = new jsPDF();
        const texts = this.getTexts(lang);

        const primaryColor = [63, 96, 111];
        const accentColor = [204, 92, 83];

        let y = 20;

        // Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(texts.title, 15, 15);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(texts.subtitle, 15, 22);

        doc.text(`${texts.date}: ${this.formatDate(new Date(), lang)}`, 195, 15, { align: 'right' });

        y = 40;

        // Eingabedaten
        doc.setTextColor(0, 0, 0);
        y = this.addSectionHeader(doc, texts.inputData, y, primaryColor);

        const inputLines = [
            [texts.principal, this.formatCHF(data.principal)],
            [texts.reminderCount, data.reminderCount.toString()]
        ];

        y = this.addTable(doc, inputLines, 15, y);
        y += 10;

        // Ergebnis
        y = this.addSectionHeader(doc, texts.result, y, primaryColor);

        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, y, 180, 35, 3, 3, 'F');

        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(texts.reminderFees, 25, y + 10);

        doc.setFontSize(14);
        doc.setTextColor(...accentColor);
        doc.text(this.formatCHF(data.reminderFees), 190, y + 10, { align: 'right' });

        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.text(texts.total, 25, y + 25);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(this.formatCHF(data.total), 190, y + 25, { align: 'right' });

        y += 45;

        // Footer
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.text(texts.disclaimer, 15, y);
        doc.text('verzugszinsrechner.ch - ' + texts.footerInfo, 15, y + 4);

        const filename = `Mahnkosten_${this.formatDateFile(new Date())}.pdf`;
        doc.save(filename);
    },

    addSectionHeader(doc, title, y, color) {
        doc.setFillColor(...color);
        doc.rect(15, y, 3, 7, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 22, y + 5);
        return y + 12;
    },

    addTable(doc, rows, x, y) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        rows.forEach(row => {
            doc.text(row[0], x, y);
            doc.setFont('helvetica', 'bold');
            doc.text(row[1], 190, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            y += 6;
        });
        return y;
    },

    formatCHF(amount) {
        return 'CHF ' + amount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    formatDate(date, lang) {
        if (!date) return '-';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString(lang === 'fr' ? 'fr-CH' : 'de-CH', options);
    },

    formatDateFile(date) {
        if (!date) date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    getTexts(lang) {
        if (lang === 'fr') {
            return {
                title: 'Calcul des frais de rappel',
                subtitle: 'Frais de rappel et d\'encaissement',
                date: 'Date',
                inputData: 'Données saisies',
                principal: 'Montant de la créance',
                reminderCount: 'Nombre de rappels',
                result: 'Résultat',
                reminderFees: 'Frais de rappel:',
                total: 'Total à payer:',
                disclaimer: 'Ce document sert uniquement d\'orientation. Pas de conseil juridique.',
                footerInfo: 'Calculateur de frais de rappel'
            };
        }
        return {
            title: 'Mahnkostenberechnung',
            subtitle: 'Mahnkosten und Inkassogebühren',
            date: 'Datum',
            inputData: 'Eingabedaten',
            principal: 'Forderungsbetrag',
            reminderCount: 'Anzahl Mahnungen',
            result: 'Ergebnis',
            reminderFees: 'Mahnkosten:',
            total: 'Total zu zahlen:',
            disclaimer: 'Dieses Dokument dient nur zur Orientierung. Keine Rechtsberatung.',
            footerInfo: 'Mahnkostenrechner'
        };
    }
};

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VerzugszinsPdfExport, MahnrechnerPdfExport };
}
