import styles from './FileList.module.css';

export default function FileList({ id, className = '', children }) {
  return (
    <ul id={id} className={`${styles.list} ${className}`}>
      {children}
    </ul>
  );
}
