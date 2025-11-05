/**
 * Business logic validation utilities
 */

/**
 * Validate if a date is in the future
 * @param {Date|string} date - Date to validate
 * @returns {boolean} - True if date is in the future
 */
const isDataValida = (date) => {
  const inputDate = new Date(date);
  const now = new Date();
  
  // Reset time to compare only dates
  now.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  
  return inputDate > now;
};

/**
 * Calculate campaign progress percentage
 * @param {number} valorAtual - Current amount raised
 * @param {number} metaArrecadacao - Target amount
 * @returns {number} - Progress percentage (0-100)
 */
const calcularProgressoCampanha = (valorAtual, metaArrecadacao) => {
  if (!metaArrecadacao || metaArrecadacao <= 0) {
    return 0;
  }
  
  const progress = (valorAtual / metaArrecadacao) * 100;
  return Math.min(progress, 100); // Cap at 100%
};

/**
 * Determine campaign status based on current values
 * @param {Object} campanha - Campaign object
 * @returns {string} - Campaign status ('ativa', 'concluida', 'expirada')
 */
const determinarStatusCampanha = (campanha) => {
  const { valor_atual, meta_arrecadacao, data_limite, status } = campanha;
  
  // If manually set to cancelled, keep it
  if (status === 'cancelada') {
    return 'cancelada';
  }
  
  // Check if campaign has reached its goal
  if (valor_atual >= meta_arrecadacao) {
    return 'concluida';
  }
  
  // Check if campaign has expired
  const now = new Date();
  const deadline = new Date(data_limite);
  
  if (deadline < now) {
    return 'expirada';
  }
  
  return 'ativa';
};

/**
 * Format currency value for display
 * @param {number} value - Numeric value
 * @returns {string} - Formatted currency string
 */
const formatarMoeda = (value) => {
  if (typeof value !== 'number') {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Validate donation amount
 * @param {number} valor - Donation amount
 * @returns {boolean} - True if valid donation amount
 */
const validarValorDoacao = (valor) => {
  return typeof valor === 'number' && valor > 0 && valor <= 1000000; // Max 1M
};

module.exports = {
  isDataValida,
  calcularProgressoCampanha,
  determinarStatusCampanha,
  formatarMoeda,
  validarValorDoacao
};