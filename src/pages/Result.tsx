
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { TestResult, ContactForm } from '@/lib/types';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Получаем результат из состояния навигации
  const { result, answers } = location.state as { 
    result: TestResult, 
    answers: number[] 
  } || { result: null, answers: [] };
  
  // Состояние формы контактов
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    phone: ''
  });
  
  // Состояние валидации формы
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });
  
  // Если нет результата, перенаправляем на главную
  if (!result) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Сбрасываем ошибку для поля, которое редактируется
    setErrors(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    const newErrors = {
      firstName: contactForm.firstName.trim() === '',
      lastName: contactForm.lastName.trim() === '',
      phone: !contactForm.phone.match(/^\+?[0-9]{10,12}$/)
    };
    
    setErrors(newErrors);
    
    // Если есть ошибки, не отправляем форму
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Сохраняем данные (для MVP используем localStorage)
    const submission = {
      answers,
      result,
      contact: contactForm,
      date: new Date().toISOString()
    };
    
    // Получаем существующие данные или создаем новый массив
    const existingData = JSON.parse(localStorage.getItem('testSubmissions') || '[]');
    localStorage.setItem('testSubmissions', JSON.stringify([...existingData, submission]));
    
    // Показываем сообщение об успешной отправке
    toast({
      title: "Форма отправлена!",
      description: "Наш специалист свяжется с вами в ближайшее время",
      duration: 5000
    });
    
    // Возвращаемся на главную страницу через небольшую задержку
    setTimeout(() => {
      navigate('/');
    }, 2000);
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
            {result.imageUrl && (
              <div className="flex justify-center mb-4">
                <img 
                  src={result.imageUrl} 
                  alt={result.title} 
                  className="rounded-lg max-h-60 object-cover" 
                />
              </div>
            )}
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Рекомендация:</h3>
              <p>{result.recommendation}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Оставьте свои контактные данные</CardTitle>
            <CardDescription>Мы свяжемся с вами для консультации и подбора оптимального курса</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    value={contactForm.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">Пожалуйста, введите имя</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    value={contactForm.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">Пожалуйста, введите фамилию</p>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    placeholder="+7XXXXXXXXXX"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      Пожалуйста, введите корректный номер телефона (10-12 цифр)
                    </p>
                  )}
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6">
                Отправить
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 text-center pt-0">
            Ваши данные будут использованы только для связи с вами по вопросу консультации.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Result;
