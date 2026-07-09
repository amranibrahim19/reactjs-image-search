import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;
const CATEGORIES = ["food", "nature", "animals", "sports", "travel", "architecture"];

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const ImageSkeleton = () => (
  <div className="aspect-[4/3] rounded-xl bg-surface-elevated animate-pulse" />
);

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("nature");
  const [query, setQuery] = useState("nature");

  const fetchImages = useCallback(async (searchQuery, currentPage) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(API_URL, {
        params: {
          query: searchQuery,
          page: currentPage,
          per_page: IMAGES_PER_PAGE,
          client_id: import.meta.env.VITE_API_KEY,
        },
      });

      setImages(data.results);
      setTotalPages(data.total_pages);
      setTotalResults(data.total);
    } catch (err) {
      setImages([]);
      setTotalPages(0);
      setTotalResults(0);
      setError(
        err.response?.status === 401
          ? "Invalid API key. Check your VITE_API_KEY in .env"
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(query, page);
  }, [page, query, fetchImages]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = searchInput.current.value.trim();
    if (!value) return;

    setActiveCategory(null);
    setQuery(value);
    setPage(1);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setQuery(category);
    if (searchInput.current) searchInput.current.value = category;
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <header className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-secondary/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
              Unsplash Gallery
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Discover beautiful images
            </h1>
            <p className="mt-4 text-muted">
              Search millions of high-resolution photos from talented creators worldwide.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon />
              </span>
              <input
                type="search"
                className="w-full rounded-xl border border-border bg-surface-elevated py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Search for images..."
                defaultValue="nature"
                ref={searchInput}
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover hover:shadow-accent/40 active:scale-[0.98]"
            >
              Search
            </button>
          </form>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                  activeCategory === category
                    ? "bg-accent text-white shadow-md shadow-accent/30"
                    : "border border-border bg-surface-elevated text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {!isLoading && !error && totalResults > 0 && (
          <p className="mb-6 text-sm text-muted">
            Showing page {page} of {totalPages} · {totalResults.toLocaleString()} results for{" "}
            <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ImageSkeleton key={i} />
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => (
              <a
                key={image.id}
                href={image.links.html}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-border/50 transition hover:ring-accent/50 hover:shadow-xl hover:shadow-accent/10"
              >
                <img
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  src={image.urls.small}
                  alt={image.alt_description || "Unsplash photo"}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="truncate text-sm font-medium text-white">
                    {image.user.name}
                  </p>
                  {image.alt_description && (
                    <p className="mt-0.5 truncate text-xs text-white/70">
                      {image.alt_description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : !error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-surface-elevated p-4 text-muted">
              <SearchIcon />
            </div>
            <h2 className="text-xl font-semibold">No images found</h2>
            <p className="mt-2 max-w-sm text-muted">
              Try a different search term or pick one of the categories above.
            </p>
          </div>
        ) : null}

        {!isLoading && images.length > 0 && totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="rounded-xl border border-border bg-surface-elevated px-5 py-2.5 text-sm font-medium transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="min-w-[6rem] text-center text-sm text-muted">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="rounded-xl border border-border bg-surface-elevated px-5 py-2.5 text-sm font-medium transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted">
        Photos provided by{" "}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Unsplash
        </a>
      </footer>
    </div>
  );
};

export default App;
