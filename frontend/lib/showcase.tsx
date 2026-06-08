import type { ReactNode } from "react"
import { DollarSign } from "lucide-react"
import { StatCard } from "@/components/showcase/blocks/StatCard"
import { BalanceCard } from "@/components/showcase/blocks/BalanceCard"
import { TransactionsCard } from "@/components/showcase/blocks/TransactionsCard"
import { UserChip } from "@/components/showcase/blocks/UserChip"
import { EmptyState } from "@/components/showcase/blocks/EmptyState"
import { CtaButton } from "@/components/showcase/blocks/CtaButton"
import { WhatsAppButton } from "@/components/showcase/blocks/WhatsAppButton"

export type ShowcaseCategory = "Cards" | "Botões" | "Feedback"

export type ShowcaseBlock = {
  id: string
  name: string
  category: ShowcaseCategory
  description: string
  /** Caminho do fonte (relativo a frontend/). O código exibido é lido deste arquivo. */
  file: string
  preview: ReactNode
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = ["Cards", "Botões", "Feedback"]

export const SHOWCASE_BLOCKS: ShowcaseBlock[] = [
  {
    id: "stat-card",
    name: "StatCard",
    category: "Cards",
    description: "Card de métrica com rótulo, valor, ícone e variação opcional.",
    file: "components/showcase/blocks/StatCard.tsx",
    preview: (
      <StatCard label="Receita mensal" value="R$ 12.480" icon={DollarSign} delta={{ value: "+12%", positive: true }} />
    ),
  },
  {
    id: "balance-card",
    name: "BalanceCard",
    category: "Cards",
    description: "Card de saldo com valor em destaque, legenda e ação opcional.",
    file: "components/showcase/blocks/BalanceCard.tsx",
    preview: <BalanceCard amount="R$ 1.250,00" caption="Atualizado agora" actionLabel="Adicionar saldo" />,
  },
  {
    id: "transactions-card",
    name: "TransactionsCard",
    category: "Cards",
    description: "Lista de transações com entrada/saída, data e valor.",
    file: "components/showcase/blocks/TransactionsCard.tsx",
    preview: (
      <TransactionsCard
        transactions={[
          { id: "1", label: "Pagamento recebido", date: "Hoje, 14:20", amount: "R$ 320,00", direction: "in" },
          { id: "2", label: "Assinatura Pro", date: "Ontem", amount: "R$ 49,90", direction: "out" },
          { id: "3", label: "Reembolso", date: "12 mai", amount: "R$ 18,00", direction: "in" },
        ]}
      />
    ),
  },
  {
    id: "user-chip",
    name: "UserChip",
    category: "Cards",
    description: "Chip de usuário com avatar (ou iniciais), nome e email.",
    file: "components/showcase/blocks/UserChip.tsx",
    preview: <UserChip name="Ana Souza" email="ana@exemplo.com" />,
  },
  {
    id: "cta-button",
    name: "CtaButton",
    category: "Botões",
    description: "Botão de chamada para ação com gradiente e seta animada.",
    file: "components/showcase/blocks/CtaButton.tsx",
    preview: <CtaButton>Começar agora</CtaButton>,
  },
  {
    id: "whatsapp-button",
    name: "WhatsAppButton",
    category: "Botões",
    description: "Botão que abre uma conversa no WhatsApp com mensagem pré-preenchida.",
    file: "components/showcase/blocks/WhatsAppButton.tsx",
    preview: <WhatsAppButton phone="5511999999999" message="Olá! Vim pelo site." />,
  },
  {
    id: "empty-state",
    name: "EmptyState",
    category: "Feedback",
    description: "Estado vazio com ícone, título, descrição e ação opcional.",
    file: "components/showcase/blocks/EmptyState.tsx",
    preview: (
      <EmptyState
        title="Nada por aqui ainda"
        description="Crie seu primeiro item para começar."
        actionLabel="Criar item"
      />
    ),
  },
]
