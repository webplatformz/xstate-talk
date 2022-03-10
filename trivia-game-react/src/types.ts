export interface QuizDataQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface FetchQuizDataResponse {
  response_code: number
  results: Question[]
}

export interface Question {
  category: string
  question: string
  correctAnswer: boolean
  userAnswer?: boolean
  correct?: boolean
}

export type MachineTypeState = MachineDefaultState | MachineQuizState;

export interface MachineDefaultState {
  value: 'welcome' | 'loading' | 'failure';
  context: AppMachineContext;
}

export interface MachineQuizState {
  value: 'quiz' | 'results';
  context: AppMachineQuizContext;
}

export type AppMachineEvent = DefaultMachineEvent | AnswerableMachineEvent;

export interface DefaultMachineEvent {
  type: 'START_QUIZ' | 'RETRY' | 'START_OVER' | 'PLAY_AGAIN';
}

export interface AnswerableMachineEvent {
  type: 'ANSWER_TRUE' | 'ANSWER_FALSE';
  answer: boolean;
}

export interface AppMachineQuizContext extends  AppMachineContext{
  questions: Question[];
}

export interface AppMachineContext {
  currentQuestion: number;
  currentQuestionDisplay: number;
  questions?: Question[];
  totalCorrectAnswers: number;
}
