import type {
  PasswordConfig,
  PasswordStrengthLevel,
  PasswordStrengthResult,
} from '@/types';

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/|~',
};

const getSecureRandom = (max: number): number => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
};

const pickFrom = (pool: string): string => {
  return pool.charAt(getSecureRandom(pool.length));
};

const shuffle = (str: string): string => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = getSecureRandom(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};

export const generatePassword = (config: PasswordConfig): string => {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  } = config;

  let pool = '';
  const required: string[] = [];

  if (includeUppercase) {
    pool += CHARS.uppercase;
    required.push(pickFrom(CHARS.uppercase));
  }
  if (includeLowercase) {
    pool += CHARS.lowercase;
    required.push(pickFrom(CHARS.lowercase));
  }
  if (includeNumbers) {
    pool += CHARS.numbers;
    required.push(pickFrom(CHARS.numbers));
  }
  if (includeSymbols) {
    pool += CHARS.symbols;
    required.push(pickFrom(CHARS.symbols));
  }

  if (pool.length === 0) {
    return '';
  }

  const remain = Math.max(length - required.length, 0);
  let result = required.join('');
  for (let i = 0; i < remain; i += 1) {
    result += pickFrom(pool);
  }

  return shuffle(result);
};

const LEVEL_LABELS: Record<PasswordStrengthLevel, string> = {
  weak: '弱',
  fair: '一般',
  good: '良好',
  strong: '强',
  excellent: '极强',
};

export const getStrengthLabel = (level: PasswordStrengthLevel): string =>
  LEVEL_LABELS[level];

const hasSequential = (pwd: string): boolean => {
  const seqs = [
    'abcdefghijklmnopqrstuvwxyz',
    '01234567890',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
  ];
  const lower = pwd.toLowerCase();
  for (const seq of seqs) {
    for (let i = 0; i <= seq.length - 3; i += 1) {
      const slice = seq.slice(i, i + 3);
      if (lower.includes(slice)) return true;
    }
  }
  return false;
};

const hasRepeating = (pwd: string): boolean => {
  return /(.)\1{2,}/.test(pwd);
};

export const checkPasswordStrength = (
  password: string,
): PasswordStrengthResult => {
  if (!password) {
    return { score: 0, level: 'weak', suggestions: ['请输入密码以检测强度'] };
  }

  const suggestions: string[] = [];
  let score = 0;

  const len = password.length;
  if (len >= 8) score += 1;
  if (len >= 12) score += 1;
  if (len >= 16) score += 1;
  if (len >= 24) score += 1;

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (hasUpper) score += 1;
  if (hasLower) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;
  if (varietyCount >= 3) score += 1;
  if (varietyCount === 4) score += 1;

  if (hasSequential(password)) {
    score -= 2;
    suggestions.push('避免使用连续字符序列（如 abc、123、qwerty）');
  }
  if (hasRepeating(password)) {
    score -= 2;
    suggestions.push('避免同一字符连续重复 3 次以上');
  }

  const common = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'letmein',
    'welcome',
  ];
  if (common.some((w) => password.toLowerCase().includes(w))) {
    score -= 2;
    suggestions.push('避免包含常见弱口令关键词');
  }

  if (len < 12) suggestions.push('建议至少 12 位，越长越安全');
  if (!hasUpper) suggestions.push('添加大写字母可显著提升强度');
  if (!hasLower) suggestions.push('添加小写字母可丰富字符集');
  if (!hasNumber) suggestions.push('包含数字会更难被暴力破解');
  if (!hasSymbol) suggestions.push('加入特殊符号（如 !@#$%）可大幅提高熵值');

  let level: PasswordStrengthLevel;
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'fair';
  else if (score <= 6) level = 'good';
  else if (score <= 8) level = 'strong';
  else level = 'excellent';

  const clampedScore = Math.max(0, Math.min(10, score));

  return {
    score: clampedScore,
    level,
    suggestions: Array.from(new Set(suggestions)).slice(0, 6),
  };
};
