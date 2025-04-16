import { createSlice } from "@reduxjs/toolkit";

export const SettingSlice = createSlice({
  name: "settings",
  initialState: {
    categories: [],
    types: [],
    selectedCategory: "",
    categoryType: "",
    categoryName: "",
    showModal: false,
    previewContent: "",
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setTypes: (state, action) => {
      state.types = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCategoryType: (state, action) => {
      state.categoryType = action.payload;
    },
    setCategoryName: (state, action) => {
      state.categoryName = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setCandidateName: (state, action) => {
      state.candidateName = action.payload;
    },
    setEmailTitle: (state, action) => {
      state.emailTitle = action.payload;
    },
    setPreviewContent: (state, action) => {
      state.previewContent = action.payload;
    },
  },
});

export const {
  setCategories,
  setTypes,
  setSelectedCategory,
  setCategoryType,
  setCategoryName,
  setShowModal,
  setPreviewContent,
  
} = SettingSlice.actions;
export default SettingSlice.reducer;
