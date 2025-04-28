
import React from "react";

interface GuideSectionProps {
  title: string;
  children: React.ReactNode;
}

const GuideSection = ({ title, children }: GuideSectionProps) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
};

export default GuideSection;
