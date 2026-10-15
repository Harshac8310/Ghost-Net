
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileClock,
  FileImage,
  FilePlus2,
  LayoutDashboard,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import "./App.css";
import DamageMap from "./components/DamageMap";

const sampleReports = [
  {
    id: "GHOST-001",
    location: "College Main Road",
    date: "15 Oct 2026",
    damage: "Possible pothole",
    status: "Pending review",
    color: "amber",
    latitude: 12.9716,
  longitude: 77.5946,
  isDemo: true,
  },
  {
    id: "GHOST-002",
    location: "East Junction",
    date: "14 Oct 2026",
    damage: "Possible road crack",
    status: "Verified",
    color: "green",
    latitude: 12.9751,
  longitude: 77.6012,
  isDemo: true,
  },
  {
    id: "GHOST-003",
    location: "Market Street",
    date: "14 Oct 2026",
    damage: "Analysis uncertain",
    status: "Needs inspection",
    color: "blue",
    latitude: 12.9650,
  longitude: 77.5845,
  isDemo: true,
  },
  {
    id: "GHOST-004",
    location: "North Avenue",
    date: "13 Oct 2026",
    damage: "No damage detected",
    status: "Dismissed",
    color: "red",
    latitude: 12.9810,
  longitude: 77.5900,
  isDemo: true,
  },
];


function RoadScene() {
  return (
    <div className="fallback-road-scene">
      <div className="fallback-road-horizon" />

      <div className="fallback-road-surface">
        <div className="fallback-road-edge left" />
        <div className="fallback-road-edge right" />

        <div className="fallback-road-center">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="fallback-road-ring ring-purple" />
        <div className="fallback-road-ring ring-gold" />
      </div>

      <div className="fallback-road-label">
        <span className="live-indicator" />
        ROAD VISUALIZATION
      </div>
    </div>
  );
}



function SplashRoadScene() {
  return (
    <>
      <color attach="background" args={["#070914"]} />
      <fog attach="fog" args={["#070914", 10, 28]} />

      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#738cff", "#160814", 1.1]} />
      <pointLight position={[-4, 3, 0]} color="#B99AFF" intensity={30} distance={18} />
<pointLight position={[4, 4, -5]} color="#E8DDFF" intensity={25} distance={18} />
<pointLight position={[0, 3, -9]} color="#E4BD78" intensity={32} distance={18} />
      <Stars radius={40} depth={28} count={750} factor={3} fade speed={0.5} />
      <Sparkles count={120} scale={[18, 5, 28]} size={2} speed={0.35} color="#ffbf76" />

      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.43, -9]}>
        <planeGeometry args={[9, 38]} />
        <meshStandardMaterial color="#11121b" metalness={0.45} roughness={0.36} />
      </mesh>

      {/* Wet neon road reflections */}
      {[-4.35, 4.35].map((x) => (
        <mesh key={x} position={[x, -0.4, -9]}>
          <boxGeometry args={[0.055, 0.035, 38]} />
          <meshStandardMaterial
  color="#B99AFF"
  emissive="#9972F0"
  emissiveIntensity={2.5}
/>
        </mesh>
      ))}

      {/* Golden road markings */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[0, -0.39, 6 - i * 2.05]}>
          <boxGeometry args={[0.105, 0.018, 0.95]} />
          <meshStandardMaterial
            color="#ffc66e"
            emissive="#e99a31"
            emissiveIntensity={2.6}
          />
        </mesh>
      ))}

      {/* Neon city buildings */}
      {Array.from({ length: 13 }, (_, i) => {
        const height = 1.5 + ((i * 7) % 5) * 0.65;
        const depth = 0.9 + (i % 3) * 0.35;
        const z = 3 - i * 2.3;

        return [-1, 1].map((side) => (
          <group key={`${side}-${i}`} position={[side * (6.4 + (i % 3) * 0.7), 0, z]}>
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[1.2 + (i % 2) * 0.5, height, depth]} />
              <meshStandardMaterial
                color={side === 1 ? "#B99AFF" : "#E4BD78"}
                metalness={0.55}
                roughness={0.4}
                emissive={side === 1 ? "#210b38" : "#260b1b"}
                emissiveIntensity={0.6}
              />
            </mesh>

            {Array.from({ length: Math.max(2, Math.floor(height * 2)) }, (_, j) => (
              <mesh key={j} position={[0, 0.45 + j * 0.45, depth / 2 + 0.012]}>
                <boxGeometry args={[0.56, 0.035, 0.02]} />
                <meshBasicMaterial
                  color={(i + j) % 3 === 0 ? "#bd91ff" : side === 1 ? "#ff315e" : "#ffc66e"}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        ));
      })}

      {/* Floating holographic road safety emblem */}
      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.22}>
        <group position={[0, 2.15, -5.2]}>
          <mesh rotation={[0, 0, 0.18]}>
            <torusGeometry args={[0.78, 0.045, 12, 100]} />
            <meshStandardMaterial
              color="#ffc66e"
              emissive="#f08b27"
              emissiveIntensity={3}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          <mesh rotation={[0.4, 0.2, -0.6]}>
            <torusGeometry args={[0.53, 0.055, 12, 100]} />
            <meshStandardMaterial
              color="#ff315e"
              emissive="#ed164d"
              emissiveIntensity={3.2}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>

          <mesh position={[0, 0, -0.08]}>
            <sphereGeometry args={[0.32, 24, 24]} />
            <meshStandardMaterial
              color="#171b32"
              emissive="#503078"
              emissiveIntensity={1.4}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
        </group>
      </Float>
    </>
  );
}

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 5200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-webgl">
        <Canvas
          camera={{ position: [0, 3.1, 8.5], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <SplashRoadScene />
        </Canvas>
      </div>

      <div className="splash-vignette" />
      <div className="splash-scanlines" />

      <div className="splash-topbar">
        <div className="splash-mini-brand">
          <div className="splash-mini-mark">
            <Activity size={24} />
          </div>
          <span>GHOST<span>NET</span></span>
        </div>
        <div className="splash-edition">CIVIC TECHNOLOGY <span> / </span> 001</div>
      </div>

      <div className="splash-side-note splash-note-left">
        <span>01 / DETECT</span>
        <span>02 / REPORT</span>
        <span>03 / TRACK</span>
        <span>04 / IMPROVE</span>
      </div>

      <div className="splash-side-note splash-note-right">
        <span>YOUR EYES</span>
        <span>ON THE ROAD</span>
        <span className="gold-text">A SAFER TOMORROW</span>
      </div>

      <div className="splash-content">
        <motion.div
          className="splash-emblem"
          initial={{ opacity: 0, scale: 0.65, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <div className="emblem-orbit orbit-one" />
          <div className="emblem-orbit orbit-two" />
          <ShieldCheck size={48} strokeWidth={1.25} />
        </motion.div>

        <motion.div
          className="splash-wordmark"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          GHOST<span>NET</span>
        </motion.div>

        <motion.p
          className="splash-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          AI-POWERED CIVIC ROAD DAMAGE REPORTING
        </motion.p>

        <motion.div
          className="splash-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          SAFER ROADS <span>•</span> STRONGER COMMUNITIES
        </motion.div>
      </div>

      <div className="splash-loader">
        <div className="splash-progress-track">
          <motion.div
            className="splash-progress-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
        <span className="splash-percent">INITIALIZING</span>
        <p>SCANNING THE ROAD TO A SAFER TOMORROW...</p>
        <div className="splash-version">G H O S T N E T&nbsp; / &nbsp;V E R S I O N&nbsp; 1 . 0</div>
      </div>
    </div>
  );
}


function StatusBadge({ status, color }) {
  return (
    <span className={`status-badge ${color}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState("");
  const [reports, setReports] = useState(sampleReports);
  const [filter, setFilter] = useState("All");
  const [showSplash, setShowSplash] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Submit report", icon: FilePlus2 },
    { name: "Report history", icon: FileClock },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      `${report.id} ${report.location} ${report.damage}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || report.status === filter;

    return matchesSearch && matchesFilter;
  });

  function submitDemoReport(event) {
    event.preventDefault();

    if (!image || !location.trim()) {
      setNotice("Choose a road image and enter its location.");
      return;
    }

    const newReport = {
      id: `DEMO-${String(reports.length + 1).padStart(3, "0")}`,
      location: location.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      damage: "Awaiting backend analysis",
      status: "Pending review",
      color: "amber",
      preview: image.preview,
    };

    setReports((previous) => [newReport, ...previous]);
    setNotice(
      "Demo report added locally. Backend upload and image analysis are not connected yet."
    );
    setImage(null);
    setLocation("");
    setDescription("");
  }

  function updateStatus(id, status) {
    const colors = {
      "Pending review": "amber",
      Verified: "green",
      Dismissed: "red",
      "Needs inspection": "blue",
      Resolved: "green",
    };

    setReports((previous) =>
      previous.map((report) =>
        report.id === id
          ? { ...report, status, color: colors[status] }
          : report
      )
    );
  }

  const counts = [
    {
      title: "Total reports",
      value: reports.length,
      icon: FileImage,
      tone: "red",
      trend: "All submitted records",
    },
    {
      title: "Pending review",
      value: reports.filter((r) => r.status === "Pending review").length,
      icon: Clock3,
      tone: "amber",
      trend: "Awaiting reviewer",
    },
    {
      title: "Verified",
      value: reports.filter((r) => r.status === "Verified").length,
      icon: ShieldCheck,
      tone: "green",
      trend: "Marked verified",
    },
    {
      title: "Resolved",
      value: reports.filter((r) => r.status === "Resolved").length,
      icon: CheckCircle2,
      tone: "blue",
      trend: "Recorded as resolved",
    },
  ];
  

  if (showSplash) {
  return <SplashScreen onComplete={() => setShowSplash(false)} />;
}

return (
  <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Activity size={23} />
          </div>
          <div>
            <div className="brand-name">GHOSTNET<span>.</span></div>
            <div className="brand-caption">CIVIC INTELLIGENCE</div>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav">
          {navItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                setNotice("");
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
              {page === name && <ChevronRight className="nav-chevron" size={16} />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-card">
            <span className="live-indicator" />
            <div>
              <strong>Monitoring workspace</strong>
              <p>Frontend preview mode</p>
            </div>
          </div>
          <div className="sidebar-footer">
            <span>GHOSTNET / MVP</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div className="breadcrumb">Workspace <span>/</span> {page}</div>
          </div>

          <div className="topbar-actions">
            <span className="environment-label">
              <span className="live-indicator" /> DEMO ENVIRONMENT
            </span>
            <button className="icon-button notification-button" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </button>
            <div className="avatar">GN</div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <motion.div
              className="notice-banner"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{notice}</span>
              <button
                className="icon-button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                <X size={17} />
              </button>
            </motion.div>
          )}

          {page === "Dashboard" && (
            <>
              <motion.section
                className="page-heading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> CIVIC ROAD INTELLIGENCE
                  </div>
                  <h1>Situation overview<span>.</span></h1>
                  <p>Monitor reports, inspect road conditions and track review progress.</p>
                </div>
                <button className="primary-button" onClick={() => setPage("Submit report")}>
                  <FilePlus2 size={17} /> New report
                </button>
              </motion.section>

              <section className="stats-grid">
                {counts.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.article
                      className="stat-card"
                      key={item.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                    >
                      <div className="stat-top">
                        <span className="stat-label">{item.title}</span>
                        <span className={`stat-icon ${item.tone}`}>
                          <Icon size={19} />
                        </span>
                      </div>
                      <div className="stat-value">{item.value.toString().padStart(2, "0")}</div>
                      <div className="stat-foot">{item.trend}</div>
                    </motion.article>
                  );
                })}
              </section>

              <section className="hero-panel">
                <div className="hero-copy">
                  <div className="hero-tag">
                    <span className="live-indicator" /> ROAD SURVEILLANCE SYSTEM
                  </div>
                  <h2>See the road.<br />Understand the <span>change.</span></h2>
                  <p>
                    One image at a time. Document road conditions,
                    review visual evidence and maintain an inspection history.
                  </p>
                  <button className="hero-button" onClick={() => setPage("Submit report")}>
                    Submit an inspection <ArrowUpRight size={17} />
                  </button>
                  <div className="hero-footnote">
                    <ShieldCheck size={15} /> Evidence-led reporting · Human review
                  </div>
                </div>

                <div className="hero-visual">
                  <div className="visual-label visual-label-top">
                    <span className="live-indicator" /> LIVE SCENE PREVIEW
                  </div>
                  <div className="scene-canvas">
                    <RoadScene />
                  </div>
                  <div className="scene-coordinate">
                    <MapPin size={13} /> VISUAL DEMONSTRATION · NOT LIVE ROAD DATA
                  </div>
                  <div className="scan-corner top-left" />
                  <div className="scan-corner top-right" />
                  <div className="scan-corner bottom-left" />
                  <div className="scan-corner bottom-right" />
                </div>
              </section>
              
<section className="map-panel">
  <div className="map-panel-heading">
    <div>
      <div className="eyebrow">
        <span className="eyebrow-line" />
        GEO-SPATIAL MONITOR
      </div>
      <h2>Road damage map</h2>
      <p>
        Explore report locations and inspect their coordinates.
      </p>
    </div>

    <span className="map-demo-chip">
      DEMO COORDINATES
    </span>
  </div>

  <DamageMap reports={reports} height={370} />
</section>

              <ReportTable
                reports={filteredReports.slice(0, 4)}
                search={search}
                setSearch={setSearch}
                onOpen={(report) => {
                  setPage("Report history");
                  setSearch(report.id);
                }}
                onStatus={updateStatus}
                compact
              />

              <div className="footer-note">
                <span>GHOSTNET CIVIC INFRASTRUCTURE MONITOR</span>
                <span>DEMO DATA · NOT LIVE MUNICIPAL RECORDS</span>
              </div>
            </>
          )}

          {page === "Submit report" && (
            <motion.section
              className="content-section"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="page-heading">
                <div>
                  <div className="eyebrow">FIELD OPERATIONS</div>
                  <h1>Submit a report<span>.</span></h1>
                  <p>Upload one current road photograph and identify the road section.</p>
                </div>
              </div>

              <form className="form-panel" onSubmit={submitDemoReport}>
                <div className="form-section-title">
                  <span className="section-number">01</span>
                  <div>
                    <h3>Inspection evidence</h3>
                    <p>Choose a clear image of the road condition.</p>
                  </div>
                </div>

                <label className="upload-zone">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;

                      if (file.size > 8 * 1024 * 1024) {
                        setNotice("Image must be smaller than 8 MB.");
                        event.target.value = "";
                        return;
                      }

                      const preview = URL.createObjectURL(file);
                      setImage({ file, preview });
                      setNotice("");
                    }}
                  />
                  {image ? (
                    <div className="image-preview">
                      <img src={image.preview} alt="Selected road inspection" />
                      <div>
                        <strong>{image.file.name}</strong>
                        <p>{(image.file.size / 1024 / 1024).toFixed(2)} MB · Image selected</p>
                        <span className="text-link">Choose another image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="upload-icon"><Upload size={23} /></span>
                      <strong>Drop your road image here</strong>
                      <span>or click to browse your device</span>
                      <small>JPG, PNG or WEBP · Maximum 8 MB</small>
                    </>
                  )}
                </label>

                <div className="form-section-title second-section">
                  <span className="section-number">02</span>
                  <div>
                    <h3>Location details</h3>
                    <p>Identify the road so inspections can be grouped correctly.</p>
                  </div>
                </div>

                <label className="field-label">
                  Road location / section <span>*</span>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Main Road, near college entrance"
                    required
                  />
                </label>
                
<div className="map-picker-block">
  <div className="map-picker-heading">
    <div>
      <h3>Pin the damaged road</h3>
      <p>
        Click the map at the location where the pothole,
        crack or road damage was observed.
      </p>
    </div>
  </div>

  <DamageMap
    reports={[]}
    selectable
    selectedPosition={selectedPosition}
    onLocationSelect={setSelectedPosition}
    height={320}
  />

  {selectedPosition ? (
    <div className="coordinate-readout">
      <span className="coordinate-indicator" />
      <div>
        <strong>Location selected</strong>
        <p>
          Latitude: {selectedPosition.latitude.toFixed(6)}
        </p>
        <p>
          Longitude: {selectedPosition.longitude.toFixed(6)}
        </p>
      </div>
    </div>
  ) : (
    <p className="map-selection-hint">
      Select a point on the map to obtain its coordinates.
    </p>
  )}
</div>


                <label className="field-label">
                  Description <span className="optional-label">OPTIONAL</span>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add any useful context about the observed road condition..."
                    rows={4}
                  />
                </label>

                <div className="form-warning">
                  <TriangleAlert size={17} />
                  <p>Analysis has not been connected yet. This prototype will save a local demo entry only.</p>
                </div>

                <button type="submit" className="primary-button form-submit">
                  <FilePlus2 size={17} /> Add demo report
                </button>
              </form>
            </motion.section>
          )}

          {page === "Report history" && (
            <motion.section
              className="content-section"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="page-heading">
                <div>
                  <div className="eyebrow">RECORDS & REVIEW</div>
                  <h1>Report history<span>.</span></h1>
                  <p>Browse report records and update review statuses in this local prototype.</p>
                </div>
                <button className="primary-button" onClick={() => setPage("Submit report")}>
                  <FilePlus2 size={17} /> New report
                </button>
              </div>

              <div className="filter-row">
                <label className="search-box">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search reports or locations..."
                  />
                </label>
                <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                  {[
                    "All",
                    "Pending review",
                    "Verified",
                    "Dismissed",
                    "Needs inspection",
                    "Resolved",
                  ].map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>

              <ReportTable
                reports={filteredReports}
                search={search}
                setSearch={setSearch}
                onOpen={(report) => setNotice(`${report.id}: ${report.damage}. Backend report details are not connected yet.`)}
                onStatus={updateStatus}
              />

              {filteredReports.length === 0 && (
                <div className="empty-state">
                  <FileClock size={28} />
                  <h3>No matching reports</h3>
                  <p>Try a different search or status filter.</p>
                </div>
              )}

              <div className="history-disclaimer">
                <TriangleAlert size={16} />
                Sample records are demonstration data. Status changes remain in frontend memory and are not saved to a backend.
              </div>
            </motion.section>
          )}
        </div>
      </main>
    </div>
  );
}

function ReportTable({
  reports,
  search,
  setSearch,
  onOpen,
  onStatus,
  compact = false,
})

{
  return (
    <section className="reports-panel">
      <div className="reports-header">
        <div>
          <div className="eyebrow">INSPECTION LOG</div>
          <h2>{compact ? "Recent reports" : "All reports"} <span className="report-count">{reports.length}</span></h2>
        </div>
        {compact ? (
          <button className="text-button" onClick={() => {
            setSearch("");
            onOpen({ id: "" });
          }}>
            View history <ChevronRight size={16} />
          </button>
        ) : (
          <span className="table-updated">LOCAL PREVIEW</span>
        )}
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>REPORT</th>
              <th>LOCATION</th>
              <th>ANALYSIS</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <div className="report-id">{report.id}</div>
                  <div className="report-date">{report.date}</div>
                </td>
                <td>
                  <div className="location-cell">
                    <MapPin size={14} /> {report.location}
                  </div>
                </td>
                <td>
                  <span className="damage-label">{report.damage}</span>
                </td>
                <td><StatusBadge status={report.status} color={report.color} /></td>
                <td>
                  <div className="row-actions">
                    <button className="view-button" onClick={() => onOpen(report)} title="View report">
                      View <ArrowUpRight size={14} />
                    </button>
                    {!compact && (
                      <select
                        aria-label={`Update status for ${report.id}`}
                        className="status-select"
                        value={report.status}
                        onChange={(event) => onStatus(report.id, event.target.value)}
                      >
                        {[
                          "Pending review",
                          "Verified",
                          "Dismissed",
                          "Needs inspection",
                          "Resolved",
                        ].map((status) => <option key={status}>{status}</option>)}
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan="5" className="empty-cell">No reports to display.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
