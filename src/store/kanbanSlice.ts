import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  id: string;
  title: string;
  text: string;
}

export interface Column {
  id: number;
  title: string;
  cards: Card[];
}

export interface KanbanState {
  id: number;
  title: string;
  columns: Column[];
}

const initialState: KanbanState = {
  id: 1,
  title: "Default Title",
  columns: [],
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    addColumn(
      state: KanbanState,
      action: PayloadAction<{ id: number; title: string; cards?: Card[] }>
    ) {
      const { id, title, cards = [] } = action.payload;
      state.columns.push({ id, title, cards });
    },
    addCard(
      state: KanbanState,
      action: PayloadAction<{
        columnId: number;
        card: { id: string; title?: string; text?: string };
      }>
    ) {
      const { columnId, card } = action.payload;
      const column = state.columns.find((column) => column.id === columnId);
      column?.cards.push({
        id: card.id,
        title: card.title ?? "",
        text: card.text ?? "",
      });
    },
    moveCard(
      state: KanbanState,
      action: PayloadAction<{
        fromColumnId: number;
        toColumnId: number;
        cardId: string;
        toIndex: number;
      }>
    ) {
      const { fromColumnId, toColumnId, cardId, toIndex } = action.payload;
      console.log(
        "%c[Reducer moveCard] payload",
        "background:#222;color:#0f0",
        action.payload
      );

      const fromColumn = state.columns.find((c) => c.id === fromColumnId);
      const toColumn = state.columns.find((c) => c.id === toColumnId);

      if (!fromColumn || !toColumn) {
        console.log(
          "%c[Reducer] Missing fromColumn or toColumn -> abort",
          "color:red"
        );
        return;
      }

      const beforeFromIds = fromColumn.cards.map((c) => c.id);
      const beforeToIds = toColumn.cards.map((c) => c.id);
      console.log("[Reducer] fromColumn BEFORE:", beforeFromIds);
      if (fromColumnId !== toColumnId) {
        console.log("[Reducer] toColumn BEFORE:", beforeToIds);
      }

      const currentIndex = fromColumn.cards.findIndex((c) => c.id === cardId);
      console.log("[Reducer] currentIndex in fromColumn:", currentIndex);

      if (currentIndex < 0) {
        console.log(
          "%c[Reducer] Card not found in fromColumn -> abort",
          "color:red"
        );
        return;
      }
      const clampedToIndex = Math.max(
        0,
        Math.min(toIndex, toColumn.cards.length)
      );
      if (clampedToIndex !== toIndex) {
        console.log(
          "%c[Reducer] toIndex clamped from " +
            toIndex +
            " to " +
            clampedToIndex,
          "color:orange"
        );
      }

      const [movedCard] = fromColumn.cards.splice(currentIndex, 1);
      console.log("[Reducer] Removed card:", movedCard.id);

      toColumn.cards.splice(clampedToIndex, 0, movedCard);

      const afterFromIds = fromColumn.cards.map((c) => c.id);
      const afterToIds = toColumn.cards.map((c) => c.id);

      console.log("[Reducer] fromColumn AFTER:", afterFromIds);
      console.log(
        "[Reducer] toColumn AFTER:",
        fromColumnId === toColumnId ? afterFromIds : afterToIds
      );
      console.log("%c[Reducer moveCard] DONE", "color:#0af");
    },
    modifyCardTitle(
      state: KanbanState,
      action: PayloadAction<{ columnId: number; cardId: string; title: string }>
    ) {
      const { columnId, cardId, title } = action.payload;
      const column = state.columns.find((column) => column.id === columnId);
      if (!column) {
        return;
      }

      const card = column.cards.find((card) => card.id === cardId);

      if (!card) {
        return;
      }

      card.title = title;
    },
    modifyCardText(
      state: KanbanState,
      action: PayloadAction<{ columnId: number; cardId: string; text: string }>
    ) {
      const { columnId, cardId, text } = action.payload;
      const column = state.columns.find((column) => column.id === columnId);
      if (!column) {
        return;
      }

      const card = column.cards.find((card) => card.id === cardId);

      if (!card) {
        return;
      }

      card.text = text;
    },
  },
});

export const { addColumn, addCard, moveCard, modifyCardTitle, modifyCardText } =
  kanbanSlice.actions;
export default kanbanSlice.reducer;
