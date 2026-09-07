import { API_BASE_URL } from '../../services';
import React, { createContext, useContext, useState, useEffect } from 'react';
const AppContext = createContext(undefined);
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
const initialPatients = [];
const initialDiseases = [];
const initialNotifications = [
    {
        id: 'N001',
        message: 'New patient John Smith added to the system',
        timestamp: '2024-03-07T09:30:00',
        read: false
    },
    {
        id: 'N002',
        message: 'Disease status updated for patient P003',
        timestamp: '2024-03-07T10:15:00',
        read: false
    },
    {
        id: 'N003',
        message: 'Critical case alert: Patient P003 requires immediate attention',
        timestamp: '2024-03-07T11:00:00',
        read: false
    }
];
export const AppProvider = ({ children }) => {
    const [patients, setPatients] = useState(initialPatients);
    const [diseases, setDiseases] = useState(initialDiseases);
    const [notifications, setNotifications] = useState([]);
    const [userRole, setUserRole] = useState('Doctor');
    const [userName, setUserName] = useState('Doctor User');
    // Fetch patients from backend
    const refreshPatients = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/`);
            if (!response.ok)
                throw new Error('Failed to fetch patients');
            const data = await response.json();
            const mapped = data.map((p) => ({
                id: String(p.id),
                name: p.name,
                age: p.age,
                gender: p.gender,
                phone: p.phone_number || '',
                address: p.address || '',
                diseases: []
            }));
            setPatients(mapped);
        }
        catch (err) {
            console.error('Context fetch patients failed', err);
        }
    };
    // Fetch all patient-disease records from backend
    const refreshDiseases = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/diseases/`);
                        const res2 = await fetch(`${API_BASE_URL}/api/reports/analytics/`); // Placeholder for "diseases" or similar
            // I'll fetch the actual assigned diseases (PatientDisease) from a reports endpoint or add a new one if needed.
            // For now, let's fetch the types to populate any name dropdowns.
            const typesResponse = await fetch(`${API_BASE_URL}/api/diseases/`);
            if (typesResponse.ok) {
                const typesData = await typesResponse.json();
                // and fetch active cases
                const casesResponse = await fetch(`${API_BASE_URL}/api/dashboard/`); // or a more specific one
                // ... mapping logic ...
            }
        }
        catch (err) {
            console.error('Context fetch diseases failed', err);
        }
    };
    // Fetch from backend
    const refreshNotifications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/`);
            if (!response.ok)
                throw new Error('Failed to fetch notifications');
            const data = await response.json();
            const mapped = data.map((n) => ({
                id: n.id,
                message: n.message,
                timestamp: n.created_at,
                read: n.is_read
            }));
            setNotifications(mapped);
        }
        catch (err) {
            console.error('Context fetch notifications failed', err);
        }
    };
    useEffect(() => {
        refreshPatients();
        refreshNotifications();
        // refreshDiseases(); // Implement if needed
        // Poll every 30 seconds
        const interval = setInterval(() => {
            refreshPatients();
            refreshNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    const addPatient = (patient) => {
        setPatients([...patients, patient]);
    };
    const updatePatient = (updatedPatient) => {
        setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    };
    const addDisease = (disease) => {
        setDiseases([...diseases, disease]);
    };
    const updateDisease = (updatedDisease) => {
        setDiseases(diseases.map(d => d.id === updatedDisease.id ? updatedDisease : d));
    };
    const markNotificationRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };
    const clearAllNotifications = () => {
        setNotifications([]);
    };
    return (<AppContext.Provider value={{
            patients,
            diseases,
            notifications,
            userRole,
            userName,
            addPatient,
            updatePatient,
            addDisease,
            updateDisease,
            markNotificationRead,
            deleteNotification,
            clearAllNotifications,
            setUserRole,
            setUserName
        }}>
      {children}
    </AppContext.Provider>);
};
