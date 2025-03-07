import PropTypes from "prop-types";
import { createContext, useContext, useReducer, useEffect } from "react";
import { instrumentReducer } from "./instrumentReducer";
import { 
  ADD_INSTRUMENT, 
  UPDATE_INSTRUMENT, 
  REMOVE_INSTRUMENT, 
  SET_INSTRUMENTS
} from "./instrumentActions";
import instrumentService from "../../services/instrumentService";

/**
 * InstrumentContext - Responsible for instrument state management
 * 
 * Single Responsibility Principle: Handles only instrument-related state
 */
const InstrumentContext = createContext();

// Initial state for instruments
const initialState = {
  instruments: [],
  totalPages: 1,
  currentPage: 0
};

export const InstrumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(instrumentReducer, initialState);

  // Load instruments on mount
  useEffect(() => {
    const loadInstruments = async () => {
      try {
        const result = await instrumentService.getInstrumenAll();
        dispatch({
          type: SET_INSTRUMENTS,
          payload: {
            instruments: result.products,
            totalPages: result.totalPages,
            currentPage: result.currentPageIndex
          }
        });
      } catch (error) {
        console.error("Error loading instruments:", error);
      }
    };

    loadInstruments();
  }, []);

  // Add a new instrument
  const addInstrument = (instrument) => {
    dispatch({
      type: ADD_INSTRUMENT,
      payload: instrument
    });
  };

  // Update an existing instrument
  const updateInstrument = (updatedInstrument) => {
    dispatch({
      type: UPDATE_INSTRUMENT,
      payload: updatedInstrument
    });
  };

  // Remove an instrument
  const removeInstrument = async (id) => {
    try {
      // Call the service method first
      await instrumentService.deleteInstrument(id);
      
      // Then update the state if successful
      dispatch({
        type: REMOVE_INSTRUMENT,
        payload: id
      });
      
      return true;
    } catch (error) {
      console.error("Error removing instrument:", error);
      return false;
    }
  };

  // Load instruments with pagination
  const loadInstrumentsByPage = async (page, pageSize = 10) => {
    try {
      const result = await instrumentService.getInstrumenAll(page, pageSize);
      dispatch({
        type: SET_INSTRUMENTS,
        payload: {
          instruments: result.products,
          totalPages: result.totalPages,
          currentPage: result.currentPageIndex
        }
      });
      return result;
    } catch (error) {
      console.error("Error loading instruments by page:", error);
      return { products: [], totalPages: 1, currentPageIndex: 0 };
    }
  };

  // Context value
  const value = {
    instruments: state.instruments,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    addInstrument,
    updateInstrument,
    removeInstrument,
    loadInstrumentsByPage
  };

  return (
    <InstrumentContext.Provider value={value}>
      {children}
    </InstrumentContext.Provider>
  );
};

// Custom hook for using instrument context
export const useInstrumentContext = () => {
  const context = useContext(InstrumentContext);
  if (context === undefined) {
    throw new Error("useInstrumentContext debe ser usado dentro de InstrumentProvider");
  }
  return context;
};

InstrumentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};