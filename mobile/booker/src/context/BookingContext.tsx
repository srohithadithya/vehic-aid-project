import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BookingState, Action } from '../types';

const initialState: BookingState = {
    step: 1,
    serviceType: null,
    location: {
        pickup: '',
    },
    vehicle: null,
};

function bookingReducer(state: BookingState, action: Action): BookingState {
    switch (action.type) {
        case 'NEXT_STEP':
            return { ...state, step: state.step + 1 };
        case 'PREV_STEP':
            return { ...state, step: Math.max(1, state.step - 1) };
        case 'SET_SERVICE':
            return { ...state, serviceType: action.payload };
        case 'SET_LOCATION':
            return { ...state, location: { ...state.location, ...action.payload } };
        case 'SET_VEHICLE':
            return { ...state, vehicle: { ...(state.vehicle || { make: '', model: '', licensePlate: '' }), ...action.payload } };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

const BookingContext = createContext<{
    state: BookingState;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    return (
        <BookingContext.Provider value={{ state, dispatch }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
