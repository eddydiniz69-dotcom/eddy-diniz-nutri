import "./App.css";

const agendamentoLink = "/agendar";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 5.7a5.4 5.4 0 0 0-7.6 0L12 6.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z" />
      <path d="M7 12h2l1.2-2.5L12.6 15l1.3-3H17" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4C12 4 6 7.5 6 13a5 5 0 0 0 5 5c5.5 0 9-6 9-14Z" />
      <path d="M4 20c3-5 7-8 12-10" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </svg>
  );
}

function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand-logo ${light ? "brand-logo--light" : ""}`}>
      <img
        src="/1000381592.jpg"
        alt="Eddy Diniz Nutricionista"
      />
    </div>
  );
}

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="header-brand" href="/" aria-label="Página inicial">
          <BrandLogo />
        </a>

        <div className="professional-id">
          <span>Nutricionista</span>
          <span>CRN-11 24210</span>
        </div>

        <a className="menu-button" href="#rodape" aria-label="Abrir menu">
          <span />
          <span />
          <span />
        </a>
      </header>

      <main>
        <section className="hero-section">
          <div className="section-kicker">
            Nutrição que acompanha você
          </div>

          <h1 className="hero-title">
            Comer bem,
            <br />
            <em>sem complicar.</em>
          </h1>

          <p className="hero-description">
            Cuidado nutricional individualizado para construir uma relação
            mais leve, possível e consciente com a comida.
          </p>

          <div className="hero-actions">
            <a className="button button--primary" href={agendamentoLink}>
              <span>Agendar consulta</span>
              <ArrowIcon />
            </a>

            <a className="button button--secondary" href="#abordagem">
              <span>Conhecer o trabalho</span>
              <ChevronIcon />
            </a>
          </div>

          <div className="institutional-card">
            <div className="institutional-line" />

            <BrandLogo />

            <p>
              Nutrição com clareza, presença e
              <br />
              cuidado.
            </p>
          </div>

          <ul className="hero-information">
            <li>CRN-11 24210</li>
            <li>Atendimento individual</li>
            <li>Atendimento presencial e online</li>
          </ul>
        </section>

        <section className="approach-section" id="abordagem">
          <div className="section-kicker">
            Como funciona a consulta
          </div>

          <h2 className="section-title">
            Menos culpa.
            <br />
            Mais clareza.
          </h2>

          <p className="section-description">
            Começamos pela sua história e pela sua rotina. A partir dessa
            conversa, construímos estratégias simples, personalizadas e
            possíveis de manter.
          </p>

          <div className="approach-cards">
            <article className="approach-card approach-card--light">
              <div className="card-icon">
                <HeartIcon />
              </div>

              <div>
                <h3>
                  Escuta antes da
                  <br />
                  prescrição
                </h3>

                <p>
                  Sua história, seus horários e sua relação com a comida
                  entram na conversa.
                </p>
              </div>
            </article>

            <article className="approach-card approach-card--yellow">
              <div className="card-icon">
                <LeafIcon />
              </div>

              <div>
                <h3>Prático para a vida real</h3>

                <p>
                  Estratégias que cabem na sua rotina — sem cardápios
                  impossíveis de sustentar.
                </p>
              </div>
            </article>

            <article className="approach-card approach-card--green">
              <div className="card-icon">
                <SparkleIcon />
              </div>

              <div>
                <h3>Evolução sem culpa</h3>

                <p>
                  Nutrição como cuidado contínuo, com clareza, autonomia e
                  gentileza.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="quote-section">
          <div className="quote-mark" aria-hidden="true">
            “
          </div>

          <blockquote>
            Não é sobre fazer tudo perfeito. É sobre fazer escolhas que cuidam
            de você — de verdade.
          </blockquote>

          <p>Uma conversa pode ser o começo</p>
        </section>

        <section className="cta-section" id="agendar">
          <h2>
            Seu próximo
            <br />
            passo pode
            <br />
            ser mais leve.
          </h2>

          <a className="button button--primary cta-button" href={agendamentoLink}>
            <span>Agendar</span>
            <ArrowIcon />
          </a>
        </section>

        <section className="services-section">
          <div className="section-kicker section-kicker--yellow">
            Como posso ajudar
          </div>

          <h2 className="services-title">
            Um cuidado feito
            <br />
            para a sua fase.
          </h2>

          <p className="services-description">
            O acompanhamento se adapta ao que você está vivendo agora — com
            espaço para perguntas, ajustes e evolução.
          </p>

          <div className="services-list">
            <a className="service-item" href={agendamentoLink}>
              <div className="service-heading">
                <span className="service-number">01</span>
                <h3>Consulta nutricional</h3>
                <ArrowIcon />
              </div>

              <p>
                Um encontro completo para entender sua rotina e traçar um
                caminho possível.
              </p>
            </a>

            <a className="service-item" href={agendamentoLink}>
              <div className="service-heading">
                <span className="service-number">02</span>
                <h3>Acompanhamento individual</h3>
                <ArrowIcon />
              </div>

              <p>
                Ajustes cuidadosos para que o plano acompanhe a sua vida real.
              </p>
            </a>

            <a className="service-item" href={agendamentoLink}>
              <div className="service-heading">
                <span className="service-number">03</span>
                <h3>Consulta online ou presencial</h3>
                <ArrowIcon />
              </div>

              <p>
                Escolha o formato que faz sentido para você, com a mesma
                atenção.
              </p>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="rodape">
        <BrandLogo light />

        <p className="footer-message">
          Nutrição prática, humana e sem extremos para a vida que você leva.
        </p>

        <div className="footer-group">
          <h2>Explore</h2>

          <nav aria-label="Links do rodapé">
            <a href="#abordagem">Sobre</a>
            <a href="#abordagem">Abordagem</a>
            <a href={agendamentoLink}>Agendar consulta</a>
          </nav>
        </div>

        <div className="footer-group">
          <h2>Contato</h2>

          <address>
            <a href="tel:+5583994210431">(83) 99421-0431</a>
            <a href="mailto:eddydiniz69@gmail.com">
              eddydiniz69@gmail.com
            </a>
            <span>CRN-11 24210</span>
          </address>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Eddy Diniz</span>
          <span>Nutricionista</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
