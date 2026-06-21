import { useMemo, useState } from 'react';
import Card from '@/components/Card';
import { checkPasswordStrength, getStrengthLabel } from '@/utils';
import type { PasswordStrengthLevel } from '@/types';
import styles from './StrengthChecker.module.css';

const LEVEL_STYLES: Record<
  PasswordStrengthLevel,
  { bar: string; badge: string; text: string }
> = {
  weak: {
    bar: styles.barWeak,
    badge: styles.badgeWeak,
    text: 'var(--accent-danger)',
  },
  fair: {
    bar: styles.barFair,
    badge: styles.badgeFair,
    text: 'var(--accent-warning)',
  },
  good: {
    bar: styles.barGood,
    badge: styles.badgeGood,
    text: '#e3b341',
  },
  strong: {
    bar: styles.barStrong,
    badge: styles.badgeStrong,
    text: 'var(--accent-cyan)',
  },
  excellent: {
    bar: styles.barExcellent,
    badge: styles.badgeExcellent,
    text: 'var(--accent-success)',
  },
};

function StrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const result = useMemo(() => checkPasswordStrength(password), [password]);
  const style = LEVEL_STYLES[result.level];
  const pct = Math.round((result.score / 10) * 100);

  return (
    <div className={styles.wrapper}>
      <Card
        accent="green"
        title="输入密码"
        description="支持实时检测，越详细越准确"
      >
        <div className={styles.inputRow}>
          <input
            type={showPwd ? 'text' : 'password'}
            className={styles.input}
            placeholder="在此输入要检测的密码…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPwd((s) => !s)}
          >
            {showPwd ? '隐藏' : '显示'}
          </button>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>长度</span>
            <span className={styles.statValue}>{password.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>评分</span>
            <span className={styles.statValue}>{result.score} / 10</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>等级</span>
            <span className={`${styles.badge} ${style.badge}`} style={{ color: style.text }}>
              {getStrengthLabel(result.level)}
            </span>
          </div>
        </div>

        <div>
          <div className={styles.barTrack}>
            <div
              className={`${styles.barFill} ${style.bar}`}
              style={{ width: `${password ? pct : 0}%` }}
            />
          </div>
          <div className={styles.barLabels}>
            <span style={{ color: password && result.level === 'weak' ? 'var(--accent-danger)' : 'var(--text-muted)' }}>弱</span>
            <span style={{ color: password && result.level === 'fair' ? 'var(--accent-warning)' : 'var(--text-muted)' }}>一般</span>
            <span style={{ color: password && result.level === 'good' ? '#e3b341' : 'var(--text-muted)' }}>良好</span>
            <span style={{ color: password && result.level === 'strong' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>强</span>
            <span style={{ color: password && result.level === 'excellent' ? 'var(--accent-success)' : 'var(--text-muted)' }}>极强</span>
          </div>
        </div>
      </Card>

      <div style={{ height: 20 }} />

      <Card accent="green" title="改进建议" description={password ? `共 ${result.suggestions.length} 条建议` : '输入密码后显示建议'}>
        {password && result.suggestions.length > 0 ? (
          <ul className={styles.suggestionList}>
            {result.suggestions.map((s, i) => (
              <li key={i} className={styles.suggestionItem}>
                <span className={styles.suggestionDot} />
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyHint}>
            {password ? '🎉 这条密码看起来相当不错，没有特别需要改进的地方。' : '请先在上方输入密码以获取建议。'}
          </p>
        )}
      </Card>
    </div>
  );
}

export default StrengthChecker;
