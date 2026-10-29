import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../../icons';
import './LinksCard.css';

/**
 * Cartão de áreas com links de acesso:
 * [texto de contexto] · [link] · [link] ...
 * Ex.: "Áreas acadêmicas" e "Áreas da coordenação".
 */
export default function LinksCard({ description, links }) {
  return (
    <article className="links-card">
      {description && (
        <p className="links-card__description">{description}</p>
      )}

      <ul className="links-card__list">
        {links.map((link) => (
          <li key={link.id} className="links-card__item">
            <Link to={link.href} className="links-card__link">
              {link.label}
              <ArrowRight size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
