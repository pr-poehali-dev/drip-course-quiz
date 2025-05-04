
import { useState } from 'react';
import PrivacyAgreement from '@/components/PrivacyAgreement';
import TestQuestion from '@/components/TestQuestion';
import { questions, results } from '@/lib/testData';
import { TestResult } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  
  const navigate = useNavigate();

  const handlePrivacyAgree = () => {
    setAgreedToPrivacy(true);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Calculate result
      const result = calculateResult(newAnswers);
      setTestResult(result);
      setTestCompleted(true);
      
      // Navigate to result page with the result and answers
      navigate('/result', { 
        state: { 
          result,
          answers: newAnswers
        } 
      });
    }
  };

  const calculateResult = (answers: number[]): TestResult => {
    // Count options
    const optionCounts = [0, 0, 0];
    
    answers.forEach(answer => {
      optionCounts[answer]++;
    });
    
    // Find the most frequent answer
    let maxCount = 0;
    let maxIndex = 0;
    
    optionCounts.forEach((count, index) => {
      if (count > maxCount) {
        maxCount = count;
        maxIndex = index;
      }
    });
    
    // Return result based on the most frequent answer
    return results[maxIndex];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="max-w-lg w-full">
        {!agreedToPrivacy ? (
          <>
            <h1 className="text-4xl font-bold mb-6 text-center">
              Узнайте, какой курс капельниц Вам подойдет
            </h1>
            <p className="text-center mb-8 text-gray-600">
              Пройдите короткий тест, чтобы получить персональную рекомендацию для вашего здоровья
            </p>
            <PrivacyAgreement onAgree={handlePrivacyAgree} />
          </>
        ) : (
          <TestQuestion
            question={questions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
