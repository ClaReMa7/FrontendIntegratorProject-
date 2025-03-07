import { 
    ADD_INSTRUMENT, 
    UPDATE_INSTRUMENT, 
    REMOVE_INSTRUMENT, 
    SET_INSTRUMENTS 
  } from "./instrumentActions";
  
  /**
   * Instrument Reducer - Manages state transitions for instruments
   * 
   * Pure function that takes previous state and an action,
   * and returns the next state.
   */
  export const instrumentReducer = (state, action) => {
    switch (action.type) {
      case ADD_INSTRUMENT:
        return {
          ...state,
          instruments: [...state.instruments, action.payload]
        };
        
      case UPDATE_INSTRUMENT:
        return {
          ...state,
          instruments: state.instruments.map((instrument) => {
            // Check multiple possible ID field names
            const instrumentId = instrument.id || instrument.idProduct;
            const payloadId = action.payload.id || action.payload.idProduct;
            
            return instrumentId === payloadId ? action.payload : instrument;
          })
        };
        
      case REMOVE_INSTRUMENT:
        return {
          ...state,
          instruments: state.instruments.filter((instrument) => {
            // Check multiple possible ID field names
            const instrumentId = instrument.id || instrument.idProduct;
            return instrumentId !== action.payload;
          })
        };
        
      case SET_INSTRUMENTS:
        return {
          ...state,
          instruments: action.payload.instruments,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage
        };
        
      default:
        return state;
    }
  };