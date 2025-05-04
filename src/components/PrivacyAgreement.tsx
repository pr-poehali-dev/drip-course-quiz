
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface PrivacyAgreementProps {
  onAgree: () => void;
}

const PrivacyAgreement = ({ onAgree }: PrivacyAgreementProps) => {
  const [agreed, setAgreed] = useState(false);
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Согласие на обработку персональных данных</CardTitle>
        <CardDescription>
          Перед прохождением теста, пожалуйста, ознакомьтесь с условиями обработки ваших персональных данных
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto border rounded-md p-4 text-sm">
            <p>
              Нажимая кнопку "Согласен и начать тест", я даю свое согласие на обработку моих персональных данных согласно Федеральному закону №152-ФЗ "О персональных данных" от 27.07.2006 г.
            </p>
            <p className="mt-2">
              Я соглашаюсь на сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу, обезличивание, блокирование, удаление, уничтожение персональных данных.
            </p>
            <p className="mt-2">
              Мои персональные данные будут использованы исключительно для предоставления результатов теста и рекомендаций по подбору курса капельниц.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy-agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
            />
            <label
              htmlFor="privacy-agree"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Я прочитал(а) и согласен(на) с условиями обработки персональных данных
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!agreed}
          onClick={onAgree}
        >
          Согласен и начать тест
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrivacyAgreement;
