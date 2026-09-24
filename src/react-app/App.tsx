import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./App.css";

const agendamentoLink = "/?pagina=agendar";

type ConsultationMode = "presencial" | "online";
type AppointmentStatus =
  | "PENDENTE"
  | "CONFIRMADO"
  | "CANCELADO";

type BookingForm = {
  name: string;
  phone: string;
  email: string;
};

type AvailabilityDay = {
  date: string;
  times: string[];
};

type Appointment = {
  name: string;
  phone: string;
  email: string;
  mode: ConsultationMode;
  scheduledDate: string;
  scheduledTime: string;
};

type AdminAppointment = Appointment & {
  id: number;
  status: AppointmentStatus;
  createdAt: string;
};

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

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

function BrandLogo({
  light = false,
}: {
  light?: boolean;
}) {
  return (
    <div
      className={`brand-logo ${
        light ? "brand-logo--light" : ""
      }`}
    >
      <img
        src="/logo.jpg"
        alt="Eddy Diniz Nutricionista"
      />
    </div>
  );
}

function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a
          className="header-brand"
          href="/"
          aria-label="Página inicial"
        >
          <BrandLogo />
        </a>

        <div className="professional-id">
          <span>Nutricionista</span>
          <span>CRN-11 24210</span>
        </div>

        <a
          className="menu-button"
          href="#rodape"
          aria-label="Abrir menu"
        >
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
            Cuidado nutricional individualizado para
            construir uma relação mais leve, possível e
            consciente com a comida.
          </p>

          <div className="hero-actions">
            <a
              className="button button--primary"
              href={agendamentoLink}
            >
              <span>Agendar consulta</span>
              <ArrowIcon />
            </a>

            <a
              className="button button--secondary"
              href="#abordagem"
            >
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
            <li>Presencial em Campina Grande e Fortaleza</li>
            <li>Atendimento online durante todo o mês</li>
          </ul>
        </section>

        <section
          className="approach-section"
          id="abordagem"
        >
          <div className="section-kicker">
            Como funciona a consulta
          </div>

          <h2 className="section-title">
            Menos culpa.
            <br />
            Mais clareza.
          </h2>

          <p className="section-description">
            Começamos pela sua história e pela sua rotina.
            A partir dessa conversa, construímos estratégias
            simples, personalizadas e possíveis de manter.
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
                  Sua história, seus horários e sua relação
                  com a comida entram na conversa.
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
                  Estratégias que cabem na sua rotina — sem
                  cardápios impossíveis de sustentar.
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
                  Nutrição como cuidado contínuo, com
                  clareza, autonomia e gentileza.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="quote-section">
          <div
            className="quote-mark"
            aria-hidden="true"
          >
            “
          </div>

          <blockquote>
            Não é sobre fazer tudo perfeito. É sobre fazer
            escolhas que cuidam de você — de verdade.
          </blockquote>

          <p>Uma conversa pode ser o começo</p>
        </section>

        <section
          className="cta-section"
          id="agendar"
        >
          <h2>
            Seu próximo
            <br />
            passo pode
            <br />
            ser mais leve.
          </h2>

          <a
            className="button button--primary cta-button"
            href={agendamentoLink}
          >
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
            O acompanhamento se adapta ao que você está
            vivendo agora — com espaço para perguntas,
            ajustes e evolução.
          </p>

          <div className="services-list">
            <a
              className="service-item"
              href={agendamentoLink}
            >
              <div className="service-heading">
                <span className="service-number">
                  01
                </span>

                <h3>Consulta nutricional</h3>
                <ArrowIcon />
              </div>

              <p>
                Um encontro completo para entender sua
                rotina e traçar um caminho possível.
              </p>
            </a>

            <a
              className="service-item"
              href={agendamentoLink}
            >
              <div className="service-heading">
                <span className="service-number">
                  02
                </span>

                <h3>Acompanhamento individual</h3>
                <ArrowIcon />
              </div>

              <p>
                Ajustes cuidadosos para que o plano
                acompanhe a sua vida real.
              </p>
            </a>

            <a
              className="service-item"
              href={agendamentoLink}
            >
              <div className="service-heading">
                <span className="service-number">
                  03
                </span>

                <h3>
                  Consulta online ou presencial
                </h3>

                <ArrowIcon />
              </div>

              <p>
                Presencial em Campina Grande e Fortaleza,
                ou online de onde você estiver.
              </p>
            </a>
          </div>
        </section>
      </main>

      <footer
        className="site-footer"
        id="rodape"
      >
        <BrandLogo light />

        <p className="footer-message">
          Nutrição prática, humana e sem extremos para a
          vida que você leva.
        </p>

        <div className="footer-group">
          <h2>Explore</h2>

          <nav aria-label="Links do rodapé">
            <a href="#abordagem">Sobre</a>
            <a href="#abordagem">Abordagem</a>
            <a href={agendamentoLink}>
              Agendar consulta
            </a>
          </nav>
        </div>

        <div className="footer-group">
          <h2>Contato</h2>

          <address>
            <a href="tel:+5583994210431">
              (83) 99421-0431
            </a>

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

function formatDateForDisplay(value: string) {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getPresentialCity(value: string) {
  const day = Number(value.slice(8, 10));

  if (day >= 1 && day <= 17) {
    return "Campina Grande";
  }

  if (day >= 19 && day <= 31) {
    return "Fortaleza";
  }

  return "Deslocamento";
}

function formatConsultationLabel(
  mode: ConsultationMode | null,
  date: string,
) {
  if (mode === "online") {
    return "Consulta online";
  }

  if (mode === "presencial" && date) {
    return `Consulta presencial · ${getPresentialCity(date)}`;
  }

  return "Consulta presencial";
}

function BookingProgress({
  step,
}: {
  step: number;
}) {
  return (
    <div
      className="booking-progress"
      aria-label={`Etapa ${step} de 3`}
    >
      {["Formato", "Horário", "Seus dados"].map(
        (label, index) => (
          <div
            className={`booking-progress-step ${
              step >= index + 1 ? "active" : ""
            }`}
            key={label}
          >
            <span>
              {step > index + 1 ? "✓" : index + 1}
            </span>

            <small>{label}</small>
          </div>
        ),
      )}
    </div>
  );
}

function Booking() {
  const [step, setStep] = useState(1);

  const [mode, setMode] =
    useState<ConsultationMode | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] =
    useState<Partial<BookingForm>>({});

  const [confirmed, setConfirmed] =
    useState(false);

  const [bookingError, setBookingError] =
    useState("");

  const [
    submittedAppointment,
    setSubmittedAppointment,
  ] = useState<Appointment | null>(null);

  const [availability, setAvailability] =
    useState<AvailabilityDay[]>([]);

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(false);

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const dateOptions = useMemo(() => {
    const result: {
      value: string;
      weekday: string;
      number: string;
      month: string;
      location: string;
    }[] = [];

    const weekdayFormatter =
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
      });

    const monthFormatter =
      new Intl.DateTimeFormat("pt-BR", {
        month: "short",
      });

    let index = 1;

    while (result.length < 6 && index < 40) {
      const next = new Date();

      next.setDate(next.getDate() + index);
      index += 1;

      const day = next.getDate();

      if (mode === "presencial" && day === 18) {
        continue;
      }

      const value = [
        next.getFullYear(),
        String(next.getMonth() + 1).padStart(
          2,
          "0",
        ),
        String(day).padStart(2, "0"),
      ].join("-");

      result.push({
        value,
        weekday: weekdayFormatter
          .format(next)
          .replace(".", ""),
        number: String(day).padStart(
          2,
          "0",
        ),
        month: monthFormatter
          .format(next)
          .replace(".", ""),
        location:
          mode === "online"
            ? "Online"
            : day <= 17
              ? "Campina"
              : "Fortaleza",
      });
    }

    return result;
  }, [mode]);

  useEffect(() => {
    const startDate = dateOptions[0]?.value;
    const endDate =
      dateOptions[dateOptions.length - 1]?.value;

    if (
      step !== 2 ||
      !mode ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError(false);

      try {
        const start = new Date(
          `${startDate}T12:00:00`,
        );
        const end = new Date(
          `${endDate}T12:00:00`,
        );
        const days =
          Math.round(
            (end.getTime() - start.getTime()) /
              86_400_000,
          ) + 1;

        const params = new URLSearchParams({
          startDate,
          days: String(days),
        });

        const response = await fetch(
          `/api/appointments/availability?${params}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new ApiError(
            response.status,
            "Não foi possível consultar os horários.",
          );
        }

        const data =
          (await response.json()) as AvailabilityDay[];

        setAvailability(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setAvailabilityError(true);
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => controller.abort();
  }, [step, mode, dateOptions]);

  const selectedAvailability =
    availability.find(
      (item) => item.date === date,
    );

  function chooseMode(
    nextMode: ConsultationMode,
  ) {
    setMode(nextMode);
    setDate("");
    setTime("");
    setAvailability([]);
    setBookingError("");
  }

  function updateForm(
    field: keyof BookingForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function submitBooking(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors: Partial<BookingForm> = {};

    if (!form.name.trim()) {
      nextErrors.name =
        "Digite seu nome para continuar.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone =
        "Digite seu telefone para continuar.";
    }

    if (
      !form.email.trim() ||
      !form.email.includes("@")
    ) {
      nextErrors.email =
        "Digite um e-mail válido.";
    }

    setErrors(nextErrors);
    setBookingError("");

    if (
      Object.keys(nextErrors).length !== 0 ||
      !mode ||
      !date ||
      !time
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            mode,
            scheduledDate: date,
            scheduledTime: time,
          }),
        },
      );

      if (!response.ok) {
        let message =
          "Não foi possível registrar sua solicitação.";

        try {
          const data =
            (await response.json()) as {
              error?: string;
            };

          if (data.error) {
            message = data.error;
          }
        } catch {
          // A resposta pode não conter JSON.
        }

        throw new ApiError(
          response.status,
          message,
        );
      }

      const appointment =
        (await response.json()) as Appointment;

      setSubmittedAppointment(appointment);
      setConfirmed(true);
    } catch (error) {
      setBookingError(
        error instanceof ApiError &&
          error.status === 409
          ? "Esse horário acabou de ser preenchido. Volte e escolha outra opção."
          : error instanceof Error
            ? error.message
            : "Não foi possível registrar sua solicitação. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmed) {
    const appointment = submittedAppointment;
    const confirmationMode =
      appointment?.mode ?? mode;
    const confirmationDate =
      appointment?.scheduledDate ?? date;

    return (
      <main className="booking-page">
        <header className="booking-topbar">
          <a
            className="booking-logo"
            href="/"
          >
            <BrandLogo />
          </a>

          <a
            className="booking-back"
            href="/"
          >
            ← Voltar ao site
          </a>
        </header>

        <section className="booking-confirmation">
          <span className="booking-confirmation-icon">
            ✓
          </span>

          <div className="section-kicker">
            Pedido recebido
          </div>

          <h1>
            Até breve,
            <br />
            {(appointment?.name ?? form.name).split(
              " ",
            )[0]}
            .
          </h1>

          <p>
            Sua solicitação foi registrada. Eddy
            entrará em contato para confirmar os
            detalhes.
          </p>

          <div className="booking-confirmation-details">
            <div>
              <span>Formato</span>

              <strong>
                {formatConsultationLabel(
                  confirmationMode,
                  confirmationDate,
                )}
              </strong>
            </div>

            <div>
              <span>Data</span>

              <strong>
                {formatDateForDisplay(
                  confirmationDate,
                )}
              </strong>
            </div>

            <div>
              <span>Horário</span>

              <strong>
                {appointment?.scheduledTime ??
                  time}
              </strong>
            </div>

            <div>
              <span>Contato</span>

              <strong>
                {appointment?.phone ??
                  form.phone}
              </strong>
            </div>
          </div>

          <a
            className="button button--primary"
            href="/"
          >
            Voltar ao início
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <header className="booking-topbar">
        <a
          className="booking-logo"
          href="/"
        >
          <BrandLogo />
        </a>

        <a
          className="booking-back"
          href="/"
        >
          ← Voltar
        </a>
      </header>

      <div className="booking-wrap">
        <div className="booking-header">
          <div className="section-kicker">
            Agendar consulta
          </div>

          <h1>
            Vamos encontrar
            <br />
            um bom momento.
          </h1>

          <p>
            Escolha o formato e o horário que funcionam
            para você. Leva menos de dois minutos.
          </p>

          <BookingProgress step={step} />
        </div>

        <section className="booking-card">
          {step === 1 && (
            <div>
              <h2>
                Como você prefere ser atendido?
              </h2>

              <p className="booking-card-intro">
                A qualidade da escuta é a mesma nos
                dois formatos.
              </p>

              <div className="booking-choice-grid">
                <button
                  type="button"
                  className={`booking-choice ${
                    mode === "presencial"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    chooseMode("presencial")
                  }
                >
                  <span className="booking-choice-icon">
                    ⌖
                  </span>

                  <h3>Presencial</h3>

                  <p>
                    Campina Grande do dia 1 ao 17 e
                    Fortaleza do dia 19 ao fim do mês.
                  </p>
                </button>

                <button
                  type="button"
                  className={`booking-choice ${
                    mode === "online"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    chooseMode("online")
                  }
                >
                  <span className="booking-choice-icon">
                    □
                  </span>

                  <h3>Online</h3>

                  <p>
                    De onde você estiver, durante todo
                    o mês, com a mesma atenção.
                  </p>
                </button>
              </div>

              <div className="booking-actions">
                <span />

                <button
                  className="button button--primary"
                  type="button"
                  disabled={!mode}
                  onClick={() => setStep(2)}
                >
                  Escolher horário
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Qual dia fica melhor?</h2>

              <p className="booking-card-intro">
                {mode === "presencial" ? (
                  <>
                    Campina Grande: dias 1 a 17. Fortaleza:
                    dias 19 ao fim do mês. O dia 18 é
                    reservado para deslocamento.
                  </>
                ) : (
                  <>
                    Atendimento online disponível durante
                    todo o mês. Escolha uma data e depois
                    um horário.
                  </>
                )}
              </p>

              <div className="booking-date-grid">
                {dateOptions.map((option) => (
                  <button
                    type="button"
                    className={`booking-date ${
                      date === option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setDate(option.value);
                      setTime("");
                      setBookingError("");
                    }}
                    key={option.value}
                  >
                    <span>
                      {option.weekday}
                    </span>

                    <strong>
                      {option.number}
                    </strong>

                    <span>{option.month}</span>
                    <span>{option.location}</span>
                  </button>
                ))}
              </div>

              {date && (
                <div className="booking-times">
                  <h3>
                    Horários disponíveis
                  </h3>

                  {availabilityLoading ? (
                    <p>
                      Consultando horários...
                    </p>
                  ) : availabilityError ? (
                    <p className="booking-error">
                      Não conseguimos consultar os
                      horários agora.
                    </p>
                  ) : selectedAvailability?.times
                      .length ? (
                    <div className="booking-time-grid">
                      {selectedAvailability.times.map(
                        (option) => (
                          <button
                            type="button"
                            className={`booking-time ${
                              time === option
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => {
                              setTime(option);
                              setBookingError("");
                            }}
                            key={option}
                          >
                            {option}
                          </button>
                        ),
                      )}
                    </div>
                  ) : (
                    <p>
                      Nenhum horário disponível neste
                      dia.
                    </p>
                  )}
                </div>
              )}

              <div className="booking-actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </button>

                <button
                  className="button button--primary"
                  type="button"
                  disabled={!date || !time}
                  onClick={() => setStep(3)}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={submitBooking}>
              <h2>
                Como podemos falar com você?
              </h2>

              <p className="booking-card-intro">
                Precisamos destes dados para confirmar
                sua solicitação.
              </p>

              <div className="booking-summary">
                <span>
                  {formatConsultationLabel(
                    mode,
                    date,
                  )}
                </span>

                <strong>
                  {formatDateForDisplay(date)} ·{" "}
                  {time}
                </strong>
              </div>

              <div className="booking-form-grid">
                <label>
                  Nome completo

                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="Seu nome"
                  />

                  {errors.name && (
                    <small>
                      {errors.name}
                    </small>
                  )}
                </label>

                <label>
                  Telefone

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateForm(
                        "phone",
                        event.target.value,
                      )
                    }
                    placeholder="(85) 99999-9999"
                  />

                  {errors.phone && (
                    <small>
                      {errors.phone}
                    </small>
                  )}
                </label>

                <label>
                  E-mail

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateForm(
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="voce@email.com"
                  />

                  {errors.email && (
                    <small>
                      {errors.email}
                    </small>
                  )}
                </label>
              </div>

              <div className="booking-actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  Voltar
                </button>

                <button
                  className="button button--primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Enviando..."
                    : "Solicitar consulta"}
                </button>
              </div>

              {bookingError && (
                <p className="booking-error">
                  {bookingError}
                </p>
              )}
            </form>
          )}
        </section>

        <p className="booking-footer-note">
          Resposta em até 1 dia útil · (83) 99421-0431
        </p>
      </div>
    </main>
  );
}

function statusLabel(
  status: AppointmentStatus,
) {
  if (status === "CONFIRMADO") {
    return "Confirmado";
  }

  if (status === "CANCELADO") {
    return "Cancelado";
  }

  return "Pendente";
}

function Admin() {
  const [tokenInput, setTokenInput] =
    useState("");

  const [token, setToken] = useState(
    () =>
      sessionStorage.getItem(
        "eddy-admin-token",
      ) ?? "",
  );

  const [appointments, setAppointments] =
    useState<AdminAppointment[]>([]);

  const [filter, setFilter] = useState<
    "TODOS" | AppointmentStatus
  >("TODOS");

  const [loading, setLoading] = useState(
    Boolean(token),
  );

  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadAppointments() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "/api/admin/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          let message =
            "Não foi possível carregar os agendamentos.";

          try {
            const data =
              (await response.json()) as {
                error?: string;
              };

            if (data.error) {
              message = data.error;
            }
          } catch {
            // A resposta pode não conter JSON.
          }

          throw new ApiError(
            response.status,
            message,
          );
        }

        const data =
          (await response.json()) as AdminAppointment[];

        setAppointments(data);
      } catch (loadError) {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        if (
          loadError instanceof ApiError &&
          loadError.status === 401
        ) {
          sessionStorage.removeItem(
            "eddy-admin-token",
          );

          setToken("");
          setTokenInput("");

          setError(
            "Senha incorreta. Digite novamente.",
          );

          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar os agendamentos.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadAppointments();

    return () => controller.abort();
  }, [token, refreshKey]);

  const filteredAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          filter === "TODOS" ||
          appointment.status === filter,
      ),
    [appointments, filter],
  );

  const counts = useMemo(
    () => ({
      TODOS: appointments.length,

      PENDENTE: appointments.filter(
        (appointment) =>
          appointment.status === "PENDENTE",
      ).length,

      CONFIRMADO: appointments.filter(
        (appointment) =>
          appointment.status === "CONFIRMADO",
      ).length,

      CANCELADO: appointments.filter(
        (appointment) =>
          appointment.status === "CANCELADO",
      ).length,
    }),
    [appointments],
  );

  function login(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextToken = tokenInput.trim();

    if (!nextToken) {
      setError(
        "Digite a senha administrativa.",
      );

      return;
    }

    setError("");

    sessionStorage.setItem(
      "eddy-admin-token",
      nextToken,
    );

    setToken(nextToken);
  }

  function logout() {
    sessionStorage.removeItem(
      "eddy-admin-token",
    );

    setToken("");
    setTokenInput("");
    setAppointments([]);
    setError("");
  }

  async function updateStatus(
    id: number,
    status: AppointmentStatus,
  ) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        let message =
          "Não foi possível atualizar o agendamento.";

        try {
          const data =
            (await response.json()) as {
              error?: string;
            };

          if (data.error) {
            message = data.error;
          }
        } catch {
          // A resposta pode não conter JSON.
        }

        throw new ApiError(
          response.status,
          message,
        );
      }

      const updated =
        (await response.json()) as AdminAppointment;

      setAppointments((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );
    } catch (updateError) {
      if (
        updateError instanceof ApiError &&
        updateError.status === 401
      ) {
        sessionStorage.removeItem(
          "eddy-admin-token",
        );

        setToken("");
        setTokenInput("");

        setError(
          "Sua sessão expirou. Entre novamente.",
        );
      } else {
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Não foi possível atualizar o agendamento.",
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  if (!token) {
    return (
      <main className="admin-page admin-login-page">
        <header className="admin-topbar">
          <a
            className="admin-logo"
            href="/"
          >
            <BrandLogo />
          </a>

          <a
            className="admin-back"
            href="/"
          >
            ← Voltar ao site
          </a>
        </header>

        <section className="admin-login-card">
          <div className="section-kicker">
            Área restrita
          </div>

          <h1>
            Painel
            <br />
            administrativo.
          </h1>

          <p>
            Use sua senha para consultar e organizar
            os agendamentos.
          </p>

          <form onSubmit={login}>
            <label>
              Senha administrativa

              <input
                type="password"
                value={tokenInput}
                onChange={(event) => {
                  setTokenInput(
                    event.target.value,
                  );

                  setError("");
                }}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                autoFocus
              />
            </label>

            <button
              className="button button--primary"
              type="submit"
            >
              Entrar
            </button>

            {error && (
              <p className="admin-error">
                {error}
              </p>
            )}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <a
          className="admin-logo"
          href="/"
        >
          <BrandLogo />
        </a>

        <div className="admin-topbar-actions">
          <a
            className="admin-back"
            href="/"
          >
            Ver site
          </a>

          <button
            className="admin-logout"
            type="button"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="admin-wrap">
        <section className="admin-heading">
          <div>
            <div className="section-kicker">
              Agenda de consultas
            </div>

            <h1>Painel administrativo.</h1>

            <p>
              Confirme, acompanhe ou cancele as
              solicitações recebidas.
            </p>
          </div>

          <button
            className="button button--secondary admin-refresh"
            type="button"
            onClick={() =>
              setRefreshKey(
                (current) => current + 1,
              )
            }
            disabled={loading}
          >
            {loading
              ? "Atualizando..."
              : "Atualizar agenda"}
          </button>
        </section>

        <section
          className="admin-stats"
          aria-label="Resumo da agenda"
        >
          <article>
            <span>Total</span>
            <strong>{counts.TODOS}</strong>
          </article>

          <article>
            <span>Pendentes</span>
            <strong>{counts.PENDENTE}</strong>
          </article>

          <article>
            <span>Confirmados</span>
            <strong>{counts.CONFIRMADO}</strong>
          </article>

          <article>
            <span>Cancelados</span>
            <strong>{counts.CANCELADO}</strong>
          </article>
        </section>

        <nav
          className="admin-filters"
          aria-label="Filtrar agendamentos"
        >
          {(
            [
              ["TODOS", "Todos"],
              ["PENDENTE", "Pendentes"],
              ["CONFIRMADO", "Confirmados"],
              ["CANCELADO", "Cancelados"],
            ] as const
          ).map(([value, label]) => (
            <button
              type="button"
              className={
                filter === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(value)
              }
              key={value}
            >
              {label}{" "}
              <span>{counts[value]}</span>
            </button>
          ))}
        </nav>

        {error && (
          <p className="admin-error admin-error--dashboard">
            {error}
          </p>
        )}

        <section
          className="admin-list"
          aria-live="polite"
        >
          {loading ? (
            <div className="admin-empty">
              Carregando agendamentos...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="admin-empty">
              Nenhum agendamento encontrado neste
              filtro.
            </div>
          ) : (
            filteredAppointments.map(
              (appointment) => (
                <article
                  className="admin-appointment"
                  key={appointment.id}
                >
                  <div className="admin-appointment-date">
                    <span>
                      {formatDateForDisplay(
                        appointment.scheduledDate,
                      )}
                    </span>

                    <strong>
                      {appointment.scheduledTime}
                    </strong>
                  </div>

                  <div className="admin-appointment-main">
                    <div className="admin-appointment-title">
                      <div>
                        <span>Paciente</span>

                        <h2>
                          {appointment.name}
                        </h2>
                      </div>

                      <span
                        className={`admin-status admin-status--${appointment.status.toLowerCase()}`}
                      >
                        {statusLabel(
                          appointment.status,
                        )}
                      </span>
                    </div>

                    <dl className="admin-appointment-details">
                      <div>
                        <dt>Formato</dt>

                        <dd>
                          {formatConsultationLabel(
                            appointment.mode,
                            appointment.scheduledDate,
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt>Telefone</dt>

                        <dd>
                          <a
                            href={`tel:${appointment.phone}`}
                          >
                            {appointment.phone}
                          </a>
                        </dd>
                      </div>

                      <div>
                        <dt>E-mail</dt>

                        <dd>
                          <a
                            href={`mailto:${appointment.email}`}
                          >
                            {appointment.email}
                          </a>
                        </dd>
                      </div>
                    </dl>

                    <div className="admin-appointment-actions">
                      {appointment.status !==
                        "CONFIRMADO" && (
                        <button
                          type="button"
                          className="admin-action admin-action--confirm"
                          onClick={() =>
                            void updateStatus(
                              appointment.id,
                              "CONFIRMADO",
                            )
                          }
                          disabled={
                            updatingId ===
                            appointment.id
                          }
                        >
                          Confirmar
                        </button>
                      )}

                      {appointment.status !==
                        "CANCELADO" && (
                        <button
                          type="button"
                          className="admin-action admin-action--cancel"
                          onClick={() =>
                            void updateStatus(
                              appointment.id,
                              "CANCELADO",
                            )
                          }
                          disabled={
                            updatingId ===
                            appointment.id
                          }
                        >
                          Cancelar
                        </button>
                      )}

                      {appointment.status ===
                        "CANCELADO" && (
                        <button
                          type="button"
                          className="admin-action admin-action--reopen"
                          onClick={() =>
                            void updateStatus(
                              appointment.id,
                              "PENDENTE",
                            )
                          }
                          disabled={
                            updatingId ===
                            appointment.id
                          }
                        >
                          Reabrir como pendente
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ),
            )
          )}
        </section>
      </div>
    </main>
  );
}

function AppRouter() {
  const pagina = new URLSearchParams(
    window.location.search,
  ).get("pagina");

  if (pagina === "agendar") {
    return <Booking />;
  }

  if (pagina === "admin") {
    return <Admin />;
  }

  return <Home />;
}

function App() {
  return <AppRouter />;
}

export default App;
