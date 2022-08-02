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

const errors = {
  'auth/invalid-email': 'Please provide a valid email.',
  'auth/email-already-in-use': 'Email already in use.',
  'auth/weak-password': 'Password should be at least six characters long.',
  'auth/wrong-password': 'Wrong password.',
  'auth/user-not-found': 'User does not exist'
}

function humanizeError (err): string {
  if (typeof err === 'string') {
    return err
  } else if ('code' in err) {
    if (errors[err.code]) {
      return errors[err.code]
    } else {
      console.log('Could not map error: ' + err.code)
      return 'Something went wrong. Check that you provided correct information.'
    }
  } else if ('message' in err) {
    return err.message as string
  } else {
    return 'Something went wrong. Check that you provided correct information.'
  }
}

export const pushError = createAsyncThunk<
  string,
  (string | { code?: string, message?: string }),
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

  return humanizeError(message)
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
