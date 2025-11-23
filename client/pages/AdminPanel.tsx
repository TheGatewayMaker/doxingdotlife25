import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Post, PostsResponse } from "@shared/api";
import {
  SearchIcon,
  FilterIcon,
  GlobeIcon,
  MapPinIcon,
  ServerIcon,
  CloseIcon,
  TrashIcon,
  EditIcon,
} from "@/components/Icons";
import AdminPostCard from "@/components/AdminPostCard";
import { toast } from "sonner";

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
];

export default function AdminPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const response = await fetch("/api/posts");
        const data: PostsResponse = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.id.includes(query),
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((post) => post.country === selectedCountry);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, searchQuery, selectedCountry]);

  useEffect(() => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    setDisplayedPosts(filteredPosts.slice(start, end));
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleDeletePost = async (postId: string) => {
    setDeletingPostId(postId);
  };

  const confirmDeletePost = async () => {
    if (!deletingPostId) return;

    try {
      setIsDeletingPost(true);
      const response = await fetch(`/api/posts/${deletingPostId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== deletingPostId),
      );
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeletingPost(false);
      setDeletingPostId(null);
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
    toast.success("Post updated successfully");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fadeIn">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-background via-card/50 to-background pt-8 pb-8 md:pt-16 md:pb-12 border-b border-border/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-foreground tracking-tighter leading-tight flex items-center gap-2">
                <EditIcon className="w-8 h-8 text-accent" />
                Admin Panel
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-muted-foreground mb-6 max-w-2xl">
                Manage, edit, and delete posts and their content
              </p>
            </div>

            {/* Search Bar */}
            <div
              className="relative mb-8 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <input
                type="text"
                placeholder="Search posts by title, description, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-card border-2 border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
              />
              <SearchIcon className="absolute right-4 sm:right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Filter Section */}
            <div
              className="mb-0 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <FilterIcon className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-black text-foreground uppercase tracking-widest">
                  Filter by Category
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Country Dropdown */}
                <div className="relative group">
                  <label className="text-sm font-bold text-foreground block mb-3 flex items-center gap-2">
                    <GlobeIcon className="w-4 h-4 text-accent" />
                    By Country
                  </label>
                  <input
                    type="text"
                    placeholder={
                      selectedCountry ? selectedCountry : "Select country..."
                    }
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all shadow-sm hover:shadow-md"
                  />
                  {countrySearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country}
                            onClick={() => {
                              setSelectedCountry(country);
                              setCountrySearch("");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground text-sm">
                          No countries found
                        </div>
                      )}
                    </div>
                  )}
                  {selectedCountry && (
                    <button
                      onClick={() => {
                        setSelectedCountry("");
                        setCountrySearch("");
                      }}
                      className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                      title="Clear selection"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Management Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-10 sm:mb-12 animate-fadeIn">
            {isLoadingPosts ? (
              <>
                <h2 className="text-5xl md:text-6xl font-black mb-3 flex items-center gap-3">
                  <span className="inline-block animate-spin">
                    <div className="w-10 h-10 border-3 border-muted border-t-accent rounded-full"></div>
                  </span>
                  Loading Posts
                </h2>
                <p className="text-muted-foreground">
                  Fetching posts for management...
                </p>
              </>
            ) : filteredPosts.length === 0 ? (
              <>
                <h2 className="text-5xl md:text-6xl font-black mb-3">
                  No Posts Found
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCountry
                    ? "Try adjusting your search filters"
                    : "No posts available at the moment"}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-5xl md:text-6xl font-black">
                  Manage Posts
                </h2>
                <p className="text-muted-foreground mt-3">
                  Showing {displayedPosts.length} of {filteredPosts.length}{" "}
                  posts
                </p>
              </>
            )}
          </div>

          {displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
                {displayedPosts.map((post, idx) => (
                  <AdminPostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost}
                    onUpdate={handlePostUpdated}
                    animationDelay={idx * 0.05}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 animate-fadeIn">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base"
                  >
                    ← Prev
                  </button>
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition-all text-xs sm:text-sm shadow-sm hover:shadow-md",
                            currentPage === page
                              ? "bg-accent text-accent-foreground"
                              : "bg-card border border-border hover:border-accent text-foreground",
                          )}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 animate-fadeIn">
              <p className="text-muted-foreground text-base sm:text-lg">
                No posts match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingPostId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl max-w-sm w-full p-6 shadow-xl animate-fadeIn">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              Delete Post?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingPostId(null)}
                disabled={isDeletingPost}
                className="flex-1 px-4 py-2 bg-card border border-border text-foreground font-medium rounded-lg hover:bg-muted disabled:opacity-40 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                disabled={isDeletingPost}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                {isDeletingPost ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
