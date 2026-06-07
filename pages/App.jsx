import { BrowserRouter, NavLink, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState, useRef } from "react";

// ==================== DATA ARTIKEL ====================
const ALL_ARTICLES = [
  {
    id: 1,
    category: "Teknologi",
    title: "Meta Rilis Llama 4: Era Baru AI Open-Source Dimulai",
    excerpt: "Meta mengumumkan Llama 4 dengan kemampuan multimodal yang menjanjikan akses lebih luas bagi developer.",
    author: "Rizky Pratama",
    date: "3 Jun 2026",
    readTime: "4 menit",
    image: "/META AI.jpg",
    featured: true,
    views: 48200,
    hot: true,
  },
  {
    id: 2,
    category: "Ekonomi",
    title: "Rupiah Menguat ke Level Rp15.200 per Dolar AS",
    excerpt: "Nilai tukar rupiah menguat seiring membaiknya sentimen global dan kebijakan moneter yang stabil.",
    author: "Sari Dewi",
    date: "3 Jun 2026",
    readTime: "3 menit",
    image: "/Dollars.jpg",
    featured: false,
    views: 31500,
    hot: false,
  },
  {
    id: 3,
    category: "Olahraga",
    title: "Timnas Indonesia Lolos ke Semifinal Piala Asia 2026",
    excerpt: "Skuad Garuda tampil heroik dan memastikan satu tempat di semifinal lewat adu penalti dramatis.",
    author: "Budi Santoso",
    date: "2 Jun 2026",
    readTime: "5 menit",
    image: "/Badminton.jpg",
    featured: true,
    views: 92700,
    hot: true,
  },
  {
    id: 4,
    category: "Teknologi",
    title: "Startup Fintech Jakarta Raih Pendanaan Seri B $50 Juta",
    excerpt: "Startup pembayaran digital mendapatkan modal besar untuk mempercepat ekspansi regional.",
    author: "Tika Rahayu",
    date: "2 Jun 2026",
    readTime: "3 menit",
    image: "/Teknologi.jpg",
    featured: false,
    views: 24100,
    hot: false,
  },
  {
    id: 5,
    category: "Kesehatan",
    title: "WHO Rilis Panduan Baru Kesehatan Mental di Era Digital",
    excerpt: "WHO mengingatkan pentingnya manajemen screen time dan dukungan psikologis untuk generasi muda.",
    author: "Dr. Anita Wijaya",
    date: "1 Jun 2026",
    readTime: "6 menit",
    image: "/Brain.jpg",
    featured: false,
    views: 38900,
    hot: true,
  },
  {
    id: 6,
    category: "Lingkungan",
    title: "Indonesia Target Nol Emisi Karbon Lebih Awal dari Jadwal",
    excerpt: "Pemerintah mempercepat program energi terbarukan demi target net zero emission 2055.",
    author: "Fahmi Hakim",
    date: "1 Jun 2026",
    readTime: "4 menit",
    image: "/Sunset.jpg",
    featured: false,
    views: 19400,
    hot: false,
  },
  {
    id: 7,
    category: "Ekonomi",
    title: "Bank Indonesia Pertahankan Suku Bunga 5,75% di Juni 2026",
    excerpt: "BI mempertahankan suku bunga dalam upaya menjaga inflasi tetap stabil sesuai target.",
    author: "Dian Puspita",
    date: "31 Mei 2026",
    readTime: "3 menit",
    image: "/TREDING.jpg",
    featured: false,
    views: 27300,
    hot: false,
  },
  {
    id: 8,
    category: "Olahraga",
    title: "Kevin/Marcus Juarai Turnamen BWF World Tour Finals",
    excerpt: "Dua atlet ganda putra Indonesia kembali membawa pulang gelar dunia prestise.",
    author: "Agung Setiawan",
    date: "31 Mei 2026",
    readTime: "4 menit",
    image: "/SepakBola.jpg",
    featured: false,
    views: 55600,
    hot: true,
  },
];

const CATEGORIES = ["Semua", "Teknologi", "Ekonomi", "Olahraga", "Kesehatan", "Lingkungan"];
const FALLBACK_IMAGE = "/TREDING.jpg";

// ==================== CONTEXT ====================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

function fallbackImage(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
}

function formatViews(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "rb";
  return n.toString();
}

// ==================== SHARED COMPONENTS ====================
function Badge({ category }) {
  const colors = {
    Teknologi: "bg-blue-100 text-blue-700",
    Ekonomi: "bg-emerald-100 text-emerald-700",
    Olahraga: "bg-orange-100 text-orange-700",
    Kesehatan: "bg-rose-100 text-rose-700",
    Lingkungan: "bg-teal-100 text-teal-700",
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colors[category] || "bg-slate-100 text-slate-700"}`}>
      {category}
    </span>
  );
}

function ArticleMeta({ author, date, readTime }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span>{author}</span> <span>·</span> <span>{date}</span> <span>·</span> <span>{readTime} baca</span>
    </div>
  );
}

function BookmarkButton({ id }) {
  const { bookmarks, toggleBookmark } = useApp();
  const saved = bookmarks.includes(id);
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggleBookmark(id); }}
      className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-2xl transition-all rounded-full hover:scale-110 z-10 ${saved ? "text-amber-500" : "text-white drop-shadow-lg"}`}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}

// ==================== HEADER ====================
function Header() {
  const { bookmarks } = useApp();
  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-3xl">K</div>
          <div>
            <p className="font-bold text-2xl tracking-tight">Kabar</p>
            <p className="text-xs text-slate-500 -mt-1">Berita Terbaru</p>
          </div>
        </NavLink>
        <nav className="flex gap-2">
          <NavLink to="/" end className={({ isActive }) => `px-6 py-3 rounded-full font-medium transition ${isActive ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Beranda</NavLink>
          <NavLink to="/service" className={({ isActive }) => `px-6 py-3 rounded-full font-medium transition ${isActive ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Service</NavLink>
          <NavLink to="/bookmarks" className={({ isActive }) => `px-6 py-3 rounded-full font-medium transition ${isActive ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Tersimpan</NavLink>
        </nav>
        <div className="bg-amber-100 text-amber-700 text-sm font-semibold px-5 py-2.5 rounded-full">
          {bookmarks.length} tersimpan
        </div>
      </div>
    </header>
  );
}

// ==================== CARD & SIDEBAR ====================
function ArticleCard({ article, onSelect }) {
  return (
    <article onClick={() => onSelect(article)} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all cursor-pointer">
      <div className="relative h-56">
        <img src={article.image} alt={article.title} onError={fallbackImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <BookmarkButton id={article.id} />
      </div>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <Badge category={article.category} />
          <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
        </div>
        <h3 className="font-semibold text-lg leading-tight line-clamp-3 group-hover:text-amber-600">{article.title}</h3>
        <p className="mt-3 text-slate-600 text-sm line-clamp-3">{article.excerpt}</p>
      </div>
    </article>
  );
}

function TrendingList({ items, onSelect }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-7 sticky top-24">
      <p className="text-amber-600 text-sm font-semibold tracking-widest">TRENDING</p>
      <h3 className="text-2xl font-bold mt-1">Top Berita</h3>
      <div className="mt-6 space-y-5">
        {items.map((article, i) => (
          <button key={article.id} onClick={() => onSelect(article)} className="group flex gap-5 w-full text-left hover:bg-slate-50 p-3 -mx-3 rounded-2xl transition">
            <span className="text-4xl font-bold text-slate-200 group-hover:text-amber-300 w-10">{i + 1}</span>
            <div>
              <p className="font-medium leading-tight line-clamp-2 group-hover:text-amber-600">{article.title}</p>
              <p className="text-xs text-slate-500 mt-2">{article.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ trending, onSelect }) {
  return (
    <aside className="space-y-8">
      <TrendingList items={trending} onSelect={onSelect} />
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7">
        <p className="text-slate-500 font-medium">REKOMENDASI</p>
        <h3 className="font-bold mt-1">Judul Pilihan</h3>
        <p className="text-slate-600 mt-4 text-sm">Simak berita terbaru setiap hari dari kategori favoritmu.</p>
      </div>
    </aside>
  );
}

// ==================== POPULAR NEWS SECTION ====================
function PopularNewsSection({ articles, onSelect }) {
  const [activeTab, setActiveTab] = useState("views");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const sorted = [...articles].sort((a, b) =>
    activeTab === "views" ? b.views - a.views : (b.featured === a.featured ? 0 : b.featured ? 1 : -1)
  ).slice(0, 6);

  const topArticle = sorted[0];
  const restArticles = sorted.slice(1);

  const rankColors = [
    "from-amber-500 to-orange-500",
    "from-slate-400 to-slate-500",
    "from-amber-700 to-amber-800",
    "from-slate-300 to-slate-400",
    "from-slate-300 to-slate-400",
  ];

  return (
    <section
      ref={sectionRef}
      className="mt-20 mb-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Section Header */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl opacity-10" />
        <div className="relative bg-white border border-amber-200 rounded-3xl px-10 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Animated fire icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ boxShadow: "0 0 24px rgba(245,158,11,0.4)" }}>
                <span className="text-3xl" style={{ filter: "drop-shadow(0 0 6px rgba(255,200,0,0.8))" }}>🔥</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">Sorotan Utama</p>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mt-1 leading-tight">
                Berita Terpopuler
              </h2>
              <p className="text-slate-500 text-sm mt-1">Diperbarui setiap jam · berdasarkan pembaca aktif</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("views")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "views" ? "bg-amber-500 text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
            >
              👁 Terbanyak Dilihat
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "featured" ? "bg-amber-500 text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
            >
              ⭐ Pilihan Editor
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Hero Card — #1 */}
        {topArticle && (
          <div
            className="lg:col-span-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <article
              onClick={() => onSelect(topArticle)}
              className="group relative h-full min-h-80 rounded-3xl overflow-hidden cursor-pointer"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.18)" }}
            >
              <img
                src={topArticle.image}
                alt={topArticle.title}
                onError={fallbackImage}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Rank badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <span>🏆</span> <span>#1 TERPOPULER</span>
                </div>
                {topArticle.hot && (
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    🔥 HOT
                  </div>
                )}
              </div>
              <BookmarkButton id={topArticle.id} />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <Badge category={topArticle.category} />
                <h3 className="text-white text-2xl font-bold mt-3 leading-tight group-hover:text-amber-300 transition-colors line-clamp-3">
                  {topArticle.title}
                </h3>
                <p className="text-white/70 text-sm mt-2 line-clamp-2">{topArticle.excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-white/60 text-sm">{topArticle.author} · {topArticle.date}</div>
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-xs">👁</span>
                    <span className="text-white text-xs font-bold">{formatViews(topArticle.views)}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Right column: ranked list */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {restArticles.map((article, idx) => (
            <article
              key={article.id}
              onClick={() => onSelect(article)}
              className="group flex gap-4 bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-amber-300 transition-all"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(40px)",
                transition: `opacity 0.5s ease ${0.15 + idx * 0.08}s, transform 0.5s ease ${0.15 + idx * 0.08}s`,
              }}
            >
              {/* Rank number */}
              <div className={`w-14 flex-shrink-0 bg-gradient-to-b ${rankColors[idx] || "from-slate-200 to-slate-300"} flex items-center justify-center`}>
                <span className="text-white font-black text-2xl">#{idx + 2}</span>
              </div>

              {/* Thumbnail */}
              <div className="w-24 flex-shrink-0 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  onError={fallbackImage}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.hot && (
                  <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">🔥</div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 py-3 pr-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge category={article.category} />
                  </div>
                  <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {article.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">{article.date}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>👁</span>
                    <span className="font-semibold text-slate-600">{formatViews(article.views)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl px-8 py-6 flex flex-wrap gap-8 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-slate-300 text-sm font-medium">Pembaca aktif sekarang</span>
        </div>
        <div className="flex flex-wrap gap-6">
          {sorted.slice(0, 4).map((a, i) => (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className="flex items-center gap-2 group"
            >
              <span className="text-amber-400 font-black text-sm">#{i + 1}</span>
              <span className="text-slate-400 text-xs group-hover:text-white transition-colors line-clamp-1 max-w-32">{a.title}</span>
              <span className="text-slate-500 text-xs">· {formatViews(a.views)}</span>
            </button>
          ))}
        </div>
        <div className="text-slate-500 text-xs">Data diperbarui: {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</div>
      </div>
    </section>
  );
}

// ==================== PAGES ====================
function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-xl w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari berita..."
        className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-3xl px-6 py-4 outline-none"
      />
      {value && <button onClick={() => onChange("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-slate-400">×</button>}
    </div>
  );
}

function CategoryTabs({ activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-6 py-3 rounded-3xl text-sm font-medium transition ${cat === activeCategory ? "bg-amber-500 text-white" : "bg-white border border-slate-200 hover:bg-slate-50"}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setArticles(ALL_ARTICLES), 400);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchCat = category === "Semua" || article.category === category;
    const q = search.toLowerCase().trim();
    const matchSearch = !q || article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q);
    const matchFeatured = !featuredOnly || article.featured;
    return matchCat && matchSearch && matchFeatured;
  });

  const trendingArticles = articles.slice(0, 5);
  const handleSelect = (article) => navigate(`/article/${article.id}`);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-12 md:p-16 mb-12">
        <p className="uppercase tracking-widest text-amber-200 text-sm">KabarID</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">Berita terbaru, cepat, dan terpercaya</h1>
        <p className="mt-6 text-lg text-amber-100">Pantau perkembangan penting setiap hari.</p>
        <div className="mt-8 flex gap-4">
          <button onClick={() => navigate("/bookmarks")} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold">Lihat Tersimpan</button>
          <button onClick={() => setFeaturedOnly(!featuredOnly)} className="border border-white/40 px-8 py-4 rounded-2xl">{featuredOnly ? "Tampilkan Semua" : "Hanya Featured"}</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs activeCategory={category} onChange={setCategory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <main className="lg:col-span-8">
          <div className="flex justify-between mb-8">
            <div>
              <p className="text-amber-600 text-sm font-semibold">LIPUTAN UTAMA</p>
              <h2 className="text-3xl font-bold">Berita Terbaru</h2>
            </div>
            <span className="text-slate-500">{filteredArticles.length} artikel</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map(a => <ArticleCard key={a.id} article={a} onSelect={handleSelect} />)}
          </div>
        </main>
        <div className="lg:col-span-4">
          <Sidebar trending={trendingArticles} onSelect={handleSelect} />
        </div>
      </div>

      {/* ====== POPULAR NEWS SECTION ====== */}
      {articles.length > 0 && (
        <PopularNewsSection articles={articles} onSelect={handleSelect} />
      )}
    </div>
  );
}

function ServicePage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold">Service KabarID</h1>
      <p className="mt-4 text-lg">Fitur lengkap untuk pengalaman membaca berita terbaik.</p>
      <button onClick={() => navigate("/")} className="mt-10 bg-amber-500 text-white px-8 py-4 rounded-2xl">Kembali ke Beranda</button>
    </div>
  );
}

function BookmarksPage() {
  const { bookmarks } = useApp();
  const navigate = useNavigate();
  const saved = ALL_ARTICLES.filter(a => bookmarks.includes(a.id));
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Artikel Tersimpan</h1>
        <button onClick={() => navigate("/")} className="bg-amber-500 text-white px-8 py-4 rounded-2xl">Kembali</button>
      </div>
      {saved.length === 0 ? (
        <p className="text-center text-xl py-20">Belum ada artikel tersimpan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {saved.map(a => <ArticleCard key={a.id} article={a} onSelect={() => navigate(`/article/${a.id}`)} />)}
        </div>
      )}
    </div>
  );
}

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useApp();
  const article = ALL_ARTICLES.find(a => String(a.id) === id);
  const saved = bookmarks.includes(article?.id);
  if (!article) return <div className="text-center py-20 text-2xl">Artikel tidak ditemukan</div>;
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-amber-600 mb-6">← Kembali</button>
      <div className="bg-white rounded-3xl p-10">
        <Badge category={article.category} />
        <h1 className="text-4xl font-bold mt-6 leading-tight">{article.title}</h1>
        <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
        <img src={article.image} alt="" onError={fallbackImage} className="my-10 rounded-2xl w-full" />
        <div className="prose prose-lg">
          <p>{article.excerpt}</p>
          <p>Berita ini terus berkembang seiring banyaknya pihak yang menyampaikan tanggapan dan analisis mendalam.</p>
        </div>
        <button onClick={() => toggleBookmark(article.id)} className={`mt-10 px-8 py-4 rounded-2xl ${saved ? "bg-red-500" : "bg-amber-500"} text-white`}>
          {saved ? "Hapus Bookmark" : "Simpan Bookmark"}
        </button>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold">Halaman Tidak Ditemukan</h2>
      <NavLink to="/" className="mt-6 inline-block bg-amber-500 text-white px-8 py-4 rounded-2xl">Kembali ke Beranda</NavLink>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl z-50">{message}</div>;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Outlet />
      <footer className="py-10 text-center text-slate-500 text-sm">
        © 2026 KabarID — Berita Terpercaya Indonesia
      </footer>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem("kabarid_bookmarks") || "[]"));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("kabarid_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const isSaved = prev.includes(id);
      setToast(isSaved ? "Bookmark dihapus" : "Artikel disimpan");
      return isSaved ? prev.filter(i => i !== id) : [...prev, id];
    });
  };

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ bookmarks, toggleBookmark }}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="service" element={<ServicePage />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            <Route path="article/:id" element={<ArticleDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AppContext.Provider>
    </BrowserRouter>
  );
}