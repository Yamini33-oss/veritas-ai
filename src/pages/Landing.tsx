import Hero from "../components/landing/Hero";
import ProblemStatement from "../components/landing/ProblemStatement";
import CouncilPreview from "../components/landing/CouncilPreview";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";

export default function Landing() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <CouncilPreview />
      <HowItWorks />
      <CTASection />
    </>
  );
}
