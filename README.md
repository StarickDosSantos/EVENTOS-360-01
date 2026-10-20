# Stands & Quiosques — Plataforma de venda e aluguer

Plataforma comercial para stands, quiosques e equipamentos de eventos.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** (modo light/dark, cor principal azul brand)
- **Prisma** + SQLite (trocar para PostgreSQL/Supabase em produção)
- **NextAuth** (credenciais) — painel admin
- **Zustand** — carrinho persistente
- **Zod** — validação de pedidos

## Funcionalidades (Fases 1–3)

### Público
- Landing com apresentação, serviços, destaques, galeria e contacto
- Catálogo com filtros (Produção / Aluguer / Pacotes) e pesquisa
- Página de produto com escolha de modalidade, quantidade e dias
- Carrinho com quantidades e duração de aluguer
- Checkout sem conta — pedido **pendente de aprovação** (código PED-AAAA-NNNN)
- Botão flutuante WhatsApp

### Admin (`/admin` — login em `/login`)
- Dashboard: totais, pendentes, valor estimado, pedidos recentes
- Gestão de pedidos: estados, notas, WhatsApp pré-preenchido, e-mail
- Gestão de catálogo: criar, editar, publicar/ocultar produtos

## Arranque local

```bash
cp .env.example .env   # ou use o .env já criado
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/login  
  - Email: `admin@stands.ao`  
  - Password: `admin123`

## Catálogo seed

| Categoria | Produto | Preço |
|-----------|---------|-------|
| Produção | Stand | 1.600.000 Kz |
| Produção | Quiosque | 65.000 Kz |
| Produção | Tendas | 80.000 Kz |
| Aluguer/Compra | Cubo | 250.000 / 450.000 Kz |
| Aluguer | Red Carpet | 100.000 Kz |
| Aluguer | Baias | 75.000 Kz |
| Aluguer | Tablet Touch 21" | 100.000 Kz/dia |
| Aluguer | Tira LED 2×0,5 | 150.000 Kz/dia |
| Aluguer | Mopie Digital | 300.000 Kz |
| Aluguer | Balcão LED | 500.000 Kz |
| Pacote | Baía + Red Carpet | 145.000 Kz |

## Próximas fases

- E-mails automáticos (Resend)
- Upload de imagens (Supabase Storage / Cloudinary)
- Calendário de disponibilidade de alugueres
- PostgreSQL + deploy Vercel

## Notas

- Alterações no catálogo **não** alteram pedidos já feitos (snapshot nos OrderItem).
- O formulário **nunca** confirma reserva nem pagamento — só cria pedido PENDENTE.
