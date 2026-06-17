"use client";
import { useState } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable, type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import { DEAL_STAGES, VAKGEBIEDEN, euro, type DealCard, type DealStage } from "@/lib/crm";
import { moveDeal } from "@/app/admin/crm/actions";

export default function DealBoard({ initial }: { initial: DealCard[] }) {
  const [cards, setCards] = useState<DealCard[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const active = cards.find((c) => c.id === activeId) ?? null;

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const id = String(e.active.id);
    const stage = e.over?.id as DealStage | undefined;
    if (!stage) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.stage === stage) return;
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    moveDeal(id, stage).catch(() => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage: card.stage } : c))));
  }

  return (
    <DndContext id="deal-board" sensors={sensors} onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {DEAL_STAGES.map((s) => {
          const col = cards.filter((c) => c.stage === s.key);
          const som = col.reduce((a, c) => a + (c.waarde ?? 0), 0);
          return <Column key={s.key} stageKey={s.key} label={s.label} cards={col} som={som} activeId={activeId} />;
        })}
      </div>
      <DragOverlay dropAnimation={null}>{active ? <CardView card={active} overlay /> : null}</DragOverlay>
    </DndContext>
  );
}

function Column({ stageKey, label, cards, som, activeId }: { stageKey: DealStage; label: string; cards: DealCard[]; som: number; activeId: string | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey });
  return (
    <div ref={setNodeRef} className={`flex w-72 shrink-0 flex-col rounded-2xl border p-3 ${isOver ? "border-cobalt bg-cobalt/5" : "border-neutral-200 bg-white"}`}>
      <div className="mb-3 px-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{label}</span>
          <span className="rounded-full bg-neutral-100 px-2 text-xs font-bold text-muted">{cards.length}</span>
        </div>
        <span className="text-xs font-semibold text-muted">{euro(som)}</span>
      </div>
      <div className="grid gap-2">
        {cards.map((c) => <DraggableCard key={c.id} card={c} hidden={c.id === activeId} />)}
        {cards.length === 0 && <p className="px-1 py-6 text-center text-xs text-muted">Leeg</p>}
      </div>
    </div>
  );
}

function DraggableCard({ card, hidden }: { card: DealCard; hidden: boolean }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: card.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={hidden ? "opacity-30" : ""}>
      <CardView card={card} />
    </div>
  );
}

function CardView({ card, overlay }: { card: DealCard; overlay?: boolean }) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-3 ${overlay ? "w-64 rotate-2 cursor-grabbing shadow-xl" : "cursor-grab shadow-sm"}`}>
      <p className="font-bold leading-tight">{card.titel}</p>
      {card.company?.naam && <p className="mt-1 text-xs text-muted">{card.company.naam}</p>}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-cobalt">{euro(card.waarde)}</span>
        <span className="text-xs font-semibold text-muted">{card.kans}%</span>
      </div>
      {card.vakgebied && <span className="mt-2 inline-block rounded-full bg-arctic px-2 py-0.5 text-[.7rem] font-bold">{VAKGEBIEDEN[card.vakgebied] ?? card.vakgebied}</span>}
    </div>
  );
}
