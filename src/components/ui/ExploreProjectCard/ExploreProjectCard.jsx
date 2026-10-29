import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkFilled } from '../../icons';
import './ExploreProjectCard.css';

/**
 * Cartão de projeto com capa (feeds de Explorar e Salvos).
 * Estrutura: [foto] [categoria + salvar] [título] [autores] [tipo · salvos]
 *
 * `saved` — exibe o marcador preenchido (estado "já salvo").
 * `onRemove` — ao informar, aparece a linha "Ver projeto / Remover".
 */
export default function ExploreProjectCard({ project, saved = false, onRemove }) {
  const { image, imageAlt, category, title, authors, type, saves, href } =
    project;

  return (
    <article className="explore-card">
      <img
        className="explore-card__image"
        src={image}
        alt={imageAlt}
        loading="lazy"
        width={366}
        height={148}
      />

      <div className="explore-card__body">
        <div className="explore-card__header">
          <span className="explore-card__category">{category}</span>
          <button
            type="button"
            className={[
              'explore-card__save',
              saved && 'explore-card__save--saved',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={
              saved ? `Remover ${title} dos salvos` : `Salvar ${title}`
            }
            onClick={saved ? onRemove : undefined}
          >
            {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
          </button>
        </div>

        <h3 className="explore-card__title">
          <Link to={href}>{title}</Link>
        </h3>

        <p className="explore-card__authors">{authors}</p>

        <div className="explore-card__footer">
          <span>{type}</span>
          <span>{saves} salvos</span>
        </div>

        {onRemove && (
          <div className="explore-card__actions">
            <Link
              to={href}
              className="explore-card__action explore-card__action--primary"
            >
              Ver projeto
            </Link>
            <button
              type="button"
              className="explore-card__action"
              onClick={onRemove}
            >
              Remover dos salvos
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
