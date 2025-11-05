/**
 * Unit tests for utility validation functions
 */

const {
  isDataValida,
  calcularProgressoCampanha,
  determinarStatusCampanha,
  formatarMoeda,
  validarValorDoacao
} = require('../../utils/validators');

describe('Validators Utility Functions', () => {
  describe('isDataValida', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      expect(isDataValida(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isDataValida(pastDate)).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isDataValida(today)).toBe(false);
    });

    it('should handle string dates', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      expect(isDataValida(futureDate)).toBe(true);
    });
  });

  describe('calcularProgressoCampanha', () => {
    it('should calculate correct progress percentage', () => {
      expect(calcularProgressoCampanha(250, 1000)).toBe(25);
      expect(calcularProgressoCampanha(500, 1000)).toBe(50);
      expect(calcularProgressoCampanha(750, 1000)).toBe(75);
    });

    it('should return 100 when goal is reached', () => {
      expect(calcularProgressoCampanha(1000, 1000)).toBe(100);
    });

    it('should cap at 100% when exceeded', () => {
      expect(calcularProgressoCampanha(1500, 1000)).toBe(100);
    });

    it('should return 0 for invalid meta_arrecadacao', () => {
      expect(calcularProgressoCampanha(100, 0)).toBe(0);
      expect(calcularProgressoCampanha(100, null)).toBe(0);
      expect(calcularProgressoCampanha(100, undefined)).toBe(0);
    });
  });

  describe('determinarStatusCampanha', () => {
    it('should return "concluida" when goal is reached', () => {
      const campanha = {
        valor_atual: 1000,
        meta_arrecadacao: 1000,
        data_limite: new Date(Date.now() + 86400000),
        status: 'ativa'
      };
      expect(determinarStatusCampanha(campanha)).toBe('concluida');
    });

    it('should return "expirada" when deadline has passed', () => {
      const campanha = {
        valor_atual: 500,
        meta_arrecadacao: 1000,
        data_limite: new Date('2020-01-01'),
        status: 'ativa'
      };
      expect(determinarStatusCampanha(campanha)).toBe('expirada');
    });

    it('should return "ativa" for ongoing campaigns', () => {
      const campanha = {
        valor_atual: 500,
        meta_arrecadacao: 1000,
        data_limite: new Date(Date.now() + 86400000),
        status: 'ativa'
      };
      expect(determinarStatusCampanha(campanha)).toBe('ativa');
    });

    it('should preserve "cancelada" status', () => {
      const campanha = {
        valor_atual: 500,
        meta_arrecadacao: 1000,
        data_limite: new Date(Date.now() + 86400000),
        status: 'cancelada'
      };
      expect(determinarStatusCampanha(campanha)).toBe('cancelada');
    });
  });

  describe('formatarMoeda', () => {
    it('should format currency correctly', () => {
      expect(formatarMoeda(1000)).toContain('R$');
      expect(formatarMoeda(1000)).toContain('1.000');
      expect(formatarMoeda(50.5)).toContain('50,50');
      expect(formatarMoeda(0)).toContain('0,00');
    });

    it('should handle invalid values', () => {
      expect(formatarMoeda(null)).toContain('R$');
      expect(formatarMoeda(null)).toContain('0,00');
      expect(formatarMoeda(undefined)).toContain('R$');
      expect(formatarMoeda('invalid')).toContain('R$');
    });
  });

  describe('validarValorDoacao', () => {
    it('should return true for valid donation amounts', () => {
      expect(validarValorDoacao(10)).toBe(true);
      expect(validarValorDoacao(100.50)).toBe(true);
      expect(validarValorDoacao(1000)).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(validarValorDoacao(0)).toBe(false);
      expect(validarValorDoacao(-10)).toBe(false);
      expect(validarValorDoacao(1000001)).toBe(false); // Over max
    });

    it('should return false for non-numeric values', () => {
      expect(validarValorDoacao('100')).toBe(false);
      expect(validarValorDoacao(null)).toBe(false);
      expect(validarValorDoacao(undefined)).toBe(false);
    });
  });
});