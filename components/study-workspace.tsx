"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BookMarked, BookOpen, BrainCircuit, CalendarDays, CheckCircle2,
  ChevronRight, CircuitBoard, Clock3, Cloud, Code2, FileText, FolderOpen, Home, Library,
  ListChecks, Menu, Network, Paperclip, Play, Plus, Search, Send, Sparkles, Target,
  Upload, Waypoints, X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { buildDetailedAnswer, COURSES, type CourseId, type DetailedAnswer } from "@/lib/study-content";
import { getTopicDetail } from "@/lib/topic-guides";

type View = "today" | "courses" | "map" | "assistant" | "plan" | "library";
type Task = { id: number; courseId: CourseId; course: string; title: string; duration: number; kind: string; completed: boolean };
type ResourceItem = { id: number; courseId: CourseId; name: string; size: number; createdAt: string };

const cloudUrl = "https://icloud.sdu.edu.cn/anyshare/m/link/AA2E11918B5BA9401FA529A26539C7CC82?expires_at=1970-01-01T08%3A00%3A00%2B08%3A00&item_type=&password_required=false&title=%E8%AE%A1%E7%A7%91%E5%AD%A6%E6%9C%AF%E9%83%A8&type=anonymous&verify_mobile=false";

const initialTasks: Task[] = [
  { id: 1, courseId: "data-structures", course: "数据结构与算法", title: "二叉树遍历与递归", duration: 45, kind: "知识 + 编程", completed: false },
  { id: 2, courseId: "networks", course: "计算机网络", title: "理解 TCP 三次握手", duration: 30, kind: "精读", completed: false },
  { id: 3, courseId: "probability", course: "概率论与数理统计", title: "离散型随机变量练习", duration: 40, kind: "6 道题", completed: false },
];

const iconMap = { "data-structures": Code2, networks: Network, systems: BrainCircuit, circuits: CircuitBoard, probability: Waypoints } as const;
const navItems: { id: View; label: string; mobile: string; icon: typeof Home }[] = [
  { id: "today", label: "今日", mobile: "今日", icon: Home },
  { id: "courses", label: "课程", mobile: "课程", icon: BookOpen },
  { id: "map", label: "知识导图", mobile: "导图", icon: Waypoints },
  { id: "assistant", label: "AI 助手", mobile: "AI 助手", icon: Sparkles },
  { id: "plan", label: "学习计划", mobile: "计划", icon: CalendarDays },
];

const pageTitles: Record<View, string> = { today: "今日学习", courses: "我的课程", map: "知识导图", assistant: "AI 学习助手", plan: "学习计划", library: "资料库" };
const masteryKey = (courseId: CourseId, topic: string) => `${courseId}:${topic}`;

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-border bg-card shadow-[0_12px_38px_rgba(27,48,41,.055)] ${className}`}>{children}</section>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-muted-foreground">{eyebrow}</p><h2 className="mt-1 font-serif-cn text-xl font-semibold">{title}</h2></div>{action}</div>;
}

export function StudyWorkspace() {
  const [view, setView] = useState<View>("today");
  const [courseId, setCourseId] = useState<CourseId>("data-structures");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskDialog, setTaskDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCourse, setNewTaskCourse] = useState<CourseId>("data-structures");
  const [question, setQuestion] = useState("TCP 为什么需要三次握手？");
  const [answer, setAnswer] = useState<DetailedAnswer>(() => buildDetailedAnswer("networks", "TCP 为什么需要三次握手？"));
  const [answerLoading, setAnswerLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("二叉树");
  const [masteryLevels, setMasteryLevels] = useState<Record<string, number>>({});
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [uploadCourse, setUploadCourse] = useState<CourseId>("data-structures");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const course = COURSES.find((item) => item.id === courseId)!;
  const doneCount = tasks.filter((task) => task.completed).length;
  const totalMinutes = tasks.filter((task) => !task.completed).reduce((sum, task) => sum + task.duration, 0);
  const courseProgress = useMemo(() => Object.fromEntries(COURSES.map((item) => {
    const topics = item.chapters.flatMap((chapter) => chapter.topics);
    const mastered = topics.filter((topic) => (masteryLevels[masteryKey(item.id, topic)] ?? 0) > 0).length;
    return [item.id, topics.length ? Math.round(mastered / topics.length * 100) : 0];
  })) as Record<CourseId, number>, [masteryLevels]);

  useEffect(() => {
    void (async () => {
      try {
        const studyData = await fetch("/api/study").then((response) => response.json());
        if (Array.isArray(studyData.tasks) && studyData.tasks.length) setTasks(studyData.tasks);
        const [resourceData, masteryData] = await Promise.all([
          fetch("/api/resources").then((response) => response.json()),
          fetch("/api/mastery").then((response) => response.json()),
        ]);
        if (Array.isArray(resourceData.resources)) setResources(resourceData.resources);
        if (Array.isArray(masteryData.records)) setMasteryLevels(Object.fromEntries(masteryData.records.map((record: { courseId: CourseId; topic: string; level: number }) => [masteryKey(record.courseId, record.topic), record.level])));
      } catch { /* 保留初始的零进度与默认任务 */ }
    })();
  }, []);

  useEffect(() => {
    if (!course.chapters.some((chapter) => chapter.topics.includes(selectedTopic))) setSelectedTopic(course.chapters[0].topics[0]);
  }, [course, selectedTopic]);

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(modelContext.registerTool({
      name: "create_study_task", title: "添加学习任务", description: "在知序中添加一项课程学习任务。",
      inputSchema: { type: "object", properties: { courseId: { type: "string", enum: COURSES.map((item) => item.id) }, title: { type: "string" }, duration: { type: "number", minimum: 5, maximum: 240 } }, required: ["courseId", "title"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (rawInput: unknown) => {
        const input = rawInput as { courseId?: CourseId; title?: string; duration?: number };
        const duration = input?.duration ?? 30;
        if (!input || !COURSES.some((item) => item.id === input.courseId) || typeof input.title !== "string" || !input.title.trim() || typeof duration !== "number" || duration < 5 || duration > 240) {
          throw new Error("任务信息无效：课程和标题必填，时长需为 5 到 240 分钟。");
        }
        const selected = COURSES.find((item) => item.id === input.courseId) ?? COURSES[0];
        const response = await fetch("/api/study", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: selected.id, course: selected.name, title: input.title.trim(), duration, kind: "学习" }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "任务创建失败");
        setTasks((current) => [...current, data.task]);
        return { id: data.task.id, title: data.task.title, saved: true };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const changeView = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function toggleTask(task: Task) {
    const completed = !task.completed;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed } : item));
    try {
      const response = await fetch("/api/study", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...task, completed }) });
      if (!response.ok) throw new Error();
      if (completed) toast.success("任务完成，进度已保存");
    } catch {
      toast.info("当前为本地预览，发布后将自动同步进度");
    }
  }

  async function addTask(event: FormEvent) {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;
    const selected = COURSES.find((item) => item.id === newTaskCourse)!;
    const fallback: Task = { id: Date.now(), courseId: selected.id, course: selected.name, title: newTaskTitle.trim(), duration: 30, kind: "学习", completed: false };
    try {
      const response = await fetch("/api/study", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fallback) });
      const data = await response.json();
      if (!response.ok) throw new Error();
      setTasks((current) => [...current, data.task]);
      toast.success("学习任务已保存");
    } catch {
      setTasks((current) => [...current, fallback]);
      toast.info("任务已加入当前计划");
    }
    setNewTaskTitle(""); setTaskDialog(false);
  }

  async function askAssistant(prompt = question, selectedCourse = courseId) {
    if (!prompt.trim()) return;
    setAnswerLoading(true); setQuestion(prompt); setCourseId(selectedCourse); setView("assistant");
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: selectedCourse, question: prompt }) });
      const data = await response.json();
      if (!response.ok) throw new Error();
      setAnswer(data.answer);
    } catch {
      setAnswer(buildDetailedAnswer(selectedCourse, prompt));
    } finally { setAnswerLoading(false); }
  }

  async function updateMastery(level: number) {
    const key = masteryKey(courseId, selectedTopic);
    setMasteryLevels((current) => ({ ...current, [key]: level }));
    try {
      await fetch("/api/mastery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId, topic: selectedTopic, level }) });
      toast.success(level ? "已标记为掌握" : "已取消掌握");
    } catch { toast.info("掌握度已在当前页面更新"); }
  }

  async function uploadResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) { toast.error("请先选择一个资料文件"); return; }
    setUploading(true);
    const data = new FormData(); data.set("file", file); data.set("courseId", uploadCourse);
    try {
      const response = await fetch("/api/resources", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setResources((current) => [result.resource, ...current]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("资料已保存到当前设备的资料库");
    } catch (error) { toast.error(error instanceof Error ? error.message : "上传失败，请稍后重试"); }
    finally { setUploading(false); }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <DesktopSidebar view={view} onChange={changeView} onLibrary={() => changeView("library")} />
      <section className="min-h-screen pb-24 lg:ml-[244px] lg:pb-0">
        <TopBar title={pageTitles[view]} onAdd={() => setTaskDialog(true)} />
        <div className="mx-auto max-w-[1240px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          {view === "today" && <TodayView tasks={tasks} doneCount={doneCount} totalMinutes={totalMinutes} progress={courseProgress} onToggle={toggleTask} onAdd={() => setTaskDialog(true)} onView={changeView} onAsk={() => void askAssistant("TCP 为什么需要三次握手？", "networks")} onCourse={(id) => { setCourseId(id); changeView("courses"); }} />}
          {view === "courses" && <CoursesView courseId={courseId} progress={courseProgress} onCourse={setCourseId} onAsk={(prompt) => void askAssistant(prompt, courseId)} onTopic={(topic) => { setSelectedTopic(topic); changeView("map"); }} onMap={() => { setSelectedTopic(course.chapters[0].topics[0]); changeView("map"); }} onLibrary={() => changeView("library")} />}
          {view === "map" && <MapView courseId={courseId} selectedTopic={selectedTopic} mastery={masteryLevels} onCourse={setCourseId} onTopic={setSelectedTopic} onMastery={(level) => void updateMastery(level)} onAsk={(topic) => void askAssistant(`请详细讲解${topic}`, courseId)} />}
          {view === "assistant" && <AssistantView courseId={courseId} question={question} answer={answer} loading={answerLoading} onCourse={setCourseId} onQuestion={setQuestion} onAsk={(prompt) => void askAssistant(prompt, courseId)} />}
          {view === "plan" && <PlanView tasks={tasks} masteredCount={Object.values(masteryLevels).filter((level) => level > 0).length} onToggle={toggleTask} onAdd={() => setTaskDialog(true)} />}
          {view === "library" && <LibraryView resources={resources} uploadCourse={uploadCourse} uploading={uploading} fileInputRef={fileInputRef} onCourse={setUploadCourse} onUpload={uploadResource} />}
        </div>
      </section>
      <MobileNav view={view} onChange={changeView} />
      <TaskDialog open={taskDialog} title={newTaskTitle} course={newTaskCourse} onOpen={setTaskDialog} onTitle={setNewTaskTitle} onCourse={setNewTaskCourse} onSubmit={addTask} />
    </main>
  );
}

function DesktopSidebar({ view, onChange, onLibrary }: { view: View; onChange: (view: View) => void; onLibrary: () => void }) {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col bg-[#142823] px-5 py-6 text-white lg:flex">
    <div className="flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-[14px] bg-[#d7f06a] text-[#142823]"><BrainCircuit className="size-5" strokeWidth={2.2} /></span><div><p className="font-serif-cn text-xl font-semibold tracking-wide">知序</p><p className="text-xs text-white/55">开放学习工作台</p></div></div>
    <nav className="mt-10 space-y-1.5" aria-label="主要导航">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${view === id ? "bg-white/11 text-white" : "text-white/62 hover:bg-white/7 hover:text-white"}`}><Icon className="size-[18px]" />{label}{view === id && <span className="ml-auto size-1.5 rounded-full bg-[#d7f06a]" />}</button>)}</nav>
    <button onClick={onLibrary} className={`mt-auto rounded-2xl border p-4 text-left transition ${view === "library" ? "border-[#d7f06a]/40 bg-white/10" : "border-white/10 bg-white/[0.055] hover:bg-white/[0.08]"}`}><div className="flex items-center gap-2 text-xs text-white/60"><Cloud className="size-4 text-[#d7f06a]" />山大云盘资源</div><p className="mt-2 text-sm leading-6 text-white/86">课程资料入口已连接</p><span className="mt-3 block text-xs font-medium text-[#d7f06a]">查看资料库 →</span></button>
  </aside>;
}

function TopBar({ title, onAdd }: { title: string; onAdd: () => void }) {
  const dateText = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "long", day: "numeric", weekday: "long" }).format(new Date());
  return <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
    <div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-[#19352d] text-[#d7f06a]"><BrainCircuit className="size-[18px]" /></span><span className="font-serif-cn text-lg font-semibold">知序</span></div>
    <div className="hidden items-center gap-2 lg:flex"><h1 className="text-sm font-semibold">{title}</h1><span className="text-muted-foreground">·</span><span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock3 className="size-4" />{dateText}</span></div>
    <div className="flex items-center gap-3"><Button variant="outline" size="sm" onClick={onAdd} className="hidden rounded-xl bg-white sm:flex"><Plus className="size-4" />新建学习任务</Button><button aria-label="搜索" className="hidden size-9 place-items-center rounded-xl border border-border bg-white sm:grid"><Search className="size-[17px]" /></button><button aria-label="打开菜单" className="grid size-9 place-items-center rounded-xl border border-border bg-white lg:hidden"><Menu className="size-[18px]" /></button><span className="grid size-9 place-items-center rounded-full bg-[#e5eee9] text-sm font-semibold text-[#315f50]">我</span></div>
  </header>;
}

function TodayView({ tasks, doneCount, totalMinutes, progress, onToggle, onAdd, onView, onAsk, onCourse }: { tasks: Task[]; doneCount: number; totalMinutes: number; progress: Record<CourseId, number>; onToggle: (task: Task) => void; onAdd: () => void; onView: (view: View) => void; onAsk: () => void; onCourse: (id: CourseId) => void }) {
  return <>
    <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-medium text-[#537167]">今天，从一个知识点开始</p><h1 className="font-serif-cn text-[2rem] font-semibold tracking-tight sm:text-[2.45rem]">准备学习什么？</h1><p className="mt-2 max-w-xl text-[15px] leading-7 text-muted-foreground">还有 {tasks.length - doneCount} 项任务，预计 {totalMinutes} 分钟。所有进度从 0 开始，学完一个就勾选一个。</p></div><div className="flex w-fit items-center gap-3 rounded-2xl border border-[#dce5df] bg-[#f4f8f5] px-4 py-3"><div className="relative grid size-12 place-items-center rounded-full border-[4px] border-[#315f50] border-r-[#d7e2dc] text-sm font-semibold">{doneCount}/{tasks.length}</div><div><p className="text-xs text-muted-foreground">今日进度</p><p className="mt-0.5 text-sm font-medium">已专注 0 分钟</p></div></div></section>
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
      <Surface className="p-5 sm:p-6"><SectionHeading eyebrow="Today" title="今日学习" action={<button onClick={() => onView("plan")} className="text-sm font-medium text-[#315f50]">调整计划</button>} /><TaskList tasks={tasks.slice(0, 5)} onToggle={onToggle} /><button onClick={onAdd} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b9c8c1] py-3 text-sm font-medium text-[#537167] transition hover:border-[#315f50] hover:bg-[#f4f8f5]"><Plus className="size-4" />添加学习任务</button></Surface>
      <section className="relative overflow-hidden rounded-[22px] bg-[#19352d] p-6 text-white shadow-[0_18px_45px_rgba(20,40,35,.16)]"><div className="absolute -right-12 -top-16 size-48 rounded-full border border-white/10" /><div className="absolute -right-5 -top-7 size-28 rounded-full border border-[#d7f06a]/25" /><span className="relative grid size-10 place-items-center rounded-xl bg-white/10 text-[#d7f06a]"><Sparkles className="size-5" /></span><p className="relative mt-5 text-xs font-semibold uppercase tracking-[.13em] text-white/50">AI 深度讲解</p><h2 className="relative mt-2 font-serif-cn text-[1.35rem] font-semibold leading-8">哪里没想通，就从哪里开始问。</h2><p className="relative mt-2 text-sm leading-6 text-white/64">默认给出定义、原理、推导、例题、易错点和练习，不省略关键过程。</p><button onClick={onAsk} className="relative mt-6 flex w-full items-center justify-between rounded-xl bg-[#d7f06a] px-4 py-3 text-sm font-semibold text-[#19352d] transition hover:bg-[#e2f58b]">向 AI 提问<ChevronRight className="size-4" /></button></section>
    </div>
    <section className="mt-8"><SectionHeading eyebrow="Courses" title="我的课程" action={<button onClick={() => onView("courses")} className="text-sm font-medium text-[#315f50]">全部课程</button>} /><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{COURSES.map((course) => <CourseCard key={course.id} course={course} progress={progress[course.id]} onClick={() => onCourse(course.id)} />)}</div></section>
  </>;
}

function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle: (task: Task) => void }) {
  return <div className="mt-5 divide-y divide-border/75">{tasks.map((task) => <article key={task.id} className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"><Checkbox checked={task.completed} onCheckedChange={() => onToggle(task)} aria-label={`${task.completed ? "取消完成" : "完成"}${task.title}`} className="size-6 rounded-full border-[#b8c7c0] data-[state=checked]:border-[#315f50] data-[state=checked]:bg-[#315f50]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-xs font-medium text-[#5c776e]">{task.course}</span><span className="text-xs text-muted-foreground">· {task.kind}</span></div><h3 className={`mt-1 text-[15px] font-semibold transition ${task.completed ? "text-muted-foreground line-through" : ""}`}>{task.title}</h3></div><span className="hidden text-xs text-muted-foreground sm:block">{task.duration} 分钟</span><ChevronRight className="size-4 text-muted-foreground/60 transition group-hover:translate-x-0.5" /></article>)}</div>;
}

function CourseCard({ course, progress, onClick }: { course: (typeof COURSES)[number]; progress: number; onClick: () => void }) {
  const Icon = iconMap[course.id];
  return <button onClick={onClick} className="group rounded-[18px] border border-border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(25,53,45,.08)]"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl" style={{ backgroundColor: course.pale, color: course.color }}><Icon className="size-[18px]" /></span><span className="text-xs font-medium text-muted-foreground">{progress}%</span></div><h3 className="mt-4 min-h-11 text-[15px] font-semibold leading-[1.35]">{course.short}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{progress ? "继续学习" : course.current}</p><Progress value={progress} className="mt-4 h-1.5 bg-muted [&>div]:bg-[#315f50]" /></button>;
}

function CoursesView({ courseId, progress, onCourse, onAsk, onTopic, onMap, onLibrary }: { courseId: CourseId; progress: Record<CourseId, number>; onCourse: (id: CourseId) => void; onAsk: (prompt: string) => void; onTopic: (topic: string) => void; onMap: () => void; onLibrary: () => void }) {
  const course = COURSES.find((item) => item.id === courseId)!; const Icon = iconMap[course.id];
  return <div><div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">{COURSES.map((item) => <button key={item.id} onClick={() => onCourse(item.id)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${courseId === item.id ? "border-[#315f50] bg-[#315f50] text-white" : "border-border bg-white text-muted-foreground hover:text-foreground"}`}>{item.short}</button>)}</div>
    <Surface className="mt-4 overflow-hidden"><div className="relative p-6 sm:p-8" style={{ background: `linear-gradient(120deg, ${course.pale}, #ffffff 65%)` }}><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white shadow-sm" style={{ color: course.color }}><Icon className="size-7" /></span><div className="flex-1"><p className="text-sm font-medium" style={{ color: course.color }}>{progress[courseId] ? "继续学习" : "尚未开始"} · {course.current}</p><h1 className="mt-1 font-serif-cn text-2xl font-semibold sm:text-3xl">{course.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{course.description}</p></div><div className="w-full rounded-2xl bg-white/75 p-4 sm:w-48"><div className="flex justify-between text-xs"><span className="text-muted-foreground">已掌握知识点</span><b>{progress[courseId]}%</b></div><Progress value={progress[courseId]} className="mt-3 h-2 [&>div]:bg-[#315f50]" /></div></div></div>
      <Tabs defaultValue="outline" className="p-5 sm:p-7"><TabsList variant="line" className="w-full justify-start overflow-x-auto"><TabsTrigger value="outline">知识目录</TabsTrigger><TabsTrigger value="practice">练习中心</TabsTrigger><TabsTrigger value="notes">学习笔记</TabsTrigger><TabsTrigger value="resources">课程资料</TabsTrigger></TabsList>
        <TabsContent value="outline" className="mt-5"><div className="grid gap-3 md:grid-cols-2">{course.chapters.map((chapter, index) => <article key={chapter.title} className="rounded-2xl border border-border bg-[#fbfcfb] p-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#e8f0ec] text-xs font-bold text-[#315f50]">{String(index + 1).padStart(2, "0")}</span><h3 className="font-semibold">{chapter.title}</h3></div><div className="mt-3 flex flex-wrap gap-2">{chapter.topics.map((topic) => <button key={topic} onClick={() => onTopic(topic)} className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-[#8aa296] hover:text-[#315f50]">{topic}</button>)}</div></article>)}</div><div className="mt-5 flex flex-wrap gap-3"><Button onClick={onMap} className="rounded-xl bg-[#315f50]"><Waypoints className="size-4" />打开知识导图</Button><Button variant="outline" onClick={() => onAsk(course.quickQuestions[0])} className="rounded-xl"><Sparkles className="size-4" />AI 讲解当前章节</Button></div></TabsContent>
        <TabsContent value="practice" className="mt-5"><div className="grid gap-4 md:grid-cols-3">{["基础巩固", "综合应用", "错题重练"].map((name, index) => <article key={name} className="rounded-2xl border border-border p-5"><span className={`grid size-10 place-items-center rounded-xl ${index === 2 ? "bg-[#fff0e6] text-[#9d5b2e]" : "bg-[#e8f0ec] text-[#315f50]"}`}>{index === 2 ? <BookMarked className="size-5" /> : <ListChecks className="size-5" />}</span><h3 className="mt-4 font-semibold">{name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{index === 0 ? "8 个知识点 · 24 道题" : index === 1 ? "4 个专题 · 12 道题" : "本周暂无错题"}</p><Button variant="outline" size="sm" className="mt-4 rounded-lg"><Play className="size-3.5" />开始练习</Button></article>)}</div></TabsContent>
        <TabsContent value="notes" className="mt-5"><div className="rounded-2xl border border-dashed border-[#b9c8c1] bg-[#f7faf8] p-8 text-center"><BookMarked className="mx-auto size-7 text-[#537167]" /><h3 className="mt-3 font-semibold">记录自己的理解</h3><p className="mt-1 text-sm text-muted-foreground">学习时收藏的 AI 回答与笔记会集中在这里。</p><Button variant="outline" size="sm" className="mt-4">新建笔记</Button></div></TabsContent>
        <TabsContent value="resources" className="mt-5"><div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-[#f7faf8] p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-white text-[#315f50]"><FolderOpen className="size-5" /></span><div><h3 className="font-semibold">课程资料库</h3><p className="mt-1 text-sm text-muted-foreground">上传课件，或从山大云盘查找相关资料。</p></div></div><Button onClick={onLibrary} className="rounded-xl bg-[#315f50]">打开资料库</Button></div></TabsContent>
      </Tabs></Surface>
  </div>;
}

function MapView({ courseId, selectedTopic, mastery, onCourse, onTopic, onMastery, onAsk }: { courseId: CourseId; selectedTopic: string; mastery: Record<string, number>; onCourse: (id: CourseId) => void; onTopic: (topic: string) => void; onMastery: (level: number) => void; onAsk: (topic: string) => void }) {
  const course = COURSES.find((item) => item.id === courseId)!;
  const level = mastery[masteryKey(courseId, selectedTopic)] ?? 0;
  const detail = getTopicDetail(course, selectedTopic);
  const masteredCount = course.chapters.flatMap((chapter) => chapter.topics).filter((topic) => (mastery[masteryKey(courseId, topic)] ?? 0) > 0).length;
  const totalCount = course.chapters.flatMap((chapter) => chapter.topics).length;

  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-medium text-[#537167]">每一点都已准备好详解与导图</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">{course.name} · 知识体系</h1><p className="mt-2 text-sm text-muted-foreground">已掌握 {masteredCount}/{totalCount} 个知识点 · 点击任意知识点开始学习</p></div>
      <Select value={courseId} onValueChange={(value) => { const next = COURSES.find((item) => item.id === value)!; onCourse(next.id); onTopic(next.chapters[0].topics[0]); }}><SelectTrigger className="w-full rounded-xl bg-white sm:w-52"><SelectValue /></SelectTrigger><SelectContent>{COURSES.map((item) => <SelectItem key={item.id} value={item.id}>{item.short}</SelectItem>)}</SelectContent></Select>
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)]">
      <Surface className="h-fit overflow-hidden p-5 sm:p-7 xl:sticky xl:top-24">
        <div className="mx-auto w-fit rounded-2xl bg-[#19352d] px-6 py-4 text-center text-white shadow-lg"><BrainCircuit className="mx-auto mb-2 size-5 text-[#d7f06a]" /><p className="font-serif-cn text-lg font-semibold">{course.short}</p></div>
        <div className="mx-auto h-8 w-px bg-[#aabbb3]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">{course.chapters.map((chapter, chapterIndex) => <article key={chapter.title} className="rounded-2xl border border-border bg-[#fbfcfb] p-4"><div className="flex items-center gap-2"><span className="text-xs font-bold text-[#315f50]">{String(chapterIndex + 1).padStart(2, "0")}</span><h3 className="font-semibold">{chapter.title}</h3></div><div className="mt-3 space-y-2">{chapter.topics.map((topic) => { const checked = (mastery[masteryKey(courseId, topic)] ?? 0) > 0; return <button key={topic} onClick={() => onTopic(topic)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${selectedTopic === topic ? "border-[#315f50] bg-[#e8f0ec] text-[#244a3e]" : "border-border bg-white hover:border-[#9bafa5]"}`}><span>{topic}</span>{checked ? <CheckCircle2 className="size-4 text-[#4f8a68]" /> : <span className="size-3.5 rounded-full border border-[#c7d2cc]" />}</button>; })}</div></article>)}</div>
      </Surface>
      <Surface className="min-w-0 overflow-hidden">
        <div className="border-b border-border bg-[#f7faf8] p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">知识点详解</p><h2 className="mt-2 font-serif-cn text-2xl font-semibold sm:text-3xl">{selectedTopic}</h2><p className="mt-3 text-[15px] leading-7 text-[#46534e]">{detail.summary}</p></div><label className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${level ? "border-[#7fa28e] bg-[#e8f0ec] text-[#315f50]" : "border-border bg-white"}`}><Checkbox checked={level > 0} onCheckedChange={(checked) => onMastery(checked ? 1 : 0)} /><span>{level ? "已掌握" : "学完后勾选"}</span></label></div></div>
        <article className="p-5 sm:p-7">
          <section><h3 className="font-serif-cn text-xl font-semibold">{detail.sections[0].heading}</h3><p className="mt-2 whitespace-pre-wrap text-[15px] leading-8 text-[#46534e]">{detail.sections[0].content}</p></section>
          <div className="mt-7 rounded-2xl border border-[#d9e3de] bg-[#f8fbf9] p-4 sm:p-5"><div className="flex items-center gap-2"><Waypoints className="size-4 text-[#315f50]" /><h3 className="font-semibold">{selectedTopic} · 思维导图</h3></div><div className="mt-4 flex flex-col items-center"><div className="rounded-xl bg-[#19352d] px-4 py-2.5 text-center text-sm font-semibold text-white">{selectedTopic}</div><div className="h-5 w-px bg-[#9fb3a9]" /><div className="grid w-full gap-3 sm:grid-cols-2">{detail.mindMap?.map((branch) => <div key={branch.label} className="rounded-xl border border-[#d8e2dd] bg-white p-3"><p className="text-sm font-semibold text-[#315f50]">{branch.label}</p>{branch.items.map((item) => <p key={item} className="mt-2 text-xs leading-5 text-muted-foreground">{item}</p>)}</div>)}</div></div></div>
          <div className="mt-7 space-y-7">{detail.sections.slice(1).map((section) => <section key={section.heading}><h3 className="font-serif-cn text-xl font-semibold">{section.heading}</h3><p className="mt-2 whitespace-pre-wrap text-[15px] leading-8 text-[#46534e]">{section.content}</p></section>)}</div>
          <div className="mt-7 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl bg-[#f3f6f4] p-5"><h3 className="flex items-center gap-2 font-semibold"><Target className="size-4 text-[#315f50]" />需要记住</h3><ul className="mt-3 space-y-2">{detail.keyPoints.map((point) => <li key={point} className="flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-[#4f8a68]" />{point}</li>)}</ul></div><div className="rounded-2xl bg-[#fff6ed] p-5"><h3 className="font-semibold text-[#84552f]">易错提醒</h3><p className="mt-3 text-sm leading-6 text-[#715b49]">{detail.mistake}</p></div></div>
          <div className="mt-4 rounded-2xl border border-[#ded8bc] bg-[#faf8ef] p-5"><h3 className="font-semibold">检验一下</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail.exercise}</p><details className="mt-3"><summary className="cursor-pointer text-sm font-medium text-[#75652f]">查看参考答案</summary><p className="mt-2 rounded-xl bg-white/70 p-3 text-sm leading-6">{detail.answer}</p></details></div>
          <Button onClick={() => onAsk(selectedTopic)} variant="outline" className="mt-5 w-full rounded-xl"><Sparkles className="size-4" />继续向 AI 追问这个知识点</Button>
        </article>
      </Surface>
    </div>
  </div>;
}

function AssistantView({ courseId, question, answer, loading, onCourse, onQuestion, onAsk }: { courseId: CourseId; question: string; answer: DetailedAnswer; loading: boolean; onCourse: (id: CourseId) => void; onQuestion: (value: string) => void; onAsk: (prompt: string) => void }) {
  const course = COURSES.find((item) => item.id === courseId)!;
  return <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]"><aside className="space-y-4"><Surface className="p-4"><p className="text-sm font-semibold">选择课程</p><div className="mt-3 space-y-1.5">{COURSES.map((item) => { const Icon = iconMap[item.id]; return <button key={item.id} onClick={() => onCourse(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${courseId === item.id ? "bg-[#e8f0ec] font-medium text-[#315f50]" : "hover:bg-muted"}`}><Icon className="size-4" />{item.short}</button>; })}</div></Surface><Surface className="p-4"><p className="text-sm font-semibold">可以这样问</p><div className="mt-3 space-y-2">{course.quickQuestions.map((item) => <button key={item} onClick={() => onAsk(item)} className="w-full rounded-xl border border-border bg-[#fbfcfb] p-3 text-left text-xs leading-5 text-muted-foreground transition hover:border-[#8da399] hover:text-foreground">{item}</button>)}</div></Surface></aside>
    <div className="min-w-0"><div className="mb-5"><p className="text-sm font-medium text-[#537167]">详细模式 · 已开启</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">问清楚，也学明白</h1></div><Surface className="overflow-hidden"><div className="border-b border-border bg-[#f7faf8] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#19352d] text-[#d7f06a]"><Sparkles className="size-[18px]" /></span><div><p className="text-sm font-semibold">知序 AI</p><p className="text-xs text-muted-foreground">{answer.course} · 深度讲解</p></div></div></div>
      <article className={`px-5 py-6 transition sm:px-8 sm:py-8 ${loading ? "opacity-45" : ""}`}><div className="rounded-2xl border-l-4 border-[#315f50] bg-[#eef4f1] p-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#537167]">核心结论</p><h2 className="mt-2 font-serif-cn text-2xl font-semibold">{answer.title}</h2><p className="mt-3 text-[15px] leading-7 text-[#354a43]">{answer.summary}</p></div><div className="mt-7 space-y-7">{answer.sections.map((section) => <section key={section.heading}><h3 className="font-serif-cn text-lg font-semibold">{section.heading}</h3><p className="mt-2 whitespace-pre-wrap text-[15px] leading-8 text-[#46534e]">{section.content}</p></section>)}</div><div className="mt-7 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl bg-[#f3f6f4] p-5"><h3 className="flex items-center gap-2 font-semibold"><Target className="size-4 text-[#315f50]" />需要记住</h3><ul className="mt-3 space-y-2">{answer.keyPoints.map((point) => <li key={point} className="flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-[#4f8a68]" />{point}</li>)}</ul></div><div className="rounded-2xl bg-[#fff6ed] p-5"><h3 className="font-semibold text-[#84552f]">易错提醒</h3><p className="mt-3 text-sm leading-6 text-[#715b49]">{answer.mistake}</p></div></div><div className="mt-4 rounded-2xl border border-[#ded8bc] bg-[#faf8ef] p-5"><h3 className="font-semibold">检验一下</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{answer.exercise}</p><details className="mt-3"><summary className="cursor-pointer text-sm font-medium text-[#75652f]">查看答案</summary><p className="mt-2 rounded-xl bg-white/70 p-3 text-sm leading-6">{answer.answer}</p></details></div></article>
      <form onSubmit={(event) => { event.preventDefault(); onAsk(question); }} className="sticky bottom-20 border-t border-border bg-white p-4 sm:bottom-0 sm:p-5"><div className="flex items-end gap-2 rounded-2xl border border-[#cbd6d0] bg-white p-2 shadow-sm focus-within:ring-3 focus-within:ring-[#739184]/20"><Textarea value={question} onChange={(event) => onQuestion(event.target.value)} placeholder="继续追问，例如：请逐步推导，并再举一个例子" className="min-h-12 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0" /><Button type="submit" disabled={loading} className="size-11 shrink-0 rounded-xl bg-[#315f50] p-0" aria-label="发送问题"><Send className="size-4" /></Button></div></form>
    </Surface></div></div>;
}

function PlanView({ tasks, masteredCount, onToggle, onAdd }: { tasks: Task[]; masteredCount: number; onToggle: (task: Task) => void; onAdd: () => void }) {
  const days = ["一", "二", "三", "四", "五", "六", "日"];
  return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#537167]">按照节奏完成，而不是堆积任务</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">本周学习计划</h1></div><Button onClick={onAdd} className="w-fit rounded-xl bg-[#315f50]"><Plus className="size-4" />添加任务</Button></div><div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-3">{days.map((day, index) => <div key={day} className={`rounded-xl border py-3 text-center ${index === 6 ? "border-[#315f50] bg-[#e8f0ec]" : "border-border bg-white"}`}><p className="text-[11px] text-muted-foreground">周{day}</p><p className="mt-1 text-sm font-semibold">{7 + index}</p>{index === 6 && <span className="mx-auto mt-1.5 block size-1.5 rounded-full bg-[#315f50]" />}</div>)}</div><div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><Surface className="p-5 sm:p-6"><SectionHeading eyebrow="Today" title="今日安排" /><TaskList tasks={tasks} onToggle={onToggle} /></Surface><div className="space-y-5"><Surface className="p-5"><p className="text-sm font-semibold">本周目标</p><div className="mt-5 space-y-4">{[{label:"完成任务",value:`${tasks.filter((task) => task.completed).length}/${Math.max(tasks.length, 1)}`,progress: tasks.length ? tasks.filter((task) => task.completed).length / tasks.length * 100 : 0},{label:"专注时长",value:"0/8h",progress:0},{label:"掌握知识点",value:`${masteredCount}/84`,progress:masteredCount / 84 * 100}].map((item) => <div key={item.label}><div className="flex justify-between text-xs"><span className="text-muted-foreground">{item.label}</span><b>{item.value}</b></div><Progress value={item.progress} className="mt-2 h-1.5 [&>div]:bg-[#315f50]" /></div>)}</div></Surface><Surface className="bg-[#19352d] p-5 text-white"><CalendarDays className="size-5 text-[#d7f06a]" /><h3 className="mt-3 font-serif-cn text-lg font-semibold">按自己的节奏学习</h3><p className="mt-2 text-sm leading-6 text-white/60">任务与掌握状态会按当前设备独立保存，不会与其他访客混在一起。</p></Surface></div></div></div>;
}

function LibraryView({ resources, uploadCourse, uploading, fileInputRef, onCourse, onUpload }: { resources: ResourceItem[]; uploadCourse: CourseId; uploading: boolean; fileInputRef: React.RefObject<HTMLInputElement | null>; onCourse: (id: CourseId) => void; onUpload: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div><div><p className="text-sm font-medium text-[#537167]">把课件、讲义和题目放在一起</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">我的资料库</h1></div><div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-5"><a href={cloudUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[22px] bg-[#19352d] p-5 text-white shadow-[0_18px_45px_rgba(20,40,35,.14)] transition hover:bg-[#21463b]"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-[#d7f06a]"><Cloud className="size-6" /></span><div><p className="font-semibold">山大云盘 · 计科学术部</p><p className="mt-1 text-sm text-white/55">包含课程资料、电子电路技术基础和概率统计等目录</p></div></div><ArrowRight className="size-5" /></a><Surface className="p-5 sm:p-6"><SectionHeading eyebrow="My Files" title="当前设备的资料" /><div className="mt-5 space-y-3">{resources.length ? resources.map((item) => <article key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3"><span className="grid size-10 place-items-center rounded-xl bg-[#eef3f0] text-[#315f50]"><FileText className="size-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{COURSES.find((course) => course.id === item.courseId)?.short || "课程资料"} · {(item.size / 1024 / 1024).toFixed(1)} MB</p></div></article>) : <div className="rounded-2xl border border-dashed border-[#b9c8c1] bg-[#f7faf8] p-10 text-center"><Library className="mx-auto size-7 text-[#537167]" /><p className="mt-3 font-semibold">还没有上传资料</p><p className="mt-1 text-sm text-muted-foreground">上传后会按照课程自动归档。</p></div>}</div></Surface></div><Surface className="h-fit p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f0ec] text-[#315f50]"><Upload className="size-5" /></span><div><h2 className="font-semibold">上传课程资料</h2><p className="text-xs text-muted-foreground">PDF、PPT、Word 或图片</p></div></div><form onSubmit={onUpload} className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-medium">所属课程</label><Select value={uploadCourse} onValueChange={(value) => onCourse(value as CourseId)}><SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{COURSES.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><div><label className="mb-2 block text-sm font-medium">选择文件</label><Input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.md,.txt,.png,.jpg,.jpeg" className="h-auto rounded-xl py-2.5" /></div><p className="text-xs leading-5 text-muted-foreground">文件与学习进度按当前设备独立保存，单个文件最大 20MB。</p><Button disabled={uploading} className="w-full rounded-xl bg-[#315f50]"><Paperclip className="size-4" />{uploading ? "正在保存…" : "保存到资料库"}</Button></form></Surface></div></div>;
}

function MobileNav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-white/95 px-2 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="手机端导航">{navItems.map(({ id, mobile, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={`flex min-w-0 flex-col items-center gap-1.5 py-1 text-[11px] ${view === id ? "font-semibold text-[#315f50]" : "text-muted-foreground"}`}><Icon className="size-5" /><span className="truncate">{mobile}</span></button>)}</nav>;
}

function TaskDialog({ open, title, course, onOpen, onTitle, onCourse, onSubmit }: { open: boolean; title: string; course: CourseId; onOpen: (open: boolean) => void; onTitle: (title: string) => void; onCourse: (course: CourseId) => void; onSubmit: (event: FormEvent) => void }) {
  return <Dialog open={open} onOpenChange={onOpen}><DialogContent className="rounded-[22px] sm:max-w-[460px]"><DialogHeader><DialogTitle className="font-serif-cn text-2xl">添加学习任务</DialogTitle><DialogDescription>为今天安排一个具体、可完成的小目标。</DialogDescription></DialogHeader><form onSubmit={onSubmit} className="mt-2 space-y-4"><div><label className="mb-2 block text-sm font-medium" htmlFor="task-title">任务内容</label><Input id="task-title" value={title} onChange={(event) => onTitle(event.target.value)} placeholder="例如：完成二叉树层序遍历" className="h-11 rounded-xl" autoFocus /></div><div><label className="mb-2 block text-sm font-medium">所属课程</label><Select value={course} onValueChange={(value) => onCourse(value as CourseId)}><SelectTrigger className="h-11 w-full rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{COURSES.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><Button type="submit" className="h-11 w-full rounded-xl bg-[#315f50]">保存任务</Button></form></DialogContent></Dialog>;
}
