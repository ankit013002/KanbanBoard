import { Card } from "@/lib/types";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface ColumnProps {
  columnId: number;
}

const Column = ({ columnId }: ColumnProps) => {
  const column = useAppSelector((state) =>
    state.kanban.columns.find((col) => col.id === columnId)
  );
  console.log("HERE:", column);
  const [cards, setCards] = useState(0);

  return (
    <div className="min-w-[20vw] max-w-[20vw]">
      <ul className="list bg-base-100 rounded-box shadow-md">
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index}>
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
        <button onClick={() => setCards(cards + 1)} className="btn">
          Add Card
        </button>
      </ul>
    </div>
  );
};

export default Column;
