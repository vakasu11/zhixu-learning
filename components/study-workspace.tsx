"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BookMarked, BookOpen, BrainCircuit, CalendarDays, CheckCircle2,
  ChevronRight, CircuitBoard, Clock3, Cloud, Code2, FileText, FolderOpen, Home, Library,
  Copy, ListChecks, Menu, Network, Paperclip, Plus, Search, Send, Sparkles, Target,
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
import { DATA_STRUCTURE_COMPARISONS, DATA_STRUCTURE_REVIEWS } from "@/lib/data-structure-review";
import { COURSE_MATERIAL_AUDITS, MATERIAL_ROLES, getCourseMaterialAudit } from "@/lib/course-materials";
import { CODE_LIBRARY_CHAPTERS, CODE_LIBRARY_STATS, DATA_STRUCTURE_CODE_LIBRARY, type CodePriority } from "@/lib/data-structure-code-library";
import { filterCodeItems, getVisibleCategories } from "@/lib/data-structure-code/selectors";
import { downloadBrowserResource, listBrowserResources, saveBrowserResource } from "@/lib/browser-files";

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
  { id: "assistant", label: "学习助手", mobile: "助手", icon: Sparkles },
  { id: "plan", label: "学习计划", mobile: "计划", icon: CalendarDays },
];

const pageTitles: Record<View, string> = { today: "今日学习", courses: "我的课程", map: "知识导图", assistant: "智能学习助手", plan: "学习计划", library: "资料库" };
const masteryKey = (courseId: CourseId, topic: string) => `${courseId}:${topic}`;
const STATIC_MODE = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_STATIC_MODE === "true";
const TASKS_STORAGE_KEY = "zhixu_tasks_v1";
const MASTERY_STORAGE_KEY = "zhixu_mastery_v1";

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-border bg-card shadow-[0_12px_38px_rgba(31,53,88,.055)] ${className}`}>{children}</section>;
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
    if (STATIC_MODE) {
      try {
        const savedTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) || "null");
        const savedMastery = JSON.parse(localStorage.getItem(MASTERY_STORAGE_KEY) || "{}");
        if (Array.isArray(savedTasks)) setTasks(savedTasks);
        if (savedMastery && typeof savedMastery === "object") setMasteryLevels(savedMastery);
      } catch { /* 损坏的浏览器数据会自动回退到零进度 */ }
      void listBrowserResources().then((items) => setResources(items as ResourceItem[])).catch(() => undefined);
      return;
    }
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
        if (STATIC_MODE) {
          const task: Task = { id: Date.now(), courseId: selected.id, course: selected.name, title: input.title.trim(), duration, kind: "学习", completed: false };
          setTasks((current) => { const next = [...current, task]; localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next)); return next; });
          return { id: task.id, title: task.title, saved: true };
        }
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
    setTasks((current) => { const next = current.map((item) => item.id === task.id ? { ...item, completed } : item); if (STATIC_MODE) localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next)); return next; });
    if (STATIC_MODE) { if (completed) toast.success("任务完成，已保存在当前浏览器"); return; }
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
    if (STATIC_MODE) {
      setTasks((current) => { const next = [...current, fallback]; localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next)); return next; });
      toast.success("学习任务已保存在当前浏览器");
      setNewTaskTitle(""); setTaskDialog(false); return;
    }
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
    if (STATIC_MODE) { setAnswer(buildDetailedAnswer(selectedCourse, prompt)); setAnswerLoading(false); return; }
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
    setMasteryLevels((current) => { const next = { ...current, [key]: level }; if (STATIC_MODE) localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(next)); return next; });
    if (STATIC_MODE) { toast.success(level ? "已标记为掌握，并保存在当前浏览器" : "已取消掌握"); return; }
    try {
      await fetch("/api/mastery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId, topic: selectedTopic, level }) });
      toast.success(level ? "已标记为掌握" : "已取消掌握");
    } catch { toast.info("掌握度已在当前页面更新"); }
  }

  async function uploadResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) { toast.error("请先选择一个资料文件"); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error("单个文件不能超过 20 兆字节"); return; }
    setUploading(true);
    if (STATIC_MODE) {
      try {
        const resource = await saveBrowserResource(uploadCourse, file);
        setResources((current) => [resource as ResourceItem, ...current]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("资料已保存在当前浏览器");
      } catch { toast.error("浏览器没有足够空间保存该资料"); }
      finally { setUploading(false); }
      return;
    }
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

  async function openResource(item: ResourceItem) {
    if (!STATIC_MODE) return;
    try { await downloadBrowserResource(item.id); }
    catch { toast.error("资料无法读取，请重新上传"); }
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
          {view === "library" && <LibraryView resources={resources} uploadCourse={uploadCourse} uploading={uploading} fileInputRef={fileInputRef} onCourse={setUploadCourse} onUpload={uploadResource} onOpen={(item) => void openResource(item)} />}
        </div>
      </section>
      <MobileNav view={view} onChange={changeView} />
      <TaskDialog open={taskDialog} title={newTaskTitle} course={newTaskCourse} onOpen={setTaskDialog} onTitle={setNewTaskTitle} onCourse={setNewTaskCourse} onSubmit={addTask} />
    </main>
  );
}

function DesktopSidebar({ view, onChange, onLibrary }: { view: View; onChange: (view: View) => void; onLibrary: () => void }) {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col bg-[#1f2a3a] px-5 py-6 text-white lg:flex">
    <div className="flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-[14px] bg-[#e6b84f] text-[#1f2a3a]"><BrainCircuit className="size-5" strokeWidth={2.2} /></span><div><p className="font-serif-cn text-xl font-semibold tracking-wide">知序</p><p className="text-xs text-white/55">开放学习工作台</p></div></div>
    <nav className="mt-10 space-y-1.5" aria-label="主要导航">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${view === id ? "bg-white/11 text-white" : "text-white/62 hover:bg-white/7 hover:text-white"}`}><Icon className="size-[18px]" />{label}{view === id && <span className="ml-auto size-1.5 rounded-full bg-[#e6b84f]" />}</button>)}</nav>
    <button onClick={onLibrary} className={`mt-auto rounded-2xl border p-4 text-left transition ${view === "library" ? "border-[#e6b84f]/40 bg-white/10" : "border-white/10 bg-white/[0.055] hover:bg-white/[0.08]"}`}><div className="flex items-center gap-2 text-xs text-white/60"><Cloud className="size-4 text-[#e6b84f]" />山大云盘资源</div><p className="mt-2 text-sm leading-6 text-white/86">课程资料入口已连接</p><span className="mt-3 block text-xs font-medium text-[#e6b84f]">查看资料库 →</span></button>
  </aside>;
}

function TopBar({ title, onAdd }: { title: string; onAdd: () => void }) {
  const dateText = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "long", day: "numeric", weekday: "long" }).format(new Date());
  return <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
    <div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-[#1f3558] text-[#e6b84f]"><BrainCircuit className="size-[18px]" /></span><span className="font-serif-cn text-lg font-semibold">知序</span></div>
    <div className="hidden items-center gap-2 lg:flex"><h1 className="text-sm font-semibold">{title}</h1><span className="text-muted-foreground">·</span><span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock3 className="size-4" />{dateText}</span></div>
    <div className="flex items-center gap-3"><Button variant="outline" size="sm" onClick={onAdd} className="hidden rounded-xl bg-white sm:flex"><Plus className="size-4" />新建学习任务</Button><button aria-label="搜索" className="hidden size-9 place-items-center rounded-xl border border-border bg-white sm:grid"><Search className="size-[17px]" /></button><button aria-label="打开菜单" className="grid size-9 place-items-center rounded-xl border border-border bg-white lg:hidden"><Menu className="size-[18px]" /></button><span className="grid size-9 place-items-center rounded-full bg-[#e7eef7] text-sm font-semibold text-[#355f91]">我</span></div>
  </header>;
}

function TodayView({ tasks, doneCount, totalMinutes, progress, onToggle, onAdd, onView, onAsk, onCourse }: { tasks: Task[]; doneCount: number; totalMinutes: number; progress: Record<CourseId, number>; onToggle: (task: Task) => void; onAdd: () => void; onView: (view: View) => void; onAsk: () => void; onCourse: (id: CourseId) => void }) {
  return <>
    <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-medium text-[#526f94]">今天，从一个知识点开始</p><h1 className="font-serif-cn text-[2rem] font-semibold tracking-tight sm:text-[2.45rem]">准备学习什么？</h1><p className="mt-2 max-w-xl text-[15px] leading-7 text-muted-foreground">还有 {tasks.length - doneCount} 项任务，预计 {totalMinutes} 分钟。所有进度从 0 开始，学完一个就勾选一个。</p></div><div className="flex w-fit items-center gap-3 rounded-2xl border border-[#d9e1eb] bg-[#f3f6fa] px-4 py-3"><div className="relative grid size-12 place-items-center rounded-full border-[4px] border-[#355f91] border-r-[#dbe3ed] text-sm font-semibold">{doneCount}/{tasks.length}</div><div><p className="text-xs text-muted-foreground">今日进度</p><p className="mt-0.5 text-sm font-medium">已专注 0 分钟</p></div></div></section>
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
      <Surface className="p-5 sm:p-6"><SectionHeading eyebrow="今日" title="今日学习" action={<button onClick={() => onView("plan")} className="text-sm font-medium text-[#355f91]">调整计划</button>} /><TaskList tasks={tasks.slice(0, 5)} onToggle={onToggle} /><button onClick={onAdd} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b7c4d4] py-3 text-sm font-medium text-[#526f94] transition hover:border-[#355f91] hover:bg-[#f3f6fa]"><Plus className="size-4" />添加学习任务</button></Surface>
      <section className="relative overflow-hidden rounded-[22px] bg-[#1f3558] p-6 text-white shadow-[0_18px_45px_rgba(31,53,88,.16)]"><div className="absolute -right-12 -top-16 size-48 rounded-full border border-white/10" /><div className="absolute -right-5 -top-7 size-28 rounded-full border border-[#e6b84f]/25" /><span className="relative grid size-10 place-items-center rounded-xl bg-white/10 text-[#e6b84f]"><Sparkles className="size-5" /></span><p className="relative mt-5 text-xs font-semibold uppercase tracking-[.13em] text-white/50">智能深度讲解</p><h2 className="relative mt-2 font-serif-cn text-[1.35rem] font-semibold leading-8">哪里没想通，就从哪里开始问。</h2><p className="relative mt-2 text-sm leading-6 text-white/64">默认给出定义、原理、推导、例题、易错点和练习，不省略关键过程。</p><button onClick={onAsk} className="relative mt-6 flex w-full items-center justify-between rounded-xl bg-[#e6b84f] px-4 py-3 text-sm font-semibold text-[#1f3558] transition hover:bg-[#e2f58b]">向学习助手提问<ChevronRight className="size-4" /></button></section>
    </div>
    <section className="mt-8"><SectionHeading eyebrow="课程" title="我的课程" action={<button onClick={() => onView("courses")} className="text-sm font-medium text-[#355f91]">全部课程</button>} /><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{COURSES.map((course) => <CourseCard key={course.id} course={course} progress={progress[course.id]} onClick={() => onCourse(course.id)} />)}</div></section>
  </>;
}

function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle: (task: Task) => void }) {
  return <div className="mt-5 divide-y divide-border/75">{tasks.map((task) => <article key={task.id} className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"><Checkbox checked={task.completed} onCheckedChange={() => onToggle(task)} aria-label={`${task.completed ? "取消完成" : "完成"}${task.title}`} className="size-6 rounded-full border-[#b8c5d5] data-[state=checked]:border-[#355f91] data-[state=checked]:bg-[#355f91]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-xs font-medium text-[#5f7693]">{task.course}</span><span className="text-xs text-muted-foreground">· {task.kind}</span></div><h3 className={`mt-1 text-[15px] font-semibold transition ${task.completed ? "text-muted-foreground line-through" : ""}`}>{task.title}</h3></div><span className="hidden text-xs text-muted-foreground sm:block">{task.duration} 分钟</span><ChevronRight className="size-4 text-muted-foreground/60 transition group-hover:translate-x-0.5" /></article>)}</div>;
}

function CourseCard({ course, progress, onClick }: { course: (typeof COURSES)[number]; progress: number; onClick: () => void }) {
  const Icon = iconMap[course.id];
  return <button onClick={onClick} className="group rounded-[18px] border border-border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(31,53,88,.08)]"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl" style={{ backgroundColor: course.pale, color: course.color }}><Icon className="size-[18px]" /></span><span className="text-xs font-medium text-muted-foreground">{progress}%</span></div><h3 className="mt-4 min-h-11 text-[15px] font-semibold leading-[1.35]">{course.short}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{progress ? "继续学习" : course.current}</p><Progress value={progress} className="mt-4 h-1.5 bg-muted [&>div]:bg-[#355f91]" /></button>;
}

function CoursesView({ courseId, progress, onCourse, onAsk, onTopic, onMap, onLibrary }: { courseId: CourseId; progress: Record<CourseId, number>; onCourse: (id: CourseId) => void; onAsk: (prompt: string) => void; onTopic: (topic: string) => void; onMap: () => void; onLibrary: () => void }) {
  const course = COURSES.find((item) => item.id === courseId)!; const Icon = iconMap[course.id];
  const materialAudit = getCourseMaterialAudit(courseId);
  return <div><div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">{COURSES.map((item) => <button key={item.id} onClick={() => onCourse(item.id)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${courseId === item.id ? "border-[#355f91] bg-[#355f91] text-white" : "border-border bg-white text-muted-foreground hover:text-foreground"}`}>{item.short}</button>)}</div>
    <Surface className="mt-4 overflow-hidden"><div className="relative p-6 sm:p-8" style={{ background: `linear-gradient(120deg, ${course.pale}, #ffffff 65%)` }}><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white shadow-sm" style={{ color: course.color }}><Icon className="size-7" /></span><div className="flex-1"><p className="text-sm font-medium" style={{ color: course.color }}>{progress[courseId] ? "继续学习" : "尚未开始"} · {course.current}</p><h1 className="mt-1 font-serif-cn text-2xl font-semibold sm:text-3xl">{course.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{course.description}</p></div><div className="w-full rounded-2xl bg-white/75 p-4 sm:w-48"><div className="flex justify-between text-xs"><span className="text-muted-foreground">已掌握知识点</span><b>{progress[courseId]}%</b></div><Progress value={progress[courseId]} className="mt-3 h-2 [&>div]:bg-[#355f91]" /></div></div></div>
      <Tabs defaultValue="outline" className="p-5 sm:p-7"><TabsList variant="line" className="w-full justify-start overflow-x-auto"><TabsTrigger value="outline">知识目录</TabsTrigger><TabsTrigger value="review">章节速查</TabsTrigger>{courseId === "data-structures" && <TabsTrigger value="code">代码复习库</TabsTrigger>}<TabsTrigger value="practice">可选自测</TabsTrigger><TabsTrigger value="notes">学习笔记</TabsTrigger><TabsTrigger value="resources">课程资料</TabsTrigger></TabsList>
        <TabsContent value="outline" className="mt-5"><div className="grid gap-3 md:grid-cols-2">{course.chapters.map((chapter, index) => <article key={chapter.title} className="rounded-2xl border border-border bg-[#fafbfd] p-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#e7eef8] text-xs font-bold text-[#355f91]">{String(index + 1).padStart(2, "0")}</span><h3 className="font-semibold">{chapter.title}</h3></div><div className="mt-3 flex flex-wrap gap-2">{chapter.topics.map((topic) => <button key={topic} onClick={() => onTopic(topic)} className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-[#8da3bf] hover:text-[#355f91]">{topic}</button>)}</div></article>)}</div><div className="mt-5 flex flex-wrap gap-3"><Button onClick={onMap} className="rounded-xl bg-[#355f91]"><Waypoints className="size-4" />打开知识导图</Button><Button variant="outline" onClick={() => onAsk(course.quickQuestions[0])} className="rounded-xl"><Sparkles className="size-4" />智能讲解当前章节</Button></div></TabsContent>
        <TabsContent value="review" className="mt-5"><ChapterReviewView course={course} onTopic={onTopic} /></TabsContent>
        {courseId === "data-structures" && <TabsContent value="code" className="mt-5"><CodeReviewLibrary /></TabsContent>}
        <TabsContent value="practice" className="mt-5"><article className="rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-5 sm:p-6"><span className="grid size-10 place-items-center rounded-xl bg-[#e7eef8] text-[#355f91]"><ListChecks className="size-5" /></span><h3 className="mt-4 font-semibold">练习不是主线</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">本项目以教材知识解析和思维导图为主。每个知识点底部只保留一道可选自测，用来确认是否真正理解；需要集中刷题时再单独增加。</p><Button onClick={onMap} variant="outline" size="sm" className="mt-4 rounded-lg"><Waypoints className="size-3.5" />返回知识解析</Button></article></TabsContent>
        <TabsContent value="notes" className="mt-5"><div className="rounded-2xl border border-dashed border-[#b7c4d4] bg-[#f6f8fb] p-8 text-center"><BookMarked className="mx-auto size-7 text-[#526f94]" /><h3 className="mt-3 font-semibold">记录自己的理解</h3><p className="mt-1 text-sm text-muted-foreground">学习时收藏的智能回答与笔记会集中在这里。</p><Button variant="outline" size="sm" className="mt-4">新建笔记</Button></div></TabsContent>
        <TabsContent value="resources" className="mt-5"><MaterialAuditView audit={materialAudit} onLibrary={onLibrary} /></TabsContent>
      </Tabs></Surface>
  </div>;
}

function CodeReviewLibrary() {
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState<"all" | CodePriority>("all");
  const visibleCategories = useMemo(() => getVisibleCategories(DATA_STRUCTURE_CODE_LIBRARY, chapter), [chapter]);
  const filtered = useMemo(() => filterCodeItems(DATA_STRUCTURE_CODE_LIBRARY, { chapter, category, priority, query }), [chapter, category, priority, query]);
  const chapterCounts = useMemo(() => Object.fromEntries(CODE_LIBRARY_CHAPTERS.map((item) => [item, DATA_STRUCTURE_CODE_LIBRARY.filter((code) => code.chapter === item).length])) as Record<number, number>, []);
  useEffect(() => {
    if (category !== "all" && !visibleCategories.includes(category)) setCategory("all");
  }, [category, visibleCategories]);
  const priorityStyle: Record<CodePriority, string> = {
    "必会": "bg-[#e6eef9] text-[#355f91]",
    "重点理解": "bg-[#f5edcf] text-[#79631d]",
    "拓展": "bg-[#ececf5] text-[#5a5978]",
  };

  async function copyCode(code: string, title: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`已复制：${title}`);
    } catch {
      toast.error("当前浏览器不允许自动复制，请长按代码手动选择");
    }
  }

  return <div>
    <section className="rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start"><div><span className="inline-flex rounded-full bg-[#1f3558] px-2.5 py-1 text-xs font-semibold text-[#e6b84f]">原创 C++17 复习版</span><h3 className="mt-3 font-serif-cn text-xl font-semibold">21 章教材代码，一处集中复习</h3><p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">依据教材程序与章节结构重新组织，每段均标注教材范围，并补充前置知识、执行步骤、复杂度、不变量与易错点。代码用于阅读、理解和默写，不提供在线编译或后端沙箱。</p></div><div className="grid shrink-0 grid-cols-3 gap-2 text-center"><div className="rounded-xl border border-border bg-white px-3 py-3"><b className="block text-xl text-[#355f91]">{CODE_LIBRARY_STATS.totalCodeItems}</b><span className="text-xs text-muted-foreground">代码专题</span></div><div className="rounded-xl border border-border bg-white px-3 py-3"><b className="block text-xl text-[#355f91]">{CODE_LIBRARY_STATS.accountedTopics}</b><span className="text-xs text-muted-foreground">知识点已对账</span></div><div className="rounded-xl border border-border bg-white px-3 py-3"><b className="block text-xl text-[#355f91]">{CODE_LIBRARY_STATS.totalChapters}</b><span className="text-xs text-muted-foreground">教材章节</span></div></div></div>
      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_160px]"><label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3"><Search className="size-4 shrink-0 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索：链表、排序、最短路径…" className="border-0 px-0 shadow-none focus-visible:ring-0" /></label><Select value={chapter} onValueChange={setChapter}><SelectTrigger className="w-full rounded-xl bg-white"><SelectValue placeholder="全部章节" /></SelectTrigger><SelectContent><SelectItem value="all">全部章节</SelectItem>{CODE_LIBRARY_CHAPTERS.map((item) => <SelectItem key={item} value={String(item)}>第 {item} 章</SelectItem>)}</SelectContent></Select><Select value={priority} onValueChange={(value) => setPriority(value as "all" | CodePriority)}><SelectTrigger className="w-full rounded-xl bg-white"><SelectValue placeholder="全部级别" /></SelectTrigger><SelectContent><SelectItem value="all">全部级别</SelectItem><SelectItem value="必会">必会</SelectItem><SelectItem value="重点理解">重点理解</SelectItem><SelectItem value="拓展">拓展</SelectItem></SelectContent></Select></div>
      <div className="mt-4"><p className="mb-2 text-xs font-semibold text-[#526f94]">按章节直接进入</p><div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"><button type="button" onClick={() => setChapter("all")} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition ${chapter === "all" ? "border-[#355f91] bg-[#355f91] text-white" : "border-border bg-white text-muted-foreground hover:border-[#8ea4c0]"}`}>全部 {DATA_STRUCTURE_CODE_LIBRARY.length}</button>{CODE_LIBRARY_CHAPTERS.map((item) => <button type="button" key={item} onClick={() => setChapter(String(item))} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition ${chapter === String(item) ? "border-[#355f91] bg-[#355f91] text-white" : "border-border bg-white text-muted-foreground hover:border-[#8ea4c0]"}`}>第 {item} 章 <span className="opacity-65">{chapterCounts[item]}</span></button>)}</div></div>
      <div className="mt-2"><p className="mb-2 text-xs font-semibold text-[#526f94]">按类型浏览</p><div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"><button type="button" onClick={() => setCategory("all")} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${category === "all" ? "border-[#355f91] bg-[#e7eef8] text-[#2d4c73]" : "border-border bg-white text-muted-foreground"}`}>全部类型</button>{visibleCategories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${category === item ? "border-[#355f91] bg-[#e7eef8] text-[#2d4c73]" : "border-border bg-white text-muted-foreground"}`}>{item}</button>)}</div></div>
    </section>
    <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">找到 <b className="text-foreground">{filtered.length}</b> 个代码专题</p><p className="hidden text-xs text-muted-foreground sm:block">建议顺序：先说出不变量 → 再默写 → 最后分析复杂度</p></div>
    <div className="mt-3 space-y-3">{filtered.map((item) => <details key={item.id} className="group overflow-hidden rounded-2xl border border-border bg-white open:border-[#8ea4c0] open:shadow-[0_10px_28px_rgba(31,53,88,.06)]">
      <summary className="cursor-pointer list-none p-4 sm:p-5"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-[#edf2f8] px-2 py-1 text-[11px] font-bold text-[#4f6f98]">第 {item.chapter} 章</span><span className="rounded-lg bg-[#f1eee7] px-2 py-1 text-[11px] font-bold text-[#6e6048]">{item.category}</span><span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${priorityStyle[item.priority]}`}>{item.priority}</span></div><h4 className="mt-2 font-semibold sm:text-[17px]">{item.title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.purpose}</p><p className="mt-2 text-xs text-muted-foreground">教材：{item.textbookRef.section} · {item.textbookRef.pdfPages}</p></div><ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground transition group-open:rotate-90" /></div></summary>
      <div className="border-t border-border bg-[#fafbfd] p-4 sm:p-5"><div className="grid gap-3 lg:grid-cols-2"><div className="rounded-xl border border-border bg-white p-4"><p className="text-xs font-semibold text-[#526f94]">前置知识</p><div className="mt-2 flex flex-wrap gap-2">{item.prerequisites.map((entry) => <span key={entry} className="rounded-lg bg-[#edf2f8] px-2 py-1 text-xs text-[#4f6f98]">{entry}</span>)}</div></div><div className="rounded-xl border border-border bg-white p-4"><p className="text-xs font-semibold text-[#526f94]">执行步骤</p><ol className="mt-2 space-y-1.5">{item.steps.map((step, index) => <li key={step} className="flex gap-2 text-sm leading-6"><span className="font-semibold text-[#526f94]">{index + 1}.</span>{step}</li>)}</ol></div><div className="rounded-xl border border-border bg-white p-4"><p className="text-xs font-semibold text-[#526f94]">复杂度</p><p className="mt-2 text-sm leading-6">{item.complexity}</p></div><div className="rounded-xl border border-border bg-white p-4"><p className="text-xs font-semibold text-[#526f94]">核心不变量</p><p className="mt-2 text-sm leading-6">{item.invariant}</p></div></div><div className="relative mt-3 min-w-0 overflow-hidden rounded-xl bg-[#172033] text-[#edf2f8]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5"><span className="text-xs font-medium text-white/55">C++17 · 原创复习实现</span><button type="button" onClick={() => void copyCode(item.code, item.title)} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-white/65 transition hover:bg-white/10 hover:text-white"><Copy className="size-3.5" />复制</button></div><pre className="max-h-[520px] max-w-full overflow-auto p-4 text-[12px] leading-6 sm:text-[13px]"><code>{item.code}</code></pre></div><div className="mt-3 rounded-xl border border-[#ead7c5] bg-[#fff7ef] p-4"><p className="text-xs font-semibold text-[#84552f]">易错点</p><ul className="mt-2 space-y-1.5">{item.pitfalls.map((pitfall) => <li key={pitfall} className="flex gap-2 text-sm leading-6 text-[#715b49]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#bd8150]" />{pitfall}</li>)}</ul></div></div>
    </details>)}</div>
    {!filtered.length && <div className="mt-3 rounded-2xl border border-dashed border-[#b7c4d4] bg-[#f6f8fb] p-10 text-center"><Code2 className="mx-auto size-7 text-[#526f94]" /><p className="mt-3 font-semibold">没有匹配的代码专题</p><button type="button" onClick={() => { setQuery(""); setChapter("all"); setCategory("all"); setPriority("all"); }} className="mt-2 text-sm font-medium text-[#355f91]">清除筛选</button></div>}
  </div>;
}

function MaterialAuditView({ audit, onLibrary }: { audit: ReturnType<typeof getCourseMaterialAudit>; onLibrary: () => void }) {
  return <div className="space-y-5">
    <section className="rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${audit.status === "已完成目录盘点" ? "bg-[#e8f0fa] text-[#3e628f]" : "bg-[#f1eee5] text-[#76663c]"}`}>{audit.status}</span><h3 className="mt-3 font-serif-cn text-xl font-semibold">教学资料选择结果</h3><p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{audit.summary}</p></div><Button onClick={onLibrary} className="shrink-0 rounded-xl bg-[#355f91]"><FolderOpen className="size-4" />打开资料库</Button></div><dl className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-white p-4"><dt className="text-xs font-semibold text-[#526f94]">主要教学依据</dt><dd className="mt-2 text-sm leading-6">{audit.primarySource}</dd></div><div className="rounded-xl border border-border bg-white p-4"><dt className="text-xs font-semibold text-[#526f94]">下一步处理</dt><dd className="mt-2 text-sm leading-6 text-muted-foreground">{audit.nextStep}</dd></div></dl></section>
    <section><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#526f94]">资料使用顺序</p><div className="mt-3 grid gap-3 md:grid-cols-2">{MATERIAL_ROLES.map((item, index) => <article key={item.name} className="rounded-2xl border border-border bg-white p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#e7eef8] text-xs font-bold text-[#355f91]">{index + 1}</span><h4 className="font-semibold">{item.name}</h4></div><span className="rounded-full bg-[#f2f5f3] px-2.5 py-1 text-xs font-medium text-[#526f94]">{item.priority}</span></div><p className="mt-3 text-sm leading-6">{item.use}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.reason}</p></article>)}</div></section>
    {audit.files && <details className="rounded-2xl border border-border bg-[#fafbfd] p-5"><summary className="cursor-pointer font-semibold">查看已盘点的 25 份课程课件</summary><p className="mt-2 text-xs leading-5 text-muted-foreground">这里只展示文件名用于章节对齐，不在公开网站转载学校课件文件。</p><div className="mt-4 flex flex-wrap gap-2">{audit.files.map((file) => <span key={file} className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-[#44566e]">{file}</span>)}</div></details>}
  </div>;
}

function ChapterReviewView({ course, onTopic }: { course: (typeof COURSES)[number]; onTopic: (topic: string) => void }) {
  if (course.id !== "data-structures") {
    return <div><div className="rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-5"><h3 className="font-serif-cn text-lg font-semibold">{course.short} · 章节总览</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">先用章节卡片建立全局框架，再进入知识导图查看每一点的详细解析。</p></div><div className="mt-4 grid gap-3 md:grid-cols-2">{course.chapters.map((chapter, index) => <button key={chapter.title} onClick={() => onTopic(chapter.topics[0])} className="rounded-2xl border border-border bg-white p-4 text-left transition hover:border-[#8da3bf] hover:bg-[#fafbfd]"><span className="text-xs font-bold text-[#526f94]">第 {index + 1} 章</span><h3 className="mt-1 font-semibold">{chapter.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{chapter.topics.join(" · ")}</p></button>)}</div></div>;
  }

  const stages = ["基础工具", "核心结构", "算法方法"] as const;
  return <div>
    <div className="rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#526f94]">教材导航</p><h3 className="mt-2 font-serif-cn text-xl font-semibold">21 章先看全局，再逐点深入</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">以下是按前置关系整理的学习层级，不代表老师划定的考试权重。点击任意章节卡片，可从该章第一个知识点开始学习。</p></div>
    {stages.map((stage) => <section key={stage} className="mt-7"><div className="flex items-center gap-3"><span className="h-px flex-1 bg-border" /><h3 className="shrink-0 font-serif-cn text-lg font-semibold">{stage}</h3><span className="h-px flex-1 bg-border" /></div><div className="mt-4 grid gap-3 lg:grid-cols-2">{DATA_STRUCTURE_REVIEWS.map((review, index) => ({ review, index })).filter(({ review }) => review.stage === stage).map(({ review, index }) => { const chapter = course.chapters[index]; return <button key={chapter.title} onClick={() => onTopic(chapter.topics[0])} className="group rounded-2xl border border-border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#8ea4c0] hover:shadow-[0_10px_24px_rgba(31,53,88,.07)]"><div className="flex items-start justify-between gap-3"><div><span className="text-xs font-bold text-[#526f94]">{String(index + 1).padStart(2, "0")} · {review.stage}</span><h4 className="mt-1 font-semibold">{chapter.title.replace(/^第\d+章\s*/, "")}</h4></div><ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" /></div><p className="mt-3 text-sm leading-6 text-[#44566e]">{review.goal}</p><div className="mt-3 flex flex-wrap gap-2">{review.focus.map((item) => <span key={item} className="rounded-lg bg-[#edf2f8] px-2.5 py-1 text-xs text-[#4f6f98]">{item}</span>)}</div><p className="mt-3 border-t border-border/70 pt-3 text-xs leading-5 text-muted-foreground"><b className="text-foreground">学完自检：</b>{review.checkpoint}</p><p className="mt-2 text-[11px] text-muted-foreground/80">{chapter.source}</p></button>; })}</div></section>)}
    <section className="mt-8"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#526f94]">选型速查</p><h3 className="mt-1 font-serif-cn text-xl font-semibold">核心结构与算法对比</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">重点不是背名称，而是根据访问方式、顺序要求和问题性质做选择。</p></div><div className="mt-4 grid gap-3 lg:grid-cols-2">{DATA_STRUCTURE_COMPARISONS.map((item) => <article key={item.title} className="rounded-2xl border border-border bg-[#fafbfd] p-4"><h4 className="font-semibold text-[#2d4c73]">{item.title}</h4><dl className="mt-3 space-y-2 text-sm leading-6"><div><dt className="inline font-semibold">本质：</dt><dd className="inline text-muted-foreground">{item.basis}</dd></div><div><dt className="inline font-semibold">选择：</dt><dd className="inline text-muted-foreground">{item.choose}</dd></div><div className="rounded-xl bg-[#fff6ed] px-3 py-2 text-[#715b49]"><dt className="inline font-semibold">易错：</dt><dd className="inline">{item.trap}</dd></div></dl></article>)}</div></section>
  </div>;
}

function MapView({ courseId, selectedTopic, mastery, onCourse, onTopic, onMastery, onAsk }: { courseId: CourseId; selectedTopic: string; mastery: Record<string, number>; onCourse: (id: CourseId) => void; onTopic: (topic: string) => void; onMastery: (level: number) => void; onAsk: (topic: string) => void }) {
  const course = COURSES.find((item) => item.id === courseId)!;
  const level = mastery[masteryKey(courseId, selectedTopic)] ?? 0;
  const detail = getTopicDetail(course, selectedTopic);
  const chapterIndex = course.chapters.findIndex((chapter) => chapter.topics.includes(selectedTopic));
  const selectedChapter = course.chapters[Math.max(0, chapterIndex)];
  const topicIndex = selectedChapter.topics.indexOf(selectedTopic);
  const chapterDetails = selectedChapter.topics.map((topic) => ({ topic, detail: getTopicDetail(course, topic) }));
  const previousTopic = topicIndex > 0 ? selectedChapter.topics[topicIndex - 1] : undefined;
  const nextTopic = topicIndex < selectedChapter.topics.length - 1 ? selectedChapter.topics[topicIndex + 1] : undefined;
  const masteredCount = course.chapters.flatMap((chapter) => chapter.topics).filter((topic) => (mastery[masteryKey(courseId, topic)] ?? 0) > 0).length;
  const totalCount = course.chapters.flatMap((chapter) => chapter.topics).length;

  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-medium text-[#526f94]">每一点都已准备好详解与导图</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">{course.name} · 知识体系</h1><p className="mt-2 text-sm text-muted-foreground">已掌握 {masteredCount}/{totalCount} 个知识点 · 点击任意知识点开始学习</p></div>
      <Select value={courseId} onValueChange={(value) => { const next = COURSES.find((item) => item.id === value)!; onCourse(next.id); onTopic(next.chapters[0].topics[0]); }}><SelectTrigger className="w-full rounded-xl bg-white sm:w-52"><SelectValue /></SelectTrigger><SelectContent>{COURSES.map((item) => <SelectItem key={item.id} value={item.id}>{item.short}</SelectItem>)}</SelectContent></Select>
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)]">
      <Surface className="h-fit overflow-hidden p-5 sm:p-7 xl:sticky xl:top-24">
        <div className="mx-auto w-fit rounded-2xl bg-[#1f3558] px-6 py-4 text-center text-white shadow-lg"><BrainCircuit className="mx-auto mb-2 size-5 text-[#e6b84f]" /><p className="font-serif-cn text-lg font-semibold">{course.short}</p></div>
        <div className="mx-auto h-8 w-px bg-[#aabbb3]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">{course.chapters.map((chapter, chapterIndex) => <article key={chapter.title} className="rounded-2xl border border-border bg-[#fafbfd] p-4"><div className="flex items-center gap-2"><span className="text-xs font-bold text-[#355f91]">{String(chapterIndex + 1).padStart(2, "0")}</span><h3 className="font-semibold">{chapter.title}</h3></div><div className="mt-3 space-y-2">{chapter.topics.map((topic) => { const checked = (mastery[masteryKey(courseId, topic)] ?? 0) > 0; return <button key={topic} onClick={() => onTopic(topic)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${selectedTopic === topic ? "border-[#355f91] bg-[#e7eef8] text-[#2d4c73]" : "border-border bg-white hover:border-[#9badc3]"}`}><span>{topic}</span>{checked ? <CheckCircle2 className="size-4 text-[#4f8a68]" /> : <span className="size-3.5 rounded-full border border-[#c8d1dc]" />}</button>; })}</div></article>)}</div>
      </Surface>
      <Surface className="min-w-0 overflow-hidden">
        <div className="border-b border-border bg-[#f6f8fb] p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{selectedChapter.title} · 第 {topicIndex + 1}/{selectedChapter.topics.length} 小点</p><h2 className="mt-2 font-serif-cn text-2xl font-semibold sm:text-3xl">{selectedTopic}</h2><p className="mt-3 text-[15px] leading-7 text-[#44566e]">{detail.summary}</p></div><label className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${level ? "border-[#7f9dbf] bg-[#e7eef8] text-[#355f91]" : "border-border bg-white"}`}><Checkbox checked={level > 0} onCheckedChange={(checked) => onMastery(checked ? 1 : 0)} /><span>{level ? "已掌握" : "学完后勾选"}</span></label></div><div className="mt-5 flex items-center justify-between gap-3"><Button variant="outline" size="sm" disabled={!previousTopic} onClick={() => previousTopic && onTopic(previousTopic)} className="rounded-lg"><ArrowLeft className="size-3.5" />上一小点</Button><Button variant="outline" size="sm" disabled={!nextTopic} onClick={() => nextTopic && onTopic(nextTopic)} className="rounded-lg">下一小点<ArrowRight className="size-3.5" /></Button></div></div>
        <article className="p-5 sm:p-7">
          <section className="rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-4 sm:p-5"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#526f94]">本章学习全景</p><h3 className="mt-1 font-serif-cn text-xl font-semibold">{selectedChapter.title}的全部 {selectedChapter.topics.length} 个知识小点</h3></div>{selectedChapter.source && <span className="text-xs text-muted-foreground">{selectedChapter.source}</span>}</div><p className="mt-2 text-sm leading-6 text-muted-foreground">每张卡片先给出核心含义和关键规律；点击后，下方会切换为该小点的完整定义、原理、C++ 实现、复杂度、应用、易错点和思维导图。</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{chapterDetails.map(({ topic, detail: topicDetail }, index) => { const checked = (mastery[masteryKey(courseId, topic)] ?? 0) > 0; const active = topic === selectedTopic; return <button key={topic} onClick={() => onTopic(topic)} className={`rounded-xl border p-3 text-left transition ${active ? "border-[#355f91] bg-white shadow-sm" : "border-[#d9e2ed] bg-white/70 hover:border-[#8ea4c0]"}`}><div className="flex items-start justify-between gap-2"><span className="text-xs font-bold text-[#526f94]">{String(index + 1).padStart(2, "0")}</span>{checked && <CheckCircle2 className="size-4 shrink-0 text-[#4f8a68]" />}</div><h4 className="mt-1 text-sm font-semibold">{topic}</h4><p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{topicDetail.summary}</p><span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#355f91]">{active ? "正在阅读完整解析" : "查看完整解析"}<ChevronRight className="size-3" /></span></button>; })}</div></section>
          <div className="my-7 flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">当前小点深度讲解</span><span className="h-px flex-1 bg-border" /></div>
          <section><h3 className="font-serif-cn text-xl font-semibold">{detail.sections[0].heading}</h3><p className="mt-2 whitespace-pre-wrap text-[15px] leading-8 text-[#44566e]">{detail.sections[0].content}</p></section>
          <div className="mt-7 rounded-2xl border border-[#d9e2ed] bg-[#f7f9fc] p-4 sm:p-5"><div className="flex items-center gap-2"><Waypoints className="size-4 text-[#355f91]" /><h3 className="font-semibold">{selectedTopic} · 思维导图</h3></div><div className="mt-4 flex flex-col items-center"><div className="rounded-xl bg-[#1f3558] px-4 py-2.5 text-center text-sm font-semibold text-white">{selectedTopic}</div><div className="h-5 w-px bg-[#a9b9cc]" /><div className="grid w-full gap-3 sm:grid-cols-2">{detail.mindMap?.map((branch) => <div key={branch.label} className="rounded-xl border border-[#d9e2ed] bg-white p-3"><p className="text-sm font-semibold text-[#355f91]">{branch.label}</p>{branch.items.map((item) => <p key={item} className="mt-2 text-xs leading-5 text-muted-foreground">{item}</p>)}</div>)}</div></div></div>
          <div className="mt-7 space-y-7">{detail.sections.slice(1).map((section) => <section key={section.heading}><h3 className="font-serif-cn text-xl font-semibold">{section.heading}</h3><p className="mt-2 whitespace-pre-wrap text-[15px] leading-8 text-[#44566e]">{section.content}</p></section>)}</div>
          <div className="mt-7 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl bg-[#f1f4f8] p-5"><h3 className="flex items-center gap-2 font-semibold"><Target className="size-4 text-[#355f91]" />需要记住</h3><ul className="mt-3 space-y-2">{detail.keyPoints.map((point) => <li key={point} className="flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-[#4f8a68]" />{point}</li>)}</ul></div><div className="rounded-2xl bg-[#fff6ed] p-5"><h3 className="font-semibold text-[#84552f]">易错提醒</h3><p className="mt-3 text-sm leading-6 text-[#715b49]">{detail.mistake}</p></div></div>
          <details className="mt-5 rounded-2xl border border-[#ded8bc] bg-[#faf8ef] p-5"><summary className="cursor-pointer font-semibold">可选自测 · 只保留一道</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{detail.exercise}</p><details className="mt-3"><summary className="cursor-pointer text-sm font-medium text-[#75652f]">查看参考答案</summary><p className="mt-2 rounded-xl bg-white/70 p-3 text-sm leading-6">{detail.answer}</p></details></details>
          <Button onClick={() => onAsk(selectedTopic)} variant="outline" className="mt-5 w-full rounded-xl"><Sparkles className="size-4" />继续向学习助手追问这个知识点</Button>
        </article>
      </Surface>
    </div>
  </div>;
}

function AssistantView({ courseId, question, answer, loading, onCourse, onQuestion, onAsk }: { courseId: CourseId; question: string; answer: DetailedAnswer; loading: boolean; onCourse: (id: CourseId) => void; onQuestion: (value: string) => void; onAsk: (prompt: string) => void }) {
  const course = COURSES.find((item) => item.id === courseId)!;
  return <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]"><aside className="space-y-4"><Surface className="p-4"><p className="text-sm font-semibold">选择课程</p><div className="mt-3 space-y-1.5">{COURSES.map((item) => { const Icon = iconMap[item.id]; return <button key={item.id} onClick={() => onCourse(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${courseId === item.id ? "bg-[#e7eef8] font-medium text-[#355f91]" : "hover:bg-muted"}`}><Icon className="size-4" />{item.short}</button>; })}</div></Surface><Surface className="p-4"><p className="text-sm font-semibold">可以这样问</p><div className="mt-3 space-y-2">{course.quickQuestions.map((item) => <button key={item} onClick={() => onAsk(item)} className="w-full rounded-xl border border-border bg-[#fafbfd] p-3 text-left text-xs leading-5 text-muted-foreground transition hover:border-[#8ea4c0] hover:text-foreground">{item}</button>)}</div></Surface></aside>
    <div className="min-w-0"><div className="mb-5"><p className="text-sm font-medium text-[#526f94]">详细模式 · 已开启</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">问清楚，也学明白</h1></div><Surface className="overflow-hidden"><div className="border-b border-border bg-[#f6f8fb] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#1f3558] text-[#e6b84f]"><Sparkles className="size-[18px]" /></span><div><p className="text-sm font-semibold">知序学习助手</p><p className="text-xs text-muted-foreground">{answer.course} · 深度讲解</p></div></div></div>
      <article className={`px-5 py-6 transition sm:px-8 sm:py-8 ${loading ? "opacity-45" : ""}`}><div className="rounded-2xl border-l-4 border-[#355f91] bg-[#edf3fa] p-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#526f94]">核心结论</p><h2 className="mt-2 font-serif-cn text-2xl font-semibold">{answer.title}</h2><p className="mt-3 text-[15px] leading-7 text-[#334a67]">{answer.summary}</p></div><div className="mt-7 space-y-7">{answer.sections.map((section) => <section key={section.heading}><h3 className="font-serif-cn text-lg font-semibold">{section.heading}</h3><p className="mt-2 whitespace-pre-wrap text-[15px] leading-8 text-[#44566e]">{section.content}</p></section>)}</div><div className="mt-7 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl bg-[#f1f4f8] p-5"><h3 className="flex items-center gap-2 font-semibold"><Target className="size-4 text-[#355f91]" />需要记住</h3><ul className="mt-3 space-y-2">{answer.keyPoints.map((point) => <li key={point} className="flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-[#4f8a68]" />{point}</li>)}</ul></div><div className="rounded-2xl bg-[#fff6ed] p-5"><h3 className="font-semibold text-[#84552f]">易错提醒</h3><p className="mt-3 text-sm leading-6 text-[#715b49]">{answer.mistake}</p></div></div><div className="mt-4 rounded-2xl border border-[#ded8bc] bg-[#faf8ef] p-5"><h3 className="font-semibold">检验一下</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{answer.exercise}</p><details className="mt-3"><summary className="cursor-pointer text-sm font-medium text-[#75652f]">查看答案</summary><p className="mt-2 rounded-xl bg-white/70 p-3 text-sm leading-6">{answer.answer}</p></details></div></article>
      <form onSubmit={(event) => { event.preventDefault(); onAsk(question); }} className="sticky bottom-20 border-t border-border bg-white p-4 sm:bottom-0 sm:p-5"><div className="flex items-end gap-2 rounded-2xl border border-[#cbd5e2] bg-white p-2 shadow-sm focus-within:ring-3 focus-within:ring-[#7694b8]/20"><Textarea value={question} onChange={(event) => onQuestion(event.target.value)} placeholder="继续追问，例如：请逐步推导，并再举一个例子" className="min-h-12 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0" /><Button type="submit" disabled={loading} className="size-11 shrink-0 rounded-xl bg-[#355f91] p-0" aria-label="发送问题"><Send className="size-4" /></Button></div></form>
    </Surface></div></div>;
}

function PlanView({ tasks, masteredCount, onToggle, onAdd }: { tasks: Task[]; masteredCount: number; onToggle: (task: Task) => void; onAdd: () => void }) {
  const days = ["一", "二", "三", "四", "五", "六", "日"];
  return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#526f94]">按照节奏完成，而不是堆积任务</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">本周学习计划</h1></div><Button onClick={onAdd} className="w-fit rounded-xl bg-[#355f91]"><Plus className="size-4" />添加任务</Button></div><div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-3">{days.map((day, index) => <div key={day} className={`rounded-xl border py-3 text-center ${index === 6 ? "border-[#355f91] bg-[#e7eef8]" : "border-border bg-white"}`}><p className="text-[11px] text-muted-foreground">周{day}</p><p className="mt-1 text-sm font-semibold">{7 + index}</p>{index === 6 && <span className="mx-auto mt-1.5 block size-1.5 rounded-full bg-[#355f91]" />}</div>)}</div><div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><Surface className="p-5 sm:p-6"><SectionHeading eyebrow="今日" title="今日安排" /><TaskList tasks={tasks} onToggle={onToggle} /></Surface><div className="space-y-5"><Surface className="p-5"><p className="text-sm font-semibold">本周目标</p><div className="mt-5 space-y-4">{[{label:"完成任务",value:`${tasks.filter((task) => task.completed).length}/${Math.max(tasks.length, 1)}`,progress: tasks.length ? tasks.filter((task) => task.completed).length / tasks.length * 100 : 0},{label:"专注时长",value:"0/8 小时",progress:0},{label:"掌握知识点",value:`${masteredCount}/84`,progress:masteredCount / 84 * 100}].map((item) => <div key={item.label}><div className="flex justify-between text-xs"><span className="text-muted-foreground">{item.label}</span><b>{item.value}</b></div><Progress value={item.progress} className="mt-2 h-1.5 [&>div]:bg-[#355f91]" /></div>)}</div></Surface><Surface className="bg-[#1f3558] p-5 text-white"><CalendarDays className="size-5 text-[#e6b84f]" /><h3 className="mt-3 font-serif-cn text-lg font-semibold">按自己的节奏学习</h3><p className="mt-2 text-sm leading-6 text-white/60">任务与掌握状态会按当前设备独立保存，不会与其他访客混在一起。</p></Surface></div></div></div>;
}

function LibraryView({ resources, uploadCourse, uploading, fileInputRef, onCourse, onUpload, onOpen }: { resources: ResourceItem[]; uploadCourse: CourseId; uploading: boolean; fileInputRef: React.RefObject<HTMLInputElement | null>; onCourse: (id: CourseId) => void; onUpload: (event: FormEvent<HTMLFormElement>) => void; onOpen: (item: ResourceItem) => void }) {
  return <div><div><p className="text-sm font-medium text-[#526f94]">先筛选，再把资料变成可以学习的内容</p><h1 className="mt-1 font-serif-cn text-3xl font-semibold">我的资料库</h1></div><div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-5"><a href={cloudUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[22px] bg-[#1f3558] p-5 text-white shadow-[0_18px_45px_rgba(31,53,88,.14)] transition hover:bg-[#29466f]"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-[#e6b84f]"><Cloud className="size-6" /></span><div><p className="font-semibold">山大云盘 · 计科学术部</p><p className="mt-1 text-sm text-white/55">只把资料作为整理依据，不在公开网站转载原文件</p></div></div><ArrowRight className="size-5" /></a><Surface className="p-5 sm:p-6"><SectionHeading eyebrow="资料审查" title="五门课程处理进度" /><div className="mt-5 grid gap-3 sm:grid-cols-2">{COURSE_MATERIAL_AUDITS.map((audit) => { const course = COURSES.find((item) => item.id === audit.courseId)!; return <article key={audit.courseId} className="rounded-2xl border border-border bg-[#fafbfd] p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{course.short}</h3><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${audit.status === "已完成目录盘点" ? "bg-[#e8f0fa] text-[#3e628f]" : "bg-[#f1eee5] text-[#76663c]"}`}>{audit.status}</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{audit.primarySource}</p></article>; })}</div></Surface><Surface className="p-5 sm:p-6"><SectionHeading eyebrow="我的文件" title="当前设备的资料" /><div className="mt-5 space-y-3">{resources.length ? resources.map((item) => <button type="button" key={item.id} onClick={() => onOpen(item)} className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:border-[#8ea4c0]"><span className="grid size-10 place-items-center rounded-xl bg-[#edf2f8] text-[#355f91]"><FileText className="size-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{COURSES.find((course) => course.id === item.courseId)?.short || "课程资料"} · {(item.size / 1024 / 1024).toFixed(1)} 兆字节 · 点击下载</p></div></button>) : <div className="rounded-2xl border border-dashed border-[#b7c4d4] bg-[#f6f8fb] p-10 text-center"><Library className="mx-auto size-7 text-[#526f94]" /><p className="mt-3 font-semibold">还没有上传资料</p><p className="mt-1 text-sm text-muted-foreground">上传后会按照课程自动归档。</p></div>}</div></Surface></div><Surface className="h-fit p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e7eef8] text-[#355f91]"><Upload className="size-5" /></span><div><h2 className="font-semibold">上传课程资料</h2><p className="text-xs text-muted-foreground">便携文档、演示文稿、文字文档或图片</p></div></div><form onSubmit={onUpload} className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-medium">所属课程</label><Select value={uploadCourse} onValueChange={(value) => onCourse(value as CourseId)}><SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{COURSES.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><div><label className="mb-2 block text-sm font-medium">选择文件</label><Input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.md,.txt,.png,.jpg,.jpeg" className="h-auto rounded-xl py-2.5" /></div><p className="text-xs leading-5 text-muted-foreground">文件与学习进度按当前设备独立保存，单个文件最大 20 兆字节。</p><Button disabled={uploading} className="w-full rounded-xl bg-[#355f91]"><Paperclip className="size-4" />{uploading ? "正在保存…" : "保存到资料库"}</Button></form></Surface></div></div>;
}

function MobileNav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-white/95 px-2 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="手机端导航">{navItems.map(({ id, mobile, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={`flex min-w-0 flex-col items-center gap-1.5 py-1 text-[11px] ${view === id ? "font-semibold text-[#355f91]" : "text-muted-foreground"}`}><Icon className="size-5" /><span className="truncate">{mobile}</span></button>)}</nav>;
}

function TaskDialog({ open, title, course, onOpen, onTitle, onCourse, onSubmit }: { open: boolean; title: string; course: CourseId; onOpen: (open: boolean) => void; onTitle: (title: string) => void; onCourse: (course: CourseId) => void; onSubmit: (event: FormEvent) => void }) {
  return <Dialog open={open} onOpenChange={onOpen}><DialogContent className="rounded-[22px] sm:max-w-[460px]"><DialogHeader><DialogTitle className="font-serif-cn text-2xl">添加学习任务</DialogTitle><DialogDescription>为今天安排一个具体、可完成的小目标。</DialogDescription></DialogHeader><form onSubmit={onSubmit} className="mt-2 space-y-4"><div><label className="mb-2 block text-sm font-medium" htmlFor="task-title">任务内容</label><Input id="task-title" value={title} onChange={(event) => onTitle(event.target.value)} placeholder="例如：完成二叉树层序遍历" className="h-11 rounded-xl" autoFocus /></div><div><label className="mb-2 block text-sm font-medium">所属课程</label><Select value={course} onValueChange={(value) => onCourse(value as CourseId)}><SelectTrigger className="h-11 w-full rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{COURSES.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><Button type="submit" className="h-11 w-full rounded-xl bg-[#355f91]">保存任务</Button></form></DialogContent></Dialog>;
}
