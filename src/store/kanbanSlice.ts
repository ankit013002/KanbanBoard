import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  id: number;
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
        card: { id: number; title?: string; text?: string };
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
        cardId: number;
        toIndex: number;
      }>
    ) {
      const { fromColumnId, toColumnId, cardId, toIndex } = action.payload;
      const fromColumn = state.columns.find(
        (column) => column.id === fromColumnId
      );
      const toColumn = state.columns.find((column) => column.id === toColumnId);

      if (!fromColumn || !toColumn) {
        return;
      }

      const index = fromColumn.cards.findIndex((card) => card.id === cardId);
      if (index < 0) {
        return;
      }
      const [movedCard] = fromColumn.cards.splice(index, 1);
      toColumn?.cards.splice(toIndex, 0, movedCard);
    },
  },
});

export const { addColumn, addCard, moveCard } = kanbanSlice.actions;
export default kanbanSlice.reducer;
