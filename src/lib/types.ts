
export interface TestQuestion {
  question: string;
  options: string[];
}

export interface TestResult {
  title: string;
  description: string;
  recommendation: string;
  imageUrl: string;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface TestSubmission {
  answers: number[];
  result: TestResult;
  contact: ContactForm;
}
