import { useAppDispatch } from "@/store";
import { Card as CardType, moveCard } from "@/store/KanbanSlice";
import { motion, PanInfo } from "framer-motion";
import React, { useRef } from "react";

interface CardProps {
  card: CardType;
  index: number;
  columnId: number;
  setDraggingMeta: (
    meta: { id: string; height: number; fromColumnId: number } | null
  ) => void;
}

const Card = ({ card, index, columnId, setDraggingMeta }: CardProps) => {
  const dispatch = useAppDispatch();
  const elRef = useRef<HTMLDivElement | null>(null);

  function handleDragEnd(_e: MouseEvent | TouchEvent, info: PanInfo) {
    setDraggingMeta(null); // remove placeholder

    const { point } = info;

    // Find drop column
    const dropColEl = Array.from(
      document.querySelectorAll<HTMLElement>("[data-column-id]")
    ).find((el) => {
      const r = el.getBoundingClientRect();
      return (
        point.x >= r.left &&
        point.x <= r.right &&
        point.y >= r.top &&
        point.y <= r.bottom
      );
    });

    if (!dropColEl) return;

    const toColumnId = Number(dropColEl.dataset.columnId);

    // Collect other cards (excluding the dragged one) and sort by visual top
    const otherCards = Array.from(
      dropColEl.querySelectorAll<HTMLElement>("[data-card-id]")
    )
      .filter((el) => el.dataset.cardId !== card.id)
      .sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );

    // Determine insertion index
    const rawIndex = otherCards.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return point.y < r.top + r.height / 2;
    });

    const toIndex = rawIndex === -1 ? otherCards.length : rawIndex;

    if (toColumnId === columnId && toIndex === index) {
      return; // no change
    }

    dispatch(
      moveCard({
        fromColumnId: columnId,
        toColumnId,
        cardId: card.id,
        toIndex,
      })
    );
  }

  return (
    <motion.div
      ref={elRef}
      layout
      drag
      dragMomentum={false}
      onDragStart={() => {
        const h = elRef.current?.getBoundingClientRect().height ?? 0;
        setDraggingMeta({ id: card.id, height: h, fromColumnId: columnId });
      }}
      onDragEnd={(e, info) => handleDragEnd(e, info)}
      whileDrag={{ zIndex: 100, scale: 1.03 }}
      data-card-id={card.id}
      className="p-3 mb-2 bg-black rounded shadow cursor-grab select-none"
    >
      <strong className="text-xs break-all">{card.id}</strong>
      <p className="text-[10px] mt-1">{card.text}</p>
    </motion.div>
  );
};

export default Card;
