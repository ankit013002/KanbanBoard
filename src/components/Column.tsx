import { Card } from "@/lib/types";
import { useAppSelector } from "@/store";
import { addCard } from "@/store/KanbanSlice";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface ColumnProps {
  columnId: number;
}

const Column = ({ columnId }: ColumnProps) => {
  const dispatch = useDispatch();
  const column = useAppSelector((state) =>
    state.kanban.columns.find((col) => col.id === columnId)
  );
  if (!column) {
    return;
  }
  const cards = column.cards;

  console.log("HERE:", column);

  const handleAddCard = () => {
    const newCard: Card = { id: 1, title: "CARD", text: "Generic Text" };
    if (cards.length < 1)
      dispatch(addCard({ columnId: column.id, card: newCard }));
  };

  return (
    <div className="min-w-[20vw] max-w-[20vw]">
      <ul className="list bg-base-100 rounded-box shadow-md">
        {cards.map((card) => (
          <div key={card.id}>
            <motion.li dragSnapToOrigin drag className="list-row">
              <div>
                <div>Dio Lupa</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Remaining Reason
                </div>
              </div>
              <p className="list-col-wrap text-xs">
                "Remaining Reason" became an instant hit, praised for its
                haunting sound and emotional depth. A viral performance brought
                it widespread recognition, making it one of Dio Lupa’s most
                iconic tracks.
              </p>
              <button className="btn btn-square btn-ghost">
                <svg
                  className="size-[1.2em]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 3L20 12 6 21 6 3z"></path>
                  </g>
                </svg>
              </button>
              <button className="btn btn-square btn-ghost">
                <svg
                  className="size-[1.2em]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </g>
                </svg>
              </button>
            </motion.li>
          </div>
        ))}
        <button onClick={() => handleAddCard()} className="btn">
          Add Card
        </button>
      </ul>
    </div>
  );
};

export default Column;
