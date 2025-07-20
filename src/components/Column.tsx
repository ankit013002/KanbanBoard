import React, { useState, useCallback } from "react";
import { useAppSelector } from "@/store";
import { addCard } from "@/store/KanbanSlice";
import { useDispatch } from "react-redux";
import Card from "./Card";
import type { Card as CardType } from "@/store/KanbanSlice";

interface ColumnProps {
  columnId: number;
}

interface DraggingMeta {
  id: string;
  height: number;
  fromColumnId: number;
}

const Column = ({ columnId }: ColumnProps) => {
  const dispatch = useDispatch();
  const column = useAppSelector((state) =>
    state.kanban.columns.find((c) => c.id === columnId)
  );
  const cards = column?.cards ?? [];

  // Local drag meta for placeholder
  const [dragging, setDragging] = useState<DraggingMeta | null>(null);

  const handleAddCard = () => {
    const newCard: CardType = {
      id: crypto.randomUUID(),
      title: "CARD",
      text: "Generic Text",
    };
    dispatch(addCard({ columnId, card: newCard }));
  };

  // Callback passed to Card to set/clear drag meta
  const setDraggingMeta = useCallback(
    (meta: DraggingMeta | null) => setDragging(meta),
    []
  );

  return (
    <div
      className="min-w-[20vw] max-w-[20vw] p-4 bg-base-200 rounded shadow mr-8"
      data-column-id={columnId}
    >
      <h3 className="font-semibold mb-2">{column?.title}</h3>
      <div>
        {cards.map((c, i) => {
          if (
            dragging &&
            dragging.id === c.id &&
            dragging.fromColumnId === columnId
          ) {
            return (
              <div
                key={c.id}
                className="mb-2 rounded bg-red border border-dashed border-red"
                style={{ height: dragging.height }}
                data-card-placeholder
              ></div>
            );
          }

          return (
            <Card
              key={c.id}
              card={c}
              index={i}
              columnId={columnId}
              setDraggingMeta={setDraggingMeta}
            />
          );
        })}
      </div>
      <button onClick={handleAddCard} className="btn w-full mt-2">
        Add Card
      </button>
    </div>
  );
};

export default Column;
