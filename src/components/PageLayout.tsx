import type { ReactNode } from 'react';
import styles from './PageLayout.module.css';
import type { ViewName } from '@/types';

interface PageLayoutProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  children: ReactNode;
}

const TITLES: Record<Exclude<ViewName, 'home'>, string> = {
  generator: '密码生成器',
  strength: '强度检测',
  passphrase: 'Passphrase 生成',
  vault: '加密保险箱',
};

function PageLayout({ currentView, onNavigate, children }: PageLayoutProps) {
  const isHome = currentView === 'home';
  const title = isHome ? undefined : TITLES[currentView];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
      <div
        className={styles.brandRow}
        onClick={() => onNavigate('home')}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onNavigate('home');
          }
        }}
      >
        <div className={styles.brandIcon}>PX</div>
        <span>Password Toolbox</span>
      </div>
      {!isHome && (
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => onNavigate('home')}
        >
          ← 返回首页
        </button>
      )}
    </header>

      <main className={styles.main}>
        {title && (
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em' }}>
              {title}
            </h1>
          </div>
        )}
        {children}
      </main>

      <footer className={styles.footer}>
        Built with React · TypeScript · Webpack
      </footer>
    </div>
  );
}

export default PageLayout;
