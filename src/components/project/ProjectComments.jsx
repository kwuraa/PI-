import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiEdit2, FiSend, FiTrash2 } from 'react-icons/fi';

import Avatar from '../ui/Avatar/Avatar.jsx';
import Button from '../ui/Button/Button.jsx';
import Callout from '../ui/Callout/Callout.jsx';
import Card from '../ui/Card/Card.jsx';
import SectionHeader from '../ui/SectionHeader/SectionHeader.jsx';
import TextField from '../ui/TextField/TextField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getTeam } from '../../mocks/projectsMock.js';
import styles from './ProjectComments.module.css';

export default function ProjectComments({ project }) {
  const { user, isRole } = useAuth();
  const isLogged = Boolean(user);
  const team = getTeam(project);
  /** Moderação: professor e coordenador excluem qualquer comentário. */
  const canModerate = isRole('professor') || isRole('coordenador');

  /** Texto do campo e comentários criados nesta sessão. */
  const [comment, setComment] = useState('');
  const [extraComments, setExtraComments] = useState([]);
  /** Edições (id → texto) e exclusões (ids) aplicadas sobre os comentários. */
  const [editedTexts, setEditedTexts] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  /** Em edição: qual comentário e o texto no campo. */
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  /** Exclusão em confirmação (evita apagar sem querer). */
  const [confirmId, setConfirmId] = useState(null);

  const comments = useMemo(
    () =>
      [...(project?.comments ?? []), ...extraComments]
        .filter((item) => !deletedIds.includes(item.id))
        .map((item) =>
          editedTexts[item.id] !== undefined
            ? { ...item, text: editedTexts[item.id] }
            : item
        ),
    [project, extraComments, deletedIds, editedTexts]
  );

  /** Envia um comentário novo (só com conta ativa). */
  const handleComment = (event) => {
    event.preventDefault();
    const text = comment.trim();
    if (!text) return;
    setExtraComments((prev) => [
      ...prev,
      {
        id: `cmt-local-${prev.length + 1}`,
        author: user.name,
        initials: user.initials,
        when: 'Agora',
        text,
        team: team?.members.includes(user.name) ?? false,
      },
    ]);
    setComment('');
  };

  /* --------------------------- moderação dos comentários
     (editar: só o autor; excluir: o autor OU professor/coordenador) */
  const startEdit = (item) => {
    setConfirmId(null);
    setEditId(item.id);
    setEditText(item.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const submitEdit = (event, item) => {
    event.preventDefault();
    const text = editText.trim();
    if (!text) return;
    setEditedTexts((prev) => ({ ...prev, [item.id]: text }));
    cancelEdit();
  };

  const askDelete = (id) => {
    cancelEdit();
    setConfirmId(id);
  };

  const deleteComment = (id) => {
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setConfirmId(null);
  };

  return (
    <Card padding="md" className={styles.commentsCard}>
      <SectionHeader
        title={`Comentários · ${comments.length} ${
          comments.length === 1 ? 'comentário' : 'comentários'
        }`}
      />

      {/* Lista de comentários RESERVADA a quem está logado (os autores
          podem ter nome real — LGPD); o visitante vê só a contagem e
          o convite de acesso. */}
      {isLogged && comments.length === 0 && (
        <p className={styles.emptyComments}>
          Seja o primeiro a comentar este projeto.
        </p>
      )}

      {isLogged && (
        <ul className={styles.comments}>
          {comments.map((item) => {
            /* Dono do comentário (aluno que o publicou). */
            const isOwn = item.author === user.name;
            const canEdit = isOwn; /* edição: SÓ o próprio comentário */
            const canDelete = isOwn || canModerate;
            const isEditing = editId === item.id;
            const wasEdited = editedTexts[item.id] !== undefined;

            return (
              <li key={item.id} className={styles.comment}>
                <Avatar
                  initials={item.initials ?? '·'}
                  tone={item.team ? 'primary' : 'neutral'}
                  size="sm"
                />
                <div className={styles.commentBody}>
                  <p className={styles.commentHead}>
                    <strong>{item.author}</strong>
                    <span>
                      {item.when}
                      {wasEdited ? ' · editado' : ''}
                    </span>
                  </p>

                  {isEditing ? (
                    <form
                      className={styles.commentEdit}
                      onSubmit={(event) => submitEdit(event, item)}
                    >
                      <textarea
                        className={styles.commentEditText}
                        rows={3}
                        aria-label={`Editar comentário de ${item.author}`}
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        autoFocus
                      />
                      <div className={styles.commentEditActions}>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!editText.trim()}
                        >
                          Salvar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className={styles.commentText}>{item.text}</p>

                      {(canEdit || canDelete) && (
                        <div className={styles.commentActions}>
                          {canEdit && (
                            <button
                              type="button"
                              className={styles.commentAction}
                              onClick={() => startEdit(item)}
                            >
                              <FiEdit2 size={14} aria-hidden="true" />
                              Editar
                            </button>
                          )}

                          {canDelete &&
                            (confirmId === item.id ? (
                              <span className={styles.commentConfirm}>
                                Excluir este comentário?
                                <button
                                  type="button"
                                  className={styles.commentActionDanger}
                                  onClick={() => deleteComment(item.id)}
                                >
                                  Sim, excluir
                                </button>
                                <button
                                  type="button"
                                  className={styles.commentAction}
                                  onClick={() => setConfirmId(null)}
                                >
                                  Manter
                                </button>
                              </span>
                            ) : (
                              <button
                                type="button"
                                className={styles.commentAction}
                                onClick={() => askDelete(item.id)}
                              >
                                <FiTrash2 size={14} aria-hidden="true" />
                                Excluir
                              </button>
                            ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isLogged ? (
        <form className={styles.commentForm} onSubmit={handleComment}>
          <TextField
            label="Participe da conversa"
            placeholder="Escreva um comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            type="submit"
            icon={<FiSend aria-hidden="true" />}
            disabled={!comment.trim()}
          >
            Enviar comentário
          </Button>
        </form>
      ) : (
        <Callout
          tone="neutral"
          icon={<FiAlertTriangle size={20} aria-hidden="true" />}
          title="Entre para comentar"
        >
          <Link to="/login">Acesse com sua conta institucional</Link> para
          comentar e acompanhar novidades.
        </Callout>
      )}
    </Card>
  );
}
