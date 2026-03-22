// src/pages/AboutPage.tsx
import { ArrowRight } from "lucide-react";

interface Props { onNavigate: (page: string) => void; }

const photos = {
  hero:    "https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?w=1800&q=80&fit=crop",
  farm1:   "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80&fit=crop",
  farm2:   "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&fit=crop",
  bottles: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80&fit=crop",
  milk:    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80&fit=crop",
  team1:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face",
  team2:   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fit=crop&crop=face",
  team3:   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop&crop=face",
};

export default function AboutPage({ onNavigate }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", paddingTop: "72px" }}>
      {/* Full-bleed hero */}
      <div style={{ height: "70vh", position: "relative", overflow: "hidden" }}>
        <img src={photos.hero} alt="Our farm" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.38) saturate(0.65)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "4rem 2.5rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
            <p className="t-label" style={{ marginBottom: "1rem" }}>About Milkman</p>
            <h1 className="t-display" style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}>
              We drove 4 hours<br />
              <em className="t-display-italic">for real milk.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Story section */}
      <section style={{ borderTop: "1px solid var(--line)", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7rem", alignItems: "start" }}>
          <div>
            <p className="t-label" style={{ marginBottom: "1.5rem" }}>Origin</p>
            <h2 className="t-heading" style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)", marginBottom: "2rem" }}>
              A single sip changed everything.
            </h2>
            <p className="t-body" style={{ marginBottom: "1.5rem" }}>
              In 2019, Rohan Mehta drove to a small farm in Nashik after reading about organic dairy. What he tasted there — cold, fresh, grassy, real — was nothing like the white water in the plastic packets he'd been buying.
            </p>
            <p className="t-body" style={{ marginBottom: "1.5rem" }}>
              He quit his finance job three weeks later. Milkman started as a WhatsApp group of 40 friends and family. Today we deliver to over 6,200 households across Maharashtra and Karnataka.
            </p>
            <p className="t-body">
              Every drop travels in refrigerated vans. Every farm is visited quarterly by our quality team. Our promise is simple: if it doesn't taste like it came from a farm, we'll refund it.
            </p>
          </div>

          {/* Photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--line)" }}>
            {[photos.farm1, photos.farm2, photos.bottles, photos.milk].map((src, i) => (
              <div key={i} style={{ height: "220px", overflow: "hidden" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(0.75)", transition: "transform 0.5s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--ink-2)", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p className="t-label" style={{ marginBottom: "1.5rem" }}>What we stand for</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "var(--line)" }}>
            {[
              { n: "01", head: "Transparency",   body: "Every product on our site shows the farm it came from, the date it was processed, and the exact cold chain it took." },
              { n: "02", head: "No Middlemen",    body: "We contract directly with farmers at fair prices. No co-ops, no brokers. Farmers earn 30–40% more with us." },
              { n: "03", head: "Minimal Processing", body: "Pasteurised, never ultra-pasteurised. Never homogenised. No additives, no stabilisers, no shelf-life extensions." },
              { n: "04", head: "Cold Always",     body: "Our entire chain from farm to door runs at 4°C. We invested in refrigerated last-mile delivery before growth." },
            ].map((v) => (
              <div key={v.n} style={{ background: "var(--ink-2)", padding: "2.5rem 2rem" }}>
                <p className="t-label" style={{ marginBottom: "1rem" }}>{v.n}</p>
                <h3 className="t-heading" style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>{v.head}</h3>
                <p className="t-body" style={{ fontSize: "0.8rem" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ borderTop: "1px solid var(--line)", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p className="t-label" style={{ marginBottom: "1.5rem" }}>The people</p>
          <h2 className="t-heading" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginBottom: "3.5rem" }}>Built by people who care about food.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: "var(--line)" }}>
            {[
              { name: "Rohan Mehta",   role: "Founder & CEO",        img: photos.team1, bio: "Former investment analyst. Drove 4 hours for milk. Never came back." },
              { name: "Anika Sharma",  role: "Head of Quality",      img: photos.team2, bio: "Dairy technologist with 12 years in food science. Obsessively precise." },
              { name: "Dev Kapoor",    role: "Head of Partnerships",  img: photos.team3, bio: "Grew up on a dairy farm in Amritsar. Speaks every farmer's language." },
            ].map((person) => (
              <div key={person.name} style={{ background: "var(--ink)" }}>
                <div style={{ height: "280px", overflow: "hidden" }}>
                  <img src={person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6) saturate(0.6)", transition: "filter 0.4s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.8) saturate(0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(0.6) saturate(0.6)")}
                  />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <p className="t-label" style={{ marginBottom: "0.3rem" }}>{person.role}</p>
                  <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.1rem", color: "var(--cream)", marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>{person.name}</h3>
                  <p className="t-body" style={{ fontSize: "0.78rem" }}>{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid var(--line)", padding: "6rem 2.5rem", textAlign: "center" }}>
        <p className="t-label" style={{ marginBottom: "1.5rem" }}>Ready to taste the difference?</p>
        <h2 className="t-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginBottom: "2.5rem" }}>
          Start your subscription today.
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => onNavigate("plans")}>
            View Plans <ArrowRight size={13} strokeWidth={2} />
          </button>
          <button className="btn-ghost" onClick={() => onNavigate("shop")}>
            Shop Products
          </button>
        </div>
      </section>
    </div>
  );
}
