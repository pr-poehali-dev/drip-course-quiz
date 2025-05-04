
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TestQuestion as ITestQuestion } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TestQuestionProps {
  question: ITestQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
}

const TestQuestion = ({ 
  question, 
  currentQuestionIndex, 
  totalQuestions,
  onAnswer
}: TestQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Сбрасываем выбранный вариант при изменении вопроса
  useEffect(() => {
    setSelectedOption(null);
  }, [question, currentQuestionIndex]);
  
  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
      // Даже если сбрасываем через useEffect, дополнительно сбрасываем здесь для надежности
      setSelectedOption(null);
    }
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Вопрос {currentQuestionIndex + 1} из {totalQuestions}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 ml-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedOption?.toString()} 
          onValueChange={(value) => setSelectedOption(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={selectedOption === null}
          onClick={handleSubmit}
        >
          {currentQuestionIndex < totalQuestions - 1 ? 'Далее' : 'Узнать результат'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestQuestion;
