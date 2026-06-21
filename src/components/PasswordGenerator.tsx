import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/Card';
import { useCopy } from '@/hooks';
import { generatePassword } from '@/utils';
import type { PasswordConfig } from '@/types';
import styles from './PasswordGenerator.module.css';

const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

const DEFAULT_CONFIG: PasswordConfig = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
};

interface CheckboxOption {
  key: keyof Omit<PasswordConfig, 'length'>;
  label: string;
  hint: string;
}

const OPTIONS: CheckboxOption[] = [
  { key: 'includeUppercase', label: '大写字母', hint: 'A-Z' },
  { key: 'includeLowercase', label: '小写字母', hint: 'a-z' },
  { key: 'includeNumbers', label: '数字', hint: '0-9' },
  { key: 'includeSymbols', label: '特殊符号', hint: '!@#$%…' },
];

function PasswordGenerator() {
  const [config, setConfig] = useState<PasswordConfig>(DEFAULT_CONFIG);
  const [password, setPassword] = useState('');
  const [copied, copy] = useCopy();

  const atLeastOne = useMemo(
    () =>
      config.includeUppercase ||
      config.includeLowercase ||
      config.includeNumbers ||
      config.includeSymbols,
    [config],
  );

  const handleGenerate = useCallback(() => {
    if (!atLeastOne) return;
    setPassword(generatePassword(config));
  }, [config, atLeastOne]);

  useEffect(() => {
    handleGenerate();
  }, []);

  const toggleOption = (key: CheckboxOption['key']) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setLength = (length: number) => {
    setConfig((prev) => ({
      ...prev,
      length: Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, length)),
    }));
  };

  return (
    <div className={styles.wrapper}>
      <Card accent="blue" title="生成结果" description="点击生成新密码，或复制当前结果">
        <div className={styles.resultRow}>
          <code className={styles.resultBox} title={password}>
            {password || '请至少选择一种字符类型'}
          </code>
          <button
            type="button"
            className={`${styles.primaryBtn} ${copied ? styles.successBtn : ''}`}
            onClick={() => password && copy(password)}
            disabled={!password}
          >
            {copied ? '已复制 ✓' : '复制'}
          </button>
        </div>
      </Card>

      <div style={{ height: 20 }} />

      <Card accent="blue" title="配置选项" description="调整长度和字符集">
        <div>
          <div className={styles.rowBetween}>
            <label className={styles.label}>密码长度</label>
            <span className={styles.lengthBadge}>{config.length}</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            step={1}
            value={config.length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{
              ['--pct' as string]: `${((config.length - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)) * 100}%`,
            }}
          />
          <div className={styles.sliderTrack}>
            <span>{MIN_LENGTH}</span>
            <span>{MAX_LENGTH}</span>
          </div>
        </div>

        <div className={styles.checkGrid}>
          {OPTIONS.map((opt) => {
            const checked = config[opt.key];
            return (
              <label
                key={opt.key}
                className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(opt.key)}
                  className={styles.nativeCheck}
                />
                <span className={styles.checkBox} />
                <div className={styles.checkText}>
                  <div className={styles.checkLabel}>{opt.label}</div>
                  <div className={styles.checkHint}>{opt.hint}</div>
                </div>
              </label>
            );
          })}
        </div>

        {!atLeastOne && (
          <p className={styles.warning}>至少需要选择一种字符类型</p>
        )}

        <button
          type="button"
          className={`${styles.primaryBtn} ${styles.fullWidth}`}
          onClick={handleGenerate}
          disabled={!atLeastOne}
        >
          🔄 重新生成
        </button>
      </Card>
    </div>
  );
}

export default PasswordGenerator;
