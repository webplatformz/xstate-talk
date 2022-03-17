import{$ as h,R as m,a as g,b as f}from"./vendor.89915203.js";const y=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerpolicy&&(n.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?n.credentials="include":e.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(e){if(e.ep)return;e.ep=!0;const n=i(e);fetch(e.href,n)}};y();function r(){document.querySelector(".toc").classList.remove("toc-hidden")}function d(){document.querySelector(".toc").classList.add("toc-hidden")}var v=`<header>
    <h1>Simple and useful State Machines with XState</h1>
    <h2>
        <span class="nowrap">Jonas Mattes & Patrick Walther</span>
    </h2>
</header>
<section>
        <h2>01 Let's build a State Machine</h2>
        <ul>
            <li>From Visualization</li>
            <li>From Code</li>
            <li>Context/Typestates</li>
        </ul>
</section>
<section>
        <h2>02 Debug it!</h2>
        <ul>
            <li>Use inspection tools</li>
        </ul>
</section>
<section>
        <h2>03 XState extended</h2>
        <ul>
            <li>Promises</li>
            <li>Timers</li>
        </ul>
</section>
<section>
        <h2>04 Further topics</h2>
        <ul>
            <li>Nested States</li>
        </ul>
</section>
`,b=`<section class="deck-slide">
    <h1>Let's build a State Machine</h1>
</section>
<section>
    <img src="assets/img/game_night.jpeg" width="80%">
</section>
<section>
    <section>
        <h2>From Visualization</h2>
        <p>
            <a href="https://stately.ai" target="_blank">
                <img src="assets/img/stately_editor.png" width="80%">
            </a>
        </p>
    </section>
    <section>
        <h2>Options<br><small>actions</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
export const options = {
    actions: {
        updateAnswer: assign((ctx: AppMachineContext, { type }: AppMachineEvent) => {
            return { questions: [] };
        },
    },
};
        </code></pre>
    </section>
    <section>
        <h2>Options<br><small>guards</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
export const options = {
    guards: {
        allQuestionsAnswered: (ctx: AppMachineContext) =>
            ctx.questions!.every((question) => question.correct !== undefined),
    },
};
        </code></pre>
    </section>
    <section>
        <h2>Back to Visualization from Code</h2>
        <p>
            <a href="https://stately.ai/viz" target="_blank">Stately Visualizer</a>
        </p>
        <aside class="notes">
            <a href="https://stately.ai/viz/97ca81d5-6c9b-4942-a4ff-616bf4c159b2" target="_blank">Stately Viz</a>
        </aside>
    </section>
</section>
<section>
    <section>
        <h2>Testing</h2>
    </section>
    <section>
        <h2>Test whole integration<br><small>arrange</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
            import { machine } from "./machine";
            import { interpret } from "xstate";

            it('should transition properly through machine', () => {
                const quizService = interpret(machine);
                quizService.start();
                ...
            });
        </code></pre>
    </section>
    <section>
        <h2>Test whole integration<br><small>act</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
            quizService.send('START_QUIZ');
            questions.forEach(() => {
                quizService.send('ANSWER_TRUE');
            });
        </code></pre>
    </section>
    <section>
        <h2>Test whole integration<br><small>assert</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
            expect(quizService.state.value).toEqual('results')
            expect(quizService.state.context).toEqual({
                currentQuestion: 3,
                currentQuestionDisplay: 4,
                totalCorrectAnswers: 1,
                questions: expect.any(Array),
            });
        </code></pre>
    </section>
    <section>
        <h2>Mock parts</h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
            it('should transition to results when all questions answered', () => {
                const result = machine
                    .withConfig({
                        guards: { allQuestionsAnswered: () => true },
                    })
                    .transition('quiz', 'ANSWER_FALSE');

                expect(result.value).toEqual('results');
            });
        </code></pre>
    </section>
</section>

<section>
    <section>
        <h2>TypeScript</h2>
    </section>
    <section>
        <h2>New way: typegen<br><small>package.json</small></h2>
        <pre><code class="language-json" data-trim contenteditable data-noescape>
            {
                scripts: {
                    "typegen": "xstate typegen \\"src/**/*.ts?(x)\\"",
                    "typegen:watch": "xstate typegen \\"src/**/*.ts?(x)\\" --watch"
                }
            }
        </code></pre>
    </section>
    <section>
        <h2>typegen<br><small>machine.ts</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
            {
                schema: {
                  context: {} as QuizContext,
                  events: {} as QuizEvents,
                },
                tsTypes: {} as import("./machine.typegen").Typegen0,
                ...
            }
        </code></pre>
    </section>
    <section>
        <h2>Old way: TypeStates<br><small>machine.ts</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape data-line-numbers="1">
            createMachine&lt;AppMachineContext, AppMachineEvent, MachineTypeState&gt;({
                id: 'Machine',
                initial: 'welcome',
                ...
            });
        </code></pre>
    </section>
    <section>
        <h2>Old way: TypeStates<br><small>types.ts</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape data-line-numbers="1|3-6|8-11|1-11">
            export type MachineTypeState = MachineDefaultState | MachineQuizState;

            export interface MachineDefaultState {
                value: 'welcome' | 'loading' | 'failure';
                context: AppMachineContext;
            }

            export interface MachineQuizState {
                value: 'quiz' | 'results';
                context: AppMachineQuizContext;
            }
        </code></pre>
    </section>
    <section>
        <h2>Old way: TypeStates<br><small>types.ts</small></h2>
        <pre><code class="language-typescript" data-trim contenteditable data-noescape>
            export interface AppMachineContext {
                currentQuestion: number;
                currentQuestionDisplay: number;
                questions?: Question[];
                totalCorrectAnswers: number;
            }

            export interface AppMachineQuizContext extends AppMachineContext {
                questions: Question[];
            }
        </code></pre>
    </section>
</section>

`,S=`<section class="deck-slide">
    <h1>Let's debug it</h1>
    <aside class="notes">
        <ul>
            <li>Hard to understand code</li>
            <li>Interactive visualization</li>
        </ul>
    </aside>
</section>
<section>
    <h2>Visualization</h2>
    <section>
        <pre class="fragment fade-in">
            <code class="language-plaintext"> npm install @xstate/inspect</code>
        </pre>
        <pre class="fragment fade-in">
                <code data-trim data-line-numbers="1, 3" class="language-typescript">
 import { inspect } from "@xstate/inspect";

 inspect({ iframe: false });

 export const machine = createMachine({
                </code>
            </pre>

        <pre class="fragment fade-in">
                <code class="language-typescript"> const [state, send] = useMachine(machine, { devTools: true })</code>
            </pre>

        <aside class="notes">
            <i>branch debug/</i>
            <ul>
                <li>Pretty easy</li>
                <li>Install package</li>
                <li>call 'inspect' before machine initialization</li>
                <li>allow machine to be debugged when hooking in</li>
            </ul>
        </aside>
    </section>
</section>
<aside class="notes">
    How do we know it works as expected?
</aside>
<section>
    <h2><a href="http://localhost:3000/" target="_blank">It's playtime \u{1F973}</a></h2>

    <aside class="notes">
        <ul>
            <li>Visualization</li>
            <li>Side / side Click through</li>
            <li>Side menu: State / Events / Sequence</li>
            <li>Block request for failure</li>
        </ul>
    </aside>
</section>
`,x=`<section class="deck-slide">
    <h1>XState extended</h1>
    <aside class="notes">
        <i>switch branch to extended/2</i>
        <ul>
            <li>Requests etc.</li>
        </ul>
    </aside>
</section>
<section>
    <h2>Promises</h2>
    <aside class="notes">
        <i>branch extended/2</i>
        <ul>
            <li>fetch some quiz data</li>
        </ul>
    </aside>

    <pre class="fragment fade-in">
        <code data-trim data-line-numbers="2|3|4,10|7" class="language-typescript">
myState: {
  invoke: {
    src: () => myFetchPromise(),
    onDone: {
      target: 'quiz',
      actions: assign({
        questions: (_, event) => event.data,
      }),
    },
    onError: {
      target: 'failure',
    }
  }
}
        </code>
    </pre>

    <aside class="notes">
        Fetch quiz data
        <ul>
            <li>We need more states: Loading, Error</li>
            <li>Updated code in background</li>
            <li>No problem in the visualization</li>
        </ul>
    </aside>

</section>

<section>
    <h2><a href="http://localhost:3000/" target="_blank">Let's fetch \u{1F3A3}</a></h2>
    <aside class="notes">
        Let's look only at viz <br>
        <i>timeout</i>

    </aside>
</section>

<section>
    <h2>Timers</h2>
    <a href="http://localhost:3000/" target="_blank">
    <pre class="fragment fade-in">
            <code data-trim data-line-numbers="2-4" class="language-typescript">
failure: {
  after: {
    5000: 'loading',
  }
},
        </code>
    </pre>
    </a>
</section>
`,w=`<section class="deck-slide">
    <h1>Further Topics</h1>
    <aside class="notes">
        Not covered in this presentation
    </aside>
</section>
<section>
    <h2>Nested State Machines</h2>
    <ul>
        <li class="fragment fade-in">Powerful but complex</li>
        <li class="fragment fade-in">Allows parallel states</li>
        <li class="fragment fade-in">Allows history states</li>
        <li class="fragment fade-in">May break the visualization and your brain</li>
    </ul>
    <aside class="notes">
        <ul>
            <li>Nested gets complex very fast but has some advantages</li>
            <li>Patrick shows SBB machine</li>
        </ul>
    </aside>
</section>
`;function k(){const t=new h(document.querySelector(".reveal"),{history:!0,plugins:[m,g,f]});return t.initialize().then(()=>(t.getPlugin("highlight").hljs.highlightAll(),t))}const q=[b,S,x,w];function z(t){document.querySelector(".toc").innerHTML=`<div>${t}</div>`}function M(t){const s=document.querySelectorAll(".toc section"),i=document.querySelectorAll(".reveal .slides > section.deck-slide"),o=document.querySelectorAll(".reveal .slides > section");s.forEach((e,n)=>{const a=i[n];if(!i){console.error(`Could not find deck slide for chapter ${n+1}`);return}o.forEach((u,p)=>{a===u&&e.addEventListener("click",()=>{d(),t.slide(p,0,0)})})})}const T=q.join("");document.querySelector(".slides-container").innerHTML=`<div class="reveal"><div class="slides">${T}</div></div>`;z(v);const[l,c]=location.hash.split("/").slice(1);(async()=>{const t=await k();l&&(t.slide(l,c!=null?c:0),d()),M(t)})();function A(t){document.querySelector("head title").textContent=t}document.querySelector(".home").addEventListener("click",()=>{r()});window.location.href.endsWith("/")&&r();A("XState");
