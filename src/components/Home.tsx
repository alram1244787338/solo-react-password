import type { ViewName } from '@/types';
import styles from './Home.module.css';

interface ToolCardData {
  icon: string;
  iconClass: string;
  title: string;
  desc: string;
  target: ViewName;
  status: 'ready' | 'coming';
}

const TOOLS: ToolCardData[] = [
  {
    icon: '🔑',
    iconClass: styles.iconGenerator,
    title: '密码生成器',
    desc: '可配置长度、字符集的随机密码生成，一键复制。',
    target: 'generator',
    status: 'ready',
  },
  {
    icon: '📊',
    iconClass: styles.iconStrength,
    title: '强度检测',
    desc: '实时强度评分（弱→极强五级），附带改进建议。',
    target: 'strength',
    status: 'ready',
  },
  {
    icon: '📝',
    iconClass: styles.iconPassphrase,
    title: 'Passphrase 生成',
    desc: '基于词库的高熵易记密码短语，支持自定义分隔符。',
    target: 'passphrase',
    status: 'coming',
  },
  {
    icon: '🔒',
    iconClass: styles.iconVault,
    title: '加密保险箱',
    desc: '端到端加密存储凭据条目，本地保存、主密码保护。',
    target: 'vault',
    status: 'coming',
  },
];

function Home({ onNavigate }: { onNavigate: (v: ViewName) => void }) {
  return (
    <>
      <section className={styles.hero}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          密码工具箱已就绪
        </span>
        <h1 className={styles.heroTitle}>密码工具箱</h1>
        <p className={styles.heroSubtitle}>
          生成、检测、存储一站式密码安全工具。点击下方卡片进入对应工具。
        </p>
      </section>

      <section className={styles.grid}>
        {TOOLS.map((tool) => (
          <button
            type="button"
            key={tool.target}
            className={styles.card}
            onClick={() => onNavigate(tool.target)}
          >
            <div className={`${styles.cardIcon} ${tool.iconClass}`}>{tool.icon}</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{tool.title}</h3>
              {tool.status === 'ready' ? (
                <span className={styles.statusReady}>可使用</span>
              ) : (
                <span className={styles.statusComing}>即将上线</span>
              )}
            </div>
            <p className={styles.cardDesc}>{tool.desc}</p>
          </button>
        ))}
      </section>
    </>
  );
}

export default Home;
