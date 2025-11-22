import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Post, PostsResponse } from "@shared/api";

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
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
].sort();

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "United States": [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ],
  "United Kingdom": [
    "London",
    "Manchester",
    "Birmingham",
    "Leeds",
    "Glasgow",
    "Liverpool",
    "Newcastle",
    "Sheffield",
    "Bristol",
    "Edinburgh",
  ],
  Canada: [
    "Toronto",
    "Vancouver",
    "Montreal",
    "Calgary",
    "Ottawa",
    "Edmonton",
    "Mississauga",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
  ],
  Australia: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Gold Coast",
    "Canberra",
    "Newcastle",
    "Logan City",
    "Parramatta",
  ],
  Germany: [
    "Berlin",
    "Munich",
    "Frankfurt",
    "Cologne",
    "Hamburg",
    "Dusseldorf",
    "Dortmund",
    "Essen",
    "Leipzig",
    "Dresden",
  ],
  France: [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Montpellier",
    "Bordeaux",
    "Lille",
  ],
  India: [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ],
  Japan: [
    "Tokyo",
    "Yokohama",
    "Osaka",
    "Kobe",
    "Kyoto",
    "Kawasaki",
    "Saitama",
    "Hiroshima",
    "Fukuoka",
    "Nagoya",
  ],
  Brazil: [
    "Sao Paulo",
    "Rio de Janeiro",
    "Brasilia",
    "Salvador",
    "Fortaleza",
    "Belo Horizonte",
    "Manaus",
    "Curitiba",
    "Recife",
    "Porto Alegre",
  ],
};

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [postsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");

  const availableCities = selectedCountry
    ? (CITIES_BY_COUNTRY[selectedCountry] || []).filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase()),
      )
    : [];

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const filteredServers = servers.filter((server) =>
    server.toLowerCase().includes(serverSearch.toLowerCase()),
  );

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data: PostsResponse = await response.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (error) {
        console.error("Error loading posts:", error);
        setPosts([]);
      }
    };

    const loadServers = async () => {
      try {
        const response = await fetch("/api/servers");
        const data = await response.json();
        setServers(Array.isArray(data.servers) ? data.servers : []);
      } catch (error) {
        console.error("Error loading servers:", error);
        setServers([]);
      }
    };

    loadPosts();
    loadServers();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((post) => post.country === selectedCountry);
    }

    if (selectedCity) {
      filtered = filtered.filter((post) => post.city === selectedCity);
    }

    if (selectedServer) {
      filtered = filtered.filter((post) => post.server === selectedServer);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, searchQuery, selectedCountry, selectedCity, selectedServer]);

  useEffect(() => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    setDisplayedPosts(filteredPosts.slice(start, end));
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fadeIn">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-background via-card/50 to-background pt-12 pb-8 md:pt-20 md:pb-16 border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 text-foreground tracking-tighter leading-tight">
                🔍 Doxing Dot Life
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-8 max-w-3xl">
                Find if you or someone you know have been Doxed
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-10 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <input
                type="text"
                placeholder="Search for individuals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-card border-2 border-border hover:border-accent/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-base sm:text-lg transition-all shadow-md hover:shadow-lg"
              />
              <Search className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground pointer-events-none" />
            </div>

            {/* Categories Section */}
            <div className="mb-0 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-sm font-black text-foreground mb-6 uppercase tracking-widest">
                📂 Filter by Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Country Dropdown */}
                <div className="relative group">
                  <label className="text-sm font-bold text-foreground block mb-2">
                    🌍 By Country
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
                              setSelectedCity("");
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
                        setSelectedCity("");
                        setCountrySearch("");
                      }}
                      className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* City Dropdown */}
                <div className="relative group">
                  <label className="text-sm font-bold text-foreground block mb-2">
                    🏙️ By City
                  </label>
                  <input
                    type="text"
                    placeholder={selectedCity ? selectedCity : "Select city..."}
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all shadow-sm hover:shadow-md"
                  />
                  {citySearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                      {availableCities.length > 0 ? (
                        availableCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city);
                              setCitySearch("");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                          >
                            {city}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground text-sm">
                          No cities found
                        </div>
                      )}
                    </div>
                  )}
                  {selectedCity && (
                    <button
                      onClick={() => {
                        setSelectedCity("");
                        setCitySearch("");
                      }}
                      className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Server Dropdown */}
                <div className="relative group">
                  <label className="text-sm font-bold text-foreground block mb-2">
                    🖥️ By Server
                  </label>
                  <input
                    type="text"
                    placeholder={
                      selectedServer ? selectedServer : "Select server..."
                    }
                    value={serverSearch}
                    onChange={(e) => setServerSearch(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all shadow-sm hover:shadow-md"
                  />
                  {serverSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                      {filteredServers.length > 0 ? (
                        filteredServers.map((server) => (
                          <button
                            key={server}
                            onClick={() => {
                              setSelectedServer(server);
                              setServerSearch("");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                          >
                            {server}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground text-sm">
                          No servers found
                        </div>
                      )}
                    </div>
                  )}
                  {selectedServer && (
                    <button
                      onClick={() => {
                        setSelectedServer("");
                        setServerSearch("");
                      }}
                      className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hot & Recent Posts */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12 animate-fadeIn">
            <h2 className="text-5xl md:text-6xl font-black mb-3">
              {filteredPosts.length === 0
                ? "No Posts Found"
                : "🔥 Hot & Recent Posts"}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length === 0
                ? "Try adjusting your search filters"
                : `Showing ${displayedPosts.length} of ${filteredPosts.length} posts`}
            </p>
          </div>

          {displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {displayedPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {post.thumbnail && (
                      <div className="w-full h-40 bg-muted overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-foreground text-base line-clamp-2 mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.country && (
                          <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">
                            🌍 {post.country}
                          </span>
                        )}
                        {post.city && (
                          <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">
                            🏙️ {post.city}
                          </span>
                        )}
                        {post.server && (
                          <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">
                            🖥️ {post.server}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No posts match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
