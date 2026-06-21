import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  accent?: 'blue' | 'green' | 'purple' | 'cyan' | 'none';
}

function Card({ children, className, title, description, accent = 'none' }: CardProps) {
  const accentClass =
    accent === 'none' ? '' : styles[`accent${accent.charAt(0).toUpperCase() + accent.slice(1)}`];
  return (
    <section className={`${styles.card} ${accentClass} ${className ?? ''}`.trim()}>
      {(title || description) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.desc}>{description}</p>}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default Card;
