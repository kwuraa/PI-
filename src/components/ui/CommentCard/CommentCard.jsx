import React from 'react';
import './CommentCard.css';

/**
 * Comentário de um participante da conversa.
 * Estrutura: [autor] [quando] / [mensagem]
 */
export default function CommentCard({ comment }) {
  const { author, timeLabel, text } = comment;

  return (
    <li className="comment-card">
      <div className="comment-card__header">
        <strong className="comment-card__author">{author}</strong>
        <span className="comment-card__time">{timeLabel}</span>
      </div>

      <p className="comment-card__text">{text}</p>
    </li>
  );
}
