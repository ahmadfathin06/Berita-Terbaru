import { BrowserRouter, NavLink, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

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
  },
  {
    id: 2,
    category: "Ekonomi",
    title: "Rupiah Menguat ke Level Rp15.200 per Dolar AS",
    excerpt: "Nilai tukar rupiah menguat seiring membaiknya sentimen global dan kebijakan moneter yang stabil.",
    author: "Sari Dewi",
    date: "3 Jun 2026",
    readTime: "3 menit",
    image: "/TREDING.jpg",
    featured: false,
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
  },
  {
    id: 7,
    category: "Ekonomi",
    title: "Bank Indonesia Pertahankan Suku Bunga 5,75% di Juni 2026",
    excerpt: "BI mempertahankan suku bunga dalam upaya menjaga inflasi tetap stabil sesuai target.",
    author: "Dian Puspita",
    date: "31 Mei 2026",
    readTime: "3 menit",
    image: "/Dollar.jpg",
    featured: false,
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
  },
];

const CATEGORIES = ["Semua", "Teknologi", "Ekonomi", "Olahraga", "Kesehatan", "Lingkungan"];
const FALLBACK_IMAGE = "/TREDING.jpg"; // Gambar cadangan yang ada

// ==================== CONTEXT ====================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

function fallbackImage(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
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
      className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-2xl transition-all rounded-full hover:scale-110 z-10 ${saved ? 'text-amber-500' : 'text-white drop-shadow-lg'}`}
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
          <NavLink to="/" end className={({ isActive }) => `px-6 py-3 rounded-full font-medium transition ${isActive ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Beranda</NavLink>
          <NavLink to="/service" className={({ isActive }) => `px-6 py-3 rounded-full font-medium transition ${isActive ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Service</NavLink>
          <NavLink to="/bookmarks" className={({ isActive }) => `px-6 py-3 rounded-full font-medium transition ${isActive ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Tersimpan</NavLink>
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

// ==================== PAGES ====================
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
          <button onClick={() => navigate('/bookmarks')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold">Lihat Tersimpan</button>
          <button onClick={() => setFeaturedOnly(!featuredOnly)} className="border border-white/40 px-8 py-4 rounded-2xl"> {featuredOnly ? "Tampilkan Semua" : "Hanya Featured"} </button>
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
    </div>
  );
}

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
          className={`px-6 py-3 rounded-3xl text-sm font-medium transition ${cat === activeCategory ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ServicePage, BookmarksPage, ArticleDetail, NotFound, Toast, AppLayout tetap sama seperti sebelumnya
function ServicePage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold">Service KabarID</h1>
      <p className="mt-4 text-lg">Fitur lengkap untuk pengalaman membaca berita terbaik.</p>
      <button onClick={() => navigate('/')} className="mt-10 bg-amber-500 text-white px-8 py-4 rounded-2xl">Kembali ke Beranda</button>
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
        <button onClick={() => navigate('/')} className="bg-amber-500 text-white px-8 py-4 rounded-2xl">Kembali</button>
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
        <button onClick={() => toggleBookmark(article.id)} className={`mt-10 px-8 py-4 rounded-2xl ${saved ? 'bg-red-500' : 'bg-amber-500'} text-white`}>
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