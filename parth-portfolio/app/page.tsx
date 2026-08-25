import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Route from "@/components/Route";
import Work from "@/components/Work";
import Profile from "@/components/Profile";
import Proof from "@/components/Proof";
import StudioReveal from "@/components/StudioReveal";
import Contact from "@/components/Footer";
import StartupIntro from "@/components/StartupIntro";

export default function Home() {
  return (
    <>
      <StartupIntro />
      <a className="skip-link" href="#profile">
        Skip to profile
      </a>
      <div className="grain" aria-hidden="true" />

      <SmoothScroll>
        <Header />
        <main id="main-content" className="site-cover">
        <Hero />
        <Route />
        <Profile />
        <Work />
        <StudioReveal />
        <Proof />
      </main>
        <Contact />
      </SmoothScroll>
    </>
  );
}
