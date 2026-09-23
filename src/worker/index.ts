import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  ADMIN_TOKEN: string;
  RESEND_API_KEY: string;
};

type AppointmentMode =
  | "presencial"
  | "online";

type AppointmentStatus =
  | "PENDENTE"
  | "CONFIRMADO"
  | "CANCELADO";

type AppointmentRow = {
  id: number;
  name: string;
  phone: string;
  email: string;
  mode: AppointmentMode;
  scheduled_date: string;
  scheduled_time: string;
  status: AppointmentStatus;
  created_at: string;
};

const app =
  new Hono<{ Bindings: Bindings }>();

const SLOT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

app.use(
  "/api/admin/*",
  async (c, next) => {
    const authorization =
      c.req.header("Authorization");

    const expectedAuthorization =
      `Bearer ${c.env.ADMIN_TOKEN}`;

    if (
      !c.env.ADMIN_TOKEN ||
      authorization !== expectedAuthorization
    ) {
      return c.json(
        {
          error:
            "Senha administrativa inválida.",
        },
        401,
      );
    }

    await next();
  },
);

function isValidDate(
  value: string,
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date =
    new Date(`${value}T12:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) ===
      value
  );
}

function addDays(
  value: string,
  days: number,
): string {
  const date =
    new Date(`${value}T12:00:00Z`);

  date.setUTCDate(
    date.getUTCDate() + days,
  );

  return date
    .toISOString()
    .slice(0, 10);
}

function getTodayInFortaleza(): string {
  const parts =
    new Intl.DateTimeFormat("en", {
      timeZone: "America/Fortaleza",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

  const year = parts.find(
    (part) => part.type === "year",
  )?.value;

  const month = parts.find(
    (part) => part.type === "month",
  )?.value;

  const day = parts.find(
    (part) => part.type === "day",
  )?.value;

  return `${year}-${month}-${day}`;
}

function isFutureSlot(
  date: string,
  time: string,
): boolean {
  return (
    Date.parse(
      `${date}T${time}:00-03:00`,
    ) > Date.now()
  );
}

function serializeAppointment(
  row: AppointmentRow,
) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    mode: row.mode,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    status: row.status,
    createdAt: row.created_at,
  };
}

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAppointmentDate(
  value: string,
): string {
  const date = new Date(
    `${value}T12:00:00-03:00`,
  );

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone: "America/Fortaleza",
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

async function sendNewAppointmentEmail(
  apiKey: string,
  appointment: AppointmentRow,
): Promise<void> {
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY não configurada.",
    );

    return;
  }

  const dateLabel =
    formatAppointmentDate(
      appointment.scheduled_date,
    );

  const modeLabel =
    appointment.mode === "online"
      ? "Online"
      : "Presencial";

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type":
          "application/json",
        "Idempotency-Key":
          `appointment-${appointment.id}`,
      },

      body: JSON.stringify({
        from:
          "Eddy Diniz Agenda <onboarding@resend.dev>",

        to: [
          "eddydiniz69@gmail.com",
        ],

        subject:
          `Novo agendamento: ${appointment.name} - ` +
          `${appointment.scheduled_date} às ` +
          `${appointment.scheduled_time}`,

        text: [
          "Novo pedido de consulta recebido.",
          "",
          `Paciente: ${appointment.name}`,
          `Data: ${dateLabel}`,
          `Horário: ${appointment.scheduled_time}`,
          `Formato: ${modeLabel}`,
          `Telefone: ${appointment.phone}`,
          `E-mail: ${appointment.email}`,
          "",
          "Acesse o painel administrativo para confirmar ou cancelar.",
          "https://eddy-diniz-nutri.eddydiniz69.workers.dev/?pagina=admin",
        ].join("\n"),

        html: `
          <div style="
            margin:0;
            padding:32px 16px;
            background:#f2e8d9;
            font-family:Arial,sans-serif;
            color:#2f331b;
          ">
            <div style="
              max-width:620px;
              margin:0 auto;
              overflow:hidden;
              background:#fffaf2;
              border:1px solid #d9d0bd;
              border-radius:24px;
            ">
              <div style="
                padding:28px;
                background:#636b37;
                color:#f2e8d9;
              ">
                <div style="
                  font-size:12px;
                  font-weight:700;
                  letter-spacing:2px;
                  text-transform:uppercase;
                ">
                  Eddy Diniz Nutricionista
                </div>

                <h1 style="
                  margin:12px 0 0;
                  font-family:Georgia,serif;
                  font-size:30px;
                  font-weight:400;
                ">
                  Novo agendamento recebido
                </h1>
              </div>

              <div style="padding:28px">
                <p style="
                  margin:0 0 24px;
                  font-size:15px;
                  line-height:1.6;
                ">
                  Um novo pedido de consulta
                  foi registrado no site.
                </p>

                <table style="
                  width:100%;
                  border-collapse:collapse;
                  font-size:14px;
                ">
                  <tr>
                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      color:#6b7050;
                    ">
                      Paciente
                    </td>

                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      text-align:right;
                      font-weight:700;
                    ">
                      ${escapeHtml(
                        appointment.name,
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      color:#6b7050;
                    ">
                      Data
                    </td>

                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      text-align:right;
                      font-weight:700;
                    ">
                      ${escapeHtml(dateLabel)}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      color:#6b7050;
                    ">
                      Horário
                    </td>

                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      text-align:right;
                      font-weight:700;
                    ">
                      ${escapeHtml(
                        appointment.scheduled_time,
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      color:#6b7050;
                    ">
                      Formato
                    </td>

                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      text-align:right;
                      font-weight:700;
                    ">
                      ${modeLabel}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      color:#6b7050;
                    ">
                      Telefone
                    </td>

                    <td style="
                      padding:12px 0;
                      border-bottom:1px solid #e4dccd;
                      text-align:right;
                      font-weight:700;
                    ">
                      ${escapeHtml(
                        appointment.phone,
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:12px 0;
                      color:#6b7050;
                    ">
                      E-mail
                    </td>

                    <td style="
                      padding:12px 0;
                      text-align:right;
                      font-weight:700;
                    ">
                      ${escapeHtml(
                        appointment.email,
                      )}
                    </td>
                  </tr>
                </table>

                <a
                  href="https://eddy-diniz-nutri.eddydiniz69.workers.dev/?pagina=admin"
                  style="
                    display:block;
                    margin-top:26px;
                    padding:16px 20px;
                    text-align:center;
                    text-decoration:none;
                    color:#f2e8d9;
                    background:#2f331b;
                    border-radius:999px;
                    font-size:14px;
                    font-weight:700;
                  "
                >
                  Abrir painel administrativo
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    },
  );

  if (!response.ok) {
    const details =
      await response.text();

    console.error(
      "Erro do Resend:",
      response.status,
      details,
    );
  }
}

app.get("/api/", (c) => {
  return c.json({
    name:
      "Eddy Diniz Nutricionista",
    status: "online",
  });
});

app.get(
  "/api/appointments/availability",
  async (c) => {
    const startDate =
      c.req.query("startDate") ??
      getTodayInFortaleza();

    const rawDays = Number(
      c.req.query("days") ?? "6",
    );

    const days =
      Number.isInteger(rawDays)
        ? rawDays
        : 0;

    if (
      !isValidDate(startDate) ||
      days < 1 ||
      days > 31
    ) {
      return c.json(
        {
          error:
            "Informe uma data válida e um período entre 1 e 31 dias.",
        },
        400,
      );
    }

    if (
      startDate <
      getTodayInFortaleza()
    ) {
      return c.json(
        {
          error:
            "A data inicial não pode estar no passado.",
        },
        400,
      );
    }

    const endDate = addDays(
      startDate,
      days - 1,
    );

    const { results } =
      await c.env.DB.prepare(
        `SELECT
          scheduled_date,
          scheduled_time
         FROM appointments
         WHERE scheduled_date
           BETWEEN ? AND ?
           AND status IN (
             'PENDENTE',
             'CONFIRMADO'
           )`,
      )
        .bind(startDate, endDate)
        .all<{
          scheduled_date: string;
          scheduled_time: string;
        }>();

    const bookedSlots = new Set(
      results.map(
        (item) =>
          `${item.scheduled_date}|${item.scheduled_time}`,
      ),
    );

    const availability =
      Array.from(
        { length: days },
        (_, index) => {
          const date = addDays(
            startDate,
            index,
          );

          const times =
            SLOT_TIMES.filter(
              (time) =>
                isFutureSlot(
                  date,
                  time,
                ) &&
                !bookedSlots.has(
                  `${date}|${time}`,
                ),
            );

          return {
            date,
            times,
          };
        },
      );

    return c.json(availability);
  },
);

app.post(
  "/api/appointments",
  async (c) => {
    let body:
      Record<string, unknown>;

    try {
      body =
        await c.req.json<
          Record<string, unknown>
        >();
    } catch {
      return c.json(
        {
          error:
            "Os dados enviados não são válidos.",
        },
        400,
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const mode = body.mode;

    const scheduledDate =
      typeof body.scheduledDate ===
      "string"
        ? body.scheduledDate
        : "";

    const scheduledTime =
      typeof body.scheduledTime ===
      "string"
        ? body.scheduledTime
        : "";

    if (
      name.length < 2 ||
      name.length > 120
    ) {
      return c.json(
        {
          error:
            "Informe um nome válido.",
        },
        400,
      );
    }

    if (
      phone.length < 8 ||
      phone.length > 30
    ) {
      return c.json(
        {
          error:
            "Informe um telefone válido.",
        },
        400,
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      ) ||
      email.length > 160
    ) {
      return c.json(
        {
          error:
            "Informe um e-mail válido.",
        },
        400,
      );
    }

    if (
      mode !== "presencial" &&
      mode !== "online"
    ) {
      return c.json(
        {
          error:
            "Escolha atendimento presencial ou online.",
        },
        400,
      );
    }

    if (
      !isValidDate(scheduledDate) ||
      !isFutureSlot(
        scheduledDate,
        scheduledTime,
      )
    ) {
      return c.json(
        {
          error:
            "Escolha uma data e um horário futuros.",
        },
        400,
      );
    }

    if (
      !SLOT_TIMES.includes(
        scheduledTime as
          (typeof SLOT_TIMES)[number],
      )
    ) {
      return c.json(
        {
          error:
            "Esse horário não está disponível para agendamento.",
        },
        400,
      );
    }

    const existing =
      await c.env.DB.prepare(
        `SELECT id
         FROM appointments
         WHERE scheduled_date = ?
           AND scheduled_time = ?
           AND status IN (
             'PENDENTE',
             'CONFIRMADO'
           )
         LIMIT 1`,
      )
        .bind(
          scheduledDate,
          scheduledTime,
        )
        .first<{ id: number }>();

    if (existing) {
      return c.json(
        {
          error:
            "Esse horário acabou de ser reservado. Escolha outro.",
        },
        409,
      );
    }

    try {
      const insertResult =
        await c.env.DB.prepare(
          `INSERT INTO appointments
            (
              name,
              phone,
              email,
              mode,
              scheduled_date,
              scheduled_time,
              status
            )
           VALUES (
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             'PENDENTE'
           )`,
        )
          .bind(
            name,
            phone,
            email,
            mode,
            scheduledDate,
            scheduledTime,
          )
          .run();

      const created =
        await c.env.DB.prepare(
          `SELECT
            id,
            name,
            phone,
            email,
            mode,
            scheduled_date,
            scheduled_time,
            status,
            created_at
           FROM appointments
           WHERE id = ?`,
        )
          .bind(
            insertResult.meta
              .last_row_id,
          )
          .first<AppointmentRow>();

      if (!created) {
        return c.json(
          {
            error:
              "Não foi possível localizar o agendamento criado.",
          },
          500,
        );
      }

      c.executionCtx.waitUntil(
        sendNewAppointmentEmail(
          c.env.RESEND_API_KEY,
          created,
        ).catch((error) => {
          console.error(
            "Erro ao enviar aviso de novo agendamento:",
            error,
          );
        }),
      );

      return c.json(
        serializeAppointment(created),
        201,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.toLowerCase()
          : "";

      if (
        message.includes("unique") ||
        message.includes("constraint")
      ) {
        return c.json(
          {
            error:
              "Esse horário acabou de ser reservado. Escolha outro.",
          },
          409,
        );
      }

      console.error(
        "Erro ao criar agendamento:",
        error,
      );

      return c.json(
        {
          error:
            "Não foi possível criar o agendamento.",
        },
        500,
      );
    }
  },
);

app.get(
  "/api/admin/appointments",
  async (c) => {
    const { results } =
      await c.env.DB.prepare(
        `SELECT
          id,
          name,
          phone,
          email,
          mode,
          scheduled_date,
          scheduled_time,
          status,
          created_at
         FROM appointments
         ORDER BY
          scheduled_date ASC,
          scheduled_time ASC,
          id ASC`,
      ).all<AppointmentRow>();

    return c.json(
      results.map(
        serializeAppointment,
      ),
    );
  },
);

app.patch(
  "/api/admin/appointments/:id/status",
  async (c) => {
    const id = Number(
      c.req.param("id"),
    );

    if (
      !Number.isInteger(id) ||
      id < 1
    ) {
      return c.json(
        {
          error:
            "Agendamento inválido.",
        },
        400,
      );
    }

    let body:
      Record<string, unknown>;

    try {
      body =
        await c.req.json<
          Record<string, unknown>
        >();
    } catch {
      return c.json(
        {
          error:
            "Os dados enviados não são válidos.",
        },
        400,
      );
    }

    const status = body.status;

    if (
      status !== "PENDENTE" &&
      status !== "CONFIRMADO" &&
      status !== "CANCELADO"
    ) {
      return c.json(
        {
          error:
            "Status inválido.",
        },
        400,
      );
    }

    const appointment =
      await c.env.DB.prepare(
        `SELECT
          id,
          scheduled_date,
          scheduled_time
         FROM appointments
         WHERE id = ?`,
      )
        .bind(id)
        .first<{
          id: number;
          scheduled_date: string;
          scheduled_time: string;
        }>();

    if (!appointment) {
      return c.json(
        {
          error:
            "Agendamento não encontrado.",
        },
        404,
      );
    }

    if (
      status === "PENDENTE" ||
      status === "CONFIRMADO"
    ) {
      const occupiedSlot =
        await c.env.DB.prepare(
          `SELECT id
           FROM appointments
           WHERE scheduled_date = ?
             AND scheduled_time = ?
             AND status IN (
               'PENDENTE',
               'CONFIRMADO'
             )
             AND id <> ?
           LIMIT 1`,
        )
          .bind(
            appointment.scheduled_date,
            appointment.scheduled_time,
            appointment.id,
          )
          .first<{ id: number }>();

      if (occupiedSlot) {
        return c.json(
          {
            error:
              "Já existe outro agendamento ativo nesse horário.",
          },
          409,
        );
      }
    }

    try {
      await c.env.DB.prepare(
        `UPDATE appointments
         SET status = ?
         WHERE id = ?`,
      )
        .bind(status, id)
        .run();

      const updated =
        await c.env.DB.prepare(
          `SELECT
            id,
            name,
            phone,
            email,
            mode,
            scheduled_date,
            scheduled_time,
            status,
            created_at
           FROM appointments
           WHERE id = ?`,
        )
          .bind(id)
          .first<AppointmentRow>();

      if (!updated) {
        return c.json(
          {
            error:
              "Agendamento não encontrado.",
          },
          404,
        );
      }

      return c.json(
        serializeAppointment(updated),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.toLowerCase()
          : "";

      if (
        message.includes("unique") ||
        message.includes(
          "constraint",
        )
      ) {
        return c.json(
          {
            error:
              "Já existe outro agendamento ativo nesse horário.",
          },
          409,
        );
      }

      console.error(
        "Erro ao atualizar agendamento:",
        error,
      );

      return c.json(
        {
          error:
            "Não foi possível atualizar o agendamento.",
        },
        500,
      );
    }
  },
);

app.notFound((c) => {
  return c.json(
    {
      error:
        "Rota não encontrada.",
    },
    404,
  );
});

app.onError((error, c) => {
  console.error(
    "Erro inesperado:",
    error,
  );

  return c.json(
    {
      error:
        "Erro interno do servidor.",
    },
    500,
  );
});

export default app;
