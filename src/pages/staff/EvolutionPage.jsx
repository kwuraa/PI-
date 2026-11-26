import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiLock } from 'react-icons/fi';

import ProjectReportSheet from '../../components/staff/ProjectReportSheet.jsx';
import ReportLetterhead from '../../components/staff/ReportLetterhead.jsx';
import { handlePrint } from '../../components/staff/reportShared.js';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import FileList from '../../components/ui/FileList/FileList.jsx';
import FileRow from '../../components/ui/FileRow/FileRow.jsx';
import PageHeader from '../../components/ui/PageHeader/PageHeader.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  buildProjectReport,
  getAdvisedProjects,
} from '../../utils/projectReport.js';
import styles from './EvolutionPage.module.css';

/**
 * Relatório por projeto: o seletor lista os projetos de PI sob orientação do
 * professor logado e o relatório exibido é montado a partir do projeto ativo.
 */
export default function EvolutionPage() {
  const { user } = useAuth();
  const projects = useMemo(() => getAdvisedProjects(user), [user]);
  const [selectedId, setSelectedId] = useState(null);

  const report = useMemo(() => {
    const project =
      projects.find((item) => item.id === selectedId) ?? projects[0];
    return project ? buildProjectReport(project) : null;
  }, [projects, selectedId]);

  return (
    <div className={styles.page} data-abnt-report>
      <Link to="/painel" className={styles.backLink} data-print-hide>
        <FiArrowLeft aria-hidden="true" />
        Painel do professor
      </Link>

      <ReportLetterhead semesterLabel={report?.semesterLabel} />

      <PageHeader
        data-print-hide
        gap="sm"
        actionsGap="lg"
        split="md"
        titleLine="normal"
        className={styles.pageHeader}
        eyebrow={
          projects.length > 0 ? (
            <Badge tone="primary">
              {projects.length} projetos sob orientação
            </Badge>
          ) : null
        }
        title="Relatório por projeto"
        lead="Selecione um projeto de PI sob sua orientação para gerar o relatório da equipe."
        actions={
          report && (
            <Button
              className={styles.printHide}
              data-print-hide
              icon={<FiDownload aria-hidden="true" />}
              onClick={handlePrint}
            >
              Exportar relatório em PDF
            </Button>
          )
        }
      />

      {!report ? (
        <Card padding="lg" className={styles.selector} data-print-hide>
          <p className={styles.emptyText}>
            Nenhum projeto de PI sob sua orientação no momento.
          </p>
        </Card>
      ) : (
        <>
          <Card padding="md" className={styles.selector} data-print-hide>
            <Select
              label="Projeto"
              hint={`${projects.length} projeto(s) cadastrado(s) para você`}
              value={report.id}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
            <div className={styles.identity}>
              <Badge tone={report.status.tone}>{report.status.label}</Badge>
              <span className={styles.projectMeta}>{report.projectMeta}</span>
            </div>
            <p className={styles.groupLabel}>{report.title}</p>
            <p className={styles.groupMeta}>
              {report.groupLabel} · {report.groupMeta}
            </p>
            <p className={styles.updated}>{report.updatedNote}</p>
          </Card>

          <div className={styles.grid} data-report-body>
            <section className={styles.column}>
              <SectionHeader
                title="Histórico do projeto"
                subtitle="Etapas registradas no cadastro"
              />
              <ol className={styles.timeline}>
                {report.timeline.map((step) => (
                  <li key={step.id}>
                    <Card padding="md" className={styles.stepCard} data-abnt-flat>
                      <div className={styles.stepTop}>
                        <Badge tone="primary">{step.tag}</Badge>
                        {step.locked && (
                          <FiLock className={styles.stepLock} aria-hidden="true" />
                        )}
                      </div>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepSummary}>{step.summary}</p>
                      <p className={styles.stepEvidence}>{step.evidence}</p>
                    </Card>
                  </li>
                ))}
              </ol>
              <div className={styles.exportRow}>
                <Button
                  className={styles.printHide}
                  data-print-hide
                  variant="secondary"
                  icon={<FiDownload aria-hidden="true" />}
                  onClick={handlePrint}
                >
                  Exportar relatório
                </Button>
              </div>
            </section>

            <section className={styles.column}>
              <SectionHeader title="Evolução qualitativa" />
              <div className={styles.qualitative}>
                {report.qualitative.map((item) => (
                  <Card
                    key={item.id}
                    padding="md"
                    className={styles.qualCard}
                    data-abnt-flat
                  >
                    <h3 className={styles.qualTitle}>{item.title}</h3>
                    <p className={styles.qualSummary}>{item.summary}</p>
                    <p className={styles.qualEvidence}>{item.evidence}</p>
                  </Card>
                ))}
              </div>

              <Card padding="md" className={styles.docsCard} data-abnt-flat>
                <h3 className={styles.docsTitle}>
                  Documentos entregues · {report.files.length}
                </h3>
                {report.files.length > 0 ? (
                  <FileList>
                    {report.files.map((file) => (
                      <FileRow
                        key={file.id}
                        name={file.name}
                        meta={`${file.kind} · ${file.size}${
                          file.version ? ` · ${file.version}` : ''
                        }`}
                        icon="square"
                        variant="page"
                        action={null}
                      />
                    ))}
                  </FileList>
                ) : (
                  <p className={styles.qualSummary}>
                    Nenhum documento anexado a este projeto.
                  </p>
                )}
              </Card>
            </section>
          </div>

          <ProjectReportSheet />
        </>
      )}
    </div>
  );
}
