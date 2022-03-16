import{$ as h,R as m,a as g,b as f}from"./vendor.89915203.js";const y=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerpolicy&&(n.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?n.credentials="include":e.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(e){if(e.ep)return;e.ep=!0;const n=a(e);fetch(e.href,n)}};y();function l(){document.querySelector(".toc").classList.remove("toc-hidden")}function d(){document.querySelector(".toc").classList.add("toc-hidden")}var b=`<header>
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
            <li>Sub State Machines</li>
            <li>Actors</li>
        </ul>
</section>
`,v=`<section class="deck-slide">
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

`,S=`<section>
    <section class="deck-slide">
        <h1>Debug it!</h1>
    </section>
    <section>
        <h2>Setup Visualization</h2>
        <section>
            <pre class="fragment fade-in">
                <code class="language-plaintext"> npm install @xstate/inspect</code>
            </pre>
            <pre class="fragment fade-in">
                <code data-trim data-line-numbers="1"><script type="text/template">
 inspect({ iframe: false });

 export const machine = createMachine<...>({

                <\/script>
                </code>
            </pre>

            <pre class="fragment fade-in">
                <code class="language-typescript"> const [state, send] = useMachine(machine, { devTools: true })</code>
            </pre>

            <aside class="notes">
                <i>branch debug/</i>
                <ul>
                    <li>Install package</li>
                    <li>call 'inspect' before machine initialization</li>
                    <li>allow machine to be debugged when hooking in</li>
                </ul>
            </aside>
        </section>
    </section>
    <section>
        <h2>It's playtime \u{1F973}</h2>
        <p>
            <a href="http://localhost:3000/" target="_blank">
                <img src="assets/img/inspect.png" width="80%">
            </a>
        </p>

        <aside class="notes">
            <ul>
                <li>Visualization</li>
                <li>Side menu: State / Events / Sequence</li>
                <li>Block request for failure</li>
            </ul>
        </aside>
    </section>

</section>
`,x=`<section>
    <section class="deck-slide">
        <h1>XState extended</h1>
        <aside class="notes">
            <i>switch branch to extended/2</i>
        </aside>
    </section>
    <section>
        <h2>Actors</h2>
        <aside class="notes">
            <i>branch extended/2</i>
            <ul>
                <li>a</li>
                <li>b</li>
                <li>b</li>
            </ul>
        </aside>

        <section class="fragment fade-in">
            <h3>Let's fetch \u{1F3A3}</h3>
            <section class="fragment fade-in">
                <pre class="fragment fade-in">
                    <code data-trim data-line-numbers="2|3,9" class="language-typescript">
myState: {
  src: () => myFetchPromise(),
  onDone: {
    target: 'successState',
    actions: assign({
      myContextProp: (_, event) => event.data,
    }),
  },
  onError: {
    target: 'failureState',
  },
}
                    </code>
                </pre>

                <aside class="notes">
                    Fetch quiz data
                    <ul>
                        <li>We need more states</li>
                        <li>Updated code in background</li>
                        <li>No problem in the visualization</li>
                    </ul>
                </aside>
            </section>
        </section>
    </section>

    <section>
        <h2>Timers</h2>
        <section>
        tesr
            <pre class="fragment fade-in">
                <code data-trim class="language-typescript">
                <script type="text/template">
failure: {
    after: {
        5000: 'loading',
    }
},
            <\/script>
                </code>
            </pre>
        </section>
    </section>
</section>
`;function w(){const t=new h(document.querySelector(".reveal"),{history:!0,plugins:[m,g,f]});return t.initialize().then(()=>(t.getPlugin("highlight").hljs.highlightAll(),t))}const q=[v,S,x];function z(t){document.querySelector(".toc").innerHTML=`<div>${t}</div>`}function M(t){const s=document.querySelectorAll(".toc section"),a=document.querySelectorAll(".reveal .slides > section.deck-slide"),c=document.querySelectorAll(".reveal .slides > section");s.forEach((e,n)=>{const i=a[n];if(!a){console.error(`Could not find deck slide for chapter ${n+1}`);return}c.forEach((p,u)=>{i===p&&e.addEventListener("click",()=>{d(),t.slide(u,0,0)})})})}const k=q.join("");document.querySelector(".slides-container").innerHTML=`<div class="reveal"><div class="slides">${k}</div></div>`;z(b);const[r,o]=location.hash.split("/").slice(1);(async()=>{const t=await w();r&&(t.slide(r,o!=null?o:0),d()),M(t)})();function T(t){document.querySelector("head title").textContent=t}document.querySelector(".home").addEventListener("click",()=>{l()});window.location.href.endsWith("/")&&l();T("XState");
