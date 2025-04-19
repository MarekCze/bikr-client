import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SupabaseClubRepository } from '../repositories/SupabaseClubRepository';
import { IClubRepository } from 'bikr-shared';

// Create the context with a default undefined value
const ClubContext = createContext<IClubRepository | undefined>(undefined);

/**
 * Props for ClubProvider component
 */
type ClubProviderProps = {
  children: ReactNode;
  repository?: IClubRepository; // Optional for testing/mocking
};

/**
 * Provider component that makes club repository available to any
 * child component that calls useClub().
 */
export const ClubProvider: React.FC<ClubProviderProps> = ({ 
  children, 
  repository 
}) => {
  const { session } = useAuth();
  
  // Create the repository instance if one wasn't provided
  const clubRepository = repository || new SupabaseClubRepository();
  
  return (
    <ClubContext.Provider value={clubRepository}>
      {children}
    </ClubContext.Provider>
  );
};

/**
 * Hook that provides access to the club repository.
 * Must be used within a ClubProvider.
 */
export const useClub = (): IClubRepository => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
