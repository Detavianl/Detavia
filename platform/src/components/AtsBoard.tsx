"use client";
import { useState } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable, type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import { STAGES, VAKGEBIEDEN, type AtsCard, type StageKey } from "@/lib/ats";
import { moveApplication } from "@/app/admin/ats/actions";

export default function AtsBoard({ initial }: { initial: AtsCard[] }) {
  const [cards, setCards] = useState<AtsCard[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeCard = cards.find((c) => c.id === activeId) ?? null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const id = String(e.active.id);
    const newStage = e.over?.id as StageKey | undefined;
    if (!newStage) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.stage === newStage) return;
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage: newStage } : c)));
    moveApplication(id, newStage).catch(() => {
      setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage: card.stage } : c)));
    });
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((s) => (
          <Column key={s.key} stageKey={s.key} label={s.label} cards={cards.filter((c) => c.stage === s.key)} activeId={activeId} />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCard ? <CardView card={activeCard} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({ stageKey, label, cards, activeId }: { stageKey: StageKey; label: string; cards: AtsCard[]; activeId: string | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey });
  return (
    <div ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-2xl border p-3 ${isOver ? "border-cobalt bg-cobalt/5" : "border-neutral-200 bg-white"}`}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-bold">{label}</span>
        <span className="rounded-full bg-neutral-100 px-2 text-xs font-bold text-muted">{cards.length}</span>
      </div>
      <div className="grid gap-2">
        {cards.map((c) => <DraggableCard key={c.id} card={c} hidden={c.id === activeId} />)}
        {cards.length === 0 && <p className="px-1 py-6 text-center text-xs text-muted">Leeg</p>}
      </div>
    </div>
  );
}

function DraggableCard({ card, hidden }: { card: AtsCard; hidden: boolean }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: card.id });
  // Geen transform op de kaart zelf: een DragOverlay volgt de muis, dus de
  // layout groeit niet mee (geen oneindig doorslepen).
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={hidden ? "opacity-30" : ""}>
      <CardView card={card} />
    </div>
  );
}

function CardView({ card, overlay }: { card: AtsCard; overlay?: boolean }) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-3 ${overlay ? "w-64 cursor-grabbing rotate-2 shadow-xl" : "cursor-grab shadow-sm"}`}>
      <p className="font-bold leading-tight">{card.candidate?.naam ?? "Onbekend"}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {card.candidate?.vakgebied && (
          <span className="rounded-full bg-arctic px-2 py-0.5 text-[.7rem] font-bold">{VAKGEBIEDEN[card.candidate.vakgebied] ?? card.candidate.vakgebied}</span>
        )}
        {card.candidate?.woonplaats && <span className="text-[.7rem] font-semibold text-muted">{card.candidate.woonplaats}</span>}
      </div>
      {card.vacature?.titel && <p className="mt-1.5 text-xs text-muted">↳ {card.vacature.titel}</p>}
    </div>
  );
}
