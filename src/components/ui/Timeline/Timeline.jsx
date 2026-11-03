import React from 'react';
import { Check, Clock } from '../../icons';
import './Timeline.css';

const STEP_ICONS = {
  check: Check,
  clock: Clock,
};

/**
 * Linha do tempo de etapas (ex.: etapas da análise de um projeto).
 * Cada item: { icon: 'check' (concluído) | 'clock' (em andamento) | 'empty',
 *              title, description }
 * O marcador "empty" mostra apenas o círculo (etapa futura).
 */
export default function Timeline({ steps = [] }) {
  return (
    <ol className="timeline">
      {steps.map((step) => {
        const Icon = STEP_ICONS[step.icon];

        return (
          <li className="timeline__step" key={step.title}>
            <span
              className={`timeline__marker timeline__marker--${step.icon}`}
              aria-hidden="true"
            >
              {Icon ? <Icon size={14} /> : null}
            </span>

            <span className="timeline__body">
              <strong className="timeline__title">{step.title}</strong>
              <span className="timeline__description">{step.description}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
