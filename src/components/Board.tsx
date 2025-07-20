"use client";

import React from "react";
import Column from "./Column";
import { useDispatch } from "react-redux";
import { addColumn } from "@/store/KanbanSlice";
import { useAppSelector } from "@/store";

const Board = () => {
  const dispatch = useDispatch();
  const columns = useAppSelector((state) => state.kanban.columns);

  const handleClick = () => {
    if (columns.length < 1) {
      dispatch(addColumn({ id: 1, title: "To Do" }));
    } else {
      dispatch(addColumn({ id: columns.length + 1, title: "To Do" }));
    }
  };

  console.log(columns);
  return (
    <div className="bg-gray-500 h-screen p-5 flex overflow-x-scroll">
      {columns.map((column) => (
        <div key={column.id}>
          <Column columnId={column.id} />
        </div>
      ))}
      <button onClick={() => handleClick()} className="btn">
        Add Column
      </button>
    </div>
  );
};

export default Board;
