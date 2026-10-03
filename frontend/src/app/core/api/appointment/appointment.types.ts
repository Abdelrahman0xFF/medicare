export interface AppointmentDto {
    id: string;
    patientId: string | { id: string; fullName: string; phone: string };
    reason: string;
    date: string;
    time: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    receiptImageUrl?: string;
    checkedIn: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}
