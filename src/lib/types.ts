
export interface TestQuestion {
  question: string;
  options: string[];
}

export interface TestResult {
  type: 'detox' | 'weight-loss' | 'energy';
  title: string;
  description: string;
  analyses: string[];
}

export interface UserData {
  name: string;
  patronymic: string;
  phone: string;
  result: TestResult;
  answers: number[];
}
