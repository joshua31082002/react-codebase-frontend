"use client";

import { useMemo, useState } from "react";

const initialTasks = [
  { id: 1, title: "Review product launch brief", project: "Website redesign", due: "Today", done: false },
  { id: 2, title: "Prepare sprint planning notes", project: "Team rituals", due: "Tomorrow", done: false },
  { id: 3, title: "Share customer interview insights", project: "Research", due: "Friday", done: true },
  { id: 4, title: "Polish onboarding checklist", project: "Product launch", due: "Friday", done: false },
];

const stats = [
  { label: "Completed this week", value: "18", change: "+12%", tone: "green" },
  { label: "Focus hours", value: "24.5", change: "+4.2h", tone: "purple" },
  { label: "Active projects", value: "6", change: "2 at risk", tone: "orange" },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeView, setActiveView] = useState("Overview");
  const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-7 lg:block">
          <div className="mb-12 flex items-center gap-3 px-2">
            <div className="grid size-9 place-items-center rounded-xl bg-[#6558d3] text-lg font-bold text-white">F</div>
            <span className="text-xl font-bold tracking-tight">Focusly</span>
          </div>
          <nav className="space-y-1" aria-label="Main navigation">
            {['Overview', 'My tasks', 'Projects', 'Calendar'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveView(item)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${activeView === item ? 'bg-[#eeecff] text-[#5549c5]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span className="w-5 text-center text-base" aria-hidden="true">{item === 'Overview' ? '◈' : item === 'My tasks' ? '✓' : item === 'Projects' ? '▦' : '□'}</span>
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-10 border-t border-slate-100 pt-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Your projects</p>
            <div className="mt-4 space-y-3 px-3 text-sm text-slate-600">
              <p><span className="mr-3 inline-block size-2 rounded-full bg-[#6558d3]" />Website redesign</p>
              <p><span className="mr-3 inline-block size-2 rounded-full bg-[#f59e0b]" />Product launch</p>
              <p><span className="mr-3 inline-block size-2 rounded-full bg-[#10b981]" />Team rituals</p>
            </div>
          </div>
          <div className="mt-auto pt-20">
            <div className="rounded-2xl bg-[#f5f3ff] p-4">
              <p className="text-sm font-semibold text-[#5549c5]">Need a reset?</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Take five minutes to plan your next focus block.</p>
              <button type="button" className="mt-3 text-xs font-semibold text-[#5549c5]">Start focus mode →</button>
            </div>
          </div>
        </aside>

        <section className="flex-1 px-5 py-7 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Wednesday, October 18</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Good morning, Alex <span aria-hidden="true">✦</span></h1>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" aria-label="Notifications">♢</button>
              <div className="grid size-10 place-items-center rounded-full bg-[#f5c6a5] text-sm font-bold text-[#82452c]">AR</div>
            </div>
          </header>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_3px_12px_rgba(30,41,59,0.03)]">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stat.tone === 'green' ? 'bg-emerald-50 text-emerald-600' : stat.tone === 'purple' ? 'bg-violet-50 text-violet-600' : 'bg-amber-50 text-amber-600'}`}>{stat.change}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_3px_12px_rgba(30,41,59,0.03)]">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-bold">Today&apos;s focus</h2><p className="mt-1 text-sm text-slate-500">{completedTasks} of {tasks.length} tasks completed</p></div>
                <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">View all</button>
              </div>
              <div className="mt-6 space-y-2">
                {tasks.map((task) => (
                  <label key={task.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50">
                    <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="size-4 accent-[#6558d3]" />
                    <span className={`min-w-0 flex-1 text-sm font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}<span className="mt-1 block text-xs font-normal text-slate-400">{task.project}</span></span>
                    <span className="text-xs text-slate-400">{task.due}</span>
                  </label>
                ))}
              </div>
              <button type="button" className="mt-4 w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-[#6558d3] hover:text-[#5549c5]">+ Add a task</button>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_3px_12px_rgba(30,41,59,0.03)]">
              <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Weekly progress</h2><p className="mt-1 text-sm text-slate-500">You&apos;re on a roll</p></div><span className="text-sm font-bold text-[#6558d3]">72%</span></div>
              <div className="mt-8 flex h-36 items-end justify-between gap-3 px-2">
                {[42, 58, 48, 76, 63, 88, 72].map((height, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full max-w-8 rounded-t-lg ${index === 5 ? 'bg-[#6558d3]' : 'bg-[#e2e0fa]'}`} style={{ height: `${height}%` }} /><span className="text-xs text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}
              </div>
              <div className="mt-6 rounded-xl bg-[#f8f7ff] p-4"><p className="text-sm font-semibold text-[#5549c5]">Small steps add up</p><p className="mt-1 text-xs leading-5 text-slate-500">You&apos;ve completed 4 more tasks than last week.</p></div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
