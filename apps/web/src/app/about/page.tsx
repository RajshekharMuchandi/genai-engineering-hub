import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">ABOUT</div>

        <h1>Rajshekhar Muchandi</h1>

        <p>
          Software engineer focused on combining enterprise software
          architecture with production-grade Generative AI engineering.
        </p>
      </div>
    </section>
  );
}
