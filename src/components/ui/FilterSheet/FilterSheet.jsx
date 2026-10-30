import React from 'react';
import Button from '../Button/Button';
import Select from '../Select/Select';
import FilterChip from '../FilterChip/FilterChip';
import { X, Check } from '../../icons';
import './FilterSheet.css';

/**
 * Painel de filtros em bottom sheet (mobile first).
 * Controlado pela página: `draft` guarda as seleções em andamento;
 * nada é aplicado até o usuário tocar em "Mostrar N projetos".
 */
export default function FilterSheet({
  open,
  panel,
  draft,
  count,
  onDraftChange,
  onApply,
  onClear,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="filter-sheet" role="dialog" aria-modal="true" aria-label={panel.title}>
      <div className="filter-sheet__backdrop" onClick={onClose} />

      <div className="filter-sheet__sheet">
        <span className="filter-sheet__handle" aria-hidden="true" />

        <header className="filter-sheet__header">
          <h2 className="filter-sheet__title">{panel.title}</h2>
          <button
            type="button"
            className="filter-sheet__close"
            onClick={onClose}
            aria-label={panel.closeLabel}
          >
            <X size={22} />
          </button>
        </header>

        {/* Cursos (radio com contagem) */}
        <p className="filter-sheet__label">{panel.courseLabel}</p>
        <div className="filter-sheet__courses" role="radiogroup" aria-label={panel.courseLabel}>
          {panel.courses.map((course) => {
            const selected = draft.course === course.id;

            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                key={course.id}
                className={`filter-sheet__course ${
                  selected ? 'filter-sheet__course--selected' : ''
                }`}
                onClick={() => onDraftChange({ course: course.id })}
              >
                <span
                  className={`filter-sheet__radio ${
                    selected ? 'filter-sheet__radio--checked' : ''
                  }`}
                  aria-hidden="true"
                >
                  {selected && <Check size={13} />}
                </span>
                <span className="filter-sheet__course-name">{course.name}</span>
                <span className="filter-sheet__course-count">{course.count}</span>
              </button>
            );
          })}
        </div>

        {/* Ano + ordenação */}
        <div className="filter-sheet__grid">
          <Select
            label={panel.yearLabel}
            options={panel.years}
            value={draft.year}
            onChange={(event) => onDraftChange({ year: event.target.value })}
          />
          <Select
            label={panel.sortLabel}
            options={panel.sortOptions}
            value={draft.sort}
            onChange={(event) => onDraftChange({ sort: event.target.value })}
          />
        </div>

        {/* Tipo de projeto (chips) */}
        <p className="filter-sheet__label">{panel.typeLabel}</p>
        <div className="filter-sheet__types">
          {panel.types.map((type) => (
            <FilterChip
              key={type.id}
              active={draft.type === type.id}
              onClick={() => onDraftChange({ type: type.id })}
            >
              {type.label}
            </FilterChip>
          ))}
        </div>

        <Button fullWidth onClick={onApply}>
          {panel.applyTemplate.replace('{count}', String(count))}
        </Button>

        <button type="button" className="filter-sheet__clear" onClick={onClear}>
          {panel.clearLabel}
        </button>
      </div>
    </div>
  );
}
