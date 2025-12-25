import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

/**
 * Gradient search button with loading state
 */
const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <Button
      variant="gradient"
      size="xl"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full sm:w-auto min-w-[200px]"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Searching...</span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5" />
          <span>Find Similar Images</span>
        </>
      )}
    </Button>
  );
};

export default SearchButton;
