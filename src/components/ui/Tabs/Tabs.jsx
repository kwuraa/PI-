import React from 'react';
import './Tabs.css';

/**
 * Controle segmentado (tabs) do painel.
 * `items`: [{ id, label }] — controlado pela página via activeId/onChange.
 */
export default function Tabs({ items, activeId, onChange, className = '' }) {
  const classes = ['tabs', className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          className={[
            'tabs__item',
            item.id === activeId && 'tabs__item--active',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
