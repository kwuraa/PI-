/**
 * PI² — Lista vertical de arquivos da entrega.
 * -----------------------------------------------------------------------------
 * Substitui as cópias de `<ul className={styles.files}>` (flex column +
 * gap 8px) que existiam em ProjectPage, DeliveryPage, ProfessorProjectPage
 * e ReviewPage. É só o container: as linhas vêm de <FileRow/>.
 *
 * Props:
 *  • id / className → passados direto (o ProjectPage usa o id como âncora
 *    do link "arquivos do projeto").
 *
 * Uso:
 *   <FileList id="arquivos-do-projeto">
 *     {files.map((file) => <FileRow key={file.id} … />)}
 *   </FileList>
 */
import styles from './FileList.module.css';

export default function FileList({ id, className = '', children }) {
  return (
    <ul id={id} className={`${styles.list} ${className}`}>
      {children}
    </ul>
  );
}
