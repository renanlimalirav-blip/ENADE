import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Settings,
  Download,
  AlertCircle,
  CheckCircle2,
  Plus,
  LogOut,
  FileSpreadsheet
} from 'lucide-react';

export const CoordinatorView = ({ HeaderRoleSwitcher }) => {
  const {
    state,
    evaluateQuestionByNDE,
    reviewQuestionByPeer,
    addMatrix,
    addCompetencyToMatrix,
    addNdeAta,
    suggestRevisionClass,
    dismissAlert,
    updateAlertConfig,
    exportCoordinatorReport,
    logout
  } = useApp();

  const [activeMenu, setActiveMenu] = useState('painel'); // 'painel' | 'governanca' | 'validacao' | 'relatorios' | 'config_alertas'
  const [topSearch, setTopSearch] = useState('');
  const [toast, setToast] = useState('');

  // Filters on Tela C1
  const [courseFilter, setCourseFilter] = useState('Todos');
  const [classFilter, setClassFilter] = useState('Todas');
  const [periodFilter, setPeriodFilter] = useState('30');
  const [discFilter, setDiscFilter] = useState('Todas');
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Governance Tabs on Tela C2
  const [govTab, setGovTab] = useState('cobertura'); // 'cobertura' | 'avaliacao_nde' | 'criterios' | 'atas'
  const [selectedMatrixId, setSelectedMatrixId] = useState('');
  const [showNewMatrixModal, setShowNewMatrixModal] = useState(false);
  const [newMatrixTitle, setNewMatrixTitle] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompCategory, setNewCompCategory] = useState('especifico');
  const [newCompTarget, setNewCompTarget] = useState(50);

  // Parecer do NDE state (US20)
  const [selectedQuestionIdForNDE, setSelectedQuestionIdForNDE] = useState('');
  const [ndeCompetency, setNdeCompetency] = useState('');
  const [ndeContent, setNdeContent] = useState('');
  const [ndeLevelOk, setNdeLevelOk] = useState(true);
  const [ndeRealProblem, setNdeRealProblem] = useState(true);
  const [ndeMatrixAligned, setNdeMatrixAligned] = useState(true);
  const [ndeNotes, setNdeNotes] = useState('');

  // Atas state
  const [ataTitle, setAtaTitle] = useState('');
  const [ataSummary, setAtaSummary] = useState('');

  const showNotice = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Filtered attempts for Tela C1 (BUG-05: aplica periodFilter e topSearch)
  const filteredAttempts = useMemo(() => {
    const now = Date.now();
    const maxAgeMs = (Number(periodFilter) || 30) * 24 * 60 * 60 * 1000;
    const term = topSearch.trim().toLowerCase();

    return state.attempts.filter((a) => {
      if (courseFilter !== 'Todos' && a.userCourse !== courseFilter) return false;
      if (classFilter !== 'Todas' && a.userClass !== classFilter) return false;
      if (discFilter !== 'Todas' && a.discipline !== discFilter) return false;
      if (a.timestamp) {
        const age = now - new Date(a.timestamp).getTime();
        if (age > maxAgeMs) return false;
      }
      if (term) {
        const match =
          (a.discipline || '').toLowerCase().includes(term) ||
          (a.topic || '').toLowerCase().includes(term) ||
          (a.userClass || '').toLowerCase().includes(term) ||
          (a.userCourse || '').toLowerCase().includes(term);
        if (!match) return false;
      }
      return true;
    });
  }, [state.attempts, courseFilter, classFilter, discFilter, periodFilter, topSearch]);

  // Performance & Bottleneck Alerts Calculation (US07)
  const coordMetrics = useMemo(() => {
    const totalAns = filteredAttempts.length;
    const totalRight = filteredAttempts.filter((a) => a.isCorrect).length;
    const overallAccuracy = totalAns > 0 ? Math.round((totalRight / totalAns) * 100) : 0;

    const activeStudentIds = new Set(filteredAttempts.map((a) => a.userId));
    const activeStudentsCount =
      activeStudentIds.size || state.users.filter((u) => u.role === 'aluno').length;

    // By discipline
    const discMap = {};
    filteredAttempts.forEach((a) => {
      const d = a.discipline || 'Geral';
      if (!discMap[d]) discMap[d] = { name: d, right: 0, total: 0 };
      discMap[d].total += 1;
      if (a.isCorrect) discMap[d].right += 1;
    });
    const byDiscipline = Object.values(discMap).map((d) => ({
      ...d,
      pct: Math.round((d.right / d.total) * 100)
    }));

    // By topic & class for bottleneck alerts
    const topicClassMap = {};
    filteredAttempts.forEach((a) => {
      const key = `${a.discipline}||${a.topic}||${a.userClass || 'Turma A'}`;
      if (!topicClassMap[key]) {
        topicClassMap[key] = {
          key,
          discipline: a.discipline || 'Geral',
          topic: a.topic || 'Geral',
          className: a.userClass || 'Turma A',
          wrong: 0,
          total: 0
        };
      }
      topicClassMap[key].total += 1;
      if (!a.isCorrect) topicClassMap[key].wrong += 1;
    });

    const threshold = state.alertConfig?.errorThresholdPct || 50;
    const minResp = state.alertConfig?.minResponses || 1;

    const activeAlerts = Object.values(topicClassMap)
      .map((item) => ({
        ...item,
        errorPct: Math.round((item.wrong / item.total) * 100)
      }))
      .filter(
        (item) =>
          item.total >= minResp &&
          item.errorPct >= threshold &&
          !state.dismissedAlertKeys.includes(item.key)
      )
      .sort((a, b) => b.errorPct - a.errorPct);

    // By class table
    const classMap = {};
    filteredAttempts.forEach((a) => {
      const c = a.userClass || 'Turma A';
      if (!classMap[c]) {
        classMap[c] = {
          className: c,
          studentsSet: new Set(),
          right: 0,
          total: 0,
          topicErrors: {}
        };
      }
      classMap[c].studentsSet.add(a.userId);
      classMap[c].total += 1;
      if (a.isCorrect) classMap[c].right += 1;
      else {
        classMap[c].topicErrors[a.topic] = (classMap[c].topicErrors[a.topic] || 0) + 1;
      }
    });

    const classRows = Object.values(classMap).map((c) => {
      const criticalTopic =
        Object.entries(c.topicErrors).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        'Sem gargalo crítico';
      return {
        className: c.className,
        studentsCount: c.studentsSet.size,
        accuracyPct: Math.round((c.right / c.total) * 100),
        participationPct: Math.min(100, c.studentsSet.size * 25 + 55),
        criticalTopic
      };
    });

    return {
      totalAns,
      overallAccuracy,
      activeStudentsCount,
      byDiscipline,
      activeAlerts,
      classRows
    };
  }, [filteredAttempts, state.users, state.alertConfig, state.dismissedAlertKeys]);

  // Active Matrix on Tela C2
  const currentMatrix = useMemo(() => {
    if (selectedMatrixId) {
      return state.matrices.find((m) => m.id === selectedMatrixId) || state.matrices[0];
    }
    return state.matrices[0] || null;
  }, [state.matrices, selectedMatrixId]);

  // Questions awaiting NDE or validated by peers
  const questionsForNDE = useMemo(() => {
    return state.questions.filter(
      (q) => q.status === 'validada_pares' || q.status === 'em_revisao' || q.status === 'aprovada_nde'
    );
  }, [state.questions]);

  const currentNDEQuestion = useMemo(() => {
    if (selectedQuestionIdForNDE) {
      return state.questions.find((q) => q.id === selectedQuestionIdForNDE) || null;
    }
    return (
      state.questions.find((q) => q.status === 'validada_pares') ||
      state.questions[0] ||
      null
    );
  }, [state.questions, selectedQuestionIdForNDE]);

  const validatedQuestionsCount = useMemo(() => {
    return state.questions.filter((q) => q.peerValidated || q.status === 'aprovada_nde').length;
  }, [state.questions]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOPBAR DARK (ENADE Prep - Coordenador) */}
      <header className="topbar-dark">
        <div className="brand-logo" onClick={() => setActiveMenu('painel')}>
          ENADE Prep
        </div>

        <div className="search-bar-top">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {HeaderRoleSwitcher}
          <span style={{ fontSize: '0.88rem' }}>
            🔔 {coordMetrics.activeAlerts.length}
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            👤 {state.currentUser?.name || 'Coordenador'} ▾
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ background: 'transparent', color: '#fff', borderColor: '#475569' }}
            onClick={logout}
            title="Sair"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <div className="app-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          {[
            { id: 'painel', label: 'Painel de desempenho' },
            { id: 'governanca', label: 'Governança ENADE' },
            { id: 'validacao', label: 'Validação pedagógica' },
            { id: 'relatorios', label: 'Relatórios exportados' },
            { id: 'config_alertas', label: 'Config. de alertas' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              className={`nav-item ${activeMenu === m.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(m.id)}
            >
              <span>{m.label}</span>
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {toast && (
            <div
              className="card"
              style={{
                background: '#eff6ff',
                borderColor: '#93c5fd',
                color: '#1e40af',
                padding: '12px 16px',
                marginBottom: '18px'
              }}
            >
              {toast}
            </div>
          )}

          {/* TELA C1 — PAINEL DE DESEMPENHO E ALERTAS (Page 10 Wireframe - US07) */}
          {activeMenu === 'painel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Painel de desempenho</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setActiveMenu('config_alertas')}
                  >
                    ⚙ Alertas
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      exportCoordinatorReport({
                        title: `Relatorio_Desempenho_${courseFilter}`,
                        format: 'CSV',
                        filters: `${courseFilter} / ${classFilter}`,
                        rows:
                          coordMetrics.classRows.length > 0
                            ? coordMetrics.classRows
                            : [{ Turma: 'Geral', AcertosPct: coordMetrics.overallAccuracy, Respostas: coordMetrics.totalAns }]
                      });
                      showNotice('Relatório exportado em CSV e salvo em Relatórios Exportados!');
                    }}
                  >
                    ⬇ Exportar PDF/CSV
                  </button>
                </div>
              </div>

              {/* Filter Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <select
                  className="form-select"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="Todos">Curso: Todos</option>
                  {state.courses.map((c) => (
                    <option key={c} value={c}>
                      Curso: {c}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="Todas">Turma: Todas</option>
                  {state.classes.map((cl) => (
                    <option key={cl} value={cl}>
                      Turma: {cl}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  <option value="30">Período: 30 dias</option>
                  <option value="90">Período: Semestre</option>
                </select>

                <select
                  className="form-select"
                  value={discFilter}
                  onChange={(e) => setDiscFilter(e.target.value)}
                >
                  <option value="Todas">Disciplina: Todas</option>
                  {state.disciplines.map((d) => (
                    <option key={d.id} value={d.name}>
                      Disciplina: {d.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => showNotice('Filtros aplicados ao painel de desempenho!')}
                >
                  Aplicar
                </button>
              </div>

              {/* Alert Cards Row (US07 Criteria 2: Geração de alerta para tópicos com alto índice de erro) */}
              {coordMetrics.activeAlerts.length > 0 ? (
                <div className="grid-2">
                  {coordMetrics.activeAlerts.map((al, idx) => (
                    <div
                      key={al.key}
                      style={{
                        background: idx === 0 ? '#fef2f2' : '#fffbeb',
                        border: '1px solid #e2e8f0',
                        borderLeft: `5px solid ${idx === 0 ? '#dc2626' : '#f59e0b'}`,
                        borderRadius: '10px',
                        padding: '16px 18px'
                      }}
                    >
                      <div style={{ fontSize: '0.94rem', marginBottom: '12px' }}>
                        <span style={{ marginRight: '6px' }}>{idx === 0 ? '🔴' : '🟠'}</span>
                        <strong>
                          {al.discipline} · {al.topic}
                        </strong>{' '}
                        — {al.errorPct}% de erro · {al.className} · {al.total} respostas
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setDetailModalItem(al)}
                        >
                          Ver detalhes
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            suggestRevisionClass(
                              al,
                              `Aula de revisão solicitada pela coordenação para reforçar ${al.topic} (${al.errorPct}% de erro na turma ${al.className}).`
                            );
                            showNotice(`Sugestão de aula de revisão enviada para a turma ${al.className}!`);
                          }}
                        >
                          Sugerir aula de revisão
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            dismissAlert(al.key);
                            showNotice('Alerta dispensado.');
                          }}
                        >
                          Dispensar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    background: '#f8fafc',
                    borderStyle: 'dashed',
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  Nenhum alerta de gargalo ativo no momento (alertas são gerados automaticamente quando uma turma atinge &ge;{state.alertConfig.errorThresholdPct}% de erro em um tópico).
                </div>
              )}

              {/* 4 KPI Cards */}
              <div className="grid-4">
                <div className="card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    {coordMetrics.overallAccuracy}%
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Acerto geral ▲
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    {coordMetrics.activeStudentsCount}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Alunos ativos
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    {coordMetrics.totalAns}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Questões respondidas
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    {coordMetrics.activeAlerts.length}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Alertas ativos
                  </div>
                </div>
              </div>

              {/* 2 Charts Row */}
              <div className="grid-2">
                <div className="card">
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '14px' }}>
                    % de acertos por disciplina
                  </h3>
                  {coordMetrics.byDiscipline.length === 0 ? (
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Aguardando resoluções de questões pelos estudantes.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {coordMetrics.byDiscipline.map((d) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '110px', fontSize: '0.88rem' }}>{d.name}</span>
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${d.pct}%`,
                                background:
                                  d.pct < 50 ? '#dc2626' : d.pct < 65 ? '#d97706' : 'var(--primary)'
                              }}
                            />
                          </div>
                          <span style={{ width: '40px', textAlign: 'right', fontSize: '0.88rem' }}>
                            {d.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '14px' }}>
                    Evolução semanal por turma
                  </h3>
                  <svg viewBox="0 0 400 130" style={{ width: '100%', height: '130px' }}>
                    <line x1="30" y1="15" x2="30" y2="105" stroke="#cbd5e1" />
                    <line x1="30" y1="105" x2="380" y2="105" stroke="#cbd5e1" />
                    {(() => {
                      const now = Date.now();
                      const weekMs = 7 * 24 * 60 * 60 * 1000;
                      const buckets = [0, 1, 2, 3, 4].map((i) => ({ right: 0, total: 0, idx: i }));
                      filteredAttempts.forEach((a) => {
                        const wAgo = Math.floor(Math.max(0, now - new Date(a.timestamp).getTime()) / weekMs);
                        const bIdx = 4 - Math.min(4, wAgo);
                        buckets[bIdx].total += 1;
                        if (a.isCorrect) buckets[bIdx].right += 1;
                      });
                      const pts = buckets
                        .map((b, i) => ({
                          x: 30 + i * 85,
                          y: b.total > 0 ? Math.max(20, Math.min(100, Math.round(105 - (b.right / b.total) * 85))) : null,
                          pct: b.total > 0 ? Math.round((b.right / b.total) * 100) : null
                        }))
                        .filter((p) => p.y !== null);

                      return (
                        <>
                          {pts.length > 1 && (
                            <polyline
                              fill="none"
                              stroke="var(--primary)"
                              strokeWidth="2.5"
                              points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                            />
                          )}
                          {pts.map((p, i) => (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="4" fill="var(--primary)" />
                              <text x={p.x - 8} y={p.y - 7} fontSize="9" fontWeight="700" fill="var(--primary)">
                                {p.pct}%
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                    {['S1', 'S2', 'S3', 'S4', 'S5'].map((s, i) => (
                      <text key={s} x={26 + i * 85} y="122" fontSize="10" fill="#64748b">
                        {s}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Turmas Table */}
              <div className="card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Turma</th>
                      <th>Alunos</th>
                      <th>Acerto</th>
                      <th>Participação</th>
                      <th>Tópico mais crítico</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {coordMetrics.classRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                          Sem respostas registradas por turma até o momento.
                        </td>
                      </tr>
                    ) : (
                      coordMetrics.classRows.map((row) => (
                        <tr key={row.className}>
                          <td>{row.className}</td>
                          <td>{row.studentsCount}</td>
                          <td>{row.accuracyPct}%</td>
                          <td>{row.participationPct}%</td>
                          <td>{row.criticalTopic}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() =>
                                setDetailModalItem({
                                  discipline: 'Desempenho da Turma',
                                  topic: row.criticalTopic,
                                  className: row.className,
                                  errorPct: 100 - row.accuracyPct,
                                  total: row.studentsCount
                                })
                              }
                            >
                              Detalhar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TELA C2 — GOVERNANÇA E ALINHAMENTO ÀS MATRIZES DO ENADE (Page 11 Wireframe - US20) */}
          {activeMenu === 'governanca' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                    Governança e alinhamento ao ENADE
                  </h1>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    Matriz vigente:{' '}
                    {currentMatrix
                      ? `${currentMatrix.title} · atualizada em ${currentMatrix.updatedAt}`
                      : 'Nenhuma matriz cadastrada ainda — clique em "+ Nova matriz / edital"'}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowNewMatrixModal(true)}
                >
                  + Nova matriz / edital
                </button>
              </div>

              {/* Tabs */}
              <div className="tabs-header" style={{ marginBottom: '4px' }}>
                <button
                  type="button"
                  className={`tab-btn ${govTab === 'cobertura' ? 'active' : ''}`}
                  onClick={() => setGovTab('cobertura')}
                >
                  Cobertura da matriz
                </button>
                <button
                  type="button"
                  className={`tab-btn ${govTab === 'avaliacao_nde' ? 'active' : ''}`}
                  onClick={() => setGovTab('avaliacao_nde')}
                >
                  Avaliação do NDE ({questionsForNDE.length})
                </button>
                <button
                  type="button"
                  className={`tab-btn ${govTab === 'criterios' ? 'active' : ''}`}
                  onClick={() => setGovTab('criterios')}
                >
                  Critérios institucionais
                </button>
                <button
                  type="button"
                  className={`tab-btn ${govTab === 'atas' ? 'active' : ''}`}
                  onClick={() => setGovTab('atas')}
                >
                  Atas e decisões ({state.ndeAtas.length})
                </button>
              </div>

              {govTab === 'cobertura' && (
                <>
                  <div className="matrix-layout-grid">
                    {/* Left: Matriz de referência tree */}
                    <div className="card">
                      <h3 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '10px' }}>
                        Matriz de referência
                      </h3>
                      <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>▾ Formação geral</div>
                        <div>▾ Componente específico</div>
                        {state.disciplines.map((d) => (
                          <div key={d.id} style={{ paddingLeft: '14px', color: 'var(--primary)', fontWeight: 600 }}>
                            ▸ {d.name}
                          </div>
                        ))}
                        {(currentMatrix?.competencies || []).map((c) => (
                          <div key={c.id} style={{ paddingLeft: '14px', color: 'var(--text-secondary)' }}>
                            ▸ {c.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Cobertura do banco */}
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '0.96rem', fontWeight: 700 }}>
                          Cobertura do banco · {validatedQuestionsCount} questões validadas
                        </h3>
                      </div>

                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Competência / conteúdo</th>
                            <th>Qtd</th>
                            <th>Meta</th>
                            <th>Cobertura</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.disciplines.length === 0 && (!currentMatrix || currentMatrix.competencies.length === 0) ? (
                            <tr>
                              <td colSpan={4} style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                                Adicione competências abaixo ou cadastre questões no perfil de Professor para acompanhar a cobertura versus meta.
                              </td>
                            </tr>
                          ) : (
                            // BUG-09 fixed: deduplica competências e conta apenas questões validadas/aprovadas
                            (() => {
                              const validatedOnly = state.questions.filter(
                                (q) => q.peerValidated || q.status === 'aprovada_nde'
                              );
                              const seen = new Set();
                              const rows = [];
                              [
                                ...(currentMatrix?.competencies || []).map((c) => ({
                                  id: c.id,
                                  name: c.name,
                                  target: c.targetCount || 10
                                })),
                                ...state.disciplines.map((d) => ({
                                  id: d.id,
                                  name: d.name,
                                  target: 10
                                }))
                              ].forEach((item) => {
                                const key = item.name.trim().toLowerCase();
                                if (!seen.has(key)) {
                                  seen.add(key);
                                  rows.push({
                                    ...item,
                                    count: validatedOnly.filter(
                                      (q) =>
                                        (q.discipline || '').toLowerCase() === key ||
                                        (q.topic || '').toLowerCase() === key
                                    ).length
                                  });
                                }
                              });
                              return rows;
                            })().map((row) => {
                              const pct = Math.min(100, Math.round((row.count / Math.max(1, row.target)) * 100));
                              return (
                                <tr key={row.id}>
                                  <td>{row.name}</td>
                                  <td>{row.count}</td>
                                  <td>{row.target}</td>
                                  <td style={{ width: '160px' }}>
                                    <div className="progress-track">
                                      <div
                                        className="progress-fill"
                                        style={{
                                          width: `${pct}%`,
                                          background:
                                            pct >= 100
                                              ? '#16a34a'
                                              : pct >= 50
                                              ? '#d97706'
                                              : '#dc2626'
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ✓ meta atingida · ▲ abaixo · 🔴 abaixo de 50%
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setActiveMenu('validacao')}
                        >
                          Ver questões do item
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Parecer do NDE Box (Bottom of Tela C2 - US20) */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '0.98rem' }}>
                          Parecer do NDE ·{' '}
                          {currentNDEQuestion
                            ? `${currentNDEQuestion.code} (${
                                currentNDEQuestion.peerValidated ? 'já validada por pares ✓' : 'em análise'
                              })`
                            : 'Selecione uma questão'}
                        </strong>
                        {state.questions.length > 1 && (
                          <select
                            className="form-select"
                            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.82rem' }}
                            value={currentNDEQuestion?.id || ''}
                            onChange={(e) => setSelectedQuestionIdForNDE(e.target.value)}
                          >
                            {state.questions.map((q) => (
                              <option key={q.id} value={q.id}>
                                {q.code} - {q.discipline} ({q.topic})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <span className="badge badge-revisao">
                        {currentNDEQuestion?.status === 'aprovada_nde' ? 'Aprovada NDE ✓' : 'Aguardando NDE'}
                      </span>
                    </div>

                    {currentNDEQuestion && (
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                        <strong>Enunciado ({currentNDEQuestion.discipline} &gt; {currentNDEQuestion.topic}):</strong>{' '}
                        {currentNDEQuestion.statement}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                      <select
                        className="form-select"
                        value={ndeCompetency}
                        onChange={(e) => setNdeCompetency(e.target.value)}
                      >
                        <option value="">Competência ▾</option>
                        <option value="Formação Geral">Formação Geral</option>
                        <option value="Componente Específico">Componente Específico</option>
                      </select>

                      <select
                        className="form-select"
                        value={ndeContent}
                        onChange={(e) => setNdeContent(e.target.value)}
                      >
                        <option value="">Conteúdo ▾</option>
                        <option value="Resolução de Problemas">Resolução de Problemas</option>
                        <option value="Análise Crítica">Análise Crítica</option>
                      </select>

                      <label
                        onClick={() => setNdeLevelOk(!ndeLevelOk)}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        Nível ENADE: <strong style={{ color: 'var(--primary)' }}>● {ndeLevelOk ? 'Adequado' : 'Ajustar'}</strong>
                      </label>

                      <label
                        onClick={() => setNdeRealProblem(!ndeRealProblem)}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        Problema real: <strong style={{ color: 'var(--primary)' }}>● {ndeRealProblem ? 'Sim' : 'Não'}</strong>
                      </label>

                      <label
                        onClick={() => setNdeMatrixAligned(!ndeMatrixAligned)}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        Alinhada à matriz: <strong style={{ color: 'var(--primary)' }}>● {ndeMatrixAligned ? 'Sim' : 'Não'}</strong>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1 }}
                        placeholder="Parecer..."
                        value={ndeNotes}
                        onChange={(e) => setNdeNotes(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn btn-danger-outline"
                        disabled={!currentNDEQuestion}
                        onClick={() => {
                          evaluateQuestionByNDE(currentNDEQuestion.id, {
                            competency: ndeCompetency,
                            content: ndeContent,
                            enadeLevel: ndeLevelOk,
                            realProblem: ndeRealProblem,
                            matrixAligned: ndeMatrixAligned,
                            notes: ndeNotes,
                            decision: 'reprovar'
                          });
                          setNdeNotes('');
                          showNotice(`Questão ${currentNDEQuestion.code} reprovada pelo NDE.`);
                        }}
                      >
                        ✖ Reprovar
                      </button>

                      <button
                        type="button"
                        className="btn btn-warning-outline"
                        disabled={!currentNDEQuestion}
                        onClick={() => {
                          evaluateQuestionByNDE(currentNDEQuestion.id, {
                            competency: ndeCompetency,
                            content: ndeContent,
                            enadeLevel: ndeLevelOk,
                            realProblem: ndeRealProblem,
                            matrixAligned: ndeMatrixAligned,
                            notes: ndeNotes,
                            decision: 'devolver'
                          });
                          setNdeNotes('');
                          showNotice(`Questão ${currentNDEQuestion.code} devolvida ao professor autor.`);
                        }}
                      >
                        ↩ Devolver ao autor
                      </button>

                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={!currentNDEQuestion || !currentNDEQuestion.peerValidated}
                        title={
                          currentNDEQuestion && !currentNDEQuestion.peerValidated
                            ? 'Aprovação para o banco exige revisão por pares concluída antes do parecer do NDE.'
                            : ''
                        }
                        onClick={() => {
                          if (!currentNDEQuestion.peerValidated) {
                            showNotice('Aprovação exige revisão por pares concluída antes do parecer do NDE.');
                            return;
                          }
                          evaluateQuestionByNDE(currentNDEQuestion.id, {
                            competency: ndeCompetency,
                            content: ndeContent,
                            enadeLevel: ndeLevelOk,
                            realProblem: ndeRealProblem,
                            matrixAligned: ndeMatrixAligned,
                            notes: ndeNotes,
                            decision: 'aprovar'
                          });
                          setNdeNotes('');
                          showNotice(`Questão ${currentNDEQuestion.code} aprovada oficialmente pelo NDE para o banco!`);
                        }}
                      >
                        ✔ Aprovar para o banco
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    <span>Aprovação exige revisão por pares + parecer do NDE</span>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        exportCoordinatorReport({
                          title: 'Relatorio_Cobertura_Matriz_ENADE',
                          format: 'CSV',
                          filters: 'Matriz Vigente',
                          rows: state.disciplines.map((d) => ({
                            Competencia: d.name,
                            QuestoesCadastradas: state.questions.filter((q) => q.discipline === d.name).length,
                            Meta: 10
                          }))
                        });
                        showNotice('Relatório de cobertura da matriz exportado!');
                      }}
                    >
                      ⬇ Exportar relatório de cobertura
                    </button>
                  </div>
                </>
              )}

              {govTab === 'avaliacao_nde' && (
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                    Fila de Avaliação do NDE
                  </h3>
                  {state.questions.length === 0 ? (
                    <div className="empty-state">Nenhuma questão cadastrada no banco até o momento.</div>
                  ) : (
                    state.questions.map((q) => (
                      <div
                        key={q.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <div>
                          <strong>{q.code}</strong> · {q.discipline} &gt; {q.topic} ({q.year})
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                            {q.statement}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedQuestionIdForNDE(q.id);
                            setGovTab('cobertura');
                          }}
                        >
                          Emitir Parecer NDE
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {govTab === 'criterios' && (
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                    Critérios Institucionais de Qualidade ENADE (NDE)
                  </h3>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {state.institutionalCriteria.map((c, idx) => (
                      <li key={idx} style={{ fontSize: '0.92rem' }}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {govTab === 'atas' && (
                <div className="grid-2">
                  <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                      Registrar Nova Ata / Decisão do NDE
                    </h3>
                    <div className="form-group">
                      <label className="form-label">Título da Reunião / Pauta</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Reunião Ordinária NDE - Cruzamento de Ementas"
                        value={ataTitle}
                        onChange={(e) => setAtaTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Deliberações e Encaminhamentos</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Resumo das decisões sobre matrizes e revisão..."
                        value={ataSummary}
                        onChange={(e) => setAtaSummary(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (!ataTitle.trim()) return;
                        addNdeAta({ title: ataTitle, summary: ataSummary });
                        setAtaTitle('');
                        setAtaSummary('');
                        showNotice('Ata registrada com sucesso!');
                      }}
                    >
                      Salvar Ata do NDE
                    </button>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                      Atas Registradas
                    </h3>
                    {state.ndeAtas.length === 0 ? (
                      <div className="empty-state">Nenhuma ata registrada ainda.</div>
                    ) : (
                      state.ndeAtas.map((a) => (
                        <div key={a.id} style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                          <div style={{ fontWeight: 700 }}>{a.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {a.date} · Resp: {a.author}
                          </div>
                          <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>{a.summary}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VALIDAÇÃO PEDAGÓGICA (US02 + US20) */}
          {activeMenu === 'validacao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                Validação Pedagógica do Banco de Questões
              </h1>
              {state.questions.length === 0 ? (
                <div className="empty-state">Nenhuma questão cadastrada no banco.</div>
              ) : (
                state.questions.map((q) => (
                  <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <strong>{q.code}</strong>
                        <span className="badge badge-neutral">{q.discipline} &gt; {q.topic}</span>
                        <span className="badge badge-neutral">{q.year}</span>
                        {q.peerValidated && <span className="badge badge-validada">Validada por Pares</span>}
                        {q.status === 'aprovada_nde' && <span className="badge badge-atualizada">Aprovada NDE</span>}
                      </div>
                      <div style={{ fontSize: '0.92rem' }}>{q.statement}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!q.peerValidated && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            reviewQuestionByPeer(q.id, true, 'Validado pela Coordenação');
                            showNotice(`Questão ${q.code} validada!`);
                          }}
                        >
                          Validar (Pares)
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          evaluateQuestionByNDE(q.id, {
                            competency: q.discipline,
                            content: q.topic,
                            enadeLevel: true,
                            realProblem: true,
                            matrixAligned: true,
                            notes: 'Aprovada na Validação Pedagógica',
                            decision: 'aprovar'
                          });
                          showNotice(`Questão ${q.code} aprovada para o banco!`);
                        }}
                      >
                        ✔ Aprovar NDE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* RELATÓRIOS EXPORTADOS */}
          {activeMenu === 'relatorios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Relatórios exportados</h1>
              {state.exportedReports.length === 0 ? (
                <div className="empty-state">
                  Nenhum relatório exportado ainda. Utilize o botão &ldquo;Exportar PDF/CSV&rdquo; no Painel de Desempenho.
                </div>
              ) : (
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Relatório</th>
                        <th>Filtros</th>
                        <th>Formato</th>
                        <th>Data / Hora</th>
                        <th>Responsável</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.exportedReports.map((r) => (
                        <tr key={r.id}>
                          <td><strong>{r.title}</strong></td>
                          <td>{r.filters}</td>
                          <td>{r.format}</td>
                          <td>{r.createdAt}</td>
                          <td>{r.author}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CONFIG. DE ALERTAS */}
          {activeMenu === 'config_alertas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Configuração de Alertas de Gargalos</h1>
              <div className="card" style={{ maxWidth: '540px' }}>
                <div className="form-group">
                  <label className="form-label">
                    Percentual mínimo de erro no tópico para disparar alerta (%)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    min={10}
                    max={100}
                    value={state.alertConfig.errorThresholdPct}
                    onChange={(e) =>
                      updateAlertConfig({ errorThresholdPct: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Quantidade mínima de respostas no tópico para avaliação
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    min={1}
                    value={state.alertConfig.minResponses}
                    onChange={(e) =>
                      updateAlertConfig({ minResponses: Number(e.target.value) })
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => showNotice('Configurações de alerta salvas!')}
                >
                  Salvar parâmetros
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Nova Matriz / Edital */}
      {showNewMatrixModal && (
        <div className="modal-backdrop" onClick={() => setShowNewMatrixModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '12px' }}>Cadastrar Matriz de Referência / Edital ENADE</h3>
            <div className="form-group">
              <label className="form-label">Título da Matriz / Edital</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: ENADE 2025 – Tecnologia em ADS"
                value={newMatrixTitle}
                onChange={(e) => setNewMatrixTitle(e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Competência inicial (opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Engenharia de Software"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Meta de questões</label>
                <input
                  type="number"
                  className="form-input"
                  value={newCompTarget}
                  onChange={(e) => setNewCompTarget(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowNewMatrixModal(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (!newMatrixTitle.trim()) return;
                  addMatrix({
                    title: newMatrixTitle.trim(),
                    competencies: newCompName.trim()
                      ? [{ id: `c_${Date.now()}`, category: newCompCategory, name: newCompName.trim(), targetCount: newCompTarget }]
                      : []
                  });
                  setNewMatrixTitle('');
                  setNewCompName('');
                  setShowNewMatrixModal(false);
                  showNotice('Nova matriz de referência cadastrada!');
                }}
              >
                Salvar Matriz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Alerta */}
      {detailModalItem && (
        <div className="modal-backdrop" onClick={() => setDetailModalItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '10px' }}>
              Diagnóstico de Gargalo: {detailModalItem.discipline} &gt; {detailModalItem.topic}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Turma: <strong>{detailModalItem.className}</strong> · Taxa de erro observada:{' '}
              <strong style={{ color: 'var(--danger)' }}>{detailModalItem.errorPct}%</strong> ({detailModalItem.total} interações).
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  suggestRevisionClass(
                    detailModalItem,
                    `Revisão agendada para ${detailModalItem.topic} na turma ${detailModalItem.className}.`
                  );
                  setDetailModalItem(null);
                  showNotice('Aula de revisão sugerida para a turma!');
                }}
              >
                Sugerir aula de revisão
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setDetailModalItem(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

