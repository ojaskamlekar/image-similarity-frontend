import React from 'react';
import { Search } from 'lucide-react';

/**
 * App header with branding and description
 */
const Header: React.FC = () => {
  return (
    <header className="text-center mb-10 animate-fade-in">
      {/* Logo/Icon */}
      <div className="inline-flex items-center justify-center mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Search className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
        Find Visually Similar Images
      </h1>

      {/* Subtitle */}
      <p className="text-base text-muted-foreground max-w-lg mx-auto">
        Upload an image and discover visually similar results based on image content.
      </p>
    </header>
  );
};

export default Header;
