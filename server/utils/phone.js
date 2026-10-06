// Проверка телефона в заявках: отсекает мусор вроде 9999999999
export function isValidPhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '')

  // Российский формат: 11 цифр, начинается с 7 или 8 — берём 10 цифр после кода страны
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    digits = digits.slice(1)
    if ('0125'.includes(digits[0])) return false
  }

  if (digits.length < 7 || digits.length > 15) return false

  // Одна-две разные цифры на весь номер
  if (new Set(digits).size <= 2) return false

  // Последовательности
  const asc = '0123456789012345'
  const desc = '9876543210987654'
  if (asc.includes(digits) || desc.includes(digits)) return false

  return true
}
