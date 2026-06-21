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
} as const;

type CharSetKey = keyof typeof CHARS;

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

const shuffle = <T>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = getSecureRandom(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const shuffleString = (str: string): string => shuffle(str.split('')).join('');

const getActiveCharSets = (config: PasswordConfig): CharSetKey[] => {
  const sets: CharSetKey[] = [];
  if (config.includeUppercase) sets.push('uppercase');
  if (config.includeLowercase) sets.push('lowercase');
  if (config.includeNumbers) sets.push('numbers');
  if (config.includeSymbols) sets.push('symbols');
  return sets;
};

const hasCharFromSet = (str: string, charSet: string): boolean => {
  for (let i = 0; i < str.length; i += 1) {
    if (charSet.includes(str[i])) return true;
  }
  return false;
};

export const generatePassword = (config: PasswordConfig): string => {
  const { length } = config;
  const activeSets = getActiveCharSets(config);

  if (activeSets.length === 0) {
    return '';
  }

  if (length <= 0) {
    return '';
  }

  const pool = activeSets.map((k) => CHARS[k]).join('');

  if (length <= activeSets.length) {
    const pickedSets = shuffle(activeSets).slice(0, length);
    const result = pickedSets.map((set) => pickFrom(CHARS[set])).join('');
    return shuffleString(result);
  }

  const result: string[] = [];

  for (const set of activeSets) {
    result.push(pickFrom(CHARS[set]));
  }

  while (result.length < length) {
    result.push(pickFrom(pool));
  }

  const shuffled = shuffle(result).join('');

  for (const set of activeSets) {
    if (!hasCharFromSet(shuffled, CHARS[set])) {
      const setChars = CHARS[set];
      const replaceIdx = getSecureRandom(shuffled.length);
      const arr = shuffled.split('');
      arr[replaceIdx] = pickFrom(setChars);
      return shuffleString(arr.join(''));
    }
  }

  return shuffled;
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

const COMMON_WORDS = [
  'password',
  '123456',
  'qwerty',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'dragon',
  'master',
  'football',
];

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
  if (len >= 12) score += 2;
  if (len >= 16) score += 1;
  if (len >= 20) score += 1;
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

  if (varietyCount === 3) score += 1;
  if (varietyCount === 4) score += 1;

  const deductions: string[] = [];

  if (hasSequential(password)) {
    score -= 1;
    deductions.push('避免使用连续字符序列（如 abc、123、qwerty）');
  }
  if (hasRepeating(password)) {
    score -= 1;
    deductions.push('避免同一字符连续重复 3 次以上');
  }

  const lowerPwd = password.toLowerCase();
  if (COMMON_WORDS.some((w) => lowerPwd.includes(w))) {
    score -= 1;
    deductions.push('避免包含常见弱口令关键词');
  }

  suggestions.push(...deductions);

  if (len < 12) suggestions.push('建议至少 12 位，越长越安全');
  if (!hasUpper) suggestions.push('添加大写字母可显著提升强度');
  if (!hasLower) suggestions.push('添加小写字母可丰富字符集');
  if (!hasNumber) suggestions.push('包含数字会更难被暴力破解');
  if (!hasSymbol) suggestions.push('加入特殊符号（如 !@#$%）可大幅提高熵值');

  if (len >= 12 && varietyCount === 4) {
    score = Math.max(score, 6);
  }

  const clampedScore = Math.max(0, Math.min(10, score));

  let level: PasswordStrengthLevel;
  if (clampedScore <= 2) level = 'weak';
  else if (clampedScore <= 4) level = 'fair';
  else if (clampedScore <= 6) level = 'good';
  else if (clampedScore <= 8) level = 'strong';
  else level = 'excellent';

  return {
    score: clampedScore,
    level,
    suggestions: Array.from(new Set(suggestions)).slice(0, 6),
  };
};
