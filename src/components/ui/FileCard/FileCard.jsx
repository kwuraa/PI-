import React from 'react';
import { FileText, Download } from '../../icons';
import './FileCard.css';

/**
 * Cartão de arquivo do projeto (material anexado).
 * Estrutura: [ícone] [nome] [tamanho] · [baixar]
 */
export default function FileCard({ file, onDownload }) {
  const { name, kind, size } = file;

  return (
    <li className="file-card">
      <span className="file-card__icon" aria-hidden="true">
        <FileText size={20} />
      </span>

      <span className="file-card__text">
        <strong className="file-card__name">{name}</strong>
        <span className="file-card__meta">
          {kind} · {size}
        </span>
      </span>

      <button
        type="button"
        className="file-card__download"
        aria-label={`Baixar ${name}`}
        onClick={onDownload}
      >
        <Download size={20} />
      </button>
    </li>
  );
}
