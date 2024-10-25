import { createContext, useContext } from 'react';

export const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);
