import {
  HomeIcon,
  LinkIcon,
  SearchAltIcon,
  MessageIcon,
  FileTextIcon,
  ScaleIcon,
  AlertIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-[#000000] to-[#1a1a1a] border-t border-[#666666] mt-16 shadow-lg animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8">
          <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                <img
                  src="https://i.ibb.co/rG8yDddq/doxingdotlifelogogeniune888175141.png"
                  alt="Doxing Dot Life Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-black text-white text-lg">
                  Doxing Dot Life
                </h3>
                <p className="text-xs text-gray-500">Doxing Database</p>
              </div>
            </div>
            <p className="text-sm text-[#979797] leading-relaxed">
              The largest database of exposed and doxed individuals. Find and
              share information about anyone.
            </p>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <LinkIcon className="w-4 h-4 text-[#979797]" />
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#979797]">
              <li>
                <a
                  href="/"
                  className="hover:text-[#0088CC] transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/all-posts"
                  className="hover:text-[#0088CC] transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <SearchAltIcon className="w-4 h-4" />
                  <span>Browse Database</span>
                </a>
              </li>
              <li>
                <a
                  href="/dox-anyone"
                  className="hover:text-[#0088CC] transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <MessageIcon className="w-4 h-4" />
                  <span>Search Tool</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <FileTextIcon className="w-4 h-4 text-[#979797]" />
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#979797]">
              <li>
                <a
                  href="#"
                  className="hover:text-[#0088CC] transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <FileTextIcon className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#0088CC] transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <ScaleIcon className="w-4 h-4" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#0088CC] transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <AlertIcon className="w-4 h-4" />
                  <span>Disclaimer</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ShoppingCartIcon className="w-4 h-4 text-gray-500" />
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <CreditCardIcon className="w-4 h-4" />
                  <span>Premium Access</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1"
                >
                  <MailIcon className="w-4 h-4" />
                  <span>Report Issue</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 sm:pt-10">
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>&copy; 2024 - 2027 Doxing Dot Life. All rights reserved.</p>
            <p className="mt-2 text-gray-700">
              Find, Dox, Expose - The Database
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
