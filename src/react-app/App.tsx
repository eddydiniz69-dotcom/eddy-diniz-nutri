import "./App.css";

const services = [
  {
    number: "01",
    title: "Nutrição clínica",
    text: "Acompanhamento individualizado, considerando sua saúde, rotina, preferências e objetivos.",
  },
  {
    number: "02",
    title: "Nutrição esportiva",
    text: "Estratégias nutricionais alinhadas ao treinamento, desempenho, composição corporal e recuperação.",
  },
  {
    number: "03",
    title: "Estilo de vida",
    text: "Construção de hábitos possíveis e sustentáveis para cuidar da alimentação sem complicar a rotina.",
  },
];

function App() {
  return (
    <div className="site">
      <header className="header">
        <a className="brand" href="#inicio" aria-label="Eddy Diniz Nutricionista">
          <span className="brandBolt">ϟ</span>

          <div className="brandText">
            <strong>EDDY DINIZ</strong>
            <span>NUTRICIONISTA</span>
          </div>
        </a>

        <nav className="nav">
          <a href="#inicio">Início</a>
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Atendimento</a>
          <a href="#contato">Contato</a>
        </nav>

        <a className="headerButton" href="#agendamento">
          Agendar consulta
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="heroCopy">
            <span className="eyebrow">
              NUTRIÇÃO • CIÊNCIA • ESTILO DE VIDA
            </span>

            <h1>
              Comer bem,
              <br />
              <em>sem complicar.</em>
            </h1>

            <p className="heroText">
              Cuidado nutricional individualizado para construir uma relação
              mais leve, possível e consciente com a alimentação.
            </p>

            <div className="heroActions">
              <a className="primaryButton" href="#agendamento">
                Agendar consulta <span>↗</span>
              </a>

              <a className="secondaryButton" href="#sobre">
                Conhecer meu trabalho
              </a>
            </div>
          </div>

          <div className="heroBrand" aria-label="Identidade Eddy Diniz">
            <div className="boltLarge">ϟ</div>

            <strong>EDDY DINIZ</strong>
            <span>NUTRICIONISTA</span>

            <div className="brandDivider" />

            <p>
              Nutrição com clareza,
              <br />
              presença e cuidado.
            </p>
          </div>
        </section>

        <section className="trustBar">
          <span>
            <i /> CRN-11 24210
          </span>

          <span>
            <i /> Atendimento individual
          </span>

          <span>
            <i /> Presencial e online
          </span>
        </section>

        <section className="about section" id="sobre">
          <div className="sectionIntro">
            <span className="eyebrow">SOBRE MIM</span>

            <h2>
              Nutrição feita
              <br />
              para <em>pessoas.</em>
            </h2>
          </div>

          <div className="aboutContent">
            <p className="aboutLead">
              “Você não precisa de mais uma regra. Precisa de um plano que
              entenda o seu dia.”
            </p>

            <p>
              Sou <strong>Eddy Diniz</strong>, nutricionista CRN-11 24210.
              Meu trabalho começa pela escuta: entender onde você está, o que
              deseja mudar e quais escolhas fazem sentido dentro da sua rotina.
            </p>

            <p>
              A partir disso, construímos uma estratégia nutricional clara,
              individualizada e possível — sem terrorismo alimentar e sem
              fórmulas prontas.
            </p>

            <div className="signature">
              <strong>Eddy Diniz</strong>
              <span>Nutricionista</span>
            </div>
          </div>
        </section>

        <section className="services section" id="servicos">
          <div className="servicesHeader">
            <span className="eyebrow">COMO POSSO AJUDAR</span>

            <h2>
              Um cuidado feito
              <br />
              para a sua <em>fase.</em>
            </h2>

            <p>
              O acompanhamento se adapta ao que você está vivendo agora, com
              espaço para perguntas, ajustes e evolução.
            </p>
          </div>

          <div className="serviceList">
            {services.map((service) => (
              <article className="serviceItem" key={service.number}>
                <span className="serviceNumber">{service.number}</span>

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>

                <span className="serviceArrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto">
          <span className="manifestoBolt">ϟ</span>

          <p>
            NUTRIÇÃO É CIÊNCIA,
            <br />
            MAS TAMBÉM É SOBRE <strong>PESSOAS.</strong>
          </p>
        </section>

        <section className="booking section" id="agendamento">
          <div className="bookingIntro">
            <span className="eyebrow">AGENDE SUA CONSULTA</span>

            <h2>
              Comece a construir
              <br />
              sua próxima <em>fase.</em>
            </h2>

            <p>
              Escolha uma data e um dos horários disponíveis para solicitar
              seu atendimento.
            </p>

            <div className="crn">
              EDDY DINIZ
              <span>Nutricionista • CRN-11 24210</span>
            </div>
          </div>

          <div className="bookingCard">
            <span className="bookingLabel">HORÁRIOS DE ATENDIMENTO</span>

            <h3>Agendamento online</h3>

            <p>Selecione o melhor horário para sua consulta.</p>

            <div className="times">
              <button type="button">08:30</button>
              <button type="button">10:00</button>
              <button type="button">14:00</button>
              <button type="button">15:30</button>
              <button type="button">17:00</button>
            </div>

            <button className="bookingButton" type="button">
              Escolher data e horário <span>↗</span>
            </button>

            <small>
              O sistema de disponibilidade será conectado na próxima etapa.
            </small>
          </div>
        </section>
      </main>

      <footer id="contato">
        <div className="footerBrand">
          <span className="footerBolt">ϟ</span>

          <div>
            <strong>EDDY DINIZ</strong>
            <span>NUTRICIONISTA</span>
          </div>
        </div>

        <div className="footerInfo">
          <span>CRN-11 24210</span>
          <span>© 2026 Eddy Diniz Nutrição</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
