import { describe, it, expect } from './runner';
import { parseHash, VALID_VIEWS } from '../src/hooks/useView';
import type { ViewName } from '../src/types';

describe('VALID_VIEWS', () => {
  it('包含所有合法视图', () => {
    expect(VALID_VIEWS).toEqual(['home', 'generator', 'strength', 'passphrase', 'vault']);
  });
});

describe('parseHash', () => {
  it('空 hash 返回默认 home', () => {
    expect(parseHash('')).toBe('home');
    expect(parseHash('#')).toBe('home');
    expect(parseHash('#/')).toBe('home');
  });

  it('带自定义 fallback 的空 hash 返回 fallback', () => {
    expect(parseHash('', 'generator')).toBe('generator');
    expect(parseHash('#', 'strength')).toBe('strength');
  });

  it('#generator 返回 generator', () => {
    expect(parseHash('#generator')).toBe('generator');
  });

  it('#strength 返回 strength', () => {
    expect(parseHash('#strength')).toBe('strength');
  });

  it('支持 #/generator 带斜杠的格式', () => {
    expect(parseHash('#/generator')).toBe('generator');
  });

  it('大小写不敏感', () => {
    expect(parseHash('#Generator')).toBe('generator');
    expect(parseHash('#STRENGTH')).toBe('strength');
  });

  it('首尾空白会被 trim', () => {
    expect(parseHash('#  generator  ')).toBe('generator');
  });

  it('未知 hash 返回 fallback', () => {
    expect(parseHash('#unknown')).toBe('home');
    expect(parseHash('#random', 'strength')).toBe('strength');
    expect(parseHash('#not-a-view', 'vault')).toBe('vault');
  });

  it('所有合法视图都能被解析', () => {
    const views: ViewName[] = ['home', 'generator', 'strength', 'passphrase', 'vault'];
    for (const v of views) {
      expect(parseHash(`#${v}`)).toBe(v);
    }
  });
});

describe('useView hook（纯函数部分）', () => {
  it('hash 解析与 fallback 覆盖完整', () => {
    expect(parseHash('', 'home')).toBe('home');
    expect(parseHash('', 'generator')).toBe('generator');
    expect(parseHash('#generator', 'home')).toBe('generator');
    expect(parseHash('#invalid', 'vault')).toBe('vault');
  });
});
