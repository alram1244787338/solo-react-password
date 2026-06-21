import styles from './App.module.css';

type ToolCard = {
  icon: string;
  iconClass: string;
  title: string;
  desc: string;
};

const TOOLS: ToolCard[] = [
  {
    icon: '🔑',
    iconClass: styles.iconGenerator,
    title: '密码生成器',
    desc: '可配置长度、字符集的随机密码生成，一次多组便于挑选。',
  },
  {
    icon: '📊',
    iconClass: styles.iconStrength,
    title: '强度检测',
    desc: '基于熵值和模式识别的密码强度评分，附带改进建议。',
  },
  {
    icon: '📝',
    iconClass: styles.iconPassphrase,
    title: 'Passphrase 生成',
    desc: '基于词库的高熵易记密码短语，支持自定义分隔符。',
  },
  {
    icon: '🔒',
    iconClass: styles.iconVault,
    title: '加密保险箱',
    desc: '端到端加密存储凭据条目，本地保存、主密码保护。',
  },
];

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>PX</div>
          <span>Password Toolbox</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.badge}>
            <span className={styles.dot} />
            项目框架就绪
          </span>
          <h1 className={styles.heroTitle}>密码工具箱</h1>
          <p className={styles.heroSubtitle}>
            生成、检测、存储一站式密码安全工具。以下模块即将上线，此页面仅为占位界面。
          </p>
        </section>

        <section className={styles.grid}>
          {TOOLS.map((tool) => (
            <div className={styles.card} key={tool.title}>
              <div className={`${styles.cardIcon} ${tool.iconClass}`}>{tool.icon}</div>
              <h3 className={styles.cardTitle}>{tool.title}</h3>
              <p className={styles.cardDesc}>{tool.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        Built with React · TypeScript · Webpack
      </footer>
    </div>
  );
}

export default App;
