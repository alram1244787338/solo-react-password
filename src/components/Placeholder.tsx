import Card from '@/components/Card';
import styles from './Placeholder.module.css';

interface PlaceholderProps {
  icon: string;
  title: string;
  description: string;
  accent: 'purple' | 'cyan';
}

function Placeholder({ icon, title, description, accent }: PlaceholderProps) {
  return (
    <Card accent={accent} title={title} description={description}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>{icon}</div>
        <p className={styles.text}>
          🚧 此功能即将上线
        </p>
        <p className={styles.subtext}>
          我们正在紧锣密鼓地开发中，敬请期待。
        </p>
      </div>
    </Card>
  );
}

export default Placeholder;
