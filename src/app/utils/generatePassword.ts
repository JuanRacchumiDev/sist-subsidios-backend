import generate from 'generate-password';

/**
 * @function generateTemporaryPassword
 * @description Genera una contraseña temporal segura.
 * @returns {string} La contraseña temporal generada.
 */
export const generateTemporaryPassword = (): string => {
    return generate.generate({
        length: 12,
        numbers: true,
        symbols: false,
        uppercase: false,
        lowercase: true,
        strict: false // Garantiza que incluya al menos un carácter de cada tipo
    });
};