import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '@store'

export interface DisplayError {
  message: string,
  id: number,
  removed: boolean
}

export interface ErrorState {
  stack: DisplayError[],
  counter: number
}

const initialState: ErrorState = {
  stack: [],
  counter: 0
}

export const pushError = createAsyncThunk<
  string,
  string,
  {
    state: RootState,
    dispatch: AppDispatch
  }
>('errors/pushError', (message, { getState, dispatch }) => {
  const id = getState().errors.counter
  setTimeout(() => {
    dispatch(removeErrorDelayed(id))
  }, 5000)

  if (getState().errors.stack.length >= 3) {
    getState().errors.stack.slice(2).forEach(({ id }) => dispatch(removeErrorDelayed(id)))
  }

  return message
})

export const removeErrorDelayed = createAsyncThunk<
  number,
  number,
  {
    dispatch: AppDispatch
  }
>('errors/removeErrorDelayed', (id, { dispatch }) => {
  setTimeout(() => {
    dispatch(removeError(id))
  }, 200)

  return id
})

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    removeError(state, action: PayloadAction<number>) {
      const index = state.stack.findIndex(({ id }) => id === action.payload)

      if (index > -1) {
        state.stack.splice(index, 1)
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(pushError.fulfilled, (state, action) => {
        state.stack.unshift({
          message: action.payload,
          id: state.counter,
          removed: false
        })

        state.counter++
      })
      .addCase(removeErrorDelayed.fulfilled, (state, action) => {
        const index = state.stack.findIndex(({ id }) => id === action.payload)

        if (index > -1) {
          state.stack[index].removed = true
        }
      })
  }
})

export const { removeError } = errorSlice.actions

export default errorSlice.reducer
