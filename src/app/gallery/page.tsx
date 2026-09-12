"use client";

import Section from "@/components/Section";
import AnimatedSection from "@/components/AnimatedSection";
import ImageGallery from "@/components/ImageGallery";

export default function GalleryPage() {
  return (
    <>
      <Section
        title="Gallery"
        description="Moments, projects, and things I've been working on."
        className="pt-8 sm:pt-24"
      >
        <AnimatedSection>
          <ImageGallery />
        </AnimatedSection>
      </Section>
    </>
  );
}
