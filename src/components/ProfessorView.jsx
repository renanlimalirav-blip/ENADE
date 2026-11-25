import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  Monitor,
  Smartphone,
  Check,
  AlertTriangle,
  Download,
  Plus,
  Edit3,
  CheckCircle2,
  CornerUpLeft,
  LogOut,
  FileText,
  ExternalLink
} from 'lucide-react';

export const ProfessorView = ({ HeaderRoleSwitcher }) => {
  const {
    state,
    addCourse,
    deleteQuestion,
    saveQuestion,
    reviewQuestionByPeer,
    recordProfessorDownload,
    logout
  } = useApp();

  const [activeNav, setActiveNav] = useState('minhas_questoes'); // 'inicio' | 'minhas_questoes' | 'revisao_pares' | 'repositorio' | 'downloads'
  const [showEditor, setShowEditor] = useState(true);
  const [topSearch, setTopSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Form state for Tela P1 — Nova Questão / Edição
  const [editingId, setEditingId] = useState(null);
  const [lastSubmittedQuestion, setLastSubmittedQuestion] = useState(null);
  const [showAddCourseInput, setShowAddCourseInput] = useState(false);
  const [course, setCourse] = useState(state.currentUser?.course || 'ADS / Computação');
  const [customCourse, setCustomCourse] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Média');
  const [year, setYear] = useState('ENADE 2023');
  const [isUpdated, setIsUpdated] = useState(true);
  const [baseText, setBaseText] = useState('');
  const [statement, setStatement] = useState('');
  const [options, setOptions] = useState([
    { letter: 'A', text: '' },
    { letter: 'B', text: '' },
    { letter: 'C', text: '' },
    { letter: 'D', text: '' },
    { letter: 'E', text: '' }
  ]);
  const [correctOption, setCorrectOption] = useState('C');
  const [shortErrorReason, setShortErrorReason] = useState('');

  // Section 3: Explicação pedagógica (US05, US15) e materiais (US24)
  const [expTab, setExpTab] = useState('etapas'); // 'etapas' | 'video' | 'links'
  const [mainIdea, setMainIdea] = useState('');
  const [steps, setSteps] = useState(['', '']);
  const [summary, setSummary] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('2 min');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkType, setLinkType] = useState('Artigo');
  const [linkUrl, setLinkUrl] = useState('');
  const [studyLinks, setStudyLinks] = useState([]);
  const [linkValidationStatus, setLinkValidationStatus] = useState('');

  // Right Column Preview Mode (Web vs Mobile - US12)
  const [previewDevice, setPreviewDevice] = useState('web'); // 'web' | 'mobile'

  // Peer review feedback input & filter (BUG-11)
  const [peerNotes, setPeerNotes] = useState({});
  const [peerFilter, setPeerFilter] = useState('pendentes'); // 'pendentes' | 'todas'

  // Shared repository filters (US18)
  const [repoCourseFilter, setRepoCourseFilter] = useState('Todos');
  const [repoDiscFilter, setRepoDiscFilter] = useState('Todas');
  const [repoDiffFilter, setRepoDiffFilter] = useState('Todas');
  const [repoYearFilter, setRepoYearFilter] = useState('Todos');
  const [selectedRepoIds, setSelectedRepoIds] = useState([]);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const resetForm = () => {
    setEditingId(null);
    setDiscipline('');
    setCustomDiscipline('');
    setTopic('');
    setCustomTopic('');
    setDifficulty('Média');
    setYear('ENADE 2023');
    setIsUpdated(true);
    setBaseText('');
    setStatement('');
    setOptions([
      { letter: 'A', text: '' },
      { letter: 'B', text: '' },
      { letter: 'C', text: '' },
      { letter: 'D', text: '' },
      { letter: 'E', text: '' }
    ]);
    setCorrectOption('C');
    setShortErrorReason('');
    setMainIdea('');
    setSteps(['', '']);
    setSummary('');
    setVideoUrl('');
    setStudyLinks([]);
    setLinkValidationStatus('');
  };

  const loadQuestionIntoForm = (q) => {
    setEditingId(q.id);
    setCourse(q.course || state.currentUser?.course || 'ADS / Computação');
    setCustomCourse('');
    setShowAddCourseInput(false);
    setDiscipline(q.discipline);
    setCustomDiscipline('');
    setTopic(q.topic);
    setCustomTopic('');
    setDifficulty(q.difficulty || 'Média');
    setYear(q.year || 'ENADE 2023');
    setIsUpdated(Boolean(q.isUpdated));
    setBaseText(q.baseText || '');
    setStatement(q.statement || '');
    setOptions(
      q.options && q.options.length === 5
        ? q.options
        : [
            { letter: 'A', text: '' },
            { letter: 'B', text: '' },
            { letter: 'C', text: '' },
            { letter: 'D', text: '' },
            { letter: 'E', text: '' }
          ]
    );
    setCorrectOption(q.correctOption || 'C');
    setShortErrorReason(q.shortErrorReason || '');
    setMainIdea(q.explanation?.mainIdea || '');
    setSteps(
      q.explanation?.steps && q.explanation.steps.length > 0
        ? q.explanation.steps
        : ['', '']
    );
    setSummary(q.explanation?.summary || '');
    setVideoUrl(q.explanation?.videoUrl || '');
    setVideoDuration(q.explanation?.videoDuration || '2 min');
    setStudyLinks(q.studyLinks || []);
    setActiveNav('minhas_questoes');
    setShowEditor(true);
  };

  const effectiveCourse = (course === '__novo_curso__' ? customCourse : course).trim();
  const effectiveDiscipline = (discipline === '__nova__' ? customDiscipline : discipline).trim();
  const effectiveTopic = (topic === '__novo__' ? customTopic : topic).trim();

  // Checklist de completude
  const hasClassification = Boolean(effectiveCourse && effectiveDiscipline && effectiveTopic && difficulty);
  const hasStatement = Boolean(statement.trim().length > 5);
  const hasFiveOptions = options.every((o) => o.text.trim().length > 0);
  const hasExplanation = Boolean(
    mainIdea.trim() ||
      steps.some((s) => s.trim()) ||
      summary.trim() ||
      videoUrl.trim()
  );

  // Similar questions in repository detector
  const similarQuestions = useMemo(() => {
    if (!effectiveTopic && !statement.trim()) return [];
    return state.questions.filter((q) => {
      if (q.id === editingId) return false;
      if (effectiveTopic && q.topic?.toLowerCase() === effectiveTopic.toLowerCase()) return true;
      if (statement.trim().length > 15 && q.statement?.toLowerCase().includes(statement.trim().slice(0, 15).toLowerCase())) {
        return true;
      }
      return false;
    });
  }, [state.questions, effectiveTopic, statement, editingId]);

  const pendingPeerReviewList = useMemo(() => {
    return state.questions.filter((q) => q.status === 'em_revisao');
  }, [state.questions]);

  const filteredRepoQuestions = useMemo(() => {
    return state.questions.filter((q) => {
      if (repoCourseFilter !== 'Todos' && q.course !== repoCourseFilter) return false;
      if (repoDiscFilter !== 'Todas' && q.discipline !== repoDiscFilter) return false;
      if (repoDiffFilter !== 'Todas' && q.difficulty !== repoDiffFilter) return false;
      if (repoYearFilter !== 'Todos' && q.year !== repoYearFilter) return false;
      if (topSearch.trim()) {
        const term = topSearch.toLowerCase();
        const match =
          q.statement?.toLowerCase().includes(term) ||
          q.discipline?.toLowerCase().includes(term) ||
          q.topic?.toLowerCase().includes(term) ||
          q.course?.toLowerCase().includes(term) ||
          q.code?.toLowerCase().includes(term);
        if (!match) return false;
      }
      return true;
    });
  }, [state.questions, repoCourseFilter, repoDiscFilter, repoDiffFilter, repoYearFilter, topSearch]);

  const handleSave = (submitForReview) => {
    if (!effectiveCourse) {
      notify('Selecione ou digite o Curso do ENADE na seção 1. Classificação.');
      return;
    }
    if (!effectiveDiscipline || !effectiveTopic) {
      notify('Preencha a Disciplina e o Assunto/Tópico na seção 1. Classificação.');
      return;
    }
    if (!statement.trim()) {
      notify('Preencha o enunciado da questão na seção 2.');
      return;
    }

    if (course === '__novo_curso__' && customCourse.trim()) {
      addCourse(customCourse.trim());
      setCourse(customCourse.trim());
      setCustomCourse('');
    }

    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    const saved = saveQuestion(
      {
        id: editingId,
        course: effectiveCourse,
        discipline: effectiveDiscipline,
        topic: effectiveTopic,
        difficulty,
        year,
        isUpdated,
        baseText,
        statement,
        options,
        correctOption,
        shortErrorReason,
        explanation: {
          mainIdea,
          steps: cleanSteps,
          summary,
          videoUrl,
          videoDuration
        },
        studyLinks
      },
      submitForReview
    );

    if (submitForReview) {
      setLastSubmittedQuestion(saved);
      notify(`Questão ${saved.code} enviada para revisão! Você pode excluí-la no botão "Excluir" caso necessário.`);
    } else {
      notify(`Rascunho da questão ${saved.code} salvo com sucesso.`);
    }
    resetForm();
  };

  const allDisciplineNames = useMemo(() => {
    const base = [
      ...state.disciplines.map((d) => d.name),
      'Lógica de Programação',
      'Banco de Dados',
      'Engenharia de Software',
      'Logística Empresarial',
      'Estatística Aplicada',
      'Didática e Práticas Pedagógicas',
      'Marketing Estratégico'
    ];
    return Array.from(new Set(base.filter(Boolean)));
  }, [state.disciplines]);

  const allTopicNames = useMemo(() => {
    const base = [
      ...state.disciplines.flatMap((d) => d.topics || []),
      'Estruturas de Repetição',
      'Normalização',
      'Custos Logísticos',
      'Gestão de Estoques',
      'Modais de Transporte'
    ];
    return Array.from(new Set(base.filter(Boolean)));
  }, [state.disciplines]);

  const handleManualAddCourse = () => {
    const clean = customCourse.trim();
    if (!clean) {
      notify('Digite o nome do curso que deseja adicionar.');
      return;
    }
    const added = addCourse(clean);
    if (added) {
      setCourse(added);
      setCustomCourse('');
      setShowAddCourseInput(false);
      notify(`Curso "${added}" adicionado com sucesso!`);
    }
  };

  const applyRichTextToken = (token) => {
    setStatement((prev) => `${prev}${prev ? ' ' : ''}${token}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOPBAR DARK (ENADE Prep - Professor) */}
      <header className="topbar-dark">
        <div className="brand-logo" onClick={() => setActiveNav('minhas_questoes')}>
          ENADE Prep
        </div>

        <div className="search-bar-top">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar questões, provas, tópicos..."
            value={topSearch}
            onChange={(e) => {
              setTopSearch(e.target.value);
              if (activeNav !== 'repositorio') setActiveNav('repositorio');
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {HeaderRoleSwitcher}
          <span style={{ fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            🔔 {pendingPeerReviewList.length}
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            👤 {state.currentUser?.name || 'Prof. Parceiro'} ▾
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
          <button
            type="button"
            className={`nav-item ${activeNav === 'inicio' ? 'active' : ''}`}
            onClick={() => setActiveNav('inicio')}
          >
            <span>Início</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === 'minhas_questoes' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('minhas_questoes');
              setShowEditor(true);
            }}
          >
            <span>Minhas questões</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === 'revisao_pares' ? 'active' : ''}`}
            onClick={() => setActiveNav('revisao_pares')}
          >
            <span>Revisão por pares</span>
            {pendingPeerReviewList.length > 0 && (
              <span className="badge-count">{pendingPeerReviewList.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === 'repositorio' ? 'active' : ''}`}
            onClick={() => setActiveNav('repositorio')}
          >
            <span>Repositório compartilhado</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === 'downloads' ? 'active' : ''}`}
            onClick={() => setActiveNav('downloads')}
          >
            <span>Meus downloads</span>
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {toastMsg && (
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
              {toastMsg}
            </div>
          )}

          {/* INÍCIO PROFESSOR */}
          {activeNav === 'inicio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                    Painel do Professor Curador
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                    Elabore questões padrão ENADE, anexe explicações comentadas e valide questões de colegas.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    resetForm();
                    setActiveNav('minhas_questoes');
                    setShowEditor(true);
                  }}
                >
                  + Nova questão
                </button>
              </div>

              <div className="grid-4">
                <div className="card">
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Total no Banco</div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800 }}>{state.questions.length}</div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Aguardando Revisão por Pares</div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#b45309' }}>
                    {pendingPeerReviewList.length}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Questões Validadas</div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#15803d' }}>
                    {state.questions.filter((q) => q.peerValidated || q.status === 'aprovada_nde').length}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Meus Downloads</div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800 }}>{state.downloads.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* TELA P1 — CADASTRO E GESTÃO DE QUESTÕES (Page 13 Wireframe - US01, US05, US21, US24) */}
          {activeNav === 'minhas_questoes' && (
            <div>
              {/* Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Minhas questões &gt; {editingId ? 'Editar questão' : 'Nova questão'}
                  </div>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                    {editingId ? 'Editar questão' : 'Nova questão'}
                  </h1>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Classificação &rarr; Enunciado e alternativas &rarr; Explicação
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {(editingId || lastSubmittedQuestion) && (
                    <button
                      type="button"
                      className="btn btn-danger-outline"
                      onClick={() => {
                        const targetId = editingId || lastSubmittedQuestion?.id;
                        const targetCode = lastSubmittedQuestion?.code || '';
                        if (targetId) {
                          deleteQuestion(targetId);
                          resetForm();
                          setLastSubmittedQuestion(null);
                          notify(`Questão ${targetCode} excluída com sucesso!`);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleSave(false)}
                  >
                    Salvar rascunho
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSave(true)}
                  >
                    Enviar para revisão ▶
                  </button>
                </div>
              </div>

              {/* Banner imediato após enviar questão para revisão com botão Excluir */}
              {lastSubmittedQuestion && (
                <div
                  className="card"
                  style={{
                    background: '#f0fdf4',
                    borderColor: '#86efac',
                    marginBottom: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ fontSize: '0.92rem', color: '#14532d' }}>
                    <strong>✓ Questão {lastSubmittedQuestion.code} enviada para revisão!</strong> ({lastSubmittedQuestion.course} · {lastSubmittedQuestion.discipline} &gt; {lastSubmittedQuestion.topic})
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => loadQuestionIntoForm(lastSubmittedQuestion)}
                    >
                      Editar questão
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => {
                        deleteQuestion(lastSubmittedQuestion.id);
                        notify(`Questão ${lastSubmittedQuestion.code} excluída com sucesso!`);
                        setLastSubmittedQuestion(null);
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}

              <div className="p1-layout-grid">
                {/* LEFT COLUMN: FORM SECTIONS 1, 2, 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0 }}>
                  {/* 1. Classificação */}
                  <div className="card">
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '14px' }}>
                      1. Classificação
                    </h3>
                    <div className="classification-grid">
                      {/* Curso do ENADE ocupando linha inteira com botão de adicionar curso manualmente */}
                      <div className="form-group classification-full-row" style={{ marginBottom: 0 }}>
                        <label className="form-label">Curso do ENADE *</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <select
                            className="form-select"
                            style={{ flex: '1 1 220px' }}
                            value={course}
                            onChange={(e) => {
                              setCourse(e.target.value);
                              if (e.target.value === '__novo_curso__') {
                                setShowAddCourseInput(true);
                              }
                            }}
                          >
                            {state.courses.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                            <option value="__novo_curso__">+ Adicionar novo curso manualmente...</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ whiteSpace: 'nowrap', height: '38px' }}
                            onClick={() => setShowAddCourseInput(!showAddCourseInput)}
                          >
                            + Adicionar curso
                          </button>
                        </div>

                        {(showAddCourseInput || course === '__novo_curso__') && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ flex: '1 1 200px' }}
                              placeholder="Digite o nome do novo curso (ex: Direito, Administração, Enfermagem)..."
                              value={customCourse}
                              onChange={(e) => setCustomCourse(e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={handleManualAddCourse}
                            >
                              Salvar curso
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Disciplina *</label>
                        <select
                          className="form-select"
                          value={discipline}
                          onChange={(e) => setDiscipline(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {allDisciplineNames.map((dName) => (
                            <option key={dName} value={dName}>
                              {dName}
                            </option>
                          ))}
                          <option value="__nova__">+ Digitar nova disciplina...</option>
                        </select>
                        {discipline === '__nova__' && (
                          <input
                            type="text"
                            className="form-input"
                            style={{ marginTop: '6px' }}
                            placeholder="Nome da disciplina"
                            value={customDiscipline}
                            onChange={(e) => setCustomDiscipline(e.target.value)}
                          />
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Assunto / tópico *</label>
                        <select
                          className="form-select"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {allTopicNames.map((tName) => (
                            <option key={tName} value={tName}>
                              {tName}
                            </option>
                          ))}
                          <option value="__novo__">+ Digitar novo tópico...</option>
                        </select>
                        {topic === '__novo__' && (
                          <input
                            type="text"
                            className="form-input"
                            style={{ marginTop: '6px' }}
                            placeholder="Nome do tópico"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                          />
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Dificuldade *</label>
                        <div className="difficulty-radio-group">
                          {['Fácil', 'Média', 'Difícil'].map((d) => (
                            <label key={d} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                name="qDiff"
                                checked={difficulty === d}
                                onChange={() => setDifficulty(d)}
                                style={{ accentColor: 'var(--primary)' }}
                              />
                              {d}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Ano / origem</label>
                        <select
                          className="form-select"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value="ENADE 2023">ENADE 2023</option>
                          <option value="ENADE 2022">ENADE 2022</option>
                          <option value="ENADE 2021">ENADE 2021</option>
                          <option value="ENADE 2019">ENADE 2019</option>
                          <option value="Inédita / Adaptada">Inédita / Adaptada</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isUpdated}
                          onChange={(e) => setIsUpdated(e.target.checked)}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        Sinalizar como <strong>Conteúdo Atualizado</strong> (US21)
                      </label>
                    </div>
                  </div>

                  {/* 2. Enunciado e alternativas */}
                  <div className="card">
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px' }}>
                      2. Enunciado e alternativas
                    </h3>

                    <div className="form-group">
                      <label className="form-label">Texto-base / Situação-problema (opcional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Contexto da empresa, tabela de custos ou trecho de artigo..."
                        value={baseText}
                        onChange={(e) => setBaseText(e.target.value)}
                      />
                    </div>

                    {/* Rich Text Editor Box */}
                    <div
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginBottom: '14px'
                      }}
                    >
                      <div
                        style={{
                          background: '#f1f5f9',
                          borderBottom: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <button type="button" onClick={() => applyRichTextToken('**texto em negrito**')} style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>B</button>
                        <button type="button" onClick={() => applyRichTextToken('*itálico*')} style={{ border: 'none', background: 'none', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                        <button type="button" onClick={() => applyRichTextToken('__sublinhado__')} style={{ border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>U</button>
                        <button type="button" onClick={() => applyRichTextToken('\n• Item')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&bull;</button>
                        <button type="button" onClick={() => applyRichTextToken('\nI. Afirmativa I\nII. Afirmativa II')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>1.</button>
                        <button type="button" onClick={() => applyRichTextToken('[referência]')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🔗</button>
                        <button type="button" onClick={() => applyRichTextToken('[Tabela: Coluna A | Coluna B]')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>⊞</button>
                        <button type="button" onClick={() => applyRichTextToken('f(x) = a + bx')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&Sigma;</button>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          (editor de texto rico — enunciado)
                        </span>
                      </div>
                      <textarea
                        className="form-textarea"
                        style={{ border: 'none', width: '100%', borderRadius: 0 }}
                        placeholder="Digite o enunciado completo da questão no padrão ENADE..."
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                      />
                    </div>

                    {/* Alternatives A..E */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {options.map((opt, idx) => (
                        <div key={opt.letter} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '24px', fontWeight: 600 }}>{opt.letter})</span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ flex: 1 }}
                            placeholder={`Texto da alternativa ${opt.letter}...`}
                            value={opt.text}
                            onChange={(e) => {
                              const next = [...options];
                              next[idx] = { ...opt, text: e.target.value };
                              setOptions(next);
                            }}
                          />
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              cursor: 'pointer',
                              fontSize: '0.84rem',
                              minWidth: '72px'
                            }}
                          >
                            <input
                              type="radio"
                              name="correctOpt"
                              checked={correctOption === opt.letter}
                              onChange={() => setCorrectOption(opt.letter)}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            {correctOption === opt.letter ? <strong>correta</strong> : ''}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Explicação pedagógica (US05) e materiais (US24) */}
                  <div className="card">
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '10px' }}>
                      3. Explicação pedagógica (US05) e materiais (US24)
                    </h3>

                    <div className="tabs-header" style={{ marginBottom: '14px' }}>
                      <button
                        type="button"
                        className={`tab-btn ${expTab === 'etapas' ? 'active' : ''}`}
                        onClick={() => setExpTab('etapas')}
                      >
                        Texto em etapas
                      </button>
                      <button
                        type="button"
                        className={`tab-btn ${expTab === 'video' ? 'active' : ''}`}
                        onClick={() => setExpTab('video')}
                      >
                        Vídeo
                      </button>
                      <button
                        type="button"
                        className={`tab-btn ${expTab === 'links' ? 'active' : ''}`}
                        onClick={() => setExpTab('links')}
                      >
                        Links de estudo ({studyLinks.length})
                      </button>
                    </div>

                    {expTab === 'etapas' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Ideia principal da questão (US15)</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Ex: Comparar o custo total de cada alternativa de armazenagem."
                            value={mainIdea}
                            onChange={(e) => setMainIdea(e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Etapas do raciocínio (Passo a passo)</label>
                          {steps.map((st, i) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ paddingTop: '8px', fontWeight: 700, fontSize: '0.84rem', color: 'var(--primary)' }}>
                                {i + 1}.
                              </span>
                              <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                placeholder={`Etapa ${i + 1} da resolução...`}
                                value={st}
                                onChange={(e) => {
                                  const next = [...steps];
                                  next[i] = e.target.value;
                                  setSteps(next);
                                }}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ alignSelf: 'flex-start' }}
                            onClick={() => setSteps([...steps, ''])}
                          >
                            + Adicionar etapa
                          </button>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Resumo final para revisão e lógica do erro</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Ex: Decida pelo ponto de equilíbrio entre custo fixo e variável."
                            value={summary}
                            onChange={(e) => {
                              setSummary(e.target.value);
                              if (!shortErrorReason) setShortErrorReason(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {expTab === 'video' && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ flex: '1 1 220px' }}
                          placeholder="https://... (link do vídeo ou texto da justificativa)"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            if (videoUrl.startsWith('http')) {
                              setLinkValidationStatus('✓ Link de vídeo válido e acessível.');
                            } else {
                              setLinkValidationStatus('⚠ Informe uma URL iniciando com https://');
                            }
                          }}
                        >
                          Validar link
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => notify('Vídeo associado à explicação da questão!')}
                        >
                          + Adicionar
                        </button>
                        {linkValidationStatus && (
                          <div style={{ width: '100%', fontSize: '0.82rem', color: 'var(--primary)', marginTop: '4px' }}>
                            {linkValidationStatus}
                          </div>
                        )}
                      </div>
                    )}

                    {expTab === 'links' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <select
                            className="form-select"
                            style={{ flex: '0 0 130px' }}
                            value={linkType}
                            onChange={(e) => setLinkType(e.target.value)}
                          >
                            <option value="Artigo">Artigo</option>
                            <option value="Vídeo">Vídeo</option>
                            <option value="Livro/PDF">Livro/PDF</option>
                          </select>
                          <input
                            type="text"
                            className="form-input"
                            style={{ flex: '1 1 180px' }}
                            placeholder="Título do material complementar"
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                          />
                          <input
                            type="text"
                            className="form-input"
                            style={{ flex: '1 1 180px' }}
                            placeholder="https://..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() =>
                              setLinkValidationStatus(
                                linkUrl.startsWith('http')
                                  ? '✓ URL validada com sucesso'
                                  : '⚠ Digite um link válido com https://'
                              )
                            }
                          >
                            Validar link
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                              if (!linkTitle.trim()) return;
                              setStudyLinks([
                                ...studyLinks,
                                { type: linkType, title: linkTitle.trim(), url: linkUrl.trim() || '#' }
                              ]);
                              setLinkTitle('');
                              setLinkUrl('');
                            }}
                          >
                            + Adicionar
                          </button>
                        </div>

                        {studyLinks.map((l, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                              <strong>{l.type}:</strong> {l.title} ({l.url})
                            </span>
                            <button
                              type="button"
                              onClick={() => setStudyLinks(studyLinks.filter((_, idx) => idx !== i))}
                              style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: LIVE PREVIEW (WEB / MOBILE) & CHECKLIST DE COMPLETUDE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Pré-visualização (como o aluno verá) */}
                  <div className="card">
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px' }}>
                      Pré-visualização (como o aluno verá)
                    </h3>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${previewDevice === 'web' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPreviewDevice('web')}
                      >
                        💻 Web
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${previewDevice === 'mobile' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPreviewDevice('mobile')}
                      >
                        📱 Mobile
                      </button>
                    </div>

                    <div
                      style={{
                        maxWidth: previewDevice === 'mobile' ? '290px' : '100%',
                        margin: previewDevice === 'mobile' ? '0 auto' : '0',
                        border: previewDevice === 'mobile' ? '6px solid #334155' : 'none',
                        borderRadius: previewDevice === 'mobile' ? '20px' : '0',
                        padding: previewDevice === 'mobile' ? '12px' : '0',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1.5px dashed #cbd5e1',
                          borderRadius: '10px',
                          padding: '18px',
                          minHeight: '110px',
                          marginBottom: '12px',
                          color: statement ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.9rem'
                        }}
                      >
                        {effectiveDiscipline && (
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                            {effectiveDiscipline} &gt; {effectiveTopic || 'Tópico'} · {year} ({difficulty})
                          </div>
                        )}
                        {baseText && (
                          <div style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '6px 8px', borderRadius: '6px', marginBottom: '8px' }}>
                            {baseText}
                          </div>
                        )}
                        <div>{statement || 'Enunciado renderizado'}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {options.slice(0, 5).map((o) => (
                          <div
                            key={o.letter}
                            style={{
                              border: o.letter === correctOption ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                              background: o.letter === correctOption ? '#f0fdf4' : '#fff',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '0.85rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {o.letter}) {o.text || '...'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Checklist de completude */}
                  <div className="card">
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px' }}>
                      Checklist de completude
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                      <div style={{ color: hasClassification ? '#15803d' : 'var(--text-secondary)' }}>
                        {hasClassification ? '✓' : '○'} Classificação
                      </div>
                      <div style={{ color: hasStatement ? '#15803d' : 'var(--text-secondary)' }}>
                        {hasStatement ? '✓' : '○'} Enunciado
                      </div>
                      <div style={{ color: hasFiveOptions ? '#15803d' : 'var(--text-secondary)' }}>
                        {hasFiveOptions ? '✓' : '○'} 5 alternativas
                      </div>
                      <div style={{ color: hasExplanation ? '#15803d' : 'var(--text-secondary)' }}>
                        {hasExplanation ? '✓' : '○'} Explicação
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>⚠ {similarQuestions.length} questões semelhantes no repositório</span>
                      <button
                        type="button"
                        onClick={() => setActiveNav('repositorio')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: '0.82rem'
                        }}
                      >
                        [Ver]
                      </button>
                    </div>
                  </div>

                  {/* Lista rápida das Minhas Questões já salvas (com botão Editar e Excluir) */}
                  {state.questions.length > 0 && (
                    <div className="card">
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                        Questões Cadastradas e Enviadas ({state.questions.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {state.questions.map((q) => (
                          <div
                            key={q.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '8px',
                              fontSize: '0.84rem',
                              paddingBottom: '8px',
                              borderBottom: '1px solid var(--border-color)'
                            }}
                          >
                            <div>
                              <strong>{q.code}</strong> · {q.course ? `${q.course} · ` : ''}{q.discipline} &gt; {q.topic}{' '}
                              <span className={`badge ${q.status === 'em_revisao' ? 'badge-revisao' : 'badge-validada'}`} style={{ marginLeft: '4px' }}>
                                {q.status === 'em_revisao' ? 'Em revisão' : q.status}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => loadQuestionIntoForm(q)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger-outline btn-sm"
                                onClick={() => {
                                  deleteQuestion(q.id);
                                  if (editingId === q.id) resetForm();
                                  notify(`Questão ${q.code} excluída com sucesso!`);
                                }}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FILA DE REVISÃO POR PARES (US02) */}
          {activeNav === 'revisao_pares' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                    Revisão por Pares (US02)
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                    Fluxo ágil de validação entre professores colegas da área. A questão aprovada recebe o selo visual &ldquo;Questão Validada&rdquo; e segue para o parecer do NDE.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${peerFilter === 'pendentes' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPeerFilter('pendentes')}
                  >
                    Pendentes ({pendingPeerReviewList.length})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${peerFilter === 'todas' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPeerFilter('todas')}
                  >
                    Todas ({state.questions.length})
                  </button>
                </div>
              </div>

              {(peerFilter === 'pendentes' ? pendingPeerReviewList : state.questions).length === 0 ? (
                <div className="empty-state">
                  {peerFilter === 'pendentes'
                    ? 'Nenhuma questão aguardando revisão por pares no momento. Clique em "Todas" para consultar o banco já validado.'
                    : 'Nenhuma questão cadastrada ainda para revisão.'}
                </div>
              ) : (
                (peerFilter === 'pendentes' ? pendingPeerReviewList : state.questions).map((q) => {
                  const isVal = q.peerValidated || q.status === 'validada_pares' || q.status === 'aprovada_nde';
                  return (
                    <div key={q.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>{q.code}</strong>
                          <span className="badge badge-neutral">
                            {q.discipline} &gt; {q.topic}
                          </span>
                          <span className="badge badge-neutral">{q.year}</span>
                          <span className="badge badge-neutral">{q.difficulty}</span>
                          {isVal ? (
                            <span className="badge badge-validada">✓ Questão Validada</span>
                          ) : (
                            <span className="badge badge-revisao">Aguardando Revisão por Pares</span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Autor: {q.authorName}
                        </span>
                      </div>

                      <p style={{ fontWeight: 600, marginBottom: '10px' }}>{q.statement}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.86rem', marginBottom: '12px' }}>
                        {(q.options || []).map((o) => (
                          <div
                            key={o.letter}
                            style={{
                              color: o.letter === q.correctOption ? '#15803d' : 'var(--text-secondary)',
                              fontWeight: o.letter === q.correctOption ? 700 : 400
                            }}
                          >
                            {o.letter}) {o.text} {o.letter === q.correctOption ? '(Gabarito)' : ''}
                          </div>
                        ))}
                      </div>

                      <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                        <strong>Explicação Pedagógica:</strong>{' '}
                        {q.explanation?.mainIdea || q.explanation?.summary || 'Sem justificativa detalhada.'}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Observação pedagógica para o colega (opcional)..."
                          value={peerNotes[q.id] || ''}
                          onChange={(e) => setPeerNotes({ ...peerNotes, [q.id]: e.target.value })}
                        />
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => {
                            reviewQuestionByPeer(q.id, true, peerNotes[q.id] || 'Aprovada na revisão por pares');
                            notify(`Questão ${q.code} validada! Selo "Questão Validada" atribuído.`);
                          }}
                        >
                          ✓ Validar questão (Selo Questão Validada)
                        </button>
                        <button
                          type="button"
                          className="btn btn-warning-outline btn-sm"
                          onClick={() => {
                            reviewQuestionByPeer(q.id, false, peerNotes[q.id] || 'Solicitado ajuste pelo par');
                            notify(`Questão ${q.code} devolvida ao autor para ajustes.`);
                          }}
                        >
                          ↩ Solicitar ajustes
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger-outline btn-sm"
                          onClick={() => {
                            deleteQuestion(q.id);
                            notify(`Questão ${q.code} excluída da revisão com sucesso!`);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* REPOSITÓRIO COMPARTILHADO DE PROFESSORES (US18) */}
          {activeNav === 'repositorio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                    Repositório Compartilhado de Professores (US18)
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Localize questões por filtros e realize o download de exercícios para reutilizar em suas aulas e simulados.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={filteredRepoQuestions.length === 0}
                    onClick={() => {
                      const targetList =
                        selectedRepoIds.length > 0
                          ? filteredRepoQuestions.filter((q) => selectedRepoIds.includes(q.id))
                          : filteredRepoQuestions;
                      recordProfessorDownload(
                        targetList,
                        `Caderno_Questoes_ENADE_${repoDiscFilter}`
                      );
                      notify(`Download de ${targetList.length} questão(ões) concluído!`);
                    }}
                  >
                    <Download size={16} /> Baixar {selectedRepoIds.length > 0 ? `Selecionadas (${selectedRepoIds.length})` : 'Lista Filtrada'}
                  </button>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  className="form-select"
                  value={repoCourseFilter}
                  onChange={(e) => setRepoCourseFilter(e.target.value)}
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
                  value={repoDiscFilter}
                  onChange={(e) => setRepoDiscFilter(e.target.value)}
                >
                  <option value="Todas">Disciplina: Todas</option>
                  {Array.from(new Set(state.questions.map((q) => q.discipline).filter(Boolean))).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={repoDiffFilter}
                  onChange={(e) => setRepoDiffFilter(e.target.value)}
                >
                  <option value="Todas">Dificuldade: Todas</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Média">Média</option>
                  <option value="Difícil">Difícil</option>
                </select>

                <select
                  className="form-select"
                  value={repoYearFilter}
                  onChange={(e) => setRepoYearFilter(e.target.value)}
                >
                  <option value="Todos">Ano: Todos</option>
                  {Array.from(new Set(state.questions.map((q) => q.year).filter(Boolean))).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {filteredRepoQuestions.length === 0 ? (
                <div className="empty-state">
                  Nenhuma questão encontrada no repositório compartilhado. Cadastre questões em &ldquo;Minhas questões&rdquo;.
                </div>
              ) : (
                filteredRepoQuestions.map((q) => (
                  <div key={q.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedRepoIds.includes(q.id)}
                          onChange={(e) =>
                            setSelectedRepoIds((prev) =>
                              e.target.checked ? [...prev, q.id] : prev.filter((id) => id !== q.id)
                            )
                          }
                        />
                        <strong>{q.code}</strong>
                        {q.course && (
                          <span className="badge badge-atualizada" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                            Curso: {q.course}
                          </span>
                        )}
                        <span className="badge badge-neutral">
                          {q.discipline} &gt; {q.topic}
                        </span>
                        <span className="badge badge-neutral">{q.year}</span>
                        {(q.peerValidated || q.status === 'aprovada_nde') && (
                          <span className="badge badge-validada">Questão Validada</span>
                        )}
                        {q.isUpdated && <span className="badge badge-atualizada">Atualizada</span>}
                      </label>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => loadQuestionIntoForm(q)}
                        >
                          Editar / Adaptar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger-outline btn-sm"
                          onClick={() => {
                            deleteQuestion(q.id);
                            notify(`Questão ${q.code} excluída com sucesso!`);
                          }}
                        >
                          Excluir
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            recordProfessorDownload([q], `Exercicio_${q.code}`);
                            notify(`Exercício ${q.code} baixado com sucesso!`);
                          }}
                        >
                          <Download size={14} /> Baixar exercício
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.94rem' }}>{q.statement}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MEUS DOWNLOADS */}
          {activeNav === 'downloads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Meus downloads</h1>
              {state.downloads.filter((dl) => !dl.professorId || dl.professorId === state.currentUser?.id).length === 0 ? (
                <div className="empty-state">
                  Você ainda não realizou downloads de questões do repositório compartilhado.
                </div>
              ) : (
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Arquivo / Lista</th>
                        <th>Qtd. Questões</th>
                        <th>Formato</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.downloads
                        .filter((dl) => !dl.professorId || dl.professorId === state.currentUser?.id)
                        .map((dl) => (
                        <tr key={dl.id}>
                          <td>
                            <strong>{dl.title}</strong>
                          </td>
                          <td>{dl.questionCount} questões</td>
                          <td>{dl.format}</td>
                          <td>{dl.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

