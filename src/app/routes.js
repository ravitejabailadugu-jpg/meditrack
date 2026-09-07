import { createBrowserRouter } from 'react-router';
import MainLayout from './components/MainLayout';
// Onboarding & Auth
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
// Main App
import DashboardScreen from './screens/DashboardScreen';
// Patient Management
import PatientListScreen from './screens/PatientListScreen';
import AddPatientScreen from './screens/AddPatientScreen';
import PatientDetailsScreen from './screens/PatientDetailsScreen';
import PatientHistoryScreen from './screens/PatientHistoryScreen';
import EditPatientScreen from './screens/EditPatientScreen';
// Disease Management
import DiseaseListScreen from './screens/DiseaseListScreen';
import AddDiseaseScreen from './screens/AddDiseaseScreen';
import DiseaseDetailsScreen from './screens/DiseaseDetailsScreen';
import DiseaseHistoryScreen from './screens/DiseaseHistoryScreen';
import UpdateDiseaseStatusScreen from './screens/UpdateDiseaseStatusScreen';
// Reports
import ReportsScreen from './screens/ReportsScreen';
import PatientReportScreen from './screens/PatientReportScreen';
import DiseaseAnalyticsScreen from './screens/DiseaseAnalyticsScreen';
import DownloadReportScreen from './screens/DownloadReportScreen';
// Other
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ActivityLogScreen from './screens/ActivityLogScreen';
import ThankYouScreen from './screens/ThankYouScreen';
export const router = createBrowserRouter([
    // Auth routes (no MainLayout)
    {
        path: '/',
        Component: SplashScreen
    },
    {
        path: '/welcome',
        Component: WelcomeScreen
    },
    {
        path: '/onboarding',
        Component: OnboardingScreen
    },
    {
        path: '/role-selection',
        Component: RoleSelectionScreen
    },
    {
        path: '/login',
        Component: LoginScreen
    },
    {
        path: '/signup',
        Component: SignupScreen
    },
    {
        path: '/forgot-password',
        Component: ForgotPasswordScreen
    },
    {
        path: '/otp-verification',
        Component: OTPVerificationScreen
    },
    {
        path: '/reset-password',
        Component: ResetPasswordScreen
    },
    {
        path: '/thank-you',
        Component: ThankYouScreen
    },
    // Main app routes (with MainLayout)
    {
        path: '/dashboard',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: DashboardScreen
            }
        ]
    },
    {
        path: '/patients',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: PatientListScreen
            },
            {
                path: 'add',
                Component: AddPatientScreen
            },
            {
                path: ':id',
                Component: PatientDetailsScreen
            },
            {
                path: ':id/history',
                Component: PatientHistoryScreen
            },
            {
                path: ':id/edit',
                Component: EditPatientScreen
            }
        ]
    },
    {
        path: '/diseases',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: DiseaseListScreen
            },
            {
                path: 'add',
                Component: AddDiseaseScreen
            },
            {
                path: ':id',
                Component: DiseaseDetailsScreen
            },
            {
                path: ':id/history',
                Component: DiseaseHistoryScreen
            },
            {
                path: ':id/update-status',
                Component: UpdateDiseaseStatusScreen
            }
        ]
    },
    {
        path: '/reports',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: ReportsScreen
            },
            {
                path: 'patients',
                Component: PatientReportScreen
            },
            {
                path: 'analytics',
                Component: DiseaseAnalyticsScreen
            },
            {
                path: 'download',
                Component: DownloadReportScreen
            }
        ]
    },
    {
        path: '/notifications',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: NotificationsScreen
            }
        ]
    },
    {
        path: '/profile',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: ProfileScreen
            },
            {
                path: 'edit',
                Component: EditProfileScreen
            }
        ]
    },
    {
        path: '/settings',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: SettingsScreen
            },
            {
                path: 'activity',
                Component: ActivityLogScreen
            }
        ]
    }
]);
