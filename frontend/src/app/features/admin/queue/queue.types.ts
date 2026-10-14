export interface QueueCardItem {
    id: string;
    patientName: string;
    time: string;
    appointmentTime?: string;
    operationalTime: string;
    timeLabel: string;
    elapsedText?: string;
}

export interface CheckInCandidate {
    id: string;
    patientName: string;
    time: string;
    phone: string;
    reason?: string;
}
