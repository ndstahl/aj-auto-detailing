/**
 * Sanitizes HTML to prevent XSS attacks in email templates
 * Escapes special HTML characters
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return ''

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Sanitizes a string to prevent injection attacks
 * Removes potentially dangerous characters
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return ''

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove angle brackets
}
