export interface QueueEntryDto {
    id: string;
    appointmentId: {
        id: string;
        time: string;
        patientId: { id: string; fullName: string };
    };
    time: string;
    stage: 'waiting' | 'in_consultation' | 'completed';
    arrivedAt?: string;
    consultationStartedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}
