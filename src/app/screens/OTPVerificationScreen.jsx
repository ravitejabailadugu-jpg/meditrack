import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Shield } from 'lucide-react';
export default function OTPVerificationScreen() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Read the email passed from the previous screen
    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Ensure we have an email
        if (!email) {
            setError('Email not found. Please go back and try again.');
            return;
        }
        // Ensure all 6 digits are filled
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/verify-forgot-otp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpString
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to verify OTP');
            }
            // Success! Move to reset password screen and keep passing the email along
            navigate('/reset-password', { state: { email, otp: otpString } });
        }
        catch (err) {
            setError(err.message || 'Error connecting to the server');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleResendOtp = async () => {
        if (!email)
            return;
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/forgot-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || data.error || 'Failed to resend OTP');
            }
            // Briefly show success or clear error
            setError('');
            alert('A new OTP has been sent to your terminal!');
        }
        catch (err) {
            setError(err.message || 'Error connecting to the server');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600"/>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enter OTP
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to {email ? <span className="font-semibold">{email}</span> : 'your email'}
          </p>
        </div>

        {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (<input className="form-control" key={index} id={`otp-${index}`} type="text" maxLength={1} value={digit} onChange={(e) => handleChange(index, e.target.value)} className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"/>))}
          </div>

          <button className="btn" type="submit" disabled={isLoading || !otp.every(digit => digit !== '')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
            {isLoading ? (<span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>) : ('Verify OTP')}
          </button>

          <div className="text-center">
            <button type="button" onClick={handleResendOtp} disabled={isLoading} className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 btn">
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>);
}
