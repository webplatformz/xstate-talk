import { assign, createMachine, DoneInvokeEvent, send } from 'xstate'
import {
  AnswerableMachineEvent,
  AppMachineContext,
  AppMachineEvent,
  AppMachineQuizContext,
  MachineTypeState,
  Question
} from './types'
import { fetchAndNormalizeQuizData } from './utils'

export const machine = createMachine<AppMachineContext, AppMachineEvent, MachineTypeState>(
  {
    id: 'Machine',
    initial: 'welcome',
    context: {
      currentQuestion: 0,
      currentQuestionDisplay: 1,
      totalCorrectAnswers: 0,
    },
    states: {
      welcome: {
        on: {
          START_QUIZ: 'loading',
        },
      },
      loading: {
        invoke: {
          id: 'getQuizData',
          src: () => fetchAndNormalizeQuizData(),
          onDone: {
            target: 'quiz',
            actions: assign({
              questions: (_, event: DoneInvokeEvent<Question[]>) => event.data,
            }),
          },
          onError: {
            target: 'failure',
          },
        },
      },
      failure: {
        after: {
          5000: 'loading',
        },
        on: {
          RETRY: 'loading',
          START_OVER: 'welcome',
        },
      },
      quiz: {
        always: {
          target: 'results',
          cond: 'allQuestionsAnswered',
        },
        on: {
          ANSWER_FALSE: {
            actions: 'updateAnswer',
          },
          ANSWER_TRUE: {
            actions: 'updateAnswer',
          },
        },
      },
      results: {
        on: {
          PLAY_AGAIN: 'welcome',
        },
        exit: 'resetGame',
      },
    },
  },
  {
    actions: {
      resetGame: assign({
        currentQuestion: 0,
        currentQuestionDisplay: 1,
        totalCorrectAnswers: 0,
        // questions: undefined,
      }),
      updateAnswer: assign((ctx, event) => {
        const { answer } = event as AnswerableMachineEvent;
        return ({
          questions: [
            ...ctx.questions!.slice(0, ctx.currentQuestion),
            {
              ...ctx.questions![ctx.currentQuestion],
              userAnswer: answer,
              correct:
                ctx.questions![ctx.currentQuestion].correctAnswer === answer,
            },
            ...ctx.questions!.slice(ctx.currentQuestion + 1),
          ],
          totalCorrectAnswers:
            ctx.questions![ctx.currentQuestion].correctAnswer === answer
              ? (ctx.totalCorrectAnswers += 1)
              : ctx.totalCorrectAnswers,
          currentQuestion: ctx.currentQuestion += 1,
          currentQuestionDisplay: ctx.currentQuestionDisplay += 1,
        });
      }),
    },
    guards: {
      allQuestionsAnswered: (ctx) =>
        (
          ctx.questions!.every(
            (question) => question.correct !== undefined,
          )
        ),
    },
  },
)
