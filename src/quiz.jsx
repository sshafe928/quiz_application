import React, { useState } from 'react';
import questionsData from './quiz-questions.json';
import './quiz.css';

const QuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = questionsData.questions.filter(q => !q.bonusQuestion);
  const bonusQuestion = questionsData.questions.find(q => q.bonusQuestion);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleBonusQuestion = (answer) => {
    const isCorrect = answer === bonusQuestion.correctAnswer;

    
    if (isCorrect) {
      setScore(prevScore => prevScore + 2);
    } else {
      setScore(prevScore => Math.max(0, prevScore - 1));
    }

    setQuizCompleted(true);  
    setShowFeedback(true);   
    setSelectedAnswer(answer);  
  };

  const restartQuiz = () => {
    // Reset all states to restart the quiz
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  const renderQuizContent = () => {
    if (quizCompleted) {
      return (
        <div className="quiz-complete">
          <h2>Quiz Completed!</h2>
          <p>Your Total Score: {score} / {questions.length + 2}</p>
          
          {/* Display bonus question and answer choices */}
          {bonusQuestion && (
            <div className="bonus-section">
              <h3>Bonus Question</h3>
              <p>{bonusQuestion.prompt}</p>
              {bonusQuestion.choices.map(choice => (
                <button 
                  key={choice} 
                  onClick={() => handleBonusQuestion(choice)}
                  className="bonus-choice"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
          {/* Restart button to restart the quiz */}
          <button onClick={restartQuiz} className="restart-quiz-btn">
            Restart Quiz
          </button>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="quiz-container">
        <div className="question-header">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p className="score">Current Score: {score}</p>
        </div>
        
        <div className="question-prompt">
          <p>{currentQuestion.prompt}</p>
        </div>

        <div className="answer-choices">
          {currentQuestion.choices.map(choice => (
            <button
              key={choice}
              onClick={() => handleAnswerSelect(choice)}
              disabled={showFeedback} 
              className={`choice-btn 
                ${showFeedback && choice === currentQuestion.correctAnswer ? 'correct' : ''} 
                ${showFeedback && selectedAnswer === choice && choice !== currentQuestion.correctAnswer ? 'incorrect' : ''}`}
            >
              {choice}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="feedback-section">
            <p>
              {selectedAnswer === currentQuestion.correctAnswer 
                ? "Correct!" 
                : `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`}
            </p>
            {currentQuestionIndex < questions.length - 1 ? (
              <button 
                onClick={handleNextQuestion} 
                className="next-question-btn"
              >
                Next Question
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion} 
                className="finish-quiz-btn"
              >
                Finish Quiz
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="quiz-app">
      {renderQuizContent()}
    </div>
  );
};

export default QuizApp;
