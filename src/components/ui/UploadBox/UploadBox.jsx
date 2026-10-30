import React from 'react';
import { Upload } from '../../icons';
import './UploadBox.css';

/**
 * Área de adição de arquivos (toque para enviar).
 * Estrutura: [ícone] [título] [regras do upload]
 */
export default function UploadBox({ title, hint, onClick }) {
  return (
    <button type="button" className="upload-box" onClick={onClick}>
      <span className="upload-box__icon" aria-hidden="true">
        <Upload size={26} />
      </span>
      <strong className="upload-box__title">{title}</strong>
      <span className="upload-box__hint">{hint}</span>
    </button>
  );
}
