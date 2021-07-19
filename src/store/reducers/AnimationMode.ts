import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
// import { IWaybackItem } from '../../types';
import { RootState } from '../configureStore';

export type AnimationModeState = {
    isAnimationModeOn: boolean;
};

export const initialAnimationModeState = {
    isAnimationModeOn: false,
} as AnimationModeState;

const slice = createSlice({
    name: 'AnimationMode',
    initialState: initialAnimationModeState,
    reducers: {
        isAnimationModeOnToggled: (state: AnimationModeState) => {
            state.isAnimationModeOn = !state.isAnimationModeOn;
        }
    },
});

const { reducer } = slice;

export const {
    isAnimationModeOnToggled
} = slice.actions;

export const isAnimationModeOnSelector = createSelector(
    (state: RootState) => state.AnimationMode.isAnimationModeOn,
    (isAnimationModeOn) => isAnimationModeOn
);

export default reducer;
