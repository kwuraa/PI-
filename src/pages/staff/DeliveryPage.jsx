/**
 * PI² — Detalhe da entrega (rota "/painel/entrega/:slug").
 * -----------------------------------------------------------------------------
 * Visão do professor/coordenador sobre uma entrega, em DUAS colunas no
 * desktop (mockup "Detalhe da entrega") e empilhada no mobile:
 *  • coluna principal — badge "Área do professor" + situação da entrega,
 *    selo do curso + status, título, metadados (tipo · turma · publicação ·
 *    salvos), equipe e orientador, seção "Sobre o projeto" (descrição +
 *    destaques), "Materiais enviados" (arquivos + contagem) e o card do
 *    link navegável com o botão "Acessar projeto";
 *  • coluna lateral — card "Revisão concluída" (parecer registrado com os
 *    critérios conferidos + botão "Ver parecer registrado" em modal) ou o
 *    callout de revisão pendente, e o card "Upload de Evidências da Banca"
 *    com dropzones "Anexar fotos" / "Anexar ata ou registro" (upload
 *    simulado: o item entra apenas na lista em estado local, sem backend).
 * Imagens do projeto: FORA DE ESCOPO (item 16 adiado).
 */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiCamera,
  FiCheck,
  FiCheckSquare,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiFileText,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  BANCA_EVIDENCE,
  COURSE_SHORT,
  getProjectBySlug,
  getTeam,
} from '../../mocks/projectsMock.js';
import styles from './DeliveryPage.module.css';

/** Turma canônica do semestre corrente (mesmo rótulo dos protótipos). */
const TURMA = '2026.2';

/** Rótulo da situação no topo da coluna direita (copy do mockup). */
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
      {/* ------------------------------------- coluna principal */}
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
          <ul className={styles.files}>
            {project.files.map((file) => (
              <li key={file.id} className={styles.file}>
                <FiFileText className={styles.fileIcon} aria-hidden="true" />
                <span className={styles.fileText}>
                  <strong>{file.name}</strong>
                  <small>
                    {file.kind} · {file.size}
                  </small>
                </span>
                <FiDownload className={styles.fileDownload} aria-hidden="true" />
              </li>
            ))}
          </ul>
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

      {/* --------------------------------------- coluna lateral */}
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
            <ul className={styles.files}>
              {photos.map((item) => (
                <li key={item.id} className={styles.file}>
                  <FiFileText className={styles.fileIcon} aria-hidden="true" />
                  <span className={styles.fileText}>
                    <strong>{item.name}</strong>
                    <small>
                      {item.kind} · {item.size}
                    </small>
                  </span>
                  <FiDownload
                    className={styles.fileDownload}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
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
            <ul className={styles.files}>
              {minutes.map((item) => (
                <li key={item.id} className={styles.file}>
                  <FiFileText className={styles.fileIcon} aria-hidden="true" />
                  <span className={styles.fileText}>
                    <strong>{item.name}</strong>
                    <small>
                      {item.kind} · {item.size}
                    </small>
                  </span>
                  <FiDownload
                    className={styles.fileDownload}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </aside>

      {/* ---------------------------------- parecer registrado */}
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

/** Estado vazio quando o slug não existe. */
function CalloutNotFound() {
  return (
    <Callout
      tone="danger"
      title="Entrega não encontrada"
      action={
        <Link to="/painel">
          <Button>Voltar ao painel</Button>
        </Link>
      }
    >
      Nenhuma entrega corresponde a este endereço.
    </Callout>
  );
}
