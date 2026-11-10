import { useFormContext } from "react-hook-form";
import {
  DESSERTS,
  findSeatedProposal,
  LUNCH_MENU,
  SEATED_PROPOSALS,
  SEATED_RECEPTION,
} from "@/features/catalog/party-options";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { ChoiceCard } from "./choice-card";
import { ChoiceGroup } from "./choice-group";
import { DishList } from "./dish-list";
import { ExtrasField } from "./extras-field";

function LunchMenu() {
  return (
    <div className="space-y-6">
      <p className="text-muted">
        El “{LUNCH_MENU.name}” es un menú completo: no hay que elegir platos, incluye todo esto.
      </p>
      <DishList title="Recepción" dishes={LUNCH_MENU.reception} />
      <DishList title="Islas" dishes={LUNCH_MENU.islands} />
    </div>
  );
}

function SeatedMenu() {
  const { register, watch, setValue, formState } = useFormContext<PartyRequestInput>();
  const errors = formState.errors.seatedMenu;
  const selectedProposalId = watch("seatedMenu.proposal");
  const selectedProposal = selectedProposalId ? findSeatedProposal(selectedProposalId) : undefined;
  const mustChooseMain = (selectedProposal?.mains.length ?? 0) > 1;

  const proposalRegistration = register("seatedMenu.proposal", {
    // Los platos dependen de la propuesta: al cambiarla, la elección anterior ya no vale.
    onChange: () => setValue("seatedMenu.main", null),
  });

  return (
    <div className="space-y-8">
      <DishList title="Recepción incluida" dishes={SEATED_RECEPTION} />

      <ChoiceGroup legend="Propuesta de plato principal" error={errors?.proposal?.message}>
        {SEATED_PROPOSALS.map((proposal) => (
          <ChoiceCard key={proposal.id} registration={proposalRegistration} value={proposal.id}>
            <span className="font-semibold">{proposal.label}</span>
            <span className="text-sm text-muted">{proposal.mains.join(" · ")}</span>
          </ChoiceCard>
        ))}
      </ChoiceGroup>

      {selectedProposal && mustChooseMain && (
        <ChoiceGroup legend="Plato principal" error={errors?.main?.message}>
          {selectedProposal.mains.map((dish) => (
            <ChoiceCard key={dish} registration={register("seatedMenu.main")} value={dish}>
              <span className="text-sm font-semibold">{dish}</span>
            </ChoiceCard>
          ))}
        </ChoiceGroup>
      )}

      <ChoiceGroup legend="Postre" error={errors?.dessert?.message}>
        {DESSERTS.map((dessert) => (
          <ChoiceCard key={dessert} registration={register("seatedMenu.dessert")} value={dessert}>
            <span className="text-sm font-semibold">{dessert}</span>
          </ChoiceCard>
        ))}
      </ChoiceGroup>
    </div>
  );
}

export function MenuStep() {
  const { watch } = useFormContext<PartyRequestInput>();

  return (
    <div className="space-y-10">
      {watch("serviceStyle") === "lunch" ? <LunchMenu /> : <SeatedMenu />}
      <p className="text-sm text-muted">
        Todas las propuestas incluyen bebidas en la recepción y la cena, y servicio de trasnoche.
      </p>
      <ExtrasField />
    </div>
  );
}
