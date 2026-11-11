/**
 * PI² — Detalhe da entrega (rota "/painel/entrega/:slug").
 * -----------------------------------------------------------------------------
 * Visão do professor/coordenador sobre uma entrega: links, arquivos e
 * EVIDÊNCIAS da banca (fotos e atas) — o upload é simulado e adiciona
 * itens à lista em estado local (sem backend).
 */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiImage, FiFileText, FiPaperclip, FiPlus } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  BANCA_EVIDENCE,
  getProjectBySlug,
  getTeam,
} from '../../mocks/projectsMock.js';
import styles from './DeliveryPage.module.css';

export default function DeliveryPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  const [photos, setPhotos] = useState(BANCA_EVIDENCE.photos);
  const [minutes, setMinutes] = useState(BANCA_EVIDENCE.minutes);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');

  if (!project) {
    return (
      <div className={styles.page}>
        <CalloutNotFound />
      </div>
    );
  }

  const team = getTeam(project);
  const status = statusMeta(project.status);

  /** Simula o anexo de uma evidência nova (foto ou ata). */
  const attach = (kind) => {
    const isPhoto = kind === 'foto';
    const item = {
      id: `ev-local-${Date.now()}`,
      name: isPhoto ? `Foto_${String(photos.length + 1).padStart(2, '0')}.jpg` : `Ata_${minutes.length + 1}.pdf`,
      kind: isPhoto ? 'JPG' : 'PDF',
      size: isPhoto ? '2,6 MB' : '980 KB',
    };
    if (isPhoto) setPhotos((prev) => [...prev, item]);
    else setMinutes((prev) => [...prev, item]);
    setUploadOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* ------------------------------------------- resumo */}
      <Card padding="md" className={styles.summary}>
        <div className={styles.summaryTop}>
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className={styles.summaryMeta}>Enviado em {project.submittedAt}</span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.team}>
          {team?.members.join(' e ')} · {team?.publicLabel}
        </p>
      </Card>

      {/* ------------------------------------------- links */}
      <section className={styles.block}>
        <SectionHeader title="Links da entrega" />
        <div className={styles.links}>
          {Object.entries(project.links).map(([key, link]) => (
            <a
              key={key}
              className={styles.link}
              href={`https://${link.label}`}
              target="_blank"
              rel="noreferrer"
            >
              <strong>{link.title}</strong>
              <code>{link.label}</code>
            </a>
          ))}
        </div>
      </section>

      {/* ---------------------------------------- arquivos */}
      <section className={styles.block}>
        <SectionHeader title="Arquivos entregues" />
        <ul className={styles.files}>
          {project.files.map((file) => (
            <li key={file.id} className={styles.file}>
              <FiFileText aria-hidden="true" />
              <span>
                <strong>{file.name}</strong> · {file.kind} · {file.size}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------- evidências */}
      <section className={styles.block}>
        <SectionHeader
          title="Evidências da banca"
          subtitle="Fotos da apresentação e atas de avaliação."
          action={
            <button type="button" className={styles.attachButton} onClick={() => setUploadOpen(true)}>
              <FiPlus aria-hidden="true" />
              Anexar
            </button>
          }
        />

        <h3 className={styles.evidenceKind}>
          <FiImage aria-hidden="true" /> Fotos ({photos.length})
        </h3>
        <ul className={styles.evidenceList}>
          {photos.map((item) => (
            <li key={item.id} className={styles.evidenceItem}>
              <FiImage aria-hidden="true" />
              <span>
                <strong>{item.name}</strong> · {item.size}
              </span>
            </li>
          ))}
          {photos.length === 0 && <li className={styles.emptyEvidence}>Nenhuma foto anexada.</li>}
        </ul>

        <h3 className={styles.evidenceKind}>
          <FiPaperclip aria-hidden="true" /> Atas ({minutes.length})
        </h3>
        <ul className={styles.evidenceList}>
          {minutes.map((item) => (
            <li key={item.id} className={styles.evidenceItem}>
              <FiFileText aria-hidden="true" />
              <span>
                <strong>{item.name}</strong> · {item.size}
              </span>
            </li>
          ))}
          {minutes.length === 0 && <li className={styles.emptyEvidence}>Nenhuma ata anexada.</li>}
        </ul>
      </section>

      {/* ------------------------------------- observações */}
      <section className={styles.block}>
        <SectionHeader title="Observações da entrega" />
        <textarea
          className={styles.textarea}
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Registre combinados, pendências ou pontos de atenção da entrega…"
        />
        <Button
          variant="secondary"
          disabled={!note.trim()}
          onClick={() => {
            setSavedNote(note.trim());
            setNote('');
          }}
        >
          Salvar observações
        </Button>
        {savedNote && <p className={styles.savedNote}>Registrado: “{savedNote}”</p>}
      </section>

      <Link to="/painel" className={styles.back}>
        Voltar ao painel
      </Link>

      {/* ---------------------------------- modal de upload */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Anexar evidência"
      >
        <div className={styles.uploadOptions}>
          <Button fullWidth variant="secondary" onClick={() => attach('foto')}>
            <FiImage aria-hidden="true" />
            Foto da banca
          </Button>
          <Button fullWidth variant="secondary" onClick={() => attach('ata')}>
            <FiFileText aria-hidden="true" />
            Ata de avaliação
          </Button>
          <p className={styles.uploadHint}>
            Upload simulado: o item entra apenas na lista desta tela.
          </p>
        </div>
      </Modal>
    </div>
  );
}

/** Estado vazio quando o slug não existe. */
function CalloutNotFound() {
  return (
    <Link to="/painel" className={styles.back}>
      Entrega não encontrada — voltar ao painel
    </Link>
  );
}
