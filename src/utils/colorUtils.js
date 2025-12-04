/**
 * ISPU Color Utility
 * Centralized color management for ISPU categories
 */

// ISPU Category Color Constants
export const ISPU_COLORS = {
    BAIK: '#00e400',           // Green (0-50)
    SEDANG: '#0000FF',         // Blue (51-100)
    TIDAK_SEHAT: '#eebb00',    // Yellow/Gold (101-200)
    SANGAT_TIDAK_SEHAT: '#ff0000', // Red (201-300)
    BERBAHAYA: '#8f3f97'       // Purple (300+)
};

// ISPU Category Names
export const ISPU_CATEGORIES = {
    BAIK: 'BAIK',
    SEDANG: 'SEDANG',
    TIDAK_SEHAT: 'TIDAK SEHAT',
    SANGAT_TIDAK_SEHAT: 'SANGAT TIDAK SEHAT',
    BERBAHAYA: 'BERBAHAYA'
};

// ISPU Category Ranges
export const ISPU_RANGES = {
    BAIK: { min: 0, max: 50 },
    SEDANG: { min: 51, max: 100 },
    TIDAK_SEHAT: { min: 101, max: 200 },
    SANGAT_TIDAK_SEHAT: { min: 201, max: 300 },
    BERBAHAYA: { min: 301, max: Infinity }
};

/**
 * Get ISPU color based on value
 * @param {number} ispu - ISPU value
 * @returns {string} Hex color code
 */
export const getISPUColor = (ispu) => {
    const value = Number(ispu) || 0;

    if (value <= 50) return ISPU_COLORS.BAIK;
    if (value <= 100) return ISPU_COLORS.SEDANG;
    if (value <= 200) return ISPU_COLORS.TIDAK_SEHAT;
    if (value <= 300) return ISPU_COLORS.SANGAT_TIDAK_SEHAT;
    return ISPU_COLORS.BERBAHAYA;
};

/**
 * Get ISPU category name based on value
 * @param {number} ispu - ISPU value
 * @returns {string} Category name
 */
export const getISPUCategory = (ispu) => {
    const value = Number(ispu) || 0;

    if (value <= 50) return ISPU_CATEGORIES.BAIK;
    if (value <= 100) return ISPU_CATEGORIES.SEDANG;
    if (value <= 200) return ISPU_CATEGORIES.TIDAK_SEHAT;
    if (value <= 300) return ISPU_CATEGORIES.SANGAT_TIDAK_SEHAT;
    return ISPU_CATEGORIES.BERBAHAYA;
};

/**
 * Get ISPU category details (color and name)
 * @param {number} ispu - ISPU value
 * @returns {object} { color: string, category: string }
 */
export const getISPUDetails = (ispu) => {
    return {
        color: getISPUColor(ispu),
        category: getISPUCategory(ispu)
    };
};

/**
 * Validate if value is in the expected ISPU range
 * @param {number} ispu - ISPU value
 * @returns {boolean} True if valid
 */
export const isValidISPU = (ispu) => {
    const value = Number(ispu);
    return !isNaN(value) && value >= 0 && value <= 1000;
};

/**
 * Get all category definitions for legend/documentation
 * @returns {array} Array of category objects
 */
export const getAllCategories = () => {
    return [
        {
            name: ISPU_CATEGORIES.BAIK,
            color: ISPU_COLORS.BAIK,
            range: ISPU_RANGES.BAIK,
            description: 'Kualitas udara sangat baik, tidak memberikan efek negatif terhadap manusia, hewan, dan tumbuhan'
        },
        {
            name: ISPU_CATEGORIES.SEDANG,
            color: ISPU_COLORS.SEDANG,
            range: ISPU_RANGES.SEDANG,
            description: 'Kualitas udara yang dapat diterima, namun beberapa polutan mungkin sedang pada tingkat sedang'
        },
        {
            name: ISPU_CATEGORIES.TIDAK_SEHAT,
            color: ISPU_COLORS.TIDAK_SEHAT,
            range: ISPU_RANGES.TIDAK_SEHAT,
            description: 'Mulai memberikan efek negatif pada manusia, hewan dan tumbuhan yang sensitif'
        },
        {
            name: ISPU_CATEGORIES.SANGAT_TIDAK_SEHAT,
            color: ISPU_COLORS.SANGAT_TIDAK_SEHAT,
            range: ISPU_RANGES.SANGAT_TIDAK_SEHAT,
            description: 'Tingkat kualitas udara yang merugikan kesehatan pada sejumlah segmen populasi yang terpapar'
        },
        {
            name: ISPU_CATEGORIES.BERBAHAYA,
            color: ISPU_COLORS.BERBAHAYA,
            range: ISPU_RANGES.BERBAHAYA,
            description: 'Tingkat kualitas udara berbahaya yang bersifat merugikan kesehatan serius pada populasi'
        }
    ];
};

export default {
    ISPU_COLORS,
    ISPU_CATEGORIES,
    ISPU_RANGES,
    getISPUColor,
    getISPUCategory,
    getISPUDetails,
    isValidISPU,
    getAllCategories
};
