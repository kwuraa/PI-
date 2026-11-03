import React from 'react';
import { FileText, Download, Eye } from '../../icons';
import './FileCard.css';

/**
 * Cartão de arquivo do projeto (material anexado).
 * Estrutura: [ícone] [nome] [tamanho (+ versão/status)] · [ação]
 * `actionIcon`: 'download' (padrão) ou 'view' (visualização).
 */
export default function FileCard({ file, onDownload, actionIcon = 'download' }) {
  const { name, kind, size, version, status } = file;
  const isView = actionIcon === 'view';

  return (
    <li className="file-card">
      <span className="file-card__icon" aria-hidden="true">
        <FileText size={20} />
      </span>

      <span className="file-card__text">
        <strong className="file-card__name">{name}</strong>
        <span className="file-card__meta">
          {kind} · {size}
          {version ? ` · Versão ${version}` : ''}
          {status ? ` · ${status}` : ''}
        </span>
      </span>

      <button
        type="button"
        className="file-card__download"
        aria-label={`${isView ? 'Visualizar' : 'Baixar'} ${name}`}
        onClick={onDownload}
      >
        {isView ? <Eye size={20} /> : <Download size={20} />}
      </button>
    </li>
  );
}
