import { doc, updateDoc } from 'firebase/firestore';
import { db, appId } from './firebase';

export const updateTicketStatus = async (ticketId, status) => {
    try {
        const ticketRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', ticketId);
        await updateDoc(ticketRef, { status });
        return true;
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

export const updateTicketPriority = async (ticketId, priority) => {
    try {
        const ticketRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', ticketId);
        await updateDoc(ticketRef, { priority });
        return true;
    } catch (error) {
        console.error("Error updating priority:", error);
        throw error;
    }
};
