export interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong' | 'excellent';

export interface PasswordStrengthResult {
  score: number;
  level: PasswordStrengthLevel;
  suggestions: string[];
}

export interface PassphraseConfig {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
}

export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
}
