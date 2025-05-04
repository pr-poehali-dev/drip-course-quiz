
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestResult } from '@/lib/types';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Получаем результат из состояния навигации
  const { result, answers } = location.state as { 
    result: TestResult, 
    answers: number[] 
  } || { result: null, answers: [] };
  
  // Если нет результата, перенаправляем на главную
  if (!result) {
    navigate('/');
    return null;
  }

  const handleContinue = () => {
    navigate('/contact', { state: { result, answers } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="max-w-lg w-full">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{result.title}</CardTitle>
            <CardDescription className="text-center">{result.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Анализы для консультации:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.analyses.map((analysis, index) => (
                  <li key={index}>{analysis}</li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={handleContinue} 
              className="w-full mt-4"
            >
              Продолжить
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Result;
