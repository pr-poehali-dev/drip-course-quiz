
export interface TestQuestion {
  question: string;
  options: string[];
}

export interface TestResult {
  type: string;
  title: string;
  description: string;
  analyses: string[];
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
}

export interface TestSubmission {
  answers: number[];
  result: TestResult;
  contact: ContactForm;
  date: string;
}
