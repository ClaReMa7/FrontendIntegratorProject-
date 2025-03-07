import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import { AuthProvider, useAuth } from './auth/AuthContext';
import { InstrumentProvider, useInstrumentContext } from './instruments/InstrumentContext';

/**
 * RootProvider - Combines all context providers for application-wide state
 */
export const RootProvider = ({ children }) => {
  return (
    <AuthProvider>
      <InstrumentProvider>
        <GlobalCompatibilityProvider>
          {children}
        </GlobalCompatibilityProvider>
      </InstrumentProvider>
    </AuthProvider>
  );
};

RootProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Compatibility layer for GlobalContext
 * 
 * This provides backward compatibility for components still using the old
 * GlobalContext pattern while you gradually migrate them to the new architecture.
 */
const GlobalContext = createContext();

const GlobalCompatibilityProvider = ({ children }) => {
  // Get state and methods from both contexts
  const { 
    user, 
    isAuthenticated, 
    loading, 
    login, 
    logout,
    updateUserData,
    checkSessionStatus
  } = useAuth();
  
  const { 
    instruments, 
    addInstrument, 
    updateInstrument, 
    removeInstrument 
  } = useInstrumentContext();

  // Combine them into a single context value that matches the old structure
  const value = {
    // Auth-related properties
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUserData,
    checkSessionStatus,
    
    // Instrument-related properties
    instruments,
    addInstrument,
    updateInstrument,
    removeInstrument
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

GlobalCompatibilityProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook for using the compatibility context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext debe ser usado dentro de GlobalProvider");
  }
  return context;
};

// Export specialized hooks
export {
  useAuth,
  useInstrumentContext
};