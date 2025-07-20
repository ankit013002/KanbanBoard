import React from "react";
import Card from "./Card";
import { useDispatch } from "react-redux";
import { addCard } from "@/store/KanbanSlice";
import { useAppSelector } from "@/store";
import type { Card as CardType } from "@/store/KanbanSlice";
import type { DraggingMeta } from "./Board";

interface Props {
  columnId: number;
  dragging: DraggingMeta | null;
  setDraggingMeta: (m: DraggingMeta | null) => void;
}

const Column = ({ columnId, dragging, setDraggingMeta }: Props) => {
  const dispatch = useDispatch();
  const column = useAppSelector((s) =>
    s.kanban.columns.find((c) => c.id === columnId)
  );
  const cards = column?.cards ?? [];

  const display: (CardType | null)[] = dragging
    ? cards.filter((c) => c.id !== dragging.id)
    : cards;

  if (dragging && dragging.overColumnId === columnId) {
    display.splice(dragging.toIndex, 0, null);
  }

  const handleAddCard = () =>
    dispatch(
      addCard({
        columnId,
        card: { id: crypto.randomUUID(), title: "CARD", text: "Generic Text" },
      })
    );

  return (
    <div
      className="min-w-[20vw] max-w-[20vw] p-4 bg-base-200 rounded shadow mr-8"
      data-column-id={columnId}
    >
      <h3 className="font-semibold mb-2">{column?.title}</h3>

      {display.map((c, i) =>
        c ? (
          <Card
            key={c.id}
            card={c}
            index={i}
            columnId={columnId}
            setDraggingMeta={setDraggingMeta}
          />
        ) : (
          <div
            key="placeholder"
            style={{ height: dragging?.height }}
            className="mb-2"
          />
        )
      )}

      <button onClick={handleAddCard} className="btn w-full mt-2">
        Add Card
      </button>
    </div>
  );
};

export default Column;
