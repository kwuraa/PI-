import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from '../../icons';
import './ExploreProjectCard.css';

/**
 * Cartão de projeto com capa (feed da tela Explorar).
 * Estrutura: [foto] [categoria + salvar] [título] [autores] [tipo · salvos]
 */
export default function ExploreProjectCard({ project }) {
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
            className="explore-card__save"
            aria-label={`Salvar ${title}`}
          >
            <Bookmark size={20} />
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
      </div>
    </article>
  );
}
