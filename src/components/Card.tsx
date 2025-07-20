import { Card } from "@/lib/types";
import { useAppDispatch } from "@/store";
import { moveCard } from "@/store/KanbanSlice";
import { motion, PanInfo } from "framer-motion";
import React from "react";

interface CardProps {
  card: Card;
  index: number;
  columnId: number;
}

const Card = ({ card, index, columnId }: CardProps) => {
  const dispatch = useAppDispatch();

  function handleDragEnd(_event: MouseEvent | TouchEvent, info: PanInfo) {
    const { point } = info;

    const columnElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-column-id]")
    );

    const dropColumnElement = columnElements.find((element) => {
      const r = element.getBoundingClientRect();
      return (
        point.x >= r.left &&
        point.x <= r.right &&
        point.y >= r.top &&
        point.y <= r.bottom
      );
    });

    if (!dropColumnElement) {
      return;
    }

    const toColumnId = Number(dropColumnElement.dataset.columnId);

    const cardElements = Array.from(
      dropColumnElement.querySelectorAll<HTMLElement>(`[data-card-id]`)
    );

    const toIndex = cardElements.findIndex((cardElement) => {
      const r = cardElement.getBoundingClientRect();
      return point.y < r.top + r.height / 2;
    });
    const finalIndex = toIndex === -1 ? cardElements.length : toIndex;

    dispatch(
      moveCard({
        fromColumnId: columnId,
        toColumnId,
        cardId: card.id,
        toIndex: finalIndex,
      })
    );
  }

  return (
    <motion.div
      layout
      drag
      dragSnapToOrigin
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      data-card-id={card.id}
      className="p-3 mb-2 bg-white rounded shadow cursor-grab"
    >
      <strong>{card.title}</strong>
      <p className="text-xs mt-1">{card.text}</p>
    </motion.div>
  );
};

export default Card;
