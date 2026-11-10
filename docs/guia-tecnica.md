# Guía técnica

## Cómo funciona

1. La persona arma su fiesta en `/armar-tu-fiesta`. Cada paso se valida con Zod (React Hook Form).
2. La disponibilidad se consulta en `GET /api/disponibilidad?fecha=AAAA-MM-DD`.
3. Al enviar, una Server Action vuelve a validar todo, revisa la fecha y guarda la consulta como **nueva**.
4. Se abre WhatsApp con el resumen y el link `/consultas/<id>/pdf`; el PDF se genera en el servidor.
5. El salón ve y gestiona las consultas en `/panel` (contraseña `PANEL_PASSWORD`).

## Dónde está cada cosa

| Qué | Dónde |
|-----|-------|
| Menús (opciones 1 a 5), tipos de evento, horarios de reunión | `features/catalog/party-options.ts` |
| Fotos del sitio (optimizadas desde `../media/`) | `public/fotos/` |
| Paleta negro y dorado | `app/globals.css` |
| Datos del salón, servicios incluidos, extras y condiciones | `features/catalog/salon.ts` |
| Reglas de validación (cliente y servidor) | `features/party-requests/party-request-schema.ts` |
| Base de datos: Postgres (Neon) con `DATABASE_URL`, o JSON en `.data/` para desarrollo | `features/party-requests/party-request-repository.ts` |
| Agenda: simulada o Google Calendar | `features/availability/` |
| Sesión del panel | `features/panel-auth/`, `proxy.ts` |
| Sitio público | `app/(sitio)/` |
| Panel del salón | `app/panel/` |

## Pasar a producción

- **Base de datos:** en Vercel se usa Postgres (Neon) a través de `DATABASE_URL`, que carga la
  integración de Neon del proyecto. La tabla `party_requests` se crea sola en el primer uso.
  Sin esa variable se usa el archivo JSON, que solo sirve en desarrollo.
- **Google Calendar:** completar las tres variables `GOOGLE_*` y compartir el calendario del salón con
  la cuenta de servicio. Sin ellas se usa la agenda simulada.
