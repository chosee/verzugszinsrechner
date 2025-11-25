/**
 * Verzugszinsrechner - Calculation Functions
 * Swiss default interest calculations according to OR Art. 104-106
 */

/**
 * Calculate default interest (Verzugszins)
 * @param {number} principal - The principal amount (Kapital)
 * @param {Date} startDate - Start date of default (Verzugsbeginn)
 * @param {Date} endDate - End date for calculation
 * @param {number} interestRate - Annual interest rate (default 5% per OR Art. 104)
 * @returns {Object} Calculation result with details
 */
function calculateDefaultInterest(principal, startDate, endDate, interestRate = 5) {
    // Validate inputs
    if (principal <= 0) {
        return { error: 'Principal must be positive' };
    }
    if (startDate >= endDate) {
        return { error: 'End date must be after start date' };
    }

    // Calculate days
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((endDate - startDate) / msPerDay);

    // Calculate interest using actual/360 method (common in Swiss banking)
    // Alternative: actual/365 or actual/actual
    const dailyRate = interestRate / 100 / 360;
    const interest = principal * dailyRate * totalDays;

    // Round to 2 decimal places (Rappen)
    const roundedInterest = Math.round(interest * 100) / 100;
    const total = Math.round((principal + roundedInterest) * 100) / 100;

    return {
        principal: principal,
        startDate: startDate,
        endDate: endDate,
        days: totalDays,
        interestRate: interestRate,
        interest: roundedInterest,
        total: total,
        method: '360-day year'
    };
}

/**
 * Calculate compound interest with annual compounding
 * For cases where interest on interest is claimed (Zinseszins)
 * Note: In Swiss law, compound interest is generally not allowed (OR Art. 105 Abs. 3)
 * except in specific cases (e.g., current account agreements)
 */
function calculateCompoundInterest(principal, startDate, endDate, interestRate = 5) {
    if (principal <= 0) {
        return { error: 'Principal must be positive' };
    }
    if (startDate >= endDate) {
        return { error: 'End date must be after start date' };
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((endDate - startDate) / msPerDay);
    const years = totalDays / 365;

    // Compound interest formula: A = P(1 + r)^t
    const total = principal * Math.pow(1 + interestRate / 100, years);
    const interest = total - principal;

    return {
        principal: principal,
        startDate: startDate,
        endDate: endDate,
        days: totalDays,
        years: Math.round(years * 100) / 100,
        interestRate: interestRate,
        interest: Math.round(interest * 100) / 100,
        total: Math.round(total * 100) / 100,
        method: 'compound (annual)'
    };
}

/**
 * Format currency in Swiss Francs
 */
function formatCHF(amount) {
    return new Intl.NumberFormat('de-CH', {
        style: 'currency',
        currency: 'CHF',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Format number with Swiss formatting
 */
function formatNumber(num, decimals = 2) {
    return new Intl.NumberFormat('de-CH', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

/**
 * Parse Swiss formatted number string to number
 * Handles various apostrophe characters used as thousands separators
 */
function parseSwissNumber(str) {
    if (typeof str !== 'string') return str;
    // Remove all types of apostrophes, quotes, and spaces used as thousands separators
    // Then replace comma with dot for decimal
    return parseFloat(str.replace(/[''\u2019\u2018\u02BC\s]/g, '').replace(',', '.'));
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateDefaultInterest,
        calculateCompoundInterest,
        formatCHF,
        formatNumber,
        parseSwissNumber
    };
}
