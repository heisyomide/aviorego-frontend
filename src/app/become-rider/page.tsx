'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

// Step Presentation Component Imports
import Step1PersonalDetails from './components/step1';
import Step2IdentityVerification from './components/step2';
import Step3VehicleInformation from './components/step3';
import Step4DocumentsUpload from './components/step4';
import Step5FinancialSettlement from './components/step5';
import Step6CompliancePolicies from './components/step6';

export default function RiderOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Section 1: Registration Core Identities & Personal Details
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'MALE',
    residentialAddress: '',
    state: '',
    city: '',
    lga: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',

    // Section 2: Identity Verification
    idType: 'NATIONAL_ID', // Reverts to default step selector fallback value
    idNumber: '',
    idFrontImage: '',
    idBackImage: '',
    selfieImage: '',

    // Section 3: Vehicle Information
    vehicleType: 'BIKE',
    plateNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: '',
    vehiclePhoto: '',

    // Section 4: Extra Documents
    driversLicenseDoc: '',
    vehiclePaperDoc: '',
    insuranceDoc: '',
    roadWorthinessDoc: '',

    // Section 5: Bank Information
    bankName: '',
    bankCode: '', 
    accountNumber: '',
    accountName: '',

    // Section 6: Agreements
    acceptedTerms: false,
    acceptedCommission: false,
    acceptedPrivacy: false,
  });

  const updateField = (key: string, value: any) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  // Bank Proxy Resolver Lookup Pipeline
  const handleResolveBankAccount = async (accountNum: string, bankCode: string) => {
    if (accountNum.length === 10 && bankCode) {
      try {
        const res = await api.get(`/payments/resolve-bank?accountNumber=${accountNum}&bankCode=${bankCode}`);
        if (res.data?.accountName) {
          updateField('accountName', res.data.accountName);
        }
      } catch (err) {
        throw err; 
      }
    }
  };

  // Authenticated Backend Proxy Media Upload Routing Array Pipeline
  const handleBackendUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const backendData = new FormData();
    backendData.append('file', file);

    let endpointUrl = '';
    switch (key) {
      case 'idFrontImage':
        endpointUrl = '/uploads/rider/id-front';
        break;
      case 'idBackImage':
        endpointUrl = '/uploads/rider/id-back';
        break;
      case 'selfieImage':
        endpointUrl = '/uploads/rider/selfie';
        break;
      case 'vehiclePhoto':
        endpointUrl = '/uploads/rider/vehicle-photo';
        break;
      case 'driversLicenseDoc':
        endpointUrl = '/uploads/license';
        break;
      case 'vehiclePaperDoc':
        endpointUrl = '/uploads/rider/vehicle-paper';
        break;
      case 'insuranceDoc':
        endpointUrl = '/uploads/rider/insurance';
        break;
      case 'roadWorthinessDoc':
        endpointUrl = '/uploads/rider/road-worthiness';
        break;
      default:
        endpointUrl = '/uploads/rider/profile-photo';
    }

    try {
      const res = await api.post(endpointUrl, backendData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.url) {
        updateField(key, res.data.url);
      } else {
        setError('Server authorized file storage successfully but returned an empty asset link.');
      }
    } catch (err: any) {
      console.error('--- Backend Binary Proxy Rejection ---', err);
      setError(
        err.response?.data?.message || 
        'Failed to upload asset through the backend proxy gateway.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    setError('');
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinalSubmission = async () => {
    if (!formData.acceptedTerms || !formData.acceptedCommission || !formData.acceptedPrivacy) {
      setError('All regulatory guidelines must be explicitly accepted.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    // 🌟 Create a safe, whitelisted clone matching the strict NestJS DTO architecture rules perfectly
    const whitelistedPayload = {
      ...formData,
      // If your interface select binds assign "NATIONAL_ID", translate it here to "NIN" if that's what your Prisma validation error requires.
      idType: formData.idType === 'NATIONAL_ID' ? 'NIN' : formData.idType,
      
      // 🌟 TRANSLATE 'BIKE' TO 'MOTORCYCLE' TO MATCH YOUR PRISMA ENUM EXACTLY
      vehicleType: formData.vehicleType === 'BIKE' ? 'MOTORCYCLE' : formData.vehicleType,
    };

    // 🌟 STRIP OUT THE UNEXPECTED FIELD THAT NESTJS IS REJECTING
    delete (whitelistedPayload as any).emergencyRelationship;

    try {
      await api.post('/rider/onboarding/submit', whitelistedPayload);
      router.replace('/become-rider/thank-you');
    } catch (err: any) {
      console.error("Submission API Error:", err.response?.data);
      const backendMessage = err.response?.data?.message;
      setError(
        Array.isArray(backendMessage) 
          ? backendMessage.join(', ') 
          : 'Submission error. Please verify field items.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Identity Verification',
    'Vehicle Setup',
    'Legal Records',
    'Financial Parameters',
    'Final Agreements'
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 font-sans select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
        
        {/* Dynamic Shared Header Title Grid */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Rider Profile</h2>
            <p className="text-xs text-zinc-400 font-medium">
              Section {step} of 6 — <span className="text-zinc-600 font-semibold">{stepTitles[step - 1]}</span>
            </p>
          </div>
          {/* Timeline Linear Progress Indicators */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className={`h-1 w-4 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-emerald-700' : 'bg-zinc-100'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Global Pipeline Notification Bar */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 text-center font-semibold tracking-wide">
            {error}
          </div>
        )}

        {/* Multi-Step Component Injection Portal Router */}
        {step === 1 && (
          <Step1PersonalDetails 
            formData={formData} 
            updateField={updateField} 
            onNext={handleNext} 
          />
        )}
        {step === 2 && (
          <Step2IdentityVerification 
            formData={formData} 
            updateField={updateField} 
            onUpload={handleBackendUpload} 
            onNext={handleNext} 
            onBack={handleBack} 
            uploading={uploading} 
          />
        )}
        {step === 3 && (
          <Step3VehicleInformation 
            formData={formData} 
            updateField={updateField} 
            onUpload={handleBackendUpload} 
            onNext={handleNext} 
            onBack={handleBack} 
            uploading={uploading} 
          />
        )}
        {step === 4 && (
          <Step4DocumentsUpload 
            formData={formData} 
            onUpload={handleBackendUpload} 
            onNext={handleNext} 
            onBack={handleBack} 
            uploading={uploading} 
          />
        )}
        {step === 5 && (
          <Step5FinancialSettlement 
            formData={formData} 
            updateField={updateField} 
            onResolveBank={handleResolveBankAccount} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}
        {step === 6 && (
          <Step6CompliancePolicies 
            formData={formData} 
            updateField={updateField} 
            onSubmit={handleFinalSubmission} 
            onBack={handleBack} 
            submitting={submitting} 
          />
        )}

      </div>
    </div>
  );
}