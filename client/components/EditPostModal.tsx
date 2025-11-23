import { useState } from "react";
import { Post } from "@shared/api";
import { CloseIcon, CheckIcon } from "./Icons";
import { toast } from "sonner";

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onUpdate: (post: Post) => void;
  authToken: string;
}

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

export default function EditPostModal({
  post,
  onClose,
  onUpdate,
}: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [country, setCountry] = useState(post.country || "");
  const [city, setCity] = useState(post.city || "");
  const [server, setServer] = useState(post.server || "");
  const [isSaving, setIsSaving] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          country: country.trim(),
          city: city.trim(),
          server: server.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const result = await response.json();
      onUpdate({
        ...post,
        title: result.post.title,
        description: result.post.description,
        country: result.post.country,
        city: result.post.city,
        server: result.post.server,
      });
      toast.success("Post updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl p-6 shadow-xl my-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Edit Post
          </h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
              placeholder="Enter post title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none disabled:opacity-50"
              placeholder="Enter post description"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Country
            </label>
            <div className="relative">
              <input
                type="text"
                value={countrySearch || country}
                onChange={(e) => setCountrySearch(e.target.value)}
                onFocus={() => setCountrySearch("")}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
                placeholder="Select or type country"
              />
              {countrySearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setCountrySearch("");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                      >
                        {c}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground text-sm">
                      No countries found
                    </div>
                  )}
                </div>
              )}
            </div>
            {country && !countrySearch && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: <span className="font-semibold">{country}</span>
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
              placeholder="Enter city name"
            />
          </div>

          {/* Server */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Server
            </label>
            <input
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
              placeholder="Enter server name"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-card border border-border text-foreground font-medium rounded-lg hover:bg-muted disabled:opacity-40 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
