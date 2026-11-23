import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BookOpen,
  Play,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Flag,
  MessageSquare,
  ExternalLink,
  LogOut,
  Plus,
  RotateCcw,
  EyeOff,
  Eye,
  Bell
} from 'lucide-react';

export const StudentView = ({ HeaderRoleSwitcher }) => {
  const {
    state,
    recordAttempt,
    saveCompletedSimulado,
    saveSimuladoTemplate,
    toggleSaveQuestion,
    saveSummaryNote,
    addQuestionComment,
    reportQuestionError,
    addFlashcard,
    updatePreferences,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState('inicio');
  const [topSearch, setTopSearch] = useState('');
  const [showNoticesModal, setShowNoticesModal] = useState(false);

  // Question Bank filters (US03, US19, US21) & separation by Course
  const [selectedCourse, setSelectedCourse] = useState('Todos');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Todas');
  const [selectedTopic, setSelectedTopic] = useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todas');
  const [onlyValidated, setOnlyValidated] = useState(false);
  const [sortBy, setSortBy] = useState('recentes');

  // Montar Simulado state (US03, US13, US14)
  const [simStep, setSimStep] = useState(1);
  const [simCourseFilter, setSimCourseFilter] = useState('Todos');
  const [simSelectedTopics, setSimSelectedTopics] = useState([]);
  const [simDifficulty, setSimDifficulty] = useState('Todas');
  const [simYear, setSimYear] = useState('Todos');
  const [simOnlyValidated, setSimOnlyValidated] = useState(false);
  const [simHideCorrect, setSimHideCorrect] = useState(false);
  const [simQty, setSimQty] = useState(10);
  const [simMode, setSimMode] = useState('cronometrado'); // 'cronometrado' | 'livre'
  const [simTimeMin, setSimTimeMin] = useState(40);
  const [simCorrectionMode, setSimCorrectionMode] = useState('cada_questao'); // 'cada_questao' | 'final'

  // Active Simulado / Question Solver state (US04, US14, US15, US23, US24, US10)
  const [activeSession, setActiveSession] = useState(null);
  // activeSession: { title, questions: [], currentIndex: 0, answers: {}, eliminated: {}, markedForReview: [], mode, timeLimitSec, remainingSec, elapsedSec, correctionMode, finished: false, questionStartTime }
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const [explanationTab, setExplanationTab] = useState('passo_a_passo'); // 'passo_a_passo' | 'video' | 'discussao'
  const [enlargedBaseText, setEnlargedBaseText] = useState(null);
  const [hideDiscussion, setHideDiscussion] = useState(state.hideDiscussionsDefault || false);
  const [commentInput, setCommentInput] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [errorReportModalQ, setErrorReportModalQ] = useState(null);
  const [errorReasonText, setErrorReasonText] = useState('');
  const [feedbackToast, setFeedbackToast] = useState('');

  // Revision & Evolution sub-tab
  const [revSubTab, setRevSubTab] = useState('plano'); // 'plano' | 'evolucao'
  const [evolWeeksFilter, setEvolWeeksFilter] = useState('8');
  const [evolCatFilter, setEvolCatFilter] = useState('Todas');

  // Flashcards state
  const [newFcDisc, setNewFcDisc] = useState('');
  const [newFcTopic, setNewFcTopic] = useState('');
  const [newFcFront, setNewFcFront] = useState('');
  const [newFcBack, setNewFcBack] = useState('');
  const [flippedCardIds, setFlippedCardIds] = useState([]);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(''), 3200);
  };

  // Timer effect for active session (US14)
  useEffect(() => {
    if (!activeSession || activeSession.finished) return;
    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.finished) return prev;
        const nextElapsed = prev.elapsedSec + 1;
        const nextRemaining = prev.mode === 'cronometrado' ? Math.max(0, prev.remainingSec - 1) : prev.remainingSec;
        return {
          ...prev,
          elapsedSec: nextElapsed,
          remainingSec: nextRemaining,
          finished: prev.mode === 'cronometrado' && nextRemaining === 0 ? true : prev.finished
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Available questions for students (all non-draft questions, or all created questions)
  const availableQuestions = useMemo(() => {
    return state.questions.filter((q) => q.status !== 'rascunho' && q.status !== 'reprovada');
  }, [state.questions]);

  // Student's own attempts
  const myAttempts = useMemo(() => {
    if (!state.currentUser) return [];
    return state.attempts.filter((a) => a.userId === state.currentUser.id);
  }, [state.attempts, state.currentUser]);

  // Performance metrics calculation (US06, US16, US17, US22)
  const metrics = useMemo(() => {
    const totalResolved = myAttempts.length;
    const totalCorrect = myAttempts.filter((a) => a.isCorrect).length;
    const overallPct = totalResolved > 0 ? Math.round((totalCorrect / totalResolved) * 100) : 0;

    // By discipline
    const byDiscMap = {};
    myAttempts.forEach((a) => {
      const d = a.discipline || 'Geral';
      if (!byDiscMap[d]) byDiscMap[d] = { name: d, correct: 0, total: 0 };
      byDiscMap[d].total += 1;
      if (a.isCorrect) byDiscMap[d].correct += 1;
    });
    const byDiscipline = Object.values(byDiscMap).map((d) => ({
      ...d,
      pct: Math.round((d.correct / d.total) * 100)
    }));

    // By topic (weak points < 60% or lowest accuracy)
    const byTopicMap = {};
    myAttempts.forEach((a) => {
      const t = a.topic || 'Geral';
      if (!byTopicMap[t]) byTopicMap[t] = { topic: t, discipline: a.discipline, correct: 0, total: 0 };
      byTopicMap[t].total += 1;
      if (a.isCorrect) byTopicMap[t].correct += 1;
    });
    const byTopic = Object.values(byTopicMap)
      .map((t) => ({
        ...t,
        pct: Math.round((t.correct / t.total) * 100)
      }))
      .sort((a, b) => a.pct - b.pct);

    const weakTopics = byTopic.filter((t) => t.pct < 60);

    return {
      totalResolved,
      totalCorrect,
      overallPct,
      byDiscipline,
      byTopic,
      weakTopics
    };
  }, [myAttempts]);

  // All disciplines & topics from context or questions
  const disciplineTree = useMemo(() => {
    const map = {};
    state.disciplines.forEach((d) => {
      map[d.name] = { name: d.name, course: d.course || 'Geral', count: 0, topics: {} };
      (d.topics || []).forEach((t) => {
        map[d.name].topics[t] = 0;
      });
    });
    availableQuestions.forEach((q) => {
      const d = q.discipline || 'Geral';
      const t = q.topic || 'Geral';
      if (!map[d]) map[d] = { name: d, course: q.course || 'Geral', count: 0, topics: {} };
      map[d].count += 1;
      map[d].topics[t] = (map[d].topics[t] || 0) + 1;
    });
    return Object.values(map);
  }, [state.disciplines, availableQuestions]);

  const allYears = useMemo(() => {
    const set = new Set(availableQuestions.map((q) => q.year).filter(Boolean));
    return Array.from(set);
  }, [availableQuestions]);

  // Filtered questions in Question Bank
  const filteredBankQuestions = useMemo(() => {
    return availableQuestions
      .filter((q) => {
        if (selectedCourse !== 'Todos' && q.course !== selectedCourse) return false;
        if (selectedDiscipline !== 'Todas' && q.discipline !== selectedDiscipline) return false;
        if (selectedTopic !== 'Todos' && q.topic !== selectedTopic) return false;
        if (selectedDifficulty !== 'Todas' && q.difficulty !== selectedDifficulty) return false;
        if (selectedYear !== 'Todos' && q.year !== selectedYear) return false;
        const isVal = q.peerValidated || q.status === 'validada_pares' || q.status === 'aprovada_nde';
        if (onlyValidated && !isVal) return false;

        const solvedByMe = myAttempts.some((a) => a.questionId === q.id);
        if (selectedStatus === 'Resolvidas' && !solvedByMe) return false;
        if (selectedStatus === 'Não resolvidas' && solvedByMe) return false;

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
      })
      .sort((a, b) => {
        if (sortBy === 'dificuldade') {
          const order = { Fácil: 1, Média: 2, Difícil: 3 };
          return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [
    availableQuestions,
    selectedCourse,
    selectedDiscipline,
    selectedTopic,
    selectedDifficulty,
    selectedYear,
    selectedStatus,
    onlyValidated,
    topSearch,
    sortBy,
    myAttempts
  ]);

  // Helper: matches a question against selected course & selected topics/disciplines
  const matchesSimSelection = (q, courseVal, selectedItems) => {
    if (courseVal !== 'Todos' && (q.course || '').toLowerCase() !== courseVal.toLowerCase()) {
      return false;
    }
    if (selectedItems.length > 0) {
      const qDisc = (q.discipline || '').trim().toLowerCase();
      const qTopic = (q.topic || '').trim().toLowerCase();
      const qCourse = (q.course || '').trim().toLowerCase();

      // Se uma disciplina foi selecionada, inclui também todos os tópicos vinculados a ela
      const selectedLower = selectedItems.map((s) => s.trim().toLowerCase());
      const parentDiscsOfTopic = state.disciplines
        .filter((d) => selectedLower.includes(d.name.trim().toLowerCase()))
        .flatMap((d) => (d.topics || []).map((t) => t.trim().toLowerCase()));

      const matches =
        selectedLower.includes(qTopic) ||
        selectedLower.includes(qDisc) ||
        selectedLower.includes(qCourse) ||
        parentDiscsOfTopic.includes(qTopic);

      if (!matches) return false;
    }
    return true;
  };

  // Filtered pool for Montar Simulado
  const simuladoCandidatePool = useMemo(() => {
    const strictMatches = availableQuestions.filter((q) => {
      if (!matchesSimSelection(q, simCourseFilter, simSelectedTopics)) return false;
      if (simDifficulty !== 'Todas' && q.difficulty !== simDifficulty) return false;
      if (simYear !== 'Todos' && q.year !== simYear) return false;
      const isVal = q.peerValidated || q.status === 'validada_pares' || q.status === 'aprovada_nde';
      if (simOnlyValidated && !isVal) return false;
      if (simHideCorrect) {
        const alreadyCorrect = myAttempts.some((a) => a.questionId === q.id && a.isCorrect);
        if (alreadyCorrect) return false;
      }
      return true;
    });

    if (strictMatches.length > 0) return strictMatches;

    // Fallback inteligente: se os filtros secundários (ano/dificuldade/ocultar certas) zerarem o pool,
    // retorna todas as questões do curso/disciplina/tópico selecionado para que o simulado sempre inicie
    const topicOrCourseMatches = availableQuestions.filter((q) =>
      matchesSimSelection(q, simCourseFilter, simSelectedTopics)
    );

    return topicOrCourseMatches;
  }, [
    availableQuestions,
    state.disciplines,
    simCourseFilter,
    simSelectedTopics,
    simDifficulty,
    simYear,
    simOnlyValidated,
    simHideCorrect,
    myAttempts
  ]);

  const startQuestionSession = (questionsList, title = 'Simulado Personalizado', mode = 'cronometrado', timeMin = 40, correctionMode = 'cada_questao') => {
    if (!questionsList || questionsList.length === 0) {
      showToast('Nenhuma questão disponível para iniciar. Cadastre questões no perfil de Professor primeiro.');
      return;
    }
    setShowFullExplanation(false);
    setActiveSession({
      title,
      questions: questionsList,
      currentIndex: 0,
      answers: {}, // { [qId]: { selectedOption, timeSpentSec, submitted: true } }
      eliminated: {}, // { [qId]: ['A', 'D'] }
      markedForReview: [],
      mode,
      timeLimitSec: timeMin * 60,
      remainingSec: timeMin * 60,
      elapsedSec: 0,
      correctionMode,
      finished: false,
      questionStartTime: Date.now()
    });
  };

  const handleSelectOptionInSession = (question, optionLetter) => {
    if (!activeSession || activeSession.finished) return;
    const existingAns = activeSession.answers[question.id];
    if (existingAns && existingAns.submitted && activeSession.correctionMode === 'cada_questao') {
      return; // already answered in immediate feedback mode
    }

    const spentSec = Math.max(1, Math.round((Date.now() - (activeSession.questionStartTime || Date.now())) / 1000));
    const submitImmediately = activeSession.correctionMode === 'cada_questao';

    if (submitImmediately) {
      recordAttempt({
        questionId: question.id,
        selectedOption: optionLetter,
        timeSpentSec: spentSec
      });
    }

    setActiveSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [question.id]: {
          selectedOption: optionLetter,
          timeSpentSec: spentSec,
          submitted: submitImmediately
        }
      }
    }));
  };

  const handleFinishSession = () => {
    if (!activeSession) return;
    let correctCount = 0;
    activeSession.questions.forEach((q) => {
      const ans = activeSession.answers[q.id];
      if (ans) {
        if (!ans.submitted) {
          recordAttempt({
            questionId: q.id,
            selectedOption: ans.selectedOption,
            timeSpentSec: ans.timeSpentSec || 30
          });
        }
        if (ans.selectedOption === q.correctOption) {
          correctCount += 1;
        }
      }
    });

    const totalCount = activeSession.questions.length;
    const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    saveCompletedSimulado({
      title: activeSession.title,
      scorePct,
      correctCount,
      totalCount,
      mode: activeSession.mode,
      timeLimitMin: Math.round(activeSession.timeLimitSec / 60),
      timeSpentSec: activeSession.elapsedSec,
      questionIds: activeSession.questions.map((q) => q.id),
      answers: activeSession.answers
    });

    setActiveSession((prev) => ({ ...prev, finished: true }));
    showToast(`Atividade concluída! Você acertou ${correctCount} de ${totalCount} (${scorePct}%).`);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const renderDifficultyDots = (difficulty) => {
    const level = difficulty === 'Fácil' ? 1 : difficulty === 'Difícil' ? 3 : 2;
    return (
      <span className="diff-dots" title={`Dificuldade: ${difficulty}`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={`diff-dot ${n <= level ? 'filled' : ''}`} />
        ))}
      </span>
    );
  };

  const initials = (state.currentUser?.name || 'AL')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // If an active Simulado / Question Solver session is open, render the full-screen Solver (Page 12 & Page 8 wireframes)
  if (activeSession) {
    const currentQ = activeSession.questions[activeSession.currentIndex];
    const currentAns = activeSession.answers[currentQ?.id];
    const isAnswered = Boolean(currentAns?.submitted || activeSession.finished);
    const isCorrect = currentAns?.selectedOption === currentQ?.correctOption;
    const isValidated =
      currentQ?.peerValidated ||
      currentQ?.status === 'validada_pares' ||
      currentQ?.status === 'aprovada_nde';

    // Full Explanation View (Page 8 wireframe - US15, US05, US24, US10)
    if (showFullExplanation && currentQ) {
      return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '48px' }}>
          {/* Top Explanation Bar */}
          <div className="topbar-light">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowFullExplanation(false)}
              >
                <ChevronLeft size={16} /> Voltar à questão {activeSession.currentIndex + 1}
              </button>
              <strong style={{ fontSize: '1.05rem' }}>
                Explicação · {currentQ.discipline} &gt; {currentQ.topic}
              </strong>
            </div>
            <span className="badge badge-validada" style={{ fontSize: '0.88rem', padding: '5px 14px' }}>
              Gabarito: {currentQ.correctOption}
            </span>
          </div>

          <div style={{ maxWidth: '880px', margin: '28px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {feedbackToast && (
              <div className="card" style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1e40af', padding: '12px 16px' }}>
                {feedbackToast}
              </div>
            )}

            {/* Main Explanation Card (US15, US05) */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Explicado por <strong style={{ color: 'var(--text-main)' }}>{currentQ.authorName || 'Professor da Instituição'}</strong>
                </div>
                {isValidated && (
                  <span className="badge badge-validada">
                    Validada em {currentQ.peerValidatedAt || 'NDE'}
                  </span>
                )}
              </div>

              <div className="tabs-header">
                <button
                  type="button"
                  className={`tab-btn ${explanationTab === 'passo_a_passo' ? 'active' : ''}`}
                  onClick={() => setExplanationTab('passo_a_passo')}
                >
                  Passo a passo
                </button>
                <button
                  type="button"
                  className={`tab-btn ${explanationTab === 'video' ? 'active' : ''}`}
                  onClick={() => setExplanationTab('video')}
                >
                  Vídeo ({currentQ.explanation?.videoDuration || '2 min'})
                </button>
                <button
                  type="button"
                  className={`tab-btn ${explanationTab === 'discussao' ? 'active' : ''}`}
                  onClick={() => setExplanationTab('discussao')}
                >
                  Discussão ({(currentQ.comments || []).length})
                </button>
              </div>

              {explanationTab === 'passo_a_passo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Ideia principal */}
                  <div
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '10px',
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Ideia principal
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: '0.93rem' }}>
                      {currentQ.explanation?.mainIdea ||
                        'Compreender o conceito central exigido pela matriz do ENADE e aplicá-lo ao problema apresentado.'}
                    </div>
                  </div>

                  {/* Etapas numeradas */}
                  {(currentQ.explanation?.steps && currentQ.explanation.steps.length > 0
                    ? currentQ.explanation.steps
                    : [
                        'Identifique os dados relevantes do texto-base e o comando da questão.',
                        currentQ.shortErrorReason || 'Compare os conceitos exigidos em cada alternativa.',
                        `Confirme por que a alternativa ${currentQ.correctOption} atende integralmente ao enunciado.`
                      ]
                  ).map((stepText, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: idx === 1 ? '1.5px solid #93c5fd' : '1px solid var(--border-color)',
                        background: idx === 1 ? '#f8fafc' : '#fff',
                        borderRadius: '10px',
                        padding: '13px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: '#dbeafe',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div style={{ fontSize: '0.93rem', color: 'var(--text-main)' }}>{stepText}</div>
                    </div>
                  ))}

                  {/* Resumo para revisar */}
                  <div
                    style={{
                      background: '#fefce8',
                      border: '1px solid #fde047',
                      borderRadius: '10px',
                      padding: '16px',
                      marginTop: '4px'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px', color: '#713f12' }}>
                      Resumo para revisar
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#422006', marginBottom: '12px' }}>
                      {currentQ.explanation?.summary ||
                        currentQ.explanation?.mainIdea ||
                        `Gabarito ${currentQ.correctOption}: revise os fundamentos de ${currentQ.topic}.`}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        saveSummaryNote({
                          questionId: currentQ.id,
                          discipline: currentQ.discipline,
                          topic: currentQ.topic,
                          summaryText:
                            currentQ.explanation?.summary ||
                            currentQ.explanation?.mainIdea ||
                            currentQ.statement
                        });
                        showToast('Resumo salvo nas suas anotações!');
                      }}
                    >
                      Salvar resumo nas minhas anotações
                    </button>
                  </div>
                </div>
              )}

              {explanationTab === 'video' && (
                <div style={{ padding: '16px 0' }}>
                  {currentQ.explanation?.videoUrl ? (
                    <div className="card" style={{ background: '#0f172a', color: '#fff', padding: '24px', textAlign: 'center' }}>
                      <Play size={36} style={{ marginBottom: '10px', color: '#60a5fa' }} />
                      <h4 style={{ marginBottom: '8px' }}>Explicação em Vídeo do Professor</h4>
                      <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '16px' }}>
                        Link cadastrado: {currentQ.explanation.videoUrl}
                      </p>
                      <a
                        href={currentQ.explanation.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        Assistir vídeo explicativo <ExternalLink size={15} />
                      </a>
                    </div>
                  ) : (
                    <div className="empty-state">
                      Nenhum vídeo anexado pelo professor para esta questão.
                    </div>
                  )}
                </div>
              )}

              {explanationTab === 'discussao' && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Utilize a área de Discussão abaixo para interagir com outros estudantes ou ocultá-la se preferir estudar sozinho.
                </p>
              )}
            </div>

            {/* Materiais complementares (US24) */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                Materiais complementares
              </h3>
              {currentQ.studyLinks && currentQ.studyLinks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQ.studyLinks.map((lnk, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '10px',
                        borderBottom: i < currentQ.studyLinks.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.92rem' }}>
                        {lnk.type || 'Material'}: {lnk.title}
                      </span>
                      <a
                        href={lnk.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        Abrir ↗
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Nenhum link complementar associado a esta questão.
                </div>
              )}
            </div>

            {/* Discussão opcional (US10) */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Discussão (opcional)</h3>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setHideDiscussion(!hideDiscussion)}
                >
                  {hideDiscussion ? (
                    <>
                      <Eye size={14} /> Mostrar discussão
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} /> Ocultar discussão
                    </>
                  )}
                </button>
              </div>

              {!hideDiscussion ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {(currentQ.comments || []).length === 0 ? (
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                        Ainda não há comentários nesta questão. Seja o primeiro a compartilhar seu raciocínio!
                      </div>
                    ) : (
                      (currentQ.comments || []).map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '12px 14px'
                          }}
                        >
                          <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                            <strong>{c.authorName}</strong>{' '}
                            <span style={{ color: 'var(--text-muted)' }}>· {c.createdAt}</span>
                          </div>
                          <div style={{ fontSize: '0.92rem', marginBottom: '6px' }}>{c.text}</div>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyToCommentId(c.id);
                              setCommentInput(`@${c.authorName} `);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary)',
                              fontSize: '0.8rem',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                          >
                            Responder
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder="Escreva um comentário..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (!commentInput.trim()) return;
                        addQuestionComment(currentQ.id, commentInput, replyToCommentId);
                        setCommentInput('');
                        setReplyToCommentId(null);
                      }}
                    >
                      Publicar
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Área de discussão ocultada para estudo individual focado.
                </div>
              )}
            </div>

            {/* Isto ajudou? */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Isto ajudou?</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => showToast('Obrigado pelo feedback positivo!')}>
                Sim
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => showToast('Registrado! Vamos aprimorar esta explicação.')}>
                Não
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  reportQuestionError(currentQ.id, 'Pedido de mais detalhes na explicação pedagógica.');
                  showToast('Solicitação enviada ao professor responsável!');
                }}
              >
                Pedir mais detalhes ao professor
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Standard Question Resolution Screen (Page 12 wireframe - US04, US14, US23)
    const progressPct = Math.round(((activeSession.currentIndex + 1) / activeSession.questions.length) * 100);

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '48px' }}>
        <div className="topbar-light">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveSession(null)}
            >
              ✕ Sair
            </button>
            <strong style={{ fontSize: '1.05rem' }}>{activeSession.title}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {activeSession.mode === 'cronometrado'
                ? `${formatTimer(activeSession.remainingSec)} restantes`
                : `Tempo: ${formatTimer(activeSession.elapsedSec)}`}
            </span>
            <span className="badge badge-atualizada" style={{ fontSize: '0.88rem', padding: '5px 12px' }}>
              {activeSession.currentIndex + 1} / {activeSession.questions.length}
            </span>
          </div>
        </div>

        {/* Thin progress bar directly under topbar */}
        <div style={{ width: '100%', height: '5px', background: '#dbeafe' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }} />
        </div>

        <div style={{ maxWidth: '860px', margin: '28px auto', padding: '0 20px' }}>
          {feedbackToast && (
            <div className="card" style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1e40af', padding: '12px 16px', marginBottom: '16px' }}>
              {feedbackToast}
            </div>
          )}

          {activeSession.finished ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Resultado do Simulado</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Tempo total utilizado: <strong>{formatTimer(activeSession.elapsedSec)}</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveSession(null)}
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </div>
          ) : null}

          {currentQ && (
            <div>
              {/* Question Header Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <strong style={{ fontSize: '1.08rem' }}>Questão {activeSession.currentIndex + 1}</strong>
                <span className="badge badge-neutral">
                  {currentQ.discipline} &gt; {currentQ.topic}
                </span>
                <span className="badge badge-neutral">{currentQ.year}</span>
                {isValidated && <span className="badge badge-validada">Validada</span>}
                {currentQ.isUpdated && <span className="badge badge-atualizada">Atualizada</span>}
                {renderDifficultyDots(currentQ.difficulty)}
                {activeSession.markedForReview.includes(currentQ.id) && (
                  <span className="badge badge-revisao">Marcada para revisar</span>
                )}
              </div>

              {/* Base Text Box with Ampliar button */}
              {currentQ.baseText ? (
                <div
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    marginBottom: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {currentQ.baseText}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setEnlargedBaseText(currentQ.baseText)}
                  >
                    Ampliar
                  </button>
                </div>
              ) : null}

              {/* Statement */}
              <div style={{ fontSize: '1.02rem', marginBottom: '20px', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                <strong>Enunciado:</strong> {currentQ.statement}
              </div>

              {/* Options A..E */}
              <div style={{ marginBottom: '18px' }}>
                {(currentQ.options || []).map((opt) => {
                  const isSelected = currentAns?.selectedOption === opt.letter;
                  const isRightOpt = currentQ.correctOption === opt.letter;
                  const eliminatedList = activeSession.eliminated[currentQ.id] || [];
                  const isEliminated = eliminatedList.includes(opt.letter);

                  let itemClass = 'option-item';
                  if (isAnswered) {
                    if (isRightOpt) itemClass += ' correct';
                    else if (isSelected && !isRightOpt) itemClass += ' wrong';
                  } else if (isSelected) {
                    itemClass += ' selected';
                  }
                  if (isEliminated) itemClass += ' eliminated';

                  return (
                    <div
                      key={opt.letter}
                      className={itemClass}
                      onClick={() => handleSelectOptionInSession(currentQ, opt.letter)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                        <span className="option-letter">{opt.letter}</span>
                        <span style={{ fontSize: '0.95rem' }}>
                          {opt.text}
                          {isAnswered && isSelected && !isRightOpt && (
                            <em style={{ color: '#b91c1c', marginLeft: '8px' }}>· sua resposta</em>
                          )}
                          {isAnswered && isRightOpt && (
                            <em style={{ color: '#15803d', marginLeft: '8px' }}>· resposta correta</em>
                          )}
                        </span>
                      </div>

                      {!isAnswered && (
                        <button
                          type="button"
                          title="Riscar/eliminar alternativa"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSession((prev) => {
                              const cur = prev.eliminated[currentQ.id] || [];
                              const next = cur.includes(opt.letter)
                                ? cur.filter((l) => l !== opt.letter)
                                : [...cur, opt.letter];
                              return {
                                ...prev,
                                eliminated: { ...prev.eliminated, [currentQ.id]: next }
                              };
                            });
                          }}
                        >
                          {isEliminated ? 'Restaurar' : 'Eliminar'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Immediate Feedback Box (US04) */}
              {isAnswered && (
                <div
                  style={{
                    border: `1.5px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                    background: isCorrect ? '#f0fdf4' : '#fff',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: isCorrect ? '#15803d' : '#b91c1c', fontSize: '0.98rem' }}>
                      {isCorrect
                        ? `Você acertou! Resposta correta: ${currentQ.correctOption}`
                        : `Você errou. Resposta correta: ${currentQ.correctOption}`}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Tempo nesta questão: {currentAns?.timeSpentSec || 15}s
                    </span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                    {currentQ.shortErrorReason ||
                      currentQ.explanation?.mainIdea ||
                      `A alternativa correta é ${currentQ.correctOption}. Confira o passo a passo completo para revisar os conceitos.`}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowFullExplanation(true)}
                  >
                    Ver explicação completa ▾
                  </button>
                </div>
              )}

              {/* Bottom Navigation Bar (US23) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={activeSession.currentIndex === 0}
                    onClick={() =>
                      setActiveSession((prev) => ({
                        ...prev,
                        currentIndex: Math.max(0, prev.currentIndex - 1),
                        questionStartTime: Date.now()
                      }))
                    }
                  >
                    &lt; Anterior
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setActiveSession((prev) => {
                        const exists = prev.markedForReview.includes(currentQ.id);
                        return {
                          ...prev,
                          markedForReview: exists
                            ? prev.markedForReview.filter((id) => id !== currentQ.id)
                            : [...prev.markedForReview, currentQ.id]
                        };
                      });
                    }}
                  >
                    {activeSession.markedForReview.includes(currentQ.id)
                      ? '✓ Marcada para revisar'
                      : 'Marcar para revisar'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setErrorReportModalQ(currentQ)}
                  >
                    Reportar erro
                  </button>
                </div>

                <div>
                  {activeSession.currentIndex < activeSession.questions.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        setActiveSession((prev) => ({
                          ...prev,
                          currentIndex: prev.currentIndex + 1,
                          questionStartTime: Date.now()
                        }))
                      }
                    >
                      Próxima questão &gt;
                    </button>
                  ) : !activeSession.finished ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleFinishSession}
                    >
                      Finalizar simulado ✓
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Ampliar Texto-base */}
        {enlargedBaseText && (
          <div className="modal-backdrop" onClick={() => setEnlargedBaseText(null)}>
            <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: '12px' }}>Texto-base Ampliado</h3>
              <div style={{ fontSize: '1.05rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                {enlargedBaseText}
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setEnlargedBaseText(null)}>
                Fechar leitura ampliada
              </button>
            </div>
          </div>
        )}

        {/* Modal Reportar Erro */}
        {errorReportModalQ && (
          <div className="modal-backdrop" onClick={() => setErrorReportModalQ(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: '10px' }}>Reportar erro na questão ({errorReportModalQ.code})</h3>
              <div className="form-group">
                <label className="form-label">Descreva o problema identificado</label>
                <textarea
                  className="form-textarea"
                  placeholder="Ex: Alternativa duplicada, erro de digitação no enunciado ou dúvida no gabarito..."
                  value={errorReasonText}
                  onChange={(e) => setErrorReasonText(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setErrorReportModalQ(null)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    reportQuestionError(errorReportModalQ.id, errorReasonText || 'Erro reportado pelo aluno');
                    setErrorReasonText('');
                    setErrorReportModalQ(null);
                    showToast('Reporte enviado para a curadoria de professores!');
                  }}
                >
                  Enviar reporte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOPBAR LIGHT (ENADE+) */}
      <header className="topbar-light">
        <div className="brand-logo" onClick={() => setActiveTab('inicio')}>
          ENADE+
        </div>

        <div className="search-bar-top">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar questão, tópico..."
            value={topSearch}
            onChange={(e) => {
              setTopSearch(e.target.value);
              if (activeTab !== 'banco') setActiveTab('banco');
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {HeaderRoleSwitcher}

          <button
            type="button"
            className="badge badge-atualizada"
            style={{ border: 'none', cursor: 'pointer', padding: '6px 12px' }}
            onClick={() => setShowNoticesModal(true)}
          >
            {state.revisionSuggestions.length} avisos
          </button>

          <div
            title={`${state.currentUser?.name} (${state.currentUser?.course})`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#dbeafe',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {initials}
          </div>

          <button type="button" className="btn btn-outline btn-sm" onClick={logout} title="Sair">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <div className="app-layout">
        {/* SIDEBAR NAVIGATION */}
        <aside className="sidebar">
          {[
            { id: 'inicio', label: 'Início' },
            { id: 'banco', label: 'Banco de questões' },
            { id: 'montar', label: 'Montar simulado' },
            { id: 'meus_simulados', label: 'Meus simulados' },
            { id: 'plano_revisao', label: 'Plano de revisão' },
            { id: 'evolucao', label: 'Evolução' },
            { id: 'desafios', label: 'Desafios do dia' },
            { id: 'ranking', label: 'Ranking e conquistas' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'evolucao') {
                  setActiveTab('plano_revisao');
                  setRevSubTab('evolucao');
                } else if (item.id === 'plano_revisao') {
                  setActiveTab('plano_revisao');
                  setRevSubTab('plano');
                } else {
                  setActiveTab(item.id);
                }
              }}
            >
              <span className="nav-item-left">
                <input
                  type="checkbox"
                  checked={
                    activeTab === item.id ||
                    (item.id === 'evolucao' && activeTab === 'plano_revisao' && revSubTab === 'evolucao')
                  }
                  readOnly
                  style={{ pointerEvents: 'none', accentColor: 'var(--primary)' }}
                />
                <span>{item.label}</span>
              </span>
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          {feedbackToast && (
            <div
              className="card"
              style={{
                background: '#eff6ff',
                borderColor: '#93c5fd',
                color: '#1e40af',
                padding: '12px 16px',
                marginBottom: '20px'
              }}
            >
              {feedbackToast}
            </div>
          )}

          {/* 1. TELA INÍCIO (DASHBOARD DO ALUNO - Page 4 Wireframe - US06, US08) */}
          {activeTab === 'inicio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
                  Olá, {state.currentUser?.name?.split(' ')[0] || 'Estudante'}!
                </h1>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('montar')}
                >
                  Novo simulado
                </button>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid-3">
                <div className="card">
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Acertos gerais
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '8px' }}>
                    {metrics.overallPct}%
                  </div>
                  <span className="badge badge-validada">
                    {metrics.totalResolved > 0 ? 'Progresso registrado' : 'Sem respostas ainda'}
                  </span>
                </div>

                <div className="card">
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Questões resolvidas
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '8px' }}>
                    {metrics.totalResolved}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Últimos 30 dias</div>
                </div>

                <div className="card">
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Sequência de estudo
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '8px' }}>
                    {state.dailyStreak} {state.dailyStreak === 1 ? 'dia' : 'dias'}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Meta: {state.optionalStreakGoal} dias (opcional)
                  </div>
                </div>
              </div>

              {/* Desafio de hoje Banner (US08) */}
              <div
                className="card"
                style={{
                  border: '1.5px solid #93c5fd',
                  background: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.02rem', marginBottom: '4px' }}>
                    Desafio de hoje
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {availableQuestions.length > 0
                      ? `${Math.min(5, availableQuestions.length)} questões · cerca de 8 min · Pílula diária ENADE`
                      : 'Cadastre questões no perfil de Professor para liberar o desafio rápido de 5 a 10 minutos'}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    startQuestionSession(
                      availableQuestions.slice(0, 5),
                      'Desafio Diário',
                      'cronometrado',
                      10,
                      'cada_questao'
                    )
                  }
                >
                  Começar
                </button>
              </div>

              {/* Desempenho por disciplina & Pontos fracos */}
              <div className="grid-2">
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                    Desempenho por disciplina
                  </h3>
                  {metrics.byDiscipline.length === 0 ? (
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '12px 0' }}>
                      Resolva questões ou simulados para visualizar seu percentual de acertos por disciplina.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {metrics.byDiscipline.map((d) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ width: '110px', fontSize: '0.9rem' }}>{d.name}</span>
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${d.pct}%`,
                                background: d.pct >= 70 ? '#15803d' : d.pct >= 50 ? '#b45309' : '#dc2626'
                              }}
                            />
                          </div>
                          <strong style={{ width: '42px', textAlign: 'right', fontSize: '0.9rem' }}>
                            {d.pct}%
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('plano_revisao');
                      setRevSubTab('evolucao');
                    }}
                    style={{
                      marginTop: '16px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    Ver todas
                  </button>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                    Pontos fracos
                  </h3>
                  {metrics.byTopic.length === 0 ? (
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '12px 0' }}>
                      Ainda não há diagnóstico de pontos fracos. Responda questões para identificar tópicos prioritários.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {metrics.byTopic.slice(0, 3).map((t) => (
                        <div
                          key={t.topic}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className={`badge ${t.pct < 50 ? 'badge-danger' : 'badge-revisao'}`}>
                              Atenção
                            </span>
                            <span style={{ fontSize: '0.92rem' }}>{t.topic}</span>
                          </div>
                          <strong style={{ fontSize: '0.92rem' }}>{t.pct}%</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setActiveTab('plano_revisao');
                      setRevSubTab('plano');
                    }}
                  >
                    Ver plano de revisão
                  </button>
                </div>
              </div>

              {/* Histórico recente */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                  Histórico recente
                </h3>
                {state.simulados.length === 0 ? (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Nenhum simulado concluído ainda.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {state.simulados.slice(0, 4).map((sim) => (
                      <div
                        key={sim.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '10px',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <span style={{ fontSize: '0.92rem' }}>
                          {sim.date} · {sim.title} · {sim.correctCount}/{sim.totalCount} · {sim.scorePct}%
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            const qs = availableQuestions.filter((q) =>
                              (sim.questionIds || []).includes(q.id)
                            );
                            startQuestionSession(qs, `Revisão: ${sim.title}`, 'livre', 40, 'cada_questao');
                          }}
                        >
                          Revisar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('meus_simulados')}
                  style={{
                    marginTop: '14px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    textDecoration: 'underline',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  Ver histórico completo
                </button>
              </div>
            </div>
          )}

          {/* 2. BANCO DE QUESTÕES (Page 5 Wireframe - US19, US21, US03) */}
          {activeTab === 'banco' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Banco de questões</h1>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Início &gt; Banco &gt; {selectedDiscipline}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    startQuestionSession(
                      filteredBankQuestions,
                      `Simulado Filtrado (${selectedDiscipline})`,
                      'cronometrado',
                      40,
                      'cada_questao'
                    )
                  }
                >
                  Montar simulado com filtros
                </button>
              </div>

              <div className="bank-layout-grid">
                {/* Left Category Tree (US19) */}
                <div className="card" style={{ padding: '14px' }}>
                  <button
                    type="button"
                    className={`nav-item ${selectedDiscipline === 'Todas' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDiscipline('Todas');
                      setSelectedTopic('Todos');
                    }}
                  >
                    <span>Todas as disciplinas</span>
                    <span>{availableQuestions.length}</span>
                  </button>

                  {disciplineTree.map((disc) => (
                    <div key={disc.name} style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        className={`nav-item ${selectedDiscipline === disc.name ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedDiscipline(disc.name);
                          setSelectedTopic('Todos');
                        }}
                      >
                        <span>{disc.name}</span>
                        <span>{disc.count}</span>
                      </button>
                      {Object.entries(disc.topics).map(([tName, tCount]) => (
                        <button
                          key={tName}
                          type="button"
                          onClick={() => {
                            setSelectedDiscipline(disc.name);
                            setSelectedTopic(tName);
                          }}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '6px 14px 6px 26px',
                            background: selectedTopic === tName ? '#eff6ff' : 'transparent',
                            color: selectedTopic === tName ? 'var(--primary)' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{tName}</span>
                          <span>{tCount}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Right Filter & Question Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                      <select
                        className="form-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
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
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                      >
                        <option value="Todos">Tópico: Todos</option>
                        {disciplineTree
                          .flatMap((d) => Object.keys(d.topics))
                          .map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                      </select>

                      <select
                        className="form-select"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      >
                        <option value="Todas">Dificuldade: Todas</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Média">Média</option>
                        <option value="Difícil">Difícil</option>
                      </select>

                      <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <option value="Todos">Ano: Todos</option>
                        {allYears.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>

                      <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="Todas">Status: Todas</option>
                        <option value="Resolvidas">Resolvidas</option>
                        <option value="Não resolvidas">Não resolvidas</option>
                      </select>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={onlyValidated}
                          onChange={(e) => setOnlyValidated(e.target.checked)}
                        />
                        Só validadas
                      </label>
                    </div>

                    {/* Active filter chips */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.84rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Filtros ativos:</span>
                        {selectedDiscipline !== 'Todas' && (
                          <span className="badge badge-atualizada">
                            {selectedDiscipline}{' '}
                            <button
                              type="button"
                              onClick={() => setSelectedDiscipline('Todas')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}
                            >
                              ✕
                            </button>
                          </span>
                        )}
                        {selectedTopic !== 'Todos' && (
                          <span className="badge badge-atualizada">
                            {selectedTopic}{' '}
                            <button
                              type="button"
                              onClick={() => setSelectedTopic('Todos')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}
                            >
                              ✕
                            </button>
                          </span>
                        )}
                        {selectedDifficulty !== 'Todas' && (
                          <span className="badge badge-atualizada">
                            {selectedDifficulty}{' '}
                            <button
                              type="button"
                              onClick={() => setSelectedDifficulty('Todas')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}
                            >
                              ✕
                            </button>
                          </span>
                        )}
                        {selectedYear !== 'Todos' && (
                          <span className="badge badge-atualizada">
                            {selectedYear}{' '}
                            <button
                              type="button"
                              onClick={() => setSelectedYear('Todos')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}
                            >
                              ✕
                            </button>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse('Todos');
                          setSelectedDiscipline('Todas');
                          setSelectedTopic('Todos');
                          setSelectedDifficulty('Todas');
                          setSelectedYear('Todos');
                          setSelectedStatus('Todas');
                          setOnlyValidated(false);
                          setTopSearch('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: '0.84rem'
                        }}
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                      {filteredBankQuestions.length} questões
                    </span>
                    <select
                      className="form-select"
                      style={{ width: 'auto' }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="recentes">Ordenar: Mais recentes</option>
                      <option value="dificuldade">Ordenar: Dificuldade</option>
                    </select>
                  </div>

                  {filteredBankQuestions.length === 0 ? (
                    <div className="empty-state">
                      <p style={{ fontWeight: 600, marginBottom: '6px' }}>
                        Nenhuma questão encontrada no banco.
                      </p>
                      <p style={{ fontSize: '0.86rem' }}>
                        Acesse o perfil de <strong>Professor</strong> (no seletor do topo) para cadastrar novas questões no banco centralizado.
                      </p>
                    </div>
                  ) : (
                    filteredBankQuestions.map((q) => {
                      const isVal =
                        q.peerValidated ||
                        q.status === 'validada_pares' ||
                        q.status === 'aprovada_nde';
                      const isSolved = myAttempts.some((a) => a.questionId === q.id);
                      const isSaved = state.savedQuestionIds.includes(q.id);

                      return (
                        <div key={q.id} className="card">
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            {isVal ? (
                              <span className="badge badge-validada">Validada</span>
                            ) : (
                              <span className="badge badge-revisao">Em revisão</span>
                            )}
                            {q.isUpdated && <span className="badge badge-atualizada">Atualizada</span>}
                            {q.course && (
                              <span className="badge badge-atualizada" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                                Curso: {q.course}
                              </span>
                            )}
                            <span className="badge badge-neutral">{q.year}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {q.discipline} &gt; {q.topic}
                            </span>
                            {renderDifficultyDots(q.difficulty)}
                          </div>

                          {q.officialSource && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                              🏛️ Fonte Oficial: {q.officialSource}
                            </div>
                          )}

                          <p style={{ fontSize: '0.96rem', marginBottom: '14px', color: 'var(--text-main)' }}>
                            &ldquo;{q.statement}&rdquo;
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  startQuestionSession([q], `Questão ${q.code}`, 'livre', 20, 'cada_questao')
                                }
                              >
                                Resolver
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => toggleSaveQuestion(q.id)}
                              >
                                {isSaved ? '✓ Salva' : 'Salvar'}
                              </button>
                            </div>
                            {isSolved && <span className="badge badge-validada">Resolvida</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. MONTAR SIMULADO (Page 6 Wireframe - US03, US13, US14) */}
          {activeTab === 'montar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 800, marginBottom: '10px' }}>
                  Montar simulado
                </h1>
                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                  {[
                    { s: 1, label: 'Conteúdo' },
                    { s: 2, label: 'Formato' },
                    { s: 3, label: 'Revisão' }
                  ].map((st, idx) => (
                    <React.Fragment key={st.s}>
                      <span
                        onClick={() => setSimStep(st.s)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: simStep === st.s ? 'var(--primary)' : '#e2e8f0',
                            color: simStep === st.s ? '#fff' : '#475569',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}
                        >
                          {st.s}
                        </span>
                        <strong style={{ color: simStep === st.s ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {st.label}
                        </strong>
                      </span>
                      {idx < 2 && <span style={{ color: '#cbd5e1' }}>—</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 1. O que você quer treinar? */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    1. O que você quer treinar?
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Filtrar por Curso:
                    </span>
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '6px 12px' }}
                      value={simCourseFilter}
                      onChange={(e) => {
                        setSimCourseFilter(e.target.value);
                        setSimSelectedTopics([]);
                      }}
                    >
                      <option value="Todos">Todos os Cursos ({availableQuestions.length} questões)</option>
                      {state.courses.map((c) => {
                        const cCount = availableQuestions.filter((q) => q.course === c).length;
                        return (
                          <option key={c} value={c}>
                            {c} ({cCount} questões)
                          </option>
                        );
                      })}
                    </select>
                    {simSelectedTopics.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setSimSelectedTopics([])}
                      >
                        Limpar seleção ({simSelectedTopics.length})
                      </button>
                    )}
                  </div>
                </div>

                {disciplineTree.length === 0 ? (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Nenhuma disciplina ou tópico cadastrado ainda.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    {disciplineTree
                      .filter((d) => simCourseFilter === 'Todos' || d.course === simCourseFilter)
                      .map((d) => {
                        const topicKeys = Object.keys(d.topics);
                        const isDiscChecked = simSelectedTopics.includes(d.name);
                        return (
                          <div
                            key={d.name}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: '#f8fafc'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, color: 'var(--text-main)' }}>
                                <input
                                  type="checkbox"
                                  checked={isDiscChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSimSelectedTopics((prev) =>
                                        Array.from(new Set([...prev, d.name, ...topicKeys]))
                                      );
                                    } else {
                                      setSimSelectedTopics((prev) =>
                                        prev.filter((item) => item !== d.name && !topicKeys.includes(item))
                                      );
                                    }
                                  }}
                                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                                />
                                <span>{d.name}</span>
                                <span className="badge badge-atualizada" style={{ fontSize: '0.72rem' }}>
                                  {d.course} · {d.count} {d.count === 1 ? 'questão' : 'questões'}
                                </span>
                              </label>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingLeft: '24px' }}>
                              {topicKeys.map((t) => (
                                <label key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.88rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={simSelectedTopics.includes(t)}
                                    onChange={(e) => {
                                      setSimSelectedTopics((prev) =>
                                        e.target.checked
                                          ? [...prev, t]
                                          : prev.filter((item) => item !== t && item !== d.name)
                                      );
                                    }}
                                    style={{ accentColor: 'var(--primary)' }}
                                  />
                                  <span>{t}</span>
                                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                    ({d.topics[t] || 1})
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const weakNames = metrics.weakTopics.map((w) => w.topic);
                    if (weakNames.length === 0) {
                      showToast('Você ainda não possui tópicos abaixo de 60% de acerto.');
                    } else {
                      setSimSelectedTopics(weakNames);
                      showToast(`Tópicos preenchidos: ${weakNames.join(', ')}`);
                    }
                  }}
                >
                  Usar meus pontos fracos
                </button>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Preenche com os tópicos abaixo de 60% de acerto.
                </div>
              </div>

              {/* 2. Filtros */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                  2. Filtros
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Dificuldade</span>
                  {['Todas', 'Fácil', 'Média', 'Difícil'].map((diff) => (
                    <label key={diff} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="simDiff"
                        checked={simDifficulty === diff}
                        onChange={() => setSimDifficulty(diff)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      {diff}
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ano da prova</span>
                    <select
                      className="form-select"
                      value={simYear}
                      onChange={(e) => setSimYear(e.target.value)}
                    >
                      <option value="Todos">Todos</option>
                      {allYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={simOnlyValidated}
                      onChange={(e) => setSimOnlyValidated(e.target.checked)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    Só questões validadas
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={simHideCorrect}
                      onChange={(e) => setSimHideCorrect(e.target.checked)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    Ocultar as que já acertei
                  </label>
                </div>
              </div>

              {/* 3. Formato */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                  3. Formato
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <span style={{ width: '90px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Quantidade</span>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        gap: '14px'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSimQty(Math.max(1, simQty - 5))}
                        style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                      >
                        −
                      </button>
                      <strong>{simQty}</strong>
                      <button
                        type="button"
                        onClick={() => setSimQty(simQty + 5)}
                        style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {simuladoCandidatePool.length} disponíveis com esses filtros
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    <span style={{ width: '90px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Modo</span>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        checked={simMode === 'cronometrado'}
                        onChange={() => setSimMode('cronometrado')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      Cronometrado
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        checked={simMode === 'livre'}
                        onChange={() => setSimMode('livre')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      Livre
                    </label>

                    {simMode === 'cronometrado' && (
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tempo</span>
                        <select
                          className="form-select"
                          value={simTimeMin}
                          onChange={(e) => setSimTimeMin(Number(e.target.value))}
                        >
                          <option value={10}>10 min</option>
                          <option value={20}>20 min</option>
                          <option value={40}>40 min</option>
                          <option value={60}>60 min</option>
                          <option value={120}>120 min</option>
                        </select>
                      </label>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    <span style={{ width: '90px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Correção</span>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        checked={simCorrectionMode === 'cada_questao'}
                        onChange={() => setSimCorrectionMode('cada_questao')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      A cada questão
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        checked={simCorrectionMode === 'final'}
                        onChange={() => setSimCorrectionMode('final')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      Só no final
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer Summary & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <strong style={{ fontSize: '0.96rem' }}>
                  Resumo: {Math.min(simQty, simuladoCandidatePool.length || simQty)} questões ·{' '}
                  {simSelectedTopics.length || 'Todos os'} temas · {simMode === 'cronometrado' ? `${simTimeMin} min` : 'Livre'}
                </strong>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      saveSimuladoTemplate({
                        title: `Modelo (${simSelectedTopics.join(', ') || 'Geral'})`,
                        topics: simSelectedTopics,
                        difficulty: simDifficulty,
                        qty: simQty,
                        mode: simMode,
                        timeMin: simTimeMin
                      });
                      showToast('Modelo de simulado salvo em Meus Simulados!');
                    }}
                  >
                    Salvar como modelo
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setActiveTab('inicio')}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      startQuestionSession(
                        simuladoCandidatePool.slice(0, simQty),
                        simSelectedTopics.length > 0
                          ? `Simulado: ${simSelectedTopics.slice(0, 2).join(' + ')}`
                          : 'Simulado Geral ENADE',
                        simMode,
                        simTimeMin,
                        simCorrectionMode
                      )
                    }
                  >
                    Iniciar simulado
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. MEUS SIMULADOS, QUESTÕES SALVAS E ANOTAÇÕES */}
          {activeTab === 'meus_simulados' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Meus simulados e caderno</h1>

              <div className="grid-2">
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                    Histórico de simulados realizados
                  </h3>
                  {state.simulados.length === 0 ? (
                    <div className="empty-state">Nenhum simulado realizado ainda.</div>
                  ) : (
                    state.simulados.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 0',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.title}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {s.date} · {s.correctCount}/{s.totalCount} acertos ({s.scorePct}%)
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            const qs = availableQuestions.filter((q) => (s.questionIds || []).includes(q.id));
                            startQuestionSession(qs, `Revisão: ${s.title}`, 'livre', 40, 'cada_questao');
                          }}
                        >
                          Refazer / Revisar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                    Meus Resumos e Anotações Salvas (US15)
                  </h3>
                  {state.savedNotes.length === 0 ? (
                    <div className="empty-state">
                      Nenhum resumo salvo ainda. Ao ver a explicação de uma questão, clique em &ldquo;Salvar resumo nas minhas anotações&rdquo;.
                    </div>
                  ) : (
                    state.savedNotes.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: '10px',
                          background: '#fefce8',
                          border: '1px solid #fde047',
                          borderRadius: '8px',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#713f12' }}>
                          {n.discipline} &gt; {n.topic}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#422006' }}>{n.summaryText}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. PLANO DE REVISÃO E EVOLUÇÃO (Page 9 Wireframe - US16, US17, US22) */}
          {activeTab === 'plano_revisao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Plano de revisão e evolução</h1>

              <div className="tabs-header" style={{ marginBottom: '4px' }}>
                <button
                  type="button"
                  className={`tab-btn ${revSubTab === 'plano' ? 'active' : ''}`}
                  onClick={() => setRevSubTab('plano')}
                >
                  Plano de revisão
                </button>
                <button
                  type="button"
                  className={`tab-btn ${revSubTab === 'evolucao' ? 'active' : ''}`}
                  onClick={() => setRevSubTab('evolucao')}
                >
                  Evolução
                </button>
              </div>

              <div className="grid-2">
                {/* Left Card: Seu diagnóstico & Sugestões para esta semana */}
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Seu diagnóstico</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Você erra mais em:
                  </div>

                  {metrics.byTopic.length === 0 ? (
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Responda questões para que o sistema identifique automaticamente seus pontos fracos e sugira um plano de revisão.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {metrics.byTopic.slice(0, 3).map((t) => (
                        <div
                          key={t.topic}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '10px',
                            borderBottom: '1px solid var(--border-color)'
                          }}
                        >
                          <span style={{ fontSize: '0.92rem' }}>{t.topic}</span>
                          <span className={`badge ${t.pct < 50 ? 'badge-danger' : 'badge-revisao'}`}>
                            {t.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
                    Sugestões para esta semana
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                    {metrics.byTopic.slice(0, 2).map((t, idx) => {
                      const topicQs = availableQuestions.filter((q) => q.topic === t.topic);
                      return (
                        <div
                          key={t.topic}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '0.92rem' }}>
                            {idx + 1}. {t.topic} · {topicQs.length} questões
                          </span>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              startQuestionSession(topicQs, `Revisão: ${t.topic}`, 'livre', 20, 'cada_questao')
                            }
                          >
                            Treinar
                          </button>
                        </div>
                      );
                    })}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.92rem' }}>
                        Refazer questões que errei
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          const wrongQIds = myAttempts.filter((a) => !a.isCorrect).map((a) => a.questionId);
                          const wrongQs = availableQuestions.filter((q) => wrongQIds.includes(q.id));
                          startQuestionSession(wrongQs, 'Refazer Questões Erradas', 'livre', 20, 'cada_questao');
                        }}
                      >
                        Refazer
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    <span>Tempo estimado: 1h40 · Meta:</span>
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '5px 10px', fontSize: '0.82rem' }}
                      value={state.weeklyGoalDays}
                      onChange={(e) => updatePreferences({ weeklyGoalDays: Number(e.target.value) })}
                    >
                      <option value={2}>2 dias na semana</option>
                      <option value={3}>3 dias na semana</option>
                      <option value={5}>5 dias na semana</option>
                    </select>
                  </div>
                </div>

                {/* Right Card: Acertos por semana (US22) */}
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                    Acertos por semana
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                    <select
                      className="form-select"
                      value={evolWeeksFilter}
                      onChange={(e) => setEvolWeeksFilter(e.target.value)}
                    >
                      <option value="8">Últimas 8 semanas</option>
                      <option value="4">Últimas 4 semanas</option>
                    </select>
                    <select
                      className="form-select"
                      value={evolCatFilter}
                      onChange={(e) => setEvolCatFilter(e.target.value)}
                    >
                      <option value="Todas">Todas as categorias</option>
                      {disciplineTree.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SVG Evolution Line Chart */}
                  <div style={{ width: '100%', height: '210px', position: 'relative' }}>
                    <svg viewBox="0 0 420 180" style={{ width: '100%', height: '100%' }}>
                      {[25, 70, 115, 155].map((y, idx) => (
                        <g key={y}>
                          <line x1="40" y1={y} x2="400" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                          <text x="5" y={y + 4} fontSize="10" fill="#64748b">
                            {['100%', '70%', '40%', '10%'][idx]}
                          </text>
                        </g>
                      ))}
                      {metrics.totalResolved > 0 && (
                        <>
                          <polyline
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="3"
                            points={`55,120 102,110 150,95 198,85 246,85 294,75 342,58 390,${Math.max(25, 155 - Math.round(metrics.overallPct * 1.3))}`}
                          />
                          {[
                            [55, 120],
                            [102, 110],
                            [150, 95],
                            [198, 85],
                            [246, 85],
                            [294, 75],
                            [342, 58],
                            [390, Math.max(25, 155 - Math.round(metrics.overallPct * 1.3))]
                          ].map(([cx, cy], i) => (
                            <circle key={i} cx={cx} cy={cy} r="4.5" fill="var(--primary)" />
                          ))}
                        </>
                      )}
                      {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((lbl, i) => (
                        <text key={lbl} x={48 + i * 48} y="174" fontSize="10" fill="#64748b">
                          {lbl}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Comparar categorias (US22) */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                  Comparar categorias
                </h3>
                {metrics.byDiscipline.length === 0 ? (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Sem dados de categorias suficientes para comparação histórica.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {metrics.byDiscipline.map((d) => (
                      <div
                        key={d.name}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '10px',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <span style={{ fontSize: '0.93rem' }}>
                          {d.name} · Atual: {d.pct}% ({d.correct}/{d.total} acertos)
                        </span>
                        <span className={`badge ${d.pct >= 65 ? 'badge-validada' : 'badge-revisao'}`}>
                          {d.pct >= 65 ? 'Em evolução' : 'Estável · repete dificuldade'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. DESAFIOS DO DIA E FLASHCARDS (US08) */}
          {activeTab === 'desafios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                Desafios diários e Pílulas de Conhecimento
              </h1>

              <div className="grid-2">
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Flame size={22} color="#ea580c" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      Pílula Diária (5 a 10 minutos)
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Mantenha sua consistência de estudos em dias corridos resolvendo uma bateria rápida de até 5 questões com correção comentada imediata.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      startQuestionSession(
                        availableQuestions.slice(0, 5),
                        'Pílula Diária (5-10 min)',
                        'cronometrado',
                        10,
                        'cada_questao'
                      )
                    }
                  >
                    Iniciar Desafio de Hoje
                  </button>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>
                    Criar Flashcard de Revisão Rápida
                  </h3>
                  <div className="grid-2" style={{ gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Disciplina"
                      value={newFcDisc}
                      onChange={(e) => setNewFcDisc(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Tópico"
                      value={newFcTopic}
                      onChange={(e) => setNewFcTopic(e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: '8px', width: '100%' }}
                    placeholder="Frente do cartão (Pergunta ou Conceito)"
                    value={newFcFront}
                    onChange={(e) => setNewFcFront(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: '8px', width: '100%' }}
                    placeholder="Verso do cartão (Resposta / Resumo)"
                    value={newFcBack}
                    onChange={(e) => setNewFcBack(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                      if (!newFcFront.trim() || !newFcBack.trim()) return;
                      addFlashcard({
                        discipline: newFcDisc || 'Geral',
                        topic: newFcTopic || 'Conceito',
                        front: newFcFront,
                        back: newFcBack
                      });
                      setNewFcFront('');
                      setNewFcBack('');
                      showToast('Flashcard adicionado!');
                    }}
                  >
                    + Adicionar Flashcard
                  </button>
                </div>
              </div>

              {state.flashcards.length > 0 && (
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                    Meus Flashcards (Clique para virar)
                  </h3>
                  <div className="grid-3">
                    {state.flashcards.map((fc) => {
                      const flipped = flippedCardIds.includes(fc.id);
                      return (
                        <div
                          key={fc.id}
                          className="card"
                          onClick={() =>
                            setFlippedCardIds((prev) =>
                              prev.includes(fc.id) ? prev.filter((i) => i !== fc.id) : [...prev, fc.id]
                            )
                          }
                          style={{
                            cursor: 'pointer',
                            background: flipped ? '#fefce8' : '#eff6ff',
                            borderColor: flipped ? '#fde047' : '#bfdbfe'
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            {fc.discipline} &gt; {fc.topic} ({flipped ? 'Verso' : 'Frente'})
                          </div>
                          <div style={{ fontWeight: 600 }}>{flipped ? fc.back : fc.front}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. RANKING E CONQUISTAS (US09 - Opcional) */}
          {activeTab === 'ranking' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Ranking e conquistas</h1>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={state.gamificationEnabled}
                    onChange={(e) => updatePreferences({ gamificationEnabled: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '17px', height: '17px' }}
                  />
                  Habilitar gamificação e ranking (opcional - US09)
                </label>
              </div>

              {!state.gamificationEnabled ? (
                <div className="card">
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Você optou por ocultar o ranking e elementos competitivos para focar apenas no seu acompanhamento individual. Marque a caixa acima quando quiser reativar.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid-3">
                    <div className="card">
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sua Pontuação</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {state.currentUser?.points || 0} pts
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+15 pts por questão correta</div>
                    </div>
                    <div className="card">
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sequência Atual (Streak)</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                        {state.dailyStreak} dias
                      </div>
                    </div>
                    <div className="card">
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Conquistas (Badges)</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {metrics.totalResolved >= 1 && (
                          <span className="badge badge-validada">🏅 1ª Questão Resolvida</span>
                        )}
                        {state.dailyStreak >= 1 && (
                          <span className="badge badge-atualizada">🔥 Foco Diário</span>
                        )}
                        {metrics.overallPct >= 70 && metrics.totalResolved >= 1 && (
                          <span className="badge badge-validada">🎯 Alta Precisão (&ge;70%)</span>
                        )}
                        {metrics.totalResolved === 0 && (
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                            Resolva questões para desbloquear badges!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                      Classificação Geral de Estudantes
                    </h3>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Posição</th>
                          <th>Estudante</th>
                          <th>Curso / Turma</th>
                          <th>Pontuação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.users
                          .filter((u) => u.role === 'aluno')
                          .sort((a, b) => (b.points || 0) - (a.points || 0))
                          .map((u, idx) => (
                            <tr key={u.id}>
                              <td>
                                <strong>#{idx + 1}</strong>
                              </td>
                              <td>{u.name}</td>
                              <td>
                                {u.course} · {u.className}
                              </td>
                              <td>
                                <strong>{u.points || 0} pts</strong>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Avisos da Coordenação */}
      {showNoticesModal && (
        <div className="modal-backdrop" onClick={() => setShowNoticesModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '12px' }}>Avisos e Aulas de Revisão</h3>
            {state.revisionSuggestions.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Nenhum aviso ou aula de revisão agendada pela coordenação no momento.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {state.revisionSuggestions.map((rev) => (
                  <div key={rev.id} className="card" style={{ padding: '12px', background: '#eff6ff' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Revisão recomendada: {rev.discipline} &gt; {rev.topic} ({rev.className})
                    </div>
                    <div style={{ fontSize: '0.86rem', marginTop: '4px' }}>{rev.note}</div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" className="btn btn-primary" onClick={() => setShowNoticesModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

