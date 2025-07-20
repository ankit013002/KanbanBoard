"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Column from "./Column";
import { useDispatch } from "react-redux";
import { addColumn, Card } from "@/store/KanbanSlice";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";
import CardDetails from "./CardDetails";

export interface DraggingMeta {
  id: string;
  height: number;
  fromColumnId: number;
  overColumnId: number;
  toIndex: number;
  cursorX: number;
  cursorY: number;
  width?: number;
}

const Board = () => {
  const dispatch = useDispatch();
  const columns = useAppSelector((state) => state.kanban.columns);

  const [draggingMeta, setDraggingMeta] = useState<DraggingMeta | null>(null);
  const handleSetDraggingMeta = useCallback(
    (m: DraggingMeta | null) => setDraggingMeta(m),
    []
  );

  const handleClick = () => {
    if (columns.length < 1) {
      dispatch(addColumn({ id: 1, title: "To Do" }));
    } else {
      dispatch(addColumn({ id: columns.length + 1, title: "To Do" }));
    }
  };

  const cardRef = useRef<Card | null>(null);

  useEffect(() => {
    if (!draggingMeta) {
      return;
    }
    const column = columns.find((column) =>
      column.cards.some((card) => card.id === draggingMeta.id)
    );
    if (!column) {
      return;
    }
    const card = column.cards.find((card) => card.id === draggingMeta.id);
    if (!card) {
      return;
    }
    cardRef.current = card;
  }, [draggingMeta]);

  return (
    <div className="bg-gray-500 h-screen p-5 flex overflow-x-scroll">
      {columns.map((column) => (
        <Column
          key={column.id}
          columnId={column.id}
          dragging={draggingMeta}
          setDraggingMeta={handleSetDraggingMeta}
        />
      ))}

      {draggingMeta && cardRef.current && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{ top: -50, left: -50 }}
          initial={false}
          animate={{ x: draggingMeta.cursorX, y: draggingMeta.cursorY }}
          transition={{ type: "tween", stiffness: 1000, damping: 100 }}
        >
          <div
            className="bg-black rounded shadow opacity-90"
            style={{
              width: draggingMeta.width ?? 200,
              height: draggingMeta.height,
            }}
          >
            <CardDetails card={cardRef.current} />
          </div>
        </motion.div>
      )}

      <button onClick={() => handleClick()} className="btn">
        Add Column
      </button>
    </div>
  );
};

export default Board;
