
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestSubmission } from '@/lib/types';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

const Admin = () => {
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Проверяем аутентификацию при загрузке страницы
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadSubmissions();
    }
  }, []);
  
  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('testSubmissions') || '[]');
    setSubmissions(data);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая аутентификация для MVP (в реальном приложении используйте более надежный метод)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadSubmissions();
    } else {
      alert('Неверный пароль');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };
  
  const groupSubmissionsByType = () => {
    const types = {
      'detox': submissions.filter(sub => sub.result.type === 'detox'),
      'weight-loss': submissions.filter(sub => sub.result.type === 'weight-loss'),
      'energy': submissions.filter(sub => sub.result.type === 'energy')
    };
    return types;
  };
  
  const types = groupSubmissionsByType();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Панель администратора</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Пароль</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Войти
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Выйти
        </button>
      </div>
      
      {submissions.length === 0 ? (
        <div className="text-center p-10 bg-white rounded shadow">
          <p>Нет данных о прохождении тестов</p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Всего заявок</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{submissions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>За сегодня</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {submissions.filter(sub => {
                    const today = new Date().toISOString().split('T')[0];
                    return sub.date.startsWith(today);
                  }).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Последняя заявка</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {submissions.length > 0 && formatDistance(
                    new Date(submissions[submissions.length - 1].date),
                    new Date(),
                    { addSuffix: true, locale: ru }
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Все заявки</TabsTrigger>
              <TabsTrigger value="detox">Детокс ({types['detox'].length})</TabsTrigger>
              <TabsTrigger value="weight-loss">Снижение веса ({types['weight-loss'].length})</TabsTrigger>
              <TabsTrigger value="energy">Энергия ({types['energy'].length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <SubmissionsList submissions={submissions} />
            </TabsContent>
            <TabsContent value="detox">
              <SubmissionsList submissions={types['detox']} />
            </TabsContent>
            <TabsContent value="weight-loss">
              <SubmissionsList submissions={types['weight-loss']} />
            </TabsContent>
            <TabsContent value="energy">
              <SubmissionsList submissions={types['energy']} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

const SubmissionsList = ({ submissions }: { submissions: TestSubmission[] }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ФИО
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Телефон
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Результат
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((sub, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(sub.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {`${sub.contact.lastName} ${sub.contact.firstName} ${sub.contact.middleName}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sub.contact.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${sub.result.type === 'detox' ? 'bg-purple-100 text-purple-800' : ''}
                  ${sub.result.type === 'weight-loss' ? 'bg-green-100 text-green-800' : ''}
                  ${sub.result.type === 'energy' ? 'bg-blue-100 text-blue-800' : ''}
                `}>
                  {sub.result.title}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
