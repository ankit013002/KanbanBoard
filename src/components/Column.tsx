import { useAppSelector } from "@/store";
import { addCard } from "@/store/KanbanSlice";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Card from "./Card";

interface ColumnProps {
  columnId: number;
}

const Column = ({ columnId }: ColumnProps) => {
  const dispatch = useDispatch();
  const column = useAppSelector((state) =>
    state.kanban.columns.find((col) => col.id === columnId)
  );
  const allColumns = useAppSelector((state) => state.kanban.columns);
  if (!column) {
    return;
  }
  const cards = column.cards;

  const handleAddCard = () => {
    const newCard: Card = {
      id: crypto.randomUUID(),
      title: "CARD",
      text: "Generic Text",
    };
    dispatch(addCard({ columnId: column.id, card: newCard }));
  };

  return (
    <div
      className="min-w-[20vw] max-w-[20vw] p-4 bg-base-100 rounded-box shadow-md mr-4"
      data-column-id={column.id}
    >
      <h2 className="font-bold mb-2">{column.title}</h2>
      <motion.ul layout className="list bg-base-100 rounded-box shadow-md">
        {cards.map((card, index) => (
          <Card key={card.id} card={card} index={index} columnId={column.id} />
        ))}
        <button onClick={() => handleAddCard()} className="btn">
          Add Card
        </button>
      </motion.ul>
    </div>
  );
};

export default Column;
