import { useAppDispatch } from "@/store";
import {
  Card,
  deleteCard,
  modifyCardText,
  modifyCardTitle,
} from "@/store/KanbanSlice";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface CardDetailsProp {
  columnId?: number;
  card: Card;
}

const CardDetails = ({ columnId, card }: CardDetailsProp) => {
  const dispatch = useAppDispatch();
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [isTextEditable, setIsTextEditable] = useState(false);
  const [text, setText] = useState(card.text);

  if (!card) {
    return;
  }

  return (
    <div className="bg-base-100">
      <div className="">
        {isTitleEditable && columnId ? (
          <input
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsTitleEditable(false);
                dispatch(modifyCardTitle({ columnId, cardId: card.id, title }));
              }
            }}
            className="input"
          />
        ) : (
          <div className="flex justify-between mx-2">
            <h2
              onDoubleClick={() => {
                console.log("CLICK");
                setIsTitleEditable(true);
              }}
              className="card-title z-10"
            >
              {card.title}
            </h2>
            <button
              onClick={() =>
                dispatch(deleteCard({ columnId: columnId, cardId: card.id }))
              }
              className="btn btn-ghost"
            >
              <FaRegTrashAlt />
            </button>
          </div>
        )}

        {isTextEditable && columnId ? (
          <textarea
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsTextEditable(false);
                dispatch(modifyCardText({ columnId, cardId: card.id, text }));
              }
            }}
            className="textarea"
          />
        ) : (
          <p
            onDoubleClick={() => setIsTextEditable(true)}
            className="textarea border-none"
          >
            {card.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
