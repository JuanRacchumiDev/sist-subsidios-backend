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
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true // Garantiza que incluya al menos un carácter de cada tipo
    });
};