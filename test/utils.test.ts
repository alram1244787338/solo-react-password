import { describe, it, expect } from './runner';
import {
  generatePassword,
  checkPasswordStrength,
  calcSliderPct,
  generateId,
} from '../src/utils';
import type { PasswordConfig } from '../src/types';

describe('calcSliderPct', () => {
  it('最小值应返回 0%', () => {
    expect(calcSliderPct(8, 8, 64)).toBe('0%');
  });

  it('最大值应返回 100%', () => {
    expect(calcSliderPct(64, 8, 64)).toBe('100%');
  });

  it('中间值应按比例计算', () => {
    expect(calcSliderPct(36, 8, 64)).toBe('50%');
  });

  it('超出范围的值应被夹紧', () => {
    expect(calcSliderPct(0, 8, 64)).toBe('0%');
    expect(calcSliderPct(100, 8, 64)).toBe('100%');
  });

  it('max <= min 时返回 0%', () => {
    expect(calcSliderPct(10, 10, 10)).toBe('0%');
    expect(calcSliderPct(10, 20, 10)).toBe('0%');
  });
});

describe('generateId', () => {
  it('应生成唯一 id', () => {
    const a = generateId();
    const b = generateId();
    expect(a).toBeTruthy();
    expect(typeof a).toBe('string');
    expect(a).not.toBe(b);
  });
});

describe('generatePassword', () => {
  const allSets: PasswordConfig = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  };

  it('空配置（全不勾）返回空字符串', () => {
    const pwd = generatePassword({
      length: 16,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
    });
    expect(pwd).toBe('');
  });

  it('length <= 0 返回空字符串', () => {
    const pwd = generatePassword({ ...allSets, length: 0 });
    expect(pwd).toBe('');
  });

  it('只勾小写字母 — 全部为小写', () => {
    const cfg: PasswordConfig = {
      length: 20,
      includeUppercase: false,
      includeLowercase: true,
      includeNumbers: false,
      includeSymbols: false,
    };
    for (let i = 0; i < 10; i++) {
      const pwd = generatePassword(cfg);
      expect(pwd).toMatch(/^[a-z]+$/);
    }
  });

  it('只勾数字 — 全部为数字', () => {
    const cfg: PasswordConfig = {
      length: 20,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
      includeSymbols: false,
    };
    for (let i = 0; i < 10; i++) {
      const pwd = generatePassword(cfg);
      expect(pwd).toMatch(/^[0-9]+$/);
    }
  });

  it('长度边界 8 — 生成 8 位', () => {
    const pwd = generatePassword({ ...allSets, length: 8 });
    expect(pwd).toHaveLength(8);
  });

  it('长度边界 64 — 生成 64 位', () => {
    const pwd = generatePassword({ ...allSets, length: 64 });
    expect(pwd).toHaveLength(64);
  });

  it('全勾 — 四种字符集都至少出现一次（100 次采样）', () => {
    for (let i = 0; i < 100; i++) {
      const pwd = generatePassword({ ...allSets, length: 12 });
      expect(pwd).toMatch(/[A-Z]/);
      expect(pwd).toMatch(/[a-z]/);
      expect(pwd).toMatch(/[0-9]/);
      expect(pwd).toMatch(/[^A-Za-z0-9]/);
    }
  });

  it('全勾 + 长度刚好 4 — 每种字符恰好一个', () => {
    for (let i = 0; i < 50; i++) {
      const pwd = generatePassword({ ...allSets, length: 4 });
      expect(pwd).toHaveLength(4);
      expect(pwd).toMatch(/[A-Z]/);
      expect(pwd).toMatch(/[a-z]/);
      expect(pwd).toMatch(/[0-9]/);
      expect(pwd).toMatch(/[^A-Za-z0-9]/);
    }
  });

  it('结果应该是随机的（两次生成不相同的概率极高）', () => {
    const a = generatePassword(allSets);
    const b = generatePassword(allSets);
    expect(a).not.toBe(b);
  });
});

describe('checkPasswordStrength', () => {
  it('空字符串', () => {
    const r = checkPasswordStrength('');
    expect(r.score).toBe(0);
    expect(r.level).toBe('weak');
    expect(r.suggestions.length).toBeGreaterThan(0);
  });

  it('弱密码：123456', () => {
    const r = checkPasswordStrength('123456');
    expect(r.level).toBe('weak');
    expect(r.score).toBeLessThanOrEqual(2);
  });

  it('弱密码：纯小写短密码', () => {
    const r = checkPasswordStrength('password');
    expect(r.level).toBe('weak');
    expect(r.score).toBeLessThanOrEqual(2);
  });

  it('纯数字长密码也不应太高分', () => {
    const r = checkPasswordStrength('1234567890123456');
    expect(r.score).toBeLessThanOrEqual(5);
  });

  it('中等：Tr0ub4dor&3（11 位四种字符）', () => {
    const r = checkPasswordStrength('Tr0ub4dor&3');
    expect(r.score).toBeGreaterThanOrEqual(5);
    expect(['good', 'strong']).toContain(r.level);
  });

  it('12 位 + 四种字符 — 保底 6 分', () => {
    const r = checkPasswordStrength('Tr0ub4dor&33');
    expect(r.score).toBeGreaterThanOrEqual(6);
  });

  it('20 位随机混合应是强密码', () => {
    const r = checkPasswordStrength('aA1!bB2@cC3#dD4$eE5%');
    expect(r.score).toBeGreaterThanOrEqual(8);
    expect(['strong', 'excellent']).toContain(r.level);
  });

  it('连续字符会被扣分', () => {
    const r1 = checkPasswordStrength('abcdefgh1A!');
    const r2 = checkPasswordStrength('xhqmvtkr1B!');
    expect(r2.score).toBeGreaterThan(r1.score);
  });

  it('连续重复会被扣分', () => {
    const r1 = checkPasswordStrength('aaaa1234Ab!');
    const r2 = checkPasswordStrength('axmq1234Cb!');
    expect(r2.score).toBeGreaterThan(r1.score);
  });

  it('包含常见弱口令词会被扣分', () => {
    const r1 = checkPasswordStrength('MyPassword123!');
    const r2 = checkPasswordStrength('MxQuasar789!');
    expect(r2.score).toBeGreaterThan(r1.score);
  });

  it('评分应该在 0-10 之间', () => {
    const cases = ['', 'a', 'abc', 'Tr0ub4dor&33', 'aA1!bB2@cC3#dD4$eE5%fF6^gG7&'];
    for (const c of cases) {
      const r = checkPasswordStrength(c);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(10);
    }
  });

  it('suggestions 最多不超过 6 条且去重', () => {
    const r = checkPasswordStrength('a');
    expect(r.suggestions.length).toBeLessThanOrEqual(6);
  });
});
