import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiCamera,
  FiCheck,
  FiCheckSquare,
  FiClock,
  FiExternalLink,
  FiFileText,
} from 'react-icons/fi';

import CalloutNotFound from '../../components/staff/CalloutNotFound.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import FileList from '../../components/ui/FileList/FileList.jsx';
import FileRow from '../../components/ui/FileRow/FileRow.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../utils/status.js';
import {
  BANCA_EVIDENCE,
  COURSE_SHORT,
  getProjectBySlug,
  getTeam,
} from '../../mocks/projectsMock.js';
import styles from './DeliveryPage.module.css';

/** Turma canônica do semestre corrente. */
const TURMA = '2026.2';

/** Rótulo da situação no topo da coluna direita. */
function situationLabel(status) {
  switch (status) {
    case 'publicado':
      return 'Entrega aprovada';
    case 'ajustes':
      return 'Ajustes solicitados';
    case 'em-analise':
      return 'Entrega em análise';
    default:
      return 'Entrega em rascunho';
  }
}

export default function DeliveryPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  const [photos, setPhotos] = useState(BANCA_EVIDENCE.photos);
  const [minutes, setMinutes] = useState(BANCA_EVIDENCE.minutes);
  const [reviewOpen, setReviewOpen] = useState(false);

  if (!project) {
    return (
      <div className={styles.page}>
        <CalloutNotFound />
      </div>
    );
  }

  const team = getTeam(project);
  const status = statusMeta(project.status);
  const live = project.links.live;

  /** Data por situação: publicado usa a data de publicação; senão, de envio. */
  const dateLine =
    project.status === 'publicado'
      ? `Publicado em ${project.publishedAt}`
      : `Enviado em ${project.submittedAt}`;

  /** Simula o anexo de uma evidência nova (foto ou ata) — sem backend. */
  const attach = (kind) => {
    const isPhoto = kind === 'foto';
    const item = {
      id: `ev-local-${Date.now()}`,
      name: isPhoto
        ? `Foto_${String(photos.length + 1).padStart(2, '0')}.jpg`
        : `Ata_${minutes.length + 1}.pdf`,
      kind: isPhoto ? 'JPG' : 'PDF',
      size: isPhoto ? '2,6 MB' : '980 KB',
    };
    if (isPhoto) setPhotos((prev) => [...prev, item]);
    else setMinutes((prev) => [...prev, item]);
  };

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.statusRow}>
          <Badge tone="primary">Área do professor</Badge>
          <span className={styles.situation}>{situationLabel(project.status)}</span>
        </div>

        {/* imagem de capa do projeto: item 16 (fora de escopo) */}

        <div className={styles.badgesRow}>
          <Badge tone="primary">{COURSE_SHORT}</Badge>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>

        <div className={styles.identity}>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.meta}>
            <p>
              {project.type} · Turma {TURMA}
            </p>
            <p>
              {dateLine} · {project.saves} salvos
            </p>
          </div>
          <p className={styles.team}>{team?.members.join(' e ')}</p>
          <p className={styles.advisor}>Orientador: {team?.advisor}</p>
        </div>

        <section className={styles.block}>
          <SectionHeader title="Sobre o projeto" />
          <p className={styles.description}>{project.description}</p>
          <ul className={styles.tags} aria-label="Destaques do projeto">
            {project.highlights.map((highlight) => (
              <li key={highlight} className={styles.tag}>
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block}>
          <SectionHeader
            title="Materiais enviados"
            action={
              <span className={styles.fileCount}>
                {project.files.length} arquivos
              </span>
            }
          />
          <FileList>
            {project.files.map((file) => (
              <FileRow
                key={file.id}
                name={file.name}
                meta={`${file.kind} · ${file.size}`}
              />
            ))}
          </FileList>
        </section>

        {live && (
          <Card padding="md" className={styles.linkCard}>
            <div className={styles.linkHead}>
              <FiFileText className={styles.linkIcon} aria-hidden="true" />
              <div>
                <strong className={styles.linkTitle}>{live.title}</strong>
                <p className={styles.linkHint}>{live.hint}</p>
                <code className={styles.linkLabel}>{live.label}</code>
              </div>
            </div>
            <a
              href={`https://${live.label}`}
              target="_blank"
              rel="noreferrer"
              className={styles.linkButton}
            >
              <Button fullWidth icon={<FiExternalLink aria-hidden="true" />}>
                Acessar projeto
              </Button>
            </a>
          </Card>
        )}
      </div>

      <aside className={styles.side}>
        {project.review ? (
          <Card padding="md" className={styles.sideCard}>
            <div className={styles.sideHead}>
              <h2 className={styles.sideTitle}>Revisão concluída</h2>
              <FiCheck className={styles.doneIcon} aria-hidden="true" />
            </div>
            <p className={styles.sideLead}>
              Aprovado em {project.review.decidedAt} por {project.review.advisor}.
            </p>
            <ul className={styles.checklist}>
              {project.review.criteria.map((item) => (
                <li key={item} className={styles.checkItem}>
                  <FiCheckSquare aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="secondary"
              fullWidth
              icon={<FiCheckSquare aria-hidden="true" />}
              onClick={() => setReviewOpen(true)}
            >
              Ver parecer registrado
            </Button>
            <p className={styles.sideNote}>
              Esta entrega já está publicada. A decisão e os comentários
              permanecem no histórico do projeto.
            </p>
          </Card>
        ) : (
          <Callout
            tone="neutral"
            icon={<FiClock size={22} aria-hidden="true" />}
            title="Revisão pendente"
            action={
              <Link to={`/painel/revisar/${project.slug}`}>
                <Button>Revisar projeto</Button>
              </Link>
            }
          >
            Esta entrega ainda não tem parecer registrado. Confira os critérios
            e registre a decisão na revisão do projeto.
          </Callout>
        )}

        <Card padding="md" className={styles.sideCard}>
          <div className={styles.sideHead}>
            <h2 className={styles.sideTitle}>Upload de Evidências da Banca</h2>
            <Badge tone="primary">Banca</Badge>
          </div>
          <p className={styles.sideLead}>
            Anexe fotos da apresentação e registros/atas da avaliação para
            complementar a revisão.
          </p>

          <div className={styles.evidenceBlock}>
            <div className={styles.evidenceHead}>
              <h3 className={styles.evidenceTitle}>Fotos da apresentação</h3>
              <span className={styles.evidenceCount}>
                {photos.length} {photos.length === 1 ? 'anexada' : 'anexas'}
              </span>
            </div>
            <button
              type="button"
              className={styles.dropzone}
              onClick={() => attach('foto')}
            >
              <FiCamera className={styles.dropIcon} aria-hidden="true" />
              <strong>Anexar fotos</strong>
              <span>JPG ou PNG · até 10 MB cada</span>
            </button>
            <FileList>
              {photos.map((item) => (
                <FileRow
                  key={item.id}
                  name={item.name}
                  meta={`${item.kind} · ${item.size}`}
                />
              ))}
            </FileList>
          </div>

          <div className={styles.evidenceBlock}>
            <div className={styles.evidenceHead}>
              <h3 className={styles.evidenceTitle}>Atas e registros da banca</h3>
              <span className={styles.evidenceCount}>
                {minutes.length} {minutes.length === 1 ? 'anexado' : 'anexados'}
              </span>
            </div>
            <button
              type="button"
              className={styles.dropzone}
              onClick={() => attach('ata')}
            >
              <FiFileText className={styles.dropIcon} aria-hidden="true" />
              <strong>Anexar ata ou registro</strong>
              <span>PDF, DOCX ou TXT · até 5 MB</span>
            </button>
            <FileList>
              {minutes.map((item) => (
                <FileRow
                  key={item.id}
                  name={item.name}
                  meta={`${item.kind} · ${item.size}`}
                />
              ))}
            </FileList>
          </div>
        </Card>
      </aside>

      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Parecer registrado"
      >
        <div className={styles.modalBody}>
          <p className={styles.modalMeta}>
            Aprovado em {project.review?.decidedAt} por {project.review?.advisor}.
          </p>
          <ul className={styles.checklist}>
            {project.review?.criteria.map((item) => (
              <li key={item} className={styles.checkItem}>
                <FiCheckSquare aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className={styles.modalComment}>{project.review?.comment}</p>
          <Button variant="secondary" fullWidth onClick={() => setReviewOpen(false)}>
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
