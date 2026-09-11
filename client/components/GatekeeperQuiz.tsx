import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import { GatekeeperQuestion } from '../types';

interface GatekeeperQuizProps {
  questions: GatekeeperQuestion[];
}

export const GatekeeperQuiz: React.FC<GatekeeperQuizProps> = ({ questions }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: string }>({});

  const handleSelect = (qIndex: number, optionKey: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: optionKey
    }));
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-number-pill">1</span>
          The Gatekeeper Test (Pre-Screen)
        </h3>
        <button
          className="btn-secondary"
          onClick={() => setShowAnswers(!showAnswers)}
          style={{ fontSize: '0.78rem' }}
        >
          {showAnswers ? <EyeOff size={14} /> : <Eye size={14} />}
          {showAnswers ? 'Hide Answer Key' : 'Reveal Answer Key'}
        </button>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        3 multiple-choice questions strictly generated from the Job Description to verify if the candidate actually read the requirements.
      </p>

      {questions.map((q, qIndex) => {
        const selected = selectedAnswers[qIndex];
        const isCorrect = selected === q.correct_answer;

        return (
          <div key={qIndex} className="gatekeeper-card">
            <div className="gatekeeper-question-text">
              <span style={{ color: 'var(--accent-primary)', marginRight: '6px', fontWeight: 800 }}>Q{qIndex + 1}.</span>
              {q.question}
            </div>

            <div className="options-grid">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = q.options[optKey];
                const isOptionCorrect = q.correct_answer === optKey;
                const isSelected = selected === optKey;

                let itemClass = 'option-item';
                if (showAnswers && isOptionCorrect) {
                  itemClass += ' correct';
                } else if (isSelected) {
                  itemClass += isOptionCorrect ? ' correct' : ' selected-wrong';
                }

                return (
                  <div
                    key={optKey}
                    className={itemClass}
                    onClick={() => handleSelect(qIndex, optKey)}
                  >
                    <span className="option-letter">{optKey}</span>
                    <span style={{ flex: 1 }}>{optText}</span>
                    {showAnswers && isOptionCorrect && (
                      <Check size={14} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                    {!showAnswers && isSelected && (
                      isOptionCorrect
                        ? <Check size={14} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        : <X size={14} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
