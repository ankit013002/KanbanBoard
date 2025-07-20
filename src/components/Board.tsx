"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import Column from "./Column";

const Board = () => {
  const [columns, setColumns] = useState(0);

  console.log(columns);
  return (
    <div className="bg-gray-500 h-screen p-5 flex overflow-x-scroll">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index}>
          <Column />
        </div>
      ))}
      <button onClick={() => setColumns(columns + 1)} className="btn">
        Add Column
      </button>
    </div>
  );
};

export default Board;
