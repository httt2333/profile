import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const featuredProjects = [
  {
    title: 'AI Image Checker',
    year: '2026',
    category: 'AI product / interaction',
    image: '/assets/ai-image-checker.png',
    description: 'A calmer way to inspect synthetic media before it reaches a real audience.',
  },
  {
    title: 'Agent Workspace',
    year: '2025',
    category: 'Product system / UX',
    image: '/assets/agent-workspace.png',
    description: 'A modular workspace for making complex AI decisions legible and reversible.',
  },
  {
    title: 'Signal / Noise',
    year: '2025',
    category: 'Brand identity / motion',
    image: '/assets/signal-noise.png',
    description: 'An identity study about finding the useful signal inside a moving system.',
  },
  {
    title: 'Common Ground',
    year: '2024',
    category: 'Visual language / editorial',
    image: '/assets/common-ground.png',
    description: 'A visual system for turning opposing points of view into something people can build on.',
  },
]

const moreProjects = [
  { title: 'Common Ground', year: '2024', type: 'Visual language', image: '/assets/common-ground.png', size: 'wide' },
  { title: 'The Small Interface', year: '2024', type: 'Editorial system', image: '/assets/agent-workspace.png', size: 'tall' },
  { title: 'Material Studies', year: '2023', type: 'Art direction', image: '/assets/signal-noise.png', size: 'square' },
  { title: 'Detection Notes', year: '2023', type: 'Research artifact', image: '/assets/ai-image-checker.png', size: 'wide' },
]

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Zhixuan Zhang home">ZZ<span>.</span></a>
      <nav className="main-nav" aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="header-status" href="mailto:hello@zhixuan.design">Available for select work</a>
    </header>
  )
}

function ArrowLink({ children, href }) {
  return <a className="arrow-link" href={href}>{children}<span className="arrow-icon" aria-hidden="true" /></a>
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy reveal-in">
        <p className="hero-kicker">ZHIXUAN ZHANG / PORTFOLIO 2026</p>
        <h1 id="hero-title">Designing trust for intelligent products.</h1>
        <p className="hero-intro">AI product designer working across interaction, systems, and visual language.</p>
        <ArrowLink href="#work">View selected work</ArrowLink>
      </div>
      <figure className="hero-figure reveal-image">
        <div className="image-frame hero-frame">
          <img src="/assets/ai-image-checker.png" alt="A translucent inspection lens over a monochrome image contact sheet" fetchPriority="high" />
          <span className="image-index" aria-hidden="true">01</span>
        </div>
        <figcaption>Work starts with looking closely.</figcaption>
      </figure>
      <div className="hero-foot" aria-hidden="true"><span>Product design</span><span>Interaction systems</span><span>Visual direction</span></div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  return (
    <article className="featured-card" id={index === 0 ? 'featured-project' : undefined}>
      <a className="project-link" href="#contact" aria-label={`Talk about ${project.title}`}>
        <div className="project-image-wrap">
          <img src={project.image} alt={`${project.title} project artwork`} loading={index === 0 ? 'eager' : 'lazy'} />
          <span className="project-number">0{index + 1}</span>
        </div>
        <div className="project-meta">
          <div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <div className="project-detail"><span>{project.category}</span><span>{project.year}</span></div>
        </div>
      </a>
    </article>
  )
}

function FeaturedWork() {
  return (
    <section className="featured-section" id="work" aria-labelledby="featured-title">
      <div className="section-intro">
        <h2 id="featured-title">Selected work</h2>
        <p>Interfaces and identities for moments where clarity matters.</p>
      </div>
      <div className="featured-stage">
        <div className="featured-sticky">
          <div className="featured-track">
            <div className="featured-lead">
              <p>Selected builds across AI, frontend, and visual systems.</p>
              <h3>Things I’ve <em>shipped.</em></h3>
              <span>04 projects / 2024-2026</span>
            </div>
            {featuredProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}
            <div className="track-end"><span>That is the short list.</span><ArrowLink href="#more">See more work</ArrowLink></div>
          </div>
        </div>
        <div className="featured-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}

function MoreWork() {
  return (
    <section className="more-section" id="more" aria-labelledby="more-title">
      <div className="section-intro more-intro">
        <h2 id="more-title">More work</h2>
        <p>A few adjacent studies in form, language, and making.</p>
      </div>
      <div className="more-grid">
        {moreProjects.map((project) => (
          <a className={`more-card more-card-${project.size}`} href="#contact" key={project.title}>
            <div className="more-image"><img src={project.image} alt={`${project.title} project artwork`} loading="lazy" /></div>
            <div className="more-meta"><h3>{project.title}</h3><span>{project.type} / {project.year}</span></div>
          </a>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-heading"><h2 id="about-title">A designer for the space between people and systems.</h2></div>
      <div className="about-body">
        <p>I work on the parts of a product that ask for judgment: the moment a system needs to explain itself, a team needs to align, or an unfamiliar tool needs to feel human.</p>
        <div className="about-facts">
          <div><span>Based in</span><strong>Shanghai / remote</strong></div>
          <div><span>Focus</span><strong>AI product design</strong></div>
          <div><span>Also into</span><strong>Research, typography, film</strong></div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-copy"><p className="contact-kicker">Have a thoughtful problem?</p><h2 id="contact-title">Let’s make it clear.</h2></div>
      <div className="contact-actions"><a className="email-link" href="mailto:hello@zhixuan.design">hello@zhixuan.design</a><div className="social-links"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></div></div>
    </section>
  )
}

function Footer() {
  return <footer className="site-footer"><span>© 2026 Zhixuan Zhang</span><a href="#top">Back to top <span className="arrow-icon" aria-hidden="true" /></a><span>Built with care</span></footer>
}

function App() {
  return <><Header /><main><Hero /><FeaturedWork /><MoreWork /><About /><Contact /></main><Footer /><div className="grain" aria-hidden="true" /></>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
