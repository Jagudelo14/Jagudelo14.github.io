import { useState, useRef, useEffect } from "react";
import zeldaImg from "../imports/image.png";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AudioPlayerProps {
  label: string;
  accentColor: string;
  transcript: string;
  src: string; // ruta al archivo de audio en /public
}

// ─── Custom Audio Player (con audio real) ─────────────────────────────────────
function AudioPlayer({ label, accentColor, transcript, src }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    });
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div>
      <div
        className="flex items-center gap-4 mb-0 p-4 border-4 border-black"
        style={{ background: accentColor, boxShadow: "4px 4px 0px 0px #000" }}
      >
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 flex-shrink-0 border-4 border-black bg-black text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Barra de progreso + tiempos */}
        <div className="flex-1">
          <div className="font-mono text-xs font-bold text-black mb-2 uppercase tracking-widest">
            {label}
          </div>
          {/* Barra clickeable */}
          <div
            className="relative w-full h-3 border-2 border-black bg-white cursor-pointer"
            onClick={seek}
          >
            <div
              className="h-full bg-black transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs mt-1 text-black font-bold">
            <span>{fmt(currentTime)}</span>
            <span>{duration ? fmt(duration) : "--:--"}</span>
          </div>
        </div>

        {/* Barras decorativas */}
        <div className="hidden sm:flex items-end gap-[2px] h-10">
          {[4, 8, 12, 6, 14, 10, 5, 13, 7, 11, 3, 9].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-black"
              style={{ height: `${h}px`, opacity: playing ? 0.9 : 0.35 }}
            />
          ))}
        </div>
      </div>

      {/* Botón de transcripción */}
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className="w-full font-mono text-xs font-bold uppercase tracking-widest border-4 border-t-0 border-black px-4 py-2 bg-white hover:bg-black hover:text-white transition-colors text-left"
      >
        {showTranscript ? "▲ Hide Transcript" : "▼ Show Transcript"}
      </button>

      {showTranscript && (
        <div className="border-4 border-t-0 border-black bg-white p-5">
          <div className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3 border-b-2 border-black pb-2">
            // TRANSCRIPT — Verbatim
          </div>
          <p
            className="text-sm leading-relaxed text-gray-800 italic"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Scroll suave a sección ───────────────────────────────────────────────────
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ══ HEADER ══ */}
      <header className="border-b-4 border-black px-6 md:px-12 pt-8 pb-0 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="relative">
            <div
              className="font-mono text-xs uppercase tracking-[0.3em] text-black mb-2 border-2 border-black inline-block px-3 py-1"
              style={{ background: "#ffe600" }}
            >
              English Portfolio · B1 Level · SENA Group 3186662
            </div>
            <h1
              className="text-[clamp(3.5rem,12vw,9rem)] font-black leading-none text-black uppercase"
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.03em",
                lineHeight: "0.9",
              }}
            >
              Thinking
              <br />
              <span
                className="inline-block"
                style={{
                  WebkitTextStroke: "3px #0a0a0a",
                  color: "transparent",
                  fontStyle: "italic",
                }}
              >
                Out Loud
              </span>
            </h1>
          </div>

          {/* Navegación — scroll a secciones */}
          <nav className="flex flex-col gap-2 md:text-right pb-4">
            <div className="font-mono text-xs uppercase tracking-widest text-gray-500">
              A personal blog by
            </div>
            <div
              className="font-mono text-sm font-bold uppercase tracking-widest border-4 border-black px-4 py-2 inline-block"
              style={{ background: "#ff2d2d", color: "#fff", boxShadow: "4px 4px 0px #000" }}
            >
              Juan Agudelo
            </div>
            <div className="font-mono text-xs text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
              {[
                { label: "Audio", target: "section-audio" },
                { label: "Essays", target: "section-essays" },
                { label: "Code", target: "section-code" },
                { label: "Gaming", target: "section-gaming" },
              ].map(({ label, target }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(target)}
                  className="border-b-2 border-black hover:text-black hover:border-red-500 transition-colors font-mono text-xs uppercase tracking-widest cursor-pointer bg-transparent"
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main className="px-4 md:px-10 py-8 max-w-7xl mx-auto">

        {/* ── ROW 1: Sección 1 + 2 — AUDIO ── */}
        <div
          id="section-audio"
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0 border-4 border-black scroll-mt-8"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          {/* ─── SECTION 1: Mapping the Horizon ─── */}
          <section className="p-7 border-b-4 lg:border-b-0 lg:border-r-4 border-black" style={{ background: "#faf7f0" }}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black"
                style={{ background: "#ffe600" }}
              >
                Audio Entry #01
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                Career Path & Future Adventures
              </div>
            </div>

            <h2
              className="text-4xl md:text-5xl font-black text-black mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mapping the
              <br />
              <span className="italic" style={{ color: "#ff2d2d" }}>Horizon</span>
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-md leading-relaxed">
              From Chemical Engineering to RPA development — talking about my academic journey, my decision to move into the innovation area, and my plans to keep growing in software engineering and artificial intelligence.
            </p>

            {/*
              Coloca tu archivo de audio en:  public/audios/audio1.mp3
              Luego cambia src a:             "/audios/audio1.mp3"
            */}
            <AudioPlayer
              label="▶ Audio: Career Path"
              accentColor="#ffe600"
              src="/audios/audio1.mp3"
              transcript="Hello, my name is Juan Agudelo, my instructor's name is Luis Javier Ardila Espino. This activity is called audio about career path. I am a student at SENA in the program software analysis and development group 3186662. I graduated as a chemical engineer two years ago. Two and a half years ago I started working as automation developer at Net Applications. One year ago I began studying software analysis and development at the SENA. I expect to finish the program at the end of this year and complete my practical stage with an employment contract. After that, I plan to study systems engineering and later a master degree related to management. In my professional experience, I have learned that technology changes very fast, so adaptability is very important. If a developer learns new technologies, they improve their opportunities and professional growth. Six months ago, my company offered me two options: move to innovation area or become a technical leader. I decided to move to the innovation area because I prefer creating solutions and working with new technologies instead of leading teams. Now I am learning about artificial intelligence and its implementations in software engineering. If I continue studying AI, I improving my skills and I will have better opportunities in the future. Sometimes I think that if I had chosen the technical leader position, I would have developed more leadership skills. However, I believe that the innovation area matches my personality and professional goals better. I also believe flexibility is essential in modern jobs. When processes change, employees must adapt quickly and learn continuously. In my case, adapting to new tools and technologies has helped me to grow professional. In about two years, I hope to change jobs and continue improving my career in software engineering. Thank you for listening."
            />

            <div className="mt-5 border-t-4 border-black pt-4">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">// Career Timeline</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { year: "~2023", event: "Chemical Engineering graduate" },
                  { year: "~2022", event: "Started as Automation Developer" },
                  { year: "2024", event: "Joined SENA — Software Analysis" },
                  { year: "2025", event: "Moved to Innovation Area + AI" },
                ].map((m) => (
                  <div key={m.year} className="border-2 border-black p-2" style={{ background: "#ffe60033" }}>
                    <div className="font-mono text-xs font-bold text-black">{m.year}</div>
                    <div className="font-mono text-xs text-gray-600 mt-0.5">{m.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── SECTION 2: The Professional Code ─── */}
          <section className="p-7 flex flex-col" style={{ background: "#0a0a0a" }}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-white"
                style={{ background: "#1a6bff", color: "#fff" }}
              >
                Audio Entry #02
              </div>
            </div>

            <h2
              className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The
              <br />
              <span className="italic" style={{ color: "#ffe600" }}>Professional</span>
              <br />
              Code
            </h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              My beliefs about work ethics, obligations in the software industry, and how I balance being a full-time developer while studying at the same time.
            </p>

            {/*
              Coloca tu archivo de audio en:  public/audios/audio2.mp3
              Luego cambia src a:             "/audios/audio2.mp3"
            */}
            <AudioPlayer
              label="▶ Audio: Attitudes & Obligations"
              accentColor="#1a6bff"
              src="/audios/audio2.mp3"
              transcript="Good morning, I am Juan Agudelo. My instructor is Luis Javier Ardila Espino. I am a student at software analysis and development program of the SENA group 3186662 and this activity is called attitudes, belief and obligations. I currently work as automation developer at Net Applications and I also study software analysis and development at SENA. In my academic and professional life, I believe responsibility, discipline and adaptability are essential abilities to grow professionally. At work, I have to adapt to new technologies because the software industry changes constantly and if I don't adapt to this change I going to go to be out of the industry. I have to learn new tools and improve my technical knowledge regularly and I must deliver reports and software developments of the established dates. I must pay attention to details and follow company processes correctly is a part very important of my work and I also must maintain good communication with my coworkers and supervisors to work efficiently as a team. In my academic life, I have to study regularly and practice programming skills every week, this work for the academic life and my work. I have to complete assignments, projects and activities on time and I must be organized with my schedule because I work and study at the same time. I must participate actively in my classes and continue improving my English and technical skills. I believe I am a software developers should be flexible and willing to learn continuously and professionals must be responsible, respectful and committed to their goals. They should listen to their teammates, solve problems professionally and maintain a positive attitude in difficult situations. Thank you for listening to me."
            />

            <div className="mt-5 border-t-2 border-gray-700 pt-4">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">// Core Beliefs</div>
              {[
                { icon: "→", text: "Responsibility & discipline every day" },
                { icon: "→", text: "Adapt fast or fall behind" },
                { icon: "→", text: "Team communication is non-negotiable" },
                { icon: "→", text: "Balance: work + study + growth" },
              ].map((v) => (
                <div key={v.text} className="flex gap-3 items-start mb-2">
                  <span className="font-mono font-bold flex-shrink-0 text-sm" style={{ color: "#ffe600" }}>
                    {v.icon}
                  </span>
                  <span className="text-sm text-gray-300">{v.text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── ROW 2: Section 3 + 4 — ESSAYS ── */}
        <div id="section-essays" className="scroll-mt-8">

          {/* Sección 3 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-0">
            <div
              className="hidden md:flex items-center justify-center border-4 border-black border-r-0 py-10"
              style={{ background: "#ffe600", boxShadow: "-8px 8px 0px 0px #000", minHeight: "320px" }}
            >
              <div
                className="text-black font-black uppercase text-4xl"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.1em",
                }}
              >
                ESSAY
              </div>
            </div>

            <section
              className="border-4 border-black p-7 md:p-10"
              style={{ background: "#faf7f0", boxShadow: "8px 8px 0px 0px #000" }}
            >
              <div
                className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black inline-block mb-4"
                style={{ background: "#ff2d2d", color: "#fff" }}
              >
                Opinion Piece · Media Literacy
              </div>

              <h2
                className="text-4xl md:text-6xl font-black text-black mb-6 leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Navigating
                <br />
                the{" "}
                <span className="italic underline decoration-4 decoration-[#ff2d2d]">
                  Algorithmic
                </span>
                <br />
                Era
              </h2>

              <div
                className="border-l-8 pl-5 mb-6 py-2"
                style={{ borderLeftColor: "#ff2d2d" }}
              >
                <p
                  className="text-xl md:text-2xl font-bold italic text-black leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "Not everything that we see on the internet is true, and we need to learn how to tell the difference."
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed text-gray-800">
                <div>
                  <p className="mb-4">
                    We live in a time when information comes to us very fast, from many different places. Social media, news websites, videos, podcasts — every day we receive so much content that it is hard to know what is real and what is not.
                  </p>
                  <p>
                    I think that media literacy — the ability to understand and think critically about what we read and see — is one of the most important skills for people today. Without it, it is very easy to believe false information, especially when it looks professional or comes from someone we trust.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    Algorithms on social platforms are designed to show us content that we already agree with. This creates a "bubble" where we only see one point of view. I have experienced this myself — sometimes I notice that my feed only shows certain types of news, and I have to actively search for other opinions.
                  </p>
                  <p>
                    My advice is simple: before sharing something, ask yourself where it came from, who wrote it, and why. Check more than one source. Think before you click.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t-4 border-black pt-4 font-mono text-xs uppercase tracking-widest text-gray-500 flex gap-6">
                <span>Critical Thinking</span>
                <span>·</span>
                <span>Digital Literacy</span>
                <span>·</span>
                <span>Opinion</span>
              </div>
            </section>
          </div>

          {/* Sección 4 */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8">
            <div className="relative">
              <div
                className="absolute inset-0 border-4 border-black translate-x-3 translate-y-3"
                style={{ background: "#ff2d2d", zIndex: 0 }}
              />
              <section
                className="relative border-4 border-black p-7"
                style={{ background: "#faf7f0", zIndex: 1 }}
              >
                <div
                  className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black inline-block mb-4"
                  style={{ background: "#0a0a0a", color: "#fff" }}
                >
                  Opinion · Crime & Justice
                </div>

                <h2
                  className="text-3xl md:text-4xl font-black text-black mb-4 leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Justice in
                  <br />
                  the{" "}
                  <span className="italic" style={{ color: "#ff2d2d" }}>Digital Age</span>
                </h2>

                <p className="text-sm leading-relaxed text-gray-800 mb-4">
                  I believe that the main purpose of a prison system should be to help people change, not only to punish them. When someone commits a crime, yes, there must be consequences. But if we only punish, and we don't give people the opportunity to learn and improve, then we are not really solving the problem.
                </p>
                <p className="text-sm leading-relaxed text-gray-800 mb-4">
                  In the digital age, new crimes have appeared — like hacking, identity theft, and online fraud. These crimes are different because they don't always use physical violence, but they can cause a lot of damage to real people's lives. I think the laws need to adapt more quickly to these new realities.
                </p>
                <p className="text-sm leading-relaxed text-gray-800">
                  It is also important to talk about equality in justice. Not everyone has the same access to good lawyers or fair treatment. I think this is a serious problem that we need to fix if we want a justice system that is truly fair for everyone.
                </p>

                <div
                  className="mt-6 p-3 border-2 border-black font-mono text-xs"
                  style={{ background: "#ffe600" }}
                >
                  <span className="font-bold uppercase">My stance:</span> Rehabilitation &gt; Pure punishment. Adapt laws to digital crime.
                </div>
              </section>
            </div>

            {/* ─── SECTION 5: Terminal ─── */}
            <section
              id="section-code"
              className="border-4 border-black scroll-mt-8"
              style={{ background: "#0f0f0f", boxShadow: "8px 8px 0px 0px #ffe600" }}
            >
              <div
                className="border-b-4 border-black px-5 py-3 flex items-center gap-3"
                style={{ background: "#1a1a1a" }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 border border-red-700" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700" />
                <div className="ml-4 font-mono text-xs uppercase tracking-widest" style={{ color: "#ffe600" }}>
                  ~/career/rpa-developer — zsh
                </div>
              </div>

              <div className="p-7 grid md:grid-cols-[1fr_auto] gap-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#1a6bff" }}>
                    // Entry — The Architect's Journey
                  </div>
                  <h2
                    className="text-3xl font-black mb-5 leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#f5f0e8" }}
                  >
                    <span style={{ color: "#ffe600" }}>python</span>{" "}
                    <span className="italic" style={{ color: "#fff" }}>build_career()</span>
                  </h2>

                  <div className="font-mono text-sm leading-relaxed space-y-3" style={{ color: "#a0a0a0" }}>
                    <p>
                      <span style={{ color: "#1a6bff" }}>$ </span>
                      <span style={{ color: "#fff" }}>My journey into technology started a few years ago</span>, when I discovered that I could use code to make repetitive tasks much faster and easier.
                    </p>
                    <p>
                      <span style={{ color: "#1a6bff" }}>$ </span>
                      I began learning Python almost by accident — I needed to automate a report at work, and someone told me that Python was the best tool for that. They were right. I fell in love with it immediately.
                    </p>
                    <p>
                      <span style={{ color: "#1a6bff" }}>$ </span>
                      Today, as a Semi-senior RPA Developer, I use{" "}
                      <span style={{ color: "#ffe600" }}>Automation Anywhere</span> every day to create bots that handle complex business processes. I also write Python scripts to manage{" "}
                      <span style={{ color: "#ff2d2d" }}>SQL databases</span>, do{" "}
                      <span style={{ color: "#4ade80" }}>web scraping</span>, and connect different systems together.
                    </p>
                    <p>
                      <span style={{ color: "#1a6bff" }}>$ </span>
                      The most exciting part right now is exploring{" "}
                      <span style={{ color: "#c084fc" }}>AI agents with LangChain</span>. I am learning how to build systems that can think and make decisions automatically.
                    </p>
                    <p style={{ color: "#4ade80" }}>
                      <span style={{ color: "#1a6bff" }}>$ </span>
                      [SUCCESS] Career.run() — still building.
                    </p>
                  </div>
                </div>

                <div
                  className="border-2 border-gray-700 p-4 font-mono text-xs min-w-[200px] self-start mt-8"
                  style={{ background: "#1a1a1a" }}
                >
                  <div className="text-gray-500 mb-3 uppercase tracking-widest text-[10px]">// snippet.py</div>
                  <pre style={{ color: "#f5f0e8", lineHeight: "1.7" }}>
                    <span style={{ color: "#c084fc" }}>from</span>{" langchain import\n"}
                    {"  Agent, Tool\n\n"}
                    <span style={{ color: "#c084fc" }}>def</span>{" "}
                    <span style={{ color: "#4ade80" }}>run_bot</span>{"(task):\n"}
                    {"  agent = "}
                    <span style={{ color: "#ffe600" }}>Agent</span>{"(\n"}
                    {"    tools=tools,\n"}
                    {"    llm=llm\n  )\n"}
                    {"  "}
                    <span style={{ color: "#c084fc" }}>return</span>{" agent\n    .run(task)\n\n"}
                    <span style={{ color: "#4ade80" }}># SQL + scraping</span>
                    {"\n"}
                    <span style={{ color: "#4ade80" }}># every day 🤖</span>
                  </pre>

                  <div className="border-t border-gray-700 mt-4 pt-3 text-gray-500 text-[10px] uppercase tracking-widest">Stack</div>
                  {[
                    { label: "Python", fill: 90, color: "#ffe600" },
                    { label: "AA Bots", fill: 80, color: "#1a6bff" },
                    { label: "SQL", fill: 75, color: "#4ade80" },
                    { label: "LangChain", fill: 40, color: "#c084fc" },
                  ].map((s) => (
                    <div key={s.label} className="mt-2">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span style={{ color: s.color }}>{s.label}</span>
                        <span className="text-gray-500">{s.fill}%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-800">
                        <div className="h-full" style={{ width: `${s.fill}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── ROW 4: Section 6 — GAMING ── */}
        <div className="mt-8 mb-8" id="section-gaming">
          <section
            className="border-4 border-black p-7 md:p-10 relative overflow-hidden scroll-mt-8"
            style={{ background: "#1a0533", boxShadow: "8px 8px 0px 0px #ffe600" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-white"
                style={{ background: "#ffe600", color: "#0a0a0a" }}
              >
                Personal Entry #06
              </div>
              <div className="font-mono text-xs text-gray-400 uppercase tracking-widest">Beyond the Screen</div>
            </div>

            <h2
              className="text-4xl md:text-6xl font-black text-white mb-8 leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Beyond the{" "}
              <span className="italic" style={{ color: "#ffe600" }}>Screen</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Zelda hero card */}
              <div className="relative md:col-span-2 z-10">
                <div
                  className="border-4 border-white p-6"
                  style={{
                    background: "linear-gradient(135deg, #2d1b69 0%, #1a0533 100%)",
                    boxShadow: "6px 6px 0px 0px #ffe600",
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5 mb-4">
                    <div
                      className="flex-shrink-0 border-4 border-white overflow-hidden"
                      style={{
                        width: "140px",
                        height: "140px",
                        background: "#0a0033",
                        boxShadow: "4px 4px 0px 0px #ffe600",
                      }}
                    >
                      <img
                        src={zeldaImg}
                        alt="The Legend of Zelda: Ocarina of Time — shield and Master Sword logo"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="font-mono text-xs uppercase tracking-widest text-yellow-400 mb-1">
                        LEGENDARY SERIES — ALL TIME FAVORITE
                      </div>
                      <h3
                        className="text-2xl font-black text-white leading-tight mb-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        The Legend of Zelda
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        I started playing Zelda when I was very young — maybe 7 or 8 years old. I remember sitting in front of the TV for hours, trying to solve puzzles and find the right way through the dungeons. Those moments felt like real adventures to me.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    Even now, when I play a new Zelda game, I feel the same magic that I felt as a child. There is something special about the world of Zelda. The music, the exploration, the mystery — it always makes me feel like I am discovering something wonderful. It is more than a game for me. It is a big part of who I am.
                  </p>

                  <div className="grid grid-cols-3 gap-3 border-t-2 border-gray-600 pt-4">
                    {[
                      { label: "Titles Played", val: "8+" },
                      { label: "Hours", val: "500+" },
                      { label: "Since", val: "Childhood" },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="font-mono font-black text-xl mb-1" style={{ color: "#ffe600" }}>{s.val}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MMORPG + YGO */}
              <div className="flex flex-col gap-0 z-0 md:-ml-1">
                <div
                  className="border-4 border-white p-5 flex-1"
                  style={{ background: "#0d3b1a", boxShadow: "4px 4px 0px 0px #4ade80" }}
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-green-400 mb-2">⚔ MMORPG</div>
                  <h3
                    className="text-xl font-black text-white mb-3 leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Crunching the Numbers
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    One of my favorite things in MMORPGs is calculating damage, critical hit rates, and optimal builds before a big fight. It feels very similar to my work — analyzing data to find the best solution. I love when math and adventure come together.
                  </p>
                  <div className="mt-3 space-y-1 font-mono text-[10px]">
                    {[{ stat: "ATK", val: 87 }, { stat: "DEF", val: 64 }, { stat: "CRIT", val: 73 }].map((s) => (
                      <div key={s.stat} className="flex items-center gap-2">
                        <span className="text-green-400 w-8">{s.stat}</span>
                        <div className="flex-1 h-1.5 bg-gray-800">
                          <div className="h-full bg-green-400" style={{ width: `${s.val}%` }} />
                        </div>
                        <span className="text-gray-500">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="border-4 border-white border-t-0 p-5 flex-1"
                  style={{ background: "#3b1a00", boxShadow: "4px 4px 0px 0px #f97316" }}
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-orange-400 mb-2">🃏 Yu-Gi-Oh!</div>
                  <h3
                    className="text-xl font-black text-white mb-3 leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Building the Perfect Deck
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    I love the strategy of building a deck in Yu-Gi-Oh. Deciding which cards to include, how to create combinations, and how to predict what the other player will do — it is like solving a puzzle every single time.
                  </p>
                  <div
                    className="mt-3 border border-orange-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "#f97316" }}
                  >
                    ★★★★★ — Blue-Eyes main enjoyer
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="border-t-4 border-black" style={{ background: "#0a0a0a" }}>
        <div
          className="border-b-4 border-black px-8 md:px-12 py-4"
          style={{ background: "#ffe600" }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-black">
              Evidence Record
            </div>
            {[
              { label: "Student", value: "Juan Agudelo" },
              { label: "Ficha", value: "3186662" },
              { label: "Date", value: "July 1, 2026" },
              { label: "Evidence", value: "GA4-240202501-AA1-EV03" },
              { label: "Instructor", value: "Luis Javier Ardila Espino" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-black opacity-60">{item.label}:</span>
                <span className="font-mono text-xs font-bold text-black border-b-2 border-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 md:px-12 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <div
                className="font-black text-2xl text-white mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Thinking Out Loud
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                English B1 Portfolio Blog · SENA Software Analysis & Development
              </div>
            </div>
            <div
              className="font-mono text-xs border-4 border-white px-4 py-2"
              style={{ background: "#ff2d2d", color: "#fff", boxShadow: "4px 4px 0px #ffe600" }}
            >
              Juan Agudelo · 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
