import React from 'react'
import { useMachine } from '@xstate/react'
import tw from 'tailwind.macro'
import { GlobalStyle } from './components'
import { machine } from './machine'
import {
  Failure as FailureScreen,
  Loading as LoadingScreen,
  Quiz as QuizScreen,
  Results as ResultsScreen,
  Welcome as WelcomeScreen,
} from './screens'

const AppWrapper = tw.div`min-h-screen min-w-screen h-screen w-screen flex justify-center items-center bg-gray-200`
const Main = tw.main`z-20 w-11/12 h-auto max-h-screen overflow-y-scroll m-4 flex flex-col items-center bg-white rounded shadow md:w-3/4 lg:w-1/2 md:m-0`

function App() {
  const [state, send] = useMachine(machine)
  send("START_QUIZ");

  const renderScreen = () => {
    if (state.matches('welcome')) {
      return <WelcomeScreen startQuiz={() => send('START_QUIZ')}/>
    } else if (state.matches('quiz')) {
      return (
        <QuizScreen
          answerFalse={() => send({ type: 'ANSWER_FALSE', answer: false })}
          answerTrue={() => send({ type: 'ANSWER_TRUE', answer: true })}
          currentQuestionNumber={state.context.currentQuestionDisplay}
          question={
            state.context.questions[state.context.currentQuestion]
          }
          totalQuestions={state.context.questions.length}
        />
      );
    } else if (state.matches('results')) {
      return (
        <ResultsScreen
          playAgain={() => send('PLAY_AGAIN')}
          questions={state.context.questions}
          totalCorrectAnswers={state.context.totalCorrectAnswers}
          totalQuestions={state.context.questions.length}
        />
      )
    } else if (state.matches('loading')) {
      return <LoadingScreen/>
    } else if (state.matches('failure')) {
      return (
        <FailureScreen
          retry={() => send('RETRY')}
          startOver={() => send('START_OVER')}
        />
      )
    }
  }

  return (
    <AppWrapper>
      <GlobalStyle/>
      <Main>{renderScreen()}</Main>
    </AppWrapper>
  )
}

export default App
