import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, CircleCheck, Clock3, CreditCard, HeartPulse, Leaf, MapPin, Menu, Monitor, Phone, ShieldCheck, Sparkles, X } from 'lucide-react';
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { getListAppointmentAvailabilityQueryKey, useCreateAppointment, useListAppointmentAvailability } from '@workspace/api-client-react';
import type { Appointment } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Admin from '@/pages/admin';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type ConsultationMode = 'presencial' | 'online';
type BookingForm = { name: string; phone: string; email: string };

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string) {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

function getErrorStatus(error: unknown) {
  return typeof error === 'object' && error !== null && 'status' in error
    ? Number((error as { status?: number }).status)
    : undefined;
}

function formatDateForDisplay(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(date);
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
   logoImageUrl: `${window.location.origin}${basePath}/logo-mark.png`,
  },
  variables: {
    colorPrimary: '#2F331B',
    colorForeground: '#2F331B',
    colorMutedForeground: '#636B37',
    colorDanger: '#636B37',
    colorBackground: '#F2EBD9',
    colorInput: '#F2EBD9',
    colorInputForeground: '#2F331B',
    colorNeutral: '#8BA564',
    fontFamily: 'Montserrat, sans-serif',
    borderRadius: '0.55rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#F2EBD9] rounded-xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#2F331B] font-semibold',
    headerSubtitle: 'text-[#636B37]',
    socialButtonsBlockButtonText: 'text-[#2F331B]',
    formFieldLabel: 'text-[#2F331B]',
    footerActionLink: 'text-[#2F331B] font-semibold',
    footerActionText: 'text-[#636B37]',
    dividerText: 'text-[#636B37]',
    identityPreviewEditButton: 'text-[#2F331B]',
    formFieldSuccessText: 'text-[#636B37]',
    alertText: 'text-[#636B37]',
    logoBox: 'h-12',
    logoImage: 'h-12 w-12 rounded-full',
    socialButtonsBlockButton: 'border-[#8BA564] bg-[#F2EBD9]',
    formButtonPrimary: 'bg-[#2F331B] text-[#F2EBD9] hover:bg-[#636B37]',
    formFieldInput: 'border-[#8BA564] bg-[#F2EBD9] text-[#2F331B]',
    footerAction: 'text-[#636B37]',
    dividerLine: 'bg-[#8BA564]',
    alert: 'border-[#636B37] bg-[#8BA564]/20',
    otpCodeFieldInput: 'border-[#8BA564] bg-[#F2EBD9] text-[#2F331B]',
    formFieldRow: 'text-[#2F331B]',
    main: 'bg-transparent',
  },
};

const services = [
  { title: 'Consulta nutricional', detail: 'Um encontro completo para entender sua rotina e traçar um caminho possível.' },
  { title: 'Acompanhamento individual', detail: 'Ajustes cuidadosos para que o plano acompanhe a sua vida real.' },
  { title: 'Consulta online ou presencial', detail: 'Escolha o formato que faz sentido para você, com a mesma atenção.' },
];

const principles = [
  { icon: HeartPulse, title: 'Escuta antes da prescrição', text: 'Sua história, seus horários e sua relação com a comida entram na conversa.' },
  { icon: Leaf, title: 'Prático para a vida real', text: 'Estratégias que cabem na sua rotina — sem cardápios impossíveis de sustentar.' },
  { icon: Sparkles, title: 'Evolução sem culpa', text: 'Nutrição como cuidado contínuo, com clareza, autonomia e gentileza.' },
];

function Logo({ detailed = false }: { detailed?: boolean }) {
  return (
    <span className={`brand-lockup ${detailed ? 'brand-lockup-detailed' : ''}`} data-testid="brand-eddy-diniz">
      <img className="brand-logo-image" src={`${basePath}/logo-official.png`} alt="Eddy Diniz Nutricionista" />
      {detailed && <span className="brand-credentials">Nutricionista | CRN-11 24210</span>}
    </span>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="topbar">
          <Link href="/" className="brand-mark home-brand" data-testid="link-home-logo" onClick={() => setMenuOpen(false)}>
            <Logo detailed />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a className="nav-link" href="/#sobre" data-testid="link-nav-sobre">Sobre</a>
          <a className="nav-link" href="/#abordagem" data-testid="link-nav-abordagem">Abordagem</a>
          <a className="nav-link" href="/#contato" data-testid="link-nav-contato">Contato</a>
          <Link href="/agendar" className="button-primary" data-testid="link-nav-agendar">Agendar consulta <ArrowUpRight size={15} /></Link>
        </nav>
        <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} data-testid="button-mobile-menu">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Menu mobile">
          <a href="/#sobre" onClick={() => setMenuOpen(false)} data-testid="link-mobile-sobre">Sobre</a>
          <a href="/#abordagem" onClick={() => setMenuOpen(false)} data-testid="link-mobile-abordagem">Abordagem</a>
          <a href="/#contato" onClick={() => setMenuOpen(false)} data-testid="link-mobile-contato">Contato</a>
          <Link href="/agendar" className="button-primary" onClick={() => setMenuOpen(false)} data-testid="link-mobile-agendar">Agendar consulta <ArrowUpRight size={15} /></Link>
        </nav>
      )}
    </>
  );
}

function Home() {
  return (
    <main className="site-shell">
      <Header />
      <section className="hero reveal">
        <div className="hero-copy">
          <div className="eyebrow">Nutrição que acompanha você</div>
          <h1 className="display-serif">Comer bem,<br /><em>sem complicar.</em></h1>
          <p className="hero-lede">Cuidado nutricional individualizado para construir uma relação mais leve, possível e consciente com a comida.</p>
          <div className="hero-actions">
            <Link href="/agendar" className="button-primary" data-testid="link-hero-agendar">Agendar consulta <ArrowUpRight size={16} /></Link>
            <a href="#sobre" className="button-secondary" data-testid="link-hero-conhecer">Conhecer o trabalho <ChevronRight size={15} /></a>
          </div>
        </div>
        <div className="hero-art reveal reveal-delay-2" aria-label="Identidade visual Eddy Diniz">
          <img className="hero-logo" src={`${basePath}/logo-official.png`} alt="Eddy Diniz Nutricionista" />
          <span className="hero-logo-caption">Nutrição com clareza, presença e cuidado.</span>
        </div>
      </section>

      <div className="trust-strip reveal reveal-delay-3" aria-label="Credenciais de Eddy Diniz">
        <span className="trust-item"><span className="trust-dot" /> CRN-11 24210</span>
        <span className="trust-item"><span className="trust-dot" /> Atendimento individual</span>
        <span className="trust-item"><span className="trust-dot" /> Atendimento presencial e online</span>
      </div>

      <section className="section about-section" id="sobre">
        <div>
          <div className="eyebrow">Sobre mim</div>
          <p className="about-note">“Você não precisa de mais uma regra. Precisa de um plano que entenda o seu dia.”</p>
        </div>
        <div>
          <p className="about-text">Sou Eddy Diniz, nutricionista (CRN-11 24210). Meu trabalho começa pela escuta: entender onde você está, o que deseja mudar e quais escolhas fazem sentido dentro da sua rotina.</p>
          <p className="about-text">A partir disso, construímos juntos uma direção clara, sem terrorismo alimentar e sem promessas rápidas. Nutrição pode ser firme e acolhedora ao mesmo tempo.</p>
          <div className="about-signature">Eddy Diniz · Nutricionista</div>
        </div>
      </section>

      <section className="section services-section" id="servicos">
        <div className="section-heading">
          <div className="eyebrow">Como posso ajudar</div>
          <h2 className="display-serif">Um cuidado feito<br />para a sua fase.</h2>
          <p>O acompanhamento se adapta ao que você está vivendo agora — com espaço para perguntas, ajustes e evolução.</p>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <div className="service-row" key={service.title} data-testid={`row-service-${index + 1}`}>
              <span className="service-number">0{index + 1}</span>
              <h3>{service.title}</h3>
              <ArrowUpRight className="service-arrow" size={18} />
              <p>{service.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="abordagem">
        <div className="section-heading">
          <div className="eyebrow">Como funciona a consulta</div>
          <h2 className="display-serif">Menos culpa.<br />Mais clareza.</h2>
          <p>Começamos pela sua história e pela sua rotina. A partir dessa conversa, construímos estratégias simples, personalizadas e possíveis de manter.</p>
        </div>
        <div className="approach-grid">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <article className="approach-card" key={title} data-testid={`card-principle-${index + 1}`}>
              <span className="approach-icon"><Icon size={19} strokeWidth={1.7} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section quote-section">
        <div className="quote-mark" aria-hidden="true">“</div>
        <p className="quote">Não é sobre fazer tudo perfeito. É sobre fazer escolhas que cuidam de você — de verdade.</p>
        <div className="quote-source">Uma conversa pode ser o começo</div>
      </section>

      <section className="cta-band" id="contato">
        <h2 className="display-serif">Seu próximo passo pode ser mais leve.</h2>
        <Link href="/agendar" className="button-primary" data-testid="link-cta-agendar">Agendar <ArrowUpRight size={16} /></Link>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Link href="/" className="brand-mark" data-testid="link-footer-home"><Logo /></Link>
            <p className="footer-note">Nutrição prática, humana e sem extremos para a vida que você leva.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <div className="footer-links">
              <a href="#sobre" data-testid="link-footer-sobre">Sobre</a>
              <a href="#abordagem" data-testid="link-footer-abordagem">Abordagem</a>
              <Link href="/agendar" data-testid="link-footer-agendar">Agendar consulta</Link>
            </div>
          </div>
          <div>
            <h3>Contato</h3>
            <div className="footer-links">
              <a href="tel:+5583994210431" data-testid="link-footer-phone">(83) 99421-0431</a>
              <a href="mailto:eddydiniz69@gmail.com" data-testid="link-footer-email">eddydiniz69@gmail.com</a>
              <span className="footer-license">CRN-11 24210</span>
            </div>
          </div>
        </div>
        <div className="footer-meta"><span>© {new Date().getFullYear()} Eddy Diniz</span><span>Nutricionista</span></div>
      </footer>
    </main>
  );
}

function BookingProgress({ step }: { step: number }) {
  return (
    <div className="progress" aria-label={`Etapa ${step} de 3`}>
      {['Formato', 'Horário', 'Seus dados'].map((label, index) => (
        <span className={`progress-step ${step >= index + 1 ? 'active' : ''}`} key={label}>
          <span>{step > index + 1 ? <Check size={12} /> : index + 1}</span>{label}
          {index < 2 && <i className="progress-line" aria-hidden="true" />}
        </span>
      ))}
    </div>
  );
}

function Booking() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<ConsultationMode | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [form, setForm] = useState<BookingForm>({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<BookingForm>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submittedAppointment, setSubmittedAppointment] = useState<Appointment | null>(null);
  const createAppointment = useCreateAppointment();

  const dateOptions = useMemo(() => {
    const result: { value: string; weekday: string; number: string; month: string }[] = [];
    const formatterWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
    const formatterMonth = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
    for (let index = 1; index < 7; index += 1) {
      const next = new Date();
      next.setDate(next.getDate() + index);
      result.push({
        value: next.toISOString().slice(0, 10),
        weekday: formatterWeekday.format(next).replace('.', ''),
        number: String(next.getDate()).padStart(2, '0'),
        month: formatterMonth.format(next).replace('.', ''),
      });
    }
    return result;
  }, []);
  const availabilityParams = useMemo(() => ({ startDate: dateOptions[0]?.value ?? '', days: 6 }), [dateOptions]);
  const { data: availability = [], isLoading: availabilityLoading, isError: availabilityError } = useListAppointmentAvailability(
    availabilityParams,
    {
      query: {
        enabled: step === 2 && Boolean(mode),
        queryKey: getListAppointmentAvailabilityQueryKey(availabilityParams),
      },
    },
  );
  const selectedDate = dateOptions.find((option) => option.value === date);
  const readableDate = selectedDate ? `${selectedDate.number} de ${selectedDate.month}` : '';
  const selectedAvailability = availability.find((item) => item.date === date);

  function chooseMode(nextMode: ConsultationMode) {
    setMode(nextMode);
    setDate('');
    setTime('');
    setBookingError('');
  }

  function updateForm(field: keyof BookingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function goToSchedule() {
    if (mode) setStep(2);
  }

  function goToDetails() {
    if (date && time) setStep(3);
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<BookingForm> = {};
    if (!form.name.trim()) nextErrors.name = 'Digite seu nome para continuar.';
    if (!form.phone.trim()) nextErrors.phone = 'Digite seu telefone para continuar.';
    if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Digite um e-mail válido.';
    setErrors(nextErrors);
    setBookingError('');
    if (Object.keys(nextErrors).length === 0 && mode && date && time) {
      createAppointment.mutate({
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          mode,
          scheduledDate: date,
          scheduledTime: time,
        },
      }, {
        onSuccess: (appointment) => {
          setSubmittedAppointment(appointment);
          setConfirmed(true);
        },
        onError: (error) => {
          setBookingError(getErrorStatus(error) === 409
            ? 'Esse horário acabou de ser preenchido. Escolha outra opção para continuar.'
            : 'Não foi possível registrar sua solicitação agora. Tente novamente em instantes.');
        },
      });
    }
  }

  function resetBooking() {
    setStep(1);
    setMode(null);
    setDate('');
    setTime('');
    setForm({ name: '', phone: '', email: '' });
    setConfirmed(false);
    setBookingError('');
    setSubmittedAppointment(null);
  }

  return (
    <main className="booking-page">
      <header className="topbar booking-top">
        <Link href="/" className="brand-mark" data-testid="link-booking-logo"><Logo /></Link>
        <Link href="/" className="button-secondary" data-testid="link-booking-back"><ArrowLeft size={15} /> Voltar</Link>
      </header>
      <div className="booking-wrap">
        {confirmed ? (
          <section className="confirmation reveal" aria-live="polite">
            <span className="confirmation-icon"><CircleCheck size={29} /></span>
            <div className="eyebrow">Pedido recebido</div>
            <h1 className="display-serif">Até breve,<br /><em>{(submittedAppointment?.name ?? form.name).split(' ')[0]}.</em></h1>
            <p>Sua solicitação de consulta foi registrada. Eddy entrará em contato pelo telefone informado para confirmar os detalhes do encontro.</p>
            <div className="confirmation-details" data-testid="status-booking-confirmation">
              <div className="summary-line"><span>Formato</span><strong>{(submittedAppointment?.mode ?? mode) === 'online' ? 'Consulta online' : 'Consulta presencial'}</strong></div>
              <div className="summary-line"><span>Data</span><strong>{formatDateForDisplay(submittedAppointment?.scheduledDate ?? date)}</strong></div>
              <div className="summary-line"><span>Horário</span><strong>{submittedAppointment?.scheduledTime ?? time}</strong></div>
              <div className="summary-line"><span>Contato</span><strong>{submittedAppointment?.phone ?? form.phone}</strong></div>
            </div>
            <div className="payment-reserve" role="note">
              <CreditCard size={18} />
              <p>Pagamento por Pix ou cartão será combinado diretamente após a confirmação. Esta etapa ainda não está integrada.</p>
            </div>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/" className="button-primary" data-testid="link-confirmation-home">Voltar para o início <ArrowUpRight size={15} /></Link>
              <button type="button" className="button-secondary" onClick={resetBooking} data-testid="button-new-booking">Fazer nova solicitação</button>
            </div>
          </section>
        ) : (
          <>
            <div className="booking-header reveal">
              <div className="eyebrow">Agendar consulta</div>
              <h1 className="display-serif">Vamos encontrar<br />um bom momento.</h1>
              <p>Escolha o formato e o horário que funcionam para você. Leva menos de dois minutos.</p>
              <BookingProgress step={step} />
            </div>
            <section className="booking-card reveal reveal-delay-1">
              {step === 1 && (
                <div>
                  <h2>Como você prefere ser atendido?</h2>
                  <p className="booking-card-intro">A qualidade da escuta é a mesma nos dois formatos.</p>
                  <div className="choice-grid">
                    <button type="button" className={`choice-card ${mode === 'presencial' ? 'selected' : ''}`} onClick={() => chooseMode('presencial')} aria-pressed={mode === 'presencial'} data-testid="button-mode-presencial">
                      <span className="choice-card-top"><span className="choice-card-icon"><MapPin size={18} /></span>{mode === 'presencial' && <Check size={18} />}</span>
                      <h3>Presencial</h3><p>Atendimento em Fortaleza, em um espaço preparado para você.</p>
                    </button>
                    <button type="button" className={`choice-card ${mode === 'online' ? 'selected' : ''}`} onClick={() => chooseMode('online')} aria-pressed={mode === 'online'} data-testid="button-mode-online">
                      <span className="choice-card-top"><span className="choice-card-icon"><Monitor size={18} /></span>{mode === 'online' && <Check size={18} />}</span>
                      <h3>Online</h3><p>De onde você estiver, com a mesma atenção e privacidade.</p>
                    </button>
                  </div>
                  <div className="booking-actions">
                    <span />
                    <button type="button" className="button-primary" disabled={!mode} onClick={goToSchedule} data-testid="button-next-format">Escolher horário <ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2>Qual dia fica melhor?</h2>
                  <p className="booking-card-intro">Selecione uma data e depois um dos horários disponíveis.</p>
                  <div className="date-section">
                    <h3>Próximos dias</h3>
                    <div className="date-grid">
                      {dateOptions.map((option) => (
                        <button type="button" className={`date-button ${date === option.value ? 'selected' : ''}`} onClick={() => { setDate(option.value); setTime(''); }} key={option.value} aria-pressed={date === option.value} data-testid={`button-date-${option.value}`}>
                          <span className="date-weekday">{option.weekday}</span><span className="date-number">{option.number}</span><span className="date-weekday">{option.month}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                      {date && (
                    <div className="date-section reveal">
                      <h3>Horários disponíveis</h3>
                      {availabilityLoading ? (
                        <div className="availability-note availability-loading" data-testid="status-availability-loading">Consultando horários...</div>
                      ) : availabilityError ? (
                        <div className="availability-note availability-error" role="alert" data-testid="status-availability-error">Não conseguimos consultar os horários agora. Tente novamente em instantes.</div>
                      ) : selectedAvailability?.times.length ? (
                        <div className="time-grid">
                          {selectedAvailability.times.map((option) => (
                            <button type="button" className={`time-button ${time === option ? 'selected' : ''}`} onClick={() => setTime(option)} key={option} aria-pressed={time === option} data-testid={`button-time-${option.replace(':', '-')}`}>{option}</button>
                          ))}
                        </div>
                      ) : (
                        <div className="availability-note" data-testid="status-availability-empty">Nenhum horário disponível neste dia. Escolha outra data.</div>
                      )}
                    </div>
                  )}
                  <div className="booking-actions">
                    <button type="button" className="button-secondary" onClick={() => setStep(1)} data-testid="button-back-format"><ArrowLeft size={15} /> Voltar</button>
                    <button type="button" className="button-primary" disabled={!date || !time} onClick={goToDetails} data-testid="button-next-time">Continuar <ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <form onSubmit={submitBooking}>
                  <h2>Como podemos falar com você?</h2>
                  <p className="booking-card-intro">Só precisamos destes dados para confirmar sua solicitação.</p>
                  <div className="booking-summary" data-testid="text-booking-summary">
                    <div className="summary-line"><span>Consulta {mode === 'online' ? 'online' : 'presencial'}</span><strong>{readableDate} · {time}</strong></div>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="name">Nome completo</label>
                      <input id="name" value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Como você gosta de ser chamado?" aria-invalid={Boolean(errors.name)} data-testid="input-name" />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>
                    <div className="form-field">
                      <label htmlFor="phone">Telefone</label>
                      <input id="phone" type="tel" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="(85) 99999-9999" aria-invalid={Boolean(errors.phone)} data-testid="input-phone" />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                    <div className="form-field">
                      <label htmlFor="email">E-mail</label>
                      <input id="email" type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="voce@email.com" aria-invalid={Boolean(errors.email)} data-testid="input-email" />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="payment-reserve" role="note">
                    <ShieldCheck size={18} />
                    <p><strong>Pagamento, depois.</strong><br />As opções Pix e cartão serão apresentadas por Eddy após a confirmação. Nenhum pagamento é solicitado agora.</p>
                  </div>
                  <div className="booking-actions">
                    <button type="button" className="button-secondary" onClick={() => setStep(2)} data-testid="button-back-time"><ArrowLeft size={15} /> Voltar</button>
                     <button type="submit" className="button-primary" disabled={createAppointment.isPending} data-testid="button-submit-booking">{createAppointment.isPending ? 'Enviando solicitação...' : 'Solicitar consulta'} <Check size={16} /></button>
                  </div>
                  {bookingError && <div className="booking-error" role="alert" data-testid="status-booking-error">{bookingError}</div>}
                </form>
              )}
            </section>
            <div className="booking-footer-note"><Clock3 size={14} /> Resposta em até 1 dia útil · <Phone size={14} /> (83) 99421-0431</div>
          </>
        )}
      </div>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/agendar" component={Booking} />
        <Route path="/admin" component={Admin} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function SignInPage() {
  return (
    <div className="clerk-page">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="clerk-page">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: 'Bem-vindo de volta', subtitle: 'Entre para acessar seu espaço privado' } },
        signUp: { start: { title: 'Crie seu acesso', subtitle: 'Seu espaço de trabalho começa aqui' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
    </TooltipProvider>
  );
}

export default App;
