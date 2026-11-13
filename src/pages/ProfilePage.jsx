/**
 * PI² — Meu perfil e configurações (rota "/perfil").
 * -----------------------------------------------------------------------------
 * Segue o protótipo "Perfil e configurações de Ana Costa":
 *  • topo com h1 "Meu perfil" + subtítulo;
 *  • no desktop (≥1024px) DUAS colunas — à esquerda o cartão de identidade e
 *    o card "Dados institucionais" (e-mail e curso travados, com texto de
 *    apoio); à direita os cards "Notificações" e "Conta e privacidade" e o
 *    botão "Sair da conta" (largura própria, como no mockup);
 *  • no mobile tudo se empilha na mesma ordem do protótipo.
 * Extras do sistema:
 *  • seletor de ESPAÇO ATIVO (troca de perfis simulada) para usuários
 *    multiperfil (ex.: professor que também coordena);
 *  • salvar alterações e logout são simulados (sem backend).
 * TopBar, breadcrumb e rodapé vêm do MainLayout — a página NÃO repete rodapé.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHelpCircle,
  FiKey,
  FiLogOut,
  FiShield,
} from 'react-icons/fi';

import Avatar from '../components/ui/Avatar/Avatar.jsx';
import Badge from '../components/ui/Badge/Badge.jsx';
import Button from '../components/ui/Button/Button.jsx';
import Card from '../components/ui/Card/Card.jsx';
import FilterChips from '../components/ui/FilterChips/FilterChips.jsx';
import ListRow from '../components/ui/ListRow/ListRow.jsx';
import SectionHeader from '../components/ui/SectionHeader/SectionHeader.jsx';
import TextField from '../components/ui/TextField/TextField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './ProfilePage.module.css';

/** Rótulo do papel (badge do cartão). */
const ROLE_LABELS = {
  aluno: 'Aluna',
  professor: 'Professor',
  coordenador: 'Coordenador',
  secretaria: 'Secretaria',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, activeRoles, spaceOptions, switchSpace, logout } = useAuth();

  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const [notifyProjects, setNotifyProjects] = useState(true);
  const [notifyNews, setNotifyNews] = useState(false);

  const roleLabel = activeRoles.map((r) => ROLE_LABELS[r]).join(' e ');

  /** Espaço ativo como "value" do seletor (chave estável = roles juntos). */
  const activeKey = activeRoles.join(',');

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meu perfil</h1>
        <p className={styles.subtitle}>
          Seu espaço, suas informações e suas preferências no PI².
        </p>
      </header>

      {/* coluna esquerda (dados) + coluna direita (preferências) no desktop */}
      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          {/* ---------------------------------- cartão do perfil */}
          <Card padding="lg" className={styles.identity}>
            <Avatar initials={user.initials} tone="primary" size="lg" />
            <div className={styles.identityTexts}>
              <h2 className={styles.identityName}>{user.name}</h2>
              <Badge tone="primary">{roleLabel}</Badge>
              <p className={styles.identityMeta}>
                {user.course}
                {user.period ? ` · ${user.period}` : ''}
                {user.registration ? ` · Matrícula ${user.registration}` : ''}
              </p>
            </div>
          </Card>

          {/* --------------------------------- espaço ativo (RBAC) */}
          {spaceOptions && (
            <Card padding="lg" className={styles.block}>
              <SectionHeader
                title="Espaço ativo"
                subtitle="Simulação de troca de perfis: escolha como você quer atuar agora."
              />
              <FilterChips
                options={spaceOptions.map((option) => ({
                  value: option.roles.join(','),
                  label: option.label,
                }))}
                value={activeKey}
                onChange={(key) => key && switchSpace(key.split(','))}
                clearLabel={null}
              />
            </Card>
          )}

          {/* ------------------------------------------- dados */}
          <Card padding="lg" className={styles.block}>
            <SectionHeader title="Dados institucionais" />
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                setSaved(true);
              }}
            >
              <TextField
                label="Nome completo"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
              <TextField
                label="E-mail institucional"
                value={user.email}
                locked
                readOnly
                hint="Vinculado à sua instituição. Para alterar, procure o suporte acadêmico."
              />
              <TextField label="Curso" value={user.course} locked readOnly />
              <Button type="submit" fullWidth size="lg">
                Salvar alterações
              </Button>
              {saved && <p className={styles.savedNote}>Alterações salvas (simulação).</p>}
            </form>
          </Card>
        </div>

        <div className={styles.sideColumn}>
          {/* -------------------------------------- notificações */}
          <Card padding="lg" className={styles.block}>
            <SectionHeader title="Notificações" />
            <div className={styles.settings}>
              <label className={styles.settingRow}>
                <span className={styles.settingTexts}>
                  <strong>Atualizações dos meus projetos</strong>
                  <span>Pareceres, ajustes e aprovações do orientador.</span>
                </span>
                <input
                  type="checkbox"
                  className={styles.switch}
                  checked={notifyProjects}
                  onChange={(e) => setNotifyProjects(e.target.checked)}
                />
              </label>
              <label className={styles.settingRow}>
                <span className={styles.settingTexts}>
                  <strong>Novidades do repositório</strong>
                  <span>Novos projetos e descobertas da comunidade.</span>
                </span>
                <input
                  type="checkbox"
                  className={styles.switch}
                  checked={notifyNews}
                  onChange={(e) => setNotifyNews(e.target.checked)}
                />
              </label>
            </div>
          </Card>

          {/* ---------------------------------- conta/privacidade */}
          <Card padding="lg" className={styles.block}>
            <SectionHeader title="Conta e privacidade" />
            <div className={styles.rows}>
              <ListRow plain danger icon={<FiKey aria-hidden="true" />} title="Alterar senha" />
              <ListRow
                plain
                danger
                icon={<FiShield aria-hidden="true" />}
                title="Privacidade e termos de uso"
              />
              <ListRow
                plain
                danger
                icon={<FiHelpCircle aria-hidden="true" />}
                title="Ajuda e suporte"
                to="/ajuda"
              />
            </div>
          </Card>

          <Button
            variant="secondary"
            className={styles.logout}
            icon={<FiLogOut aria-hidden="true" />}
            onClick={handleLogout}
          >
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
