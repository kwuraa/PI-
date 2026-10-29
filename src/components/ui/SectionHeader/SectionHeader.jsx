import React from 'react';
import './SectionHeader.css';

/**
 * Cabeçalho de seção: título + ação opcional (ex.: "Ver todos").
 */
export default function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>

      {actionLabel && (
        <button type="button" className="section-header__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
