import { createSlice } from "@reduxjs/toolkit";

export const TemplateSlice = createSlice({
  name: "template",
  initialState: {
    fbCategory: [],
    selectedCategory: null,
    fbType: [],
    fbGeneratedDatas: [],
    categoryAndTypes: [],
    categoryWithTypesWithTemplates:[],
    selectTemplate:'',
    generateDatas:[],
    datas:[]
  },
  reducers: {
    setFbCategory: (state, action) => {
      state.fbCategory = action.payload;
    },
    setSelectedCategory: (state, action) => { 
      state.selectedCategory = action.payload;
    },
    setFbType: (state, action) => {
      state.fbType = action.payload;
    },
    setFbGeneratedDatas: (state, action) => {
      state.fbGeneratedDatas = action.payload;
    },
    setCategoryAndTypes: (state, action) => {
      state.categoryAndTypes = action.payload;
      },
      setCategoryWithTypesWithTemplates:(state,action)=>{
        state.categoryWithTypesWithTemplates = action.payload
      },
      setSelectTemplate:(state,action)=>{
        state.selectTemplate = action.payload
      },
      setGenerateDatas : (state,action)=>{
        state.generateDatas = action.payload
      },
      setDatas:(state,action)=>{
        state.datas = action.payload
      }
  },
});
export const {
  setFbCategory,
  setSelectedCategory,
  setFbType,
  setCategoryAndTypes,
  setFbGeneratedDatas,
  setCategoryWithTypesWithTemplates,
  setSelectTemplate,
  setGenerateDatas,
  setDatas
} = TemplateSlice.actions;
export default TemplateSlice.reducer;
