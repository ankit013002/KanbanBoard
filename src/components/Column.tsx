import React, { useState } from "react";
import Card from "./Card";
import { useDispatch } from "react-redux";
import { addCard, deleteColumn, modifyColumnTitle } from "@/store/KanbanSlice";
import { useAppSelector } from "@/store";
import type { Card as CardType } from "@/store/KanbanSlice";
import type { DraggingMeta } from "./Board";
import { FaRegTrashAlt } from "react-icons/fa";

interface ColumnProps {
  columnId: number;
  dragging: DraggingMeta | null;
  setDraggingMeta: React.Dispatch<React.SetStateAction<DraggingMeta | null>>;
}

const Column = ({ columnId, dragging, setDraggingMeta }: ColumnProps) => {
  const dispatch = useDispatch();

  const column = useAppSelector((s) =>
    s.kanban.columns.find((c) => c.id === columnId)
  );

  const cards = column?.cards ?? [];

  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [title, setTitle] = useState(column?.title ?? "");

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
        card: { id: crypto.randomUUID(), title: "Title", text: "Generic Text" },
      })
    );

  return (
    <div
      className="min-w-[20vw] max-w-[20vw] p-4 bg-base-200 rounded shadow mr-8"
      data-column-id={columnId}
    >
      {isTitleEditable ? (
        <input
          className="input"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              dispatch(modifyColumnTitle({ columnId, title }));
              setIsTitleEditable(false);
            }
          }}
        />
      ) : (
        <div className="flex justify-between items-center mb-2">
          <h3
            onDoubleClick={() => setIsTitleEditable(true)}
            className="font-semibold"
          >
            {column?.title}
          </h3>
          <button
            onClick={() => dispatch(deleteColumn({ columnId }))}
            className="btn btn-ghost"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      )}

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
