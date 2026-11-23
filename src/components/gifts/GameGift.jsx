import { useState } from 'react';
import { Check, X, RotateCcw, Camera } from 'lucide-react';
import Button from '../Button.jsx';
import PhotoFrame from '../PhotoFrame.jsx';
import { useAppState } from '../../hooks/useAppState.jsx';
import { Divider } from '../decor/Decor.jsx';

function Quiz({ content, day }) {
  const { state, actions } = useAppState();
  const key = `quiz-${day}`;
  const stored = state.completedInteractions[key];
  const questions = content.questions || [];
  const [step, setStep] = useState(stored != null ? questions.length : 0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(typeof stored === 'number' ? stored : 0);

  if (!questions.length) return null;

  if (step >= questions.length) {
    return (
      <div className="quiz quiz--done reveal">
        <p className="eyebrow">Your score</p>
        <p className="quiz__score">{score} <span>/ {questions.length}</span></p>
        <p className="quiz__result">{content.result}</p>
        {content.photo && <div className="quiz__photo"><PhotoFrame photo={content.photo} tilt={-1.2} /></div>}
        <Button variant="text" icon={RotateCcw} onClick={() => { setStep(0); setScore(0); setPicked(null); }}>Play again</Button>
      </div>
    );
  }

  const q = questions[step];
  const answered = picked !== null;
  const next = () => {
    const nextStep = step + 1;
    if (nextStep >= questions.length) actions.complete(key, score);
    setPicked(null);
    setStep(nextStep);
  };

  return (
    <div className="quiz" key={step}>
      <p className="quiz__progress">Question {step + 1} of {questions.length}</p>
      <h2 className="quiz__q reveal">{q.q}</h2>
      <div className="quiz__options" role="group" aria-label="Answers">
        {q.options.map((opt, i) => {
          const isRight = i === q.answer;
          const state = !answered ? '' : isRight ? 'is-right' : i === picked ? 'is-wrong' : 'is-dim';
          return (
            <button
              key={i}
              className={`quiz__option ${state}`}
              disabled={answered}
              onClick={() => {
                setPicked(i);
                if (isRight) setScore((s) => s + 1);
              }}
            >
              <span>{opt}</span>
              {answered && isRight && <Check size={18} aria-label="Correct" />}
              {answered && i === picked && !isRight && <X size={18} aria-label="Not quite" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="quiz__feedback reveal" aria-live="polite">
          <p className="quiz__verdict">{picked === q.answer ? 'Exactly right.' : 'Not quite — but close enough for me.'}</p>
          {q.note && <p className="quiz__note">{q.note}</p>}
          <Button variant="gold" onClick={next}>{step + 1 === questions.length ? 'See how you did' : 'Next question'}</Button>
        </div>
      )}
    </div>
  );
}

function Challenge({ content, day }) {
  const { state, actions, toast } = useAppState();
  const key = `challenge-${day}`;
  const doneSteps = Array.isArray(state.completedInteractions[key]) ? state.completedInteractions[key] : [];
  const steps = content.steps || [];
  const allDone = steps.length > 0 && steps.every((_, i) => doneSteps.includes(i));

  const toggle = (i) => {
    const next = doneSteps.includes(i) ? doneSteps.filter((x) => x !== i) : [...doneSteps, i];
    actions.complete(key, next);
    if (next.length === steps.length && !allDone) toast('Challenge complete ♡');
  };

  return (
    <div className="challenge">
      {content.intro && <p className="gift-intro reveal">{content.intro}</p>}
      <ul className="challenge__list reveal reveal-2">
        {steps.map((s, i) => {
          const done = doneSteps.includes(i);
          return (
            <li key={i}>
              <label className={`challenge__item ${done ? 'is-done' : ''}`}>
                <input type="checkbox" checked={done} onChange={() => toggle(i)} />
                <span className="challenge__box" aria-hidden="true">{done ? <Check size={14} /> : <Camera size={13} strokeWidth={1.5} />}</span>
                <span className="challenge__text">{s}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="challenge__count" aria-live="polite">{doneSteps.length} of {steps.length} captured</p>
      {allDone && (
        <>
          <Divider glyph="heart" />
          <p className="challenge__done reveal">{content.doneText}</p>
        </>
      )}
    </div>
  );
}

export default function GameGift({ content, day }) {
  if (content.game === 'challenge') return <Challenge content={content} day={day} />;
  return (
    <div className="game">
      {content.intro && <p className="gift-intro reveal">{content.intro}</p>}
      <Quiz content={content} day={day} />
    </div>
  );
}
