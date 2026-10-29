import React from 'react';
import { Search, Sliders } from '../../icons';
import './SearchBar.css';

/**
 * Barra de busca: campo de texto + botão de filtros.
 * Controlada pela página via `value`/`onChange`.
 */
export default function SearchBar({
  placeholder,
  value,
  onChange,
  filterLabel = 'Filtros',
  onFilterClick,
  showFilter = true,
}) {
  return (
    <div className="search-bar">
      <div className="search-bar__field">
        <span className="search-bar__icon" aria-hidden="true">
          <Search size={20} />
        </span>
        <input
          type="search"
          className="search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label={placeholder}
        />
      </div>

      {showFilter && (
        <button
          type="button"
          className="search-bar__filter"
          onClick={onFilterClick}
          aria-label={filterLabel}
        >
          <Sliders size={22} />
        </button>
      )}
    </div>
  );
}
