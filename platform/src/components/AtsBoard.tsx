"use client";
import { useState } from "react";
import {
  DndContext, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable, type DragEndEvent,
} from "@dnd-kit/core";
import { STAGES, VAKGEBIEDEN, type AtsCard, type StageKey } from "@/lib/ats";
import { moveApplication } from "@/app/admin/ats/actions";

export default function AtsBoard({ initial }: { initial: AtsCard[] }) {
  const [cards, setCards] = useState<AtsCard[]>(initial);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function onDragEnd(e: DragEndEvent) {
    const id = String(e.active.id);
    const newStage = e.over?.id as StageKey | undefined;
    if (!newStage) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.stage === newStage) return;
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage: newStage } : c)));
    moveApplication(id, newStage).catch(() => {
      // rollback bij fout
      setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage: card.stage } : c)));
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((s) => (
          <Column key={s.key} stageKey={s.key} label={s.label} cards={cards.filter((c) => c.stage === s.key)} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ stageKey, label, cards }: { stageKey: StageKey; label: string; cards: AtsCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey });
  return (
    <div ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-2xl border p-3 ${isOver ? "border-cobalt bg-cobalt/5" : "border-neutral-200 bg-white"}`}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-bold">{label}</span>
        <span className="rounded-full bg-neutral-100 px-2 text-xs font-bold text-muted">{cards.length}</span>
      </div>
      <div className="grid gap-2">
        {cards.map((c) => <Card key={c.id} card={c} />)}
        {cards.length === 0 && <p className="px-1 py-6 text-center text-xs text-muted">Leeg</p>}
      </div>
    </div>
  );
}

function Card({ card }: { card: AtsCard }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`cursor-grab rounded-xl border border-neutral-200 bg-white p-3 shadow-sm active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}>
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
