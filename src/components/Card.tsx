import { useAppDispatch } from "@/store";
import { Card as CardType, moveCard } from "@/store/KanbanSlice";
import { motion, PanInfo } from "framer-motion";
import React, { useRef } from "react";
import type { DraggingMeta } from "./Board";
import CardDetails from "./CardDetails";

interface CardProps {
  card: CardType;
  index: number;
  columnId: number;
  setDraggingMeta: React.Dispatch<React.SetStateAction<DraggingMeta | null>>;
}

const Card = ({ card, index, columnId, setDraggingMeta }: CardProps) => {
  const dispatch = useAppDispatch();
  const elRef = useRef<HTMLDivElement | null>(null);

  const locate = (point: { x: number; y: number }) => {
    const cols = Array.from(
      document.querySelectorAll<HTMLElement>("[data-column-id]")
    );
    const overCol = cols.find((el) => {
      const r = el.getBoundingClientRect();
      return (
        point.x >= r.left &&
        point.x <= r.right &&
        point.y >= r.top &&
        point.y <= r.bottom
      );
    });
    if (!overCol) return null;

    const overColumnId = Number(overCol.dataset.columnId);

    const otherCards = Array.from(
      overCol.querySelectorAll<HTMLElement>("[data-card-id]")
    )
      .filter((el) => el.dataset.cardId !== card.id)
      .sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );

    const rawIdx = otherCards.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return point.y < r.top + r.height / 2;
    });

    return {
      overColumnId,
      toIndex: rawIdx === -1 ? otherCards.length : rawIdx,
    };
  };

  return (
    <motion.div
      ref={elRef}
      layout
      drag
      dragMomentum={false}
      whileDrag={{ zIndex: 100, scale: 1.03 }}
      data-card-id={card.id}
      className="mb-2 bg-black rounded shadow cursor-grab select-none"
      onDragStart={(_e, info) => {
        const { x, y } = info.point;
        const h = elRef.current?.getBoundingClientRect().height ?? 0;
        setDraggingMeta({
          id: card.id,
          height: h,
          fromColumnId: columnId,
          overColumnId: columnId,
          toIndex: index,
          cursorX: x,
          cursorY: y,
        });
      }}
      onDrag={(_e, info) => {
        const located = locate(info.point);
        if (!located) return;

        setDraggingMeta(
          (prev) =>
            prev && {
              ...prev,
              overColumnId: located.overColumnId,
              toIndex: located.toIndex,
              cursorX: info.point.x, // keep updating
              cursorY: info.point.y,
            }
        );
      }}
      onDragEnd={(_e, info: PanInfo) => {
        const located = locate(info.point);
        setDraggingMeta(null); // remove placeholder

        if (!located) return;

        const { overColumnId, toIndex } = located;

        if (overColumnId === columnId && toIndex === index) return; // no-op

        dispatch(
          moveCard({
            fromColumnId: columnId,
            toColumnId: overColumnId,
            cardId: card.id,
            toIndex,
          })
        );
      }}
    >
      <div>
        <CardDetails columnId={columnId} card={card} />
      </div>
    </motion.div>
  );
};

export default Card;
