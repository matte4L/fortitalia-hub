import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Settings, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Notizie", path: "/news" },
    { label: "Tornei", path: "/tournaments" },
    { label: "Top Players", path: "/players" },
    { label: "Predictions", path: "/predictions" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-gaming rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">🇮🇹</span>
          </div>
          <h1 className="text-xl font-bold text-primary">Fortnite Italia</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-colors ${
                isActive(item.path)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="outline" className="glow-primary">
            Community
          </Button>
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg py-2 px-4 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button variant="outline" className="glow-primary w-full mt-4">
                  Unisciti alla Community
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;