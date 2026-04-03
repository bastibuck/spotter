import React from "react";

import HomepageHeroSection from "./_components/HomepageHeroSection";
import HomepageMapSectionSkeleton from "./_components/HomepageMapSectionSkeleton";
import HomepageSuggestionSection from "./_components/HomepageSuggestionSection";

const LoadingSpots = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <HomepageHeroSection />

      <div className="mx-auto">
        <HomepageMapSectionSkeleton />
        <HomepageSuggestionSection />
      </div>
    </div>
  );
};

export default LoadingSpots;
