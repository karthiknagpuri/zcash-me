import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Link2, MapPin, Shield, CheckCircle2, Check, ExternalLink, Loader2 } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { getAuthProviderForUrl, startOAuthVerification } from '../utils/linkAuthFlow';

const ZcasherOnboarding = () => {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    bio: '',
    address: '',
    addressVerified: false,
    verificationCode: '',
    mainFocus: 'Privacy Advocate',
    profile_image_url: '',
    fetchedAvatars: [], // Store fetched profile pictures from social platforms
    nearest_city_name: '',
    nearest_city_id: null,
    referred_by: '',
    referred_by_zcasher_id: null,
    activityRange: 'Just starting',
    socialLinks: [],
    cardTheme: 'passport-stamp-name'
  });

  const cardThemes = [
    { id: 'passport-stamp-name', name: 'Burgundy', bg: '#7c2d3a', isLight: false },
    { id: 'passport-stamp-name-black', name: 'Black', bg: '#1a1a1a', isLight: false },
    { id: 'passport-stamp-name-white', name: 'White', bg: '#fafafa', isLight: true },
    { id: 'passport-stamp-name-yellow', name: 'Yellow', bg: '#f5c542', isLight: true },
  ];

  const [errors, setErrors] = useState({});
  const totalSteps = 5;

  // Read username from URL params and pre-fill
  useEffect(() => {
    const username = searchParams.get('username');
    if (username) {
      setFormData(prev => ({ ...prev, name: username }));
    }
  }, [searchParams]);

  const calculateProgress = () => {
    const fields = [
      { filled: !!formData.name, weight: 15 },
      { filled: !!formData.display_name, weight: 15 },
      { filled: !!formData.address, weight: 20 },
      { filled: formData.addressVerified, weight: 15 },
      { filled: !!formData.bio, weight: 10 },
      { filled: !!formData.profile_image_url, weight: 10 },
      { filled: !!formData.nearest_city_name, weight: 5 },
      { filled: formData.socialLinks.length > 0, weight: 10 },
    ];
    return fields.reduce((acc, field) => acc + (field.filled ? field.weight : 0), 0);
  };

  const progress = calculateProgress();
  const totalBars = 25;
  const filledBars = Math.round((progress / 100) * totalBars);

  const focusOptions = [
    'Privacy Advocate',
    'Crypto Trader',
    'Developer',
    'Content Creator',
    'Community Builder',
    'Investor'
  ];

  const revenueRanges = [
    'Just starting',
    '$1k - $10k',
    '$10k - $50k',
    '$50k - $100k',
    '$100k - $500k',
    '$500k+'
  ];

  const socialPlatforms = [
    { value: 'X', label: 'X (Twitter)', urlPattern: 'x.com/' },
    { value: 'GitHub', label: 'GitHub', urlPattern: 'github.com/' },
    { value: 'Instagram', label: 'Instagram', urlPattern: 'instagram.com/' },
    { value: 'Reddit', label: 'Reddit', urlPattern: 'reddit.com/user/' },
    { value: 'LinkedIn', label: 'LinkedIn', urlPattern: 'linkedin.com/in/' },
    { value: 'Discord', label: 'Discord', urlPattern: 'discord.com/users/' },
    { value: 'TikTok', label: 'TikTok', urlPattern: 'tiktok.com/@' },
    { value: 'Mastodon', label: 'Mastodon', urlPattern: 'mastodon.social/@' },
    { value: 'Bluesky', label: 'Bluesky', urlPattern: 'bsky.app/profile/' },
    { value: 'Snapchat', label: 'Snapchat', urlPattern: 'snapchat.com/add/' },
    { value: 'Telegram', label: 'Telegram', urlPattern: 't.me/' },
    { value: 'Other', label: 'Other (custom URL)', urlPattern: '' },
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, {
        id: Date.now(),
        platform: 'X',
        handle: '',
        authenticated: false,
        order_index: prev.socialLinks.length
      }]
    }));
  };

  const updateSocialLink = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (id) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const handleContinue = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const getGreeting = () => {
    if (formData.display_name) return `Welcome to Zcash, ${formData.display_name}`;
    if (formData.name) return `Welcome to Zcash, ${formData.name}`;
    return 'Welcome to Zcash';
  };

  return (
    <div className="h-screen bg-[#FDF6F0] flex items-center justify-center py-4 px-5">
      <div
        className="relative max-w-7xl max-h-[770px]"
        style={{
          width: 'min(calc(100vw - 40px), calc((100vh - 32px) * 1.6))',
          height: 'min(calc(100vh - 32px), calc((100vw - 40px) / 1.6))',
        }}
      >
        {/* 3D Depth Shadow */}
        <div className="absolute inset-0 bg-black/[0.03] rounded-[28px] transform translate-x-3 translate-y-3" />

        <div className="relative flex flex-col lg:flex-row gap-4 items-stretch h-full">
          {/* Form Card */}
          <div className="w-full lg:w-[64%] order-2 lg:order-1 h-full">
            <div className="bg-white rounded-[24px] shadow-sm border border-black/[0.04] p-6 h-full flex flex-col">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex-shrink-0 mb-4">
                  <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                    {currentStep === 0 && getGreeting()}
                    {currentStep === 1 && "Secure your profile"}
                    {currentStep === 2 && "Connect your accounts"}
                    {currentStep === 3 && "Complete your profile"}
                    {currentStep === 4 && "Review and confirm"}
                  </h1>
                  <p className="text-[15px] text-[#86868b] mt-1 leading-relaxed">
                    {currentStep === 0 && "Create your profile to start receiving ZEC."}
                    {currentStep === 1 && "Verify your Zcash address to prove ownership."}
                    {currentStep === 2 && "Add and authenticate your social accounts."}
                    {currentStep === 3 && "Add final details to complete your profile."}
                    {currentStep === 4 && "Review your information before creating your profile."}
                  </p>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto min-h-0 px-3 -mx-3">
                  {currentStep === 0 && <Step1 formData={formData} updateField={updateField} focusOptions={focusOptions} revenueRanges={revenueRanges} cardThemes={cardThemes} />}
                  {currentStep === 1 && <Step2 formData={formData} updateField={updateField} />}
                  {currentStep === 2 && <Step3 formData={formData} updateField={updateField} socialPlatforms={socialPlatforms} addSocialLink={addSocialLink} updateSocialLink={updateSocialLink} removeSocialLink={removeSocialLink} />}
                  {currentStep === 3 && <Step4 formData={formData} updateField={updateField} />}
                  {currentStep === 4 && <Step5 formData={formData} socialPlatforms={socialPlatforms} />}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between pt-3 mt-3 border-t border-[#d2d2d7]">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-[#86868b] tabular-nums">
                      {progress}%
                    </span>
                    <div className="flex items-end gap-[2px]">
                      {Array.from({ length: totalBars }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-[2px] rounded-full transition-all duration-300 ${
                            index < filledBars
                              ? 'h-5 bg-[#0071e3]'
                              : 'h-5 bg-[#d2d2d7]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-5 py-2.5 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={handleContinue}
                      className="px-6 py-2.5 bg-[#1d1d1f] text-white text-[14px] font-medium rounded-full hover:bg-[#424245] transition-colors active:scale-[0.98]"
                    >
                      {currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="w-full lg:w-[36%] hidden lg:flex order-1 lg:order-2 h-full">
            <MobilePreviewCard formData={formData} socialPlatforms={socialPlatforms} cardThemes={cardThemes} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Main Focus
const Step1 = ({ formData, updateField, focusOptions, revenueRanges, cardThemes }) => {
  return (
    <div className="space-y-4">
      {/* Username & Display Name - Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Username */}
        <div>
          <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
            Username
          </label>
          <div className="flex items-center bg-[#f5f5f7] rounded-xl border-2 border-transparent focus-within:border-[#0071e3] focus-within:bg-white transition-all">
            <span className="pl-3 pr-0.5 py-2.5 text-[#86868b] text-[12px] font-medium select-none whitespace-nowrap">
              zcash.me/
            </span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="username"
              className="flex-1 pr-2 py-2.5 bg-transparent border-0 text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none min-w-0"
            />
            {formData.name && (
              <div className="pr-2">
                <CheckCircle2 className="w-4 h-4 text-[#1b5e20]" />
              </div>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
            Display name
          </label>
          <div className="flex items-center bg-[#f5f5f7] rounded-xl border-2 border-transparent focus-within:border-[#0071e3] focus-within:bg-white transition-all">
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => updateField('display_name', e.target.value)}
              placeholder="Your name"
              className="flex-1 px-3 py-2.5 bg-transparent border-0 text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none min-w-0"
            />
            {formData.display_name && (
              <div className="pr-2">
                <CheckCircle2 className="w-4 h-4 text-[#1b5e20]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Theme */}
      <div>
        <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
          Card Style
        </label>
        <div className="flex flex-wrap gap-3">
          {cardThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateField('cardTheme', theme.id)}
              className={`relative w-16 h-20 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                formData.cardTheme === theme.id
                  ? 'border-[#0071e3] scale-105'
                  : 'border-transparent hover:scale-105 hover:border-[#d2d2d7]'
              }`}
              title={theme.name}
            >
              {/* Mini card preview */}
              <div
                className="w-full h-full flex flex-col items-center justify-center p-1.5"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Mini passport stamp */}
                <div className={`w-6 h-6 rounded-full border border-dashed ${theme.isLight ? 'border-emerald-600' : 'border-emerald-400'} flex items-center justify-center mb-1`}>
                  <svg className={`w-3 h-3 ${theme.isLight ? 'text-emerald-600' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Mini avatar placeholder */}
                <div className={`w-4 h-4 rounded-full ${theme.isLight ? 'bg-gray-300' : 'bg-white/20'} mb-1`} />
                {/* Mini text lines */}
                <div className={`w-8 h-1 rounded ${theme.isLight ? 'bg-gray-400' : 'bg-white/30'} mb-0.5`} />
                <div className={`w-6 h-0.5 rounded ${theme.isLight ? 'bg-gray-300' : 'bg-white/20'}`} />
              </div>
              {formData.cardTheme === theme.id && (
                <div className={`absolute inset-0 flex items-center justify-center ${theme.isLight ? 'bg-black/10' : 'bg-black/30'}`}>
                  <div className="w-5 h-5 rounded-full bg-[#0071e3] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Choose a passport card style that represents you
        </p>
      </div>

      {/* Monthly Activity & Referral - Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
            Monthly activity
          </label>
          <select
            value={formData.activityRange}
            onChange={(e) => updateField('activityRange', e.target.value)}
            className="w-full px-3 py-3 bg-[#f5f5f7] border-2 border-transparent rounded-xl text-[13px] text-[#1d1d1f] cursor-pointer focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2386868b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
          >
            {revenueRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
            Referred by <span className="text-[#86868b] font-normal normal-case">(opt)</span>
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={formData.referred_by}
              onChange={(e) => updateField('referred_by', e.target.value)}
              placeholder="Username"
              className="w-full pl-9 pr-3 py-3 bg-[#f5f5f7] border-2 border-transparent rounded-xl text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Focus */}
      <div>
        <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
          Your main focus
        </label>
        <div className="flex flex-wrap gap-2">
          {focusOptions.map((option) => (
            <button
              key={option}
              onClick={() => updateField('mainFocus', option)}
              className={`px-3 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                formData.mainFocus === option
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
              }`}
            >
              {formData.mainFocus === option && (
                <Check className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
              )}
              {option}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Select what best describes your primary interest in Zcash
        </p>
      </div>
    </div>
  );
};

// Step 2: Zcash Address
const Step2 = ({ formData, updateField }) => {
  const [showVerification, setShowVerification] = useState(false);

  return (
    <div className="space-y-4">
      {/* Zcash Address */}
      <div>
        <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
          Your Zcash address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="u1..."
          disabled={formData.addressVerified}
          className={`w-full px-4 py-3 border-2 border-transparent rounded-xl text-[14px] font-mono placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] transition-all ${
            formData.addressVerified
              ? 'bg-[#e8f5e9] text-[#1b5e20]'
              : 'bg-[#f5f5f7] text-[#1d1d1f] focus:bg-white'
          }`}
        />
        <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Enter your unified address (starts with u1) to receive payments
        </p>
      </div>

      {/* Verification */}
      {!formData.addressVerified && formData.address && (
        <div className="bg-[#f5f5f7] rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#e8e8ed] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[#1d1d1f]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1d1d1f] text-[14px]">Verify ownership</h3>
              <p className="text-[12px] text-[#86868b]">
                We'll send a verification code to this address
              </p>
            </div>
          </div>

          {!showVerification ? (
            <button
              onClick={() => setShowVerification(true)}
              className="w-full py-2.5 bg-[#1d1d1f] text-white rounded-lg text-[14px] font-medium hover:bg-[#424245] transition-colors"
            >
              Send Verification Code
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.verificationCode}
                onChange={(e) => updateField('verificationCode', e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2.5 bg-white border-2 border-transparent rounded-lg text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] transition-all"
              />
              <button
                onClick={() => {
                  if (formData.verificationCode) {
                    updateField('addressVerified', true);
                  }
                }}
                className="w-full py-2.5 bg-[#1d1d1f] text-white rounded-lg text-[14px] font-medium hover:bg-[#424245] transition-colors"
              >
                Verify Code
              </button>
            </div>
          )}
        </div>
      )}

      {formData.addressVerified && (
        <div className="bg-[#e8f5e9] rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b5e20] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1b5e20] text-[14px]">Address verified</h3>
            <p className="text-[12px] text-[#2e7d32]">You can now authenticate social links</p>
          </div>
        </div>
      )}

      {/* Bio */}
      <div>
        <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
          Bio <span className="text-[#86868b] font-normal normal-case">(optional)</span>
        </label>
        <div className="relative">
          <textarea
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value.slice(0, 100))}
            placeholder="Tell us about yourself..."
            rows={2}
            maxLength={100}
            className="w-full px-4 py-3 bg-[#f5f5f7] border-2 border-transparent rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all resize-none"
          />
          <span className="absolute bottom-2 right-3 text-[11px] text-[#86868b] tabular-nums">
            {formData.bio.length}/100
          </span>
        </div>
        <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> A short bio helps others know who you are
        </p>
      </div>
    </div>
  );
};

// Step 3: Social Links
const Step3 = ({ formData, updateField, socialPlatforms, addSocialLink, updateSocialLink, removeSocialLink }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [authenticatingId, setAuthenticatingId] = useState(null);
  const [showRedirect, setShowRedirect] = useState(false);
  const [redirectLabel, setRedirectLabel] = useState('');

  // Platforms that support OAuth authentication
  const oauthPlatforms = ['X', 'GitHub', 'LinkedIn', 'Discord'];

  // Get platforms not yet added
  const availablePlatforms = socialPlatforms.filter(
    p => !formData.socialLinks.find(link => link.platform === p.value)
  );

  const handleAddPlatform = () => {
    if (!selectedPlatform) return;
    const platform = socialPlatforms.find(p => p.value === selectedPlatform);
    const newLink = {
      id: Date.now(),
      platform: selectedPlatform,
      handle: '',
      authenticated: false,
      order_index: formData.socialLinks.length,
      urlPattern: platform?.urlPattern || ''
    };
    updateField('socialLinks', [...formData.socialLinks, newLink]);
    setSelectedPlatform('');
  };

  // Get profile picture URL for different platforms
  const getProfilePictureUrl = (platform, handle) => {
    switch (platform) {
      case 'GitHub':
        return `https://github.com/${handle}.png`;
      case 'X':
        // Twitter/X doesn't have a public avatar API, use unavatar.io as fallback
        return `https://unavatar.io/twitter/${handle}`;
      case 'Instagram':
        return `https://unavatar.io/instagram/${handle}`;
      case 'LinkedIn':
        return `https://unavatar.io/linkedin/${handle}`;
      case 'Discord':
        return null; // Discord requires API access
      case 'TikTok':
        return `https://unavatar.io/tiktok/${handle}`;
      case 'Reddit':
        return `https://unavatar.io/reddit/${handle}`;
      case 'Mastodon':
        return `https://unavatar.io/mastodon/${handle}`;
      case 'Bluesky':
        return `https://unavatar.io/${handle}.bsky.social`;
      default:
        return null;
    }
  };

  const handleAuthenticate = async (link) => {
    if (!link.handle) {
      alert('Please enter your username first');
      return;
    }

    setAuthenticatingId(link.id);

    // Get profile picture URL
    const pfpUrl = getProfilePictureUrl(link.platform, link.handle);

    // Build profile URL
    const platform = socialPlatforms.find(p => p.value === link.platform);
    const profileUrl = platform?.urlPattern
      ? `https://${platform.urlPattern}${link.handle}`
      : link.handle;

    // Simulate verification delay
    setTimeout(() => {
      // Mark as authenticated
      updateSocialLink(link.id, 'authenticated', true);
      updateSocialLink(link.id, 'profileUrl', profileUrl);

      // Add fetched avatar to the list if available
      if (pfpUrl) {
        updateSocialLink(link.id, 'avatarUrl', pfpUrl);

        // Add to fetchedAvatars if not already there
        const existingAvatars = formData.fetchedAvatars || [];
        const alreadyExists = existingAvatars.some(a => a.url === pfpUrl);
        if (!alreadyExists) {
          updateField('fetchedAvatars', [
            ...existingAvatars,
            { platform: link.platform, handle: link.handle, url: pfpUrl }
          ]);
        }
      }

      setAuthenticatingId(null);
    }, 800);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLinks = [...formData.socialLinks];
    const draggedItem = newLinks[draggedIndex];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(index, 0, draggedItem);

    // Update order_index for all items
    newLinks.forEach((link, i) => {
      link.order_index = i;
    });

    updateField('socialLinks', newLinks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveLink = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.socialLinks.length) return;

    const newLinks = [...formData.socialLinks];
    const temp = newLinks[index];
    newLinks[index] = newLinks[newIndex];
    newLinks[newIndex] = temp;

    // Update order_index
    newLinks.forEach((link, i) => {
      link.order_index = i;
    });

    updateField('socialLinks', newLinks);
  };

  const getPlatformLabel = (platformValue) => {
    const platform = socialPlatforms.find(p => p.value === platformValue);
    return platform?.label || platformValue;
  };

  const canAuthenticate = (platform) => {
    return oauthPlatforms.includes(platform);
  };

  return (
    <div className="space-y-4">
      {/* Redirect Modal */}
      {showRedirect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
            <Loader2 className="w-8 h-8 text-[#0071e3] animate-spin mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-2">
              Redirecting to {redirectLabel}
            </h3>
            <p className="text-[13px] text-[#86868b]">
              You'll be redirected to verify your account...
            </p>
          </div>
        </div>
      )}

      {/* Add Platform Dropdown */}
      <div className="flex gap-2 p-0.5 -m-0.5">
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-[#f5f5f7] border-2 border-transparent rounded-xl text-[13px] text-[#1d1d1f] cursor-pointer focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2386868b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
        >
          <option value="">Select a platform...</option>
          {availablePlatforms.map((platform) => (
            <option key={platform.value} value={platform.value}>
              {platform.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddPlatform}
          disabled={!selectedPlatform}
          className="px-4 py-2.5 bg-[#1d1d1f] text-white text-[13px] font-medium rounded-xl hover:bg-[#424245] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      <p className="text-[11px] text-[#86868b] flex items-center gap-1 mt-1 ml-0.5">
        <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Verify with OAuth (X, GitHub, LinkedIn, Discord). Drag to reorder.
      </p>

      {/* Added Links List */}
      {formData.socialLinks.length > 0 && (
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide">
            Your links ({formData.socialLinks.length})
          </label>
          {formData.socialLinks.map((link, index) => (
            <div
              key={link.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-2 bg-[#f5f5f7] rounded-xl transition-all ${
                draggedIndex === index ? 'opacity-50 scale-[0.98]' : ''
              }`}
            >
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing p-1 text-[#86868b] hover:text-[#1d1d1f]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>

              {/* Reorder Buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveLink(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 text-[#86868b] hover:text-[#1d1d1f] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveLink(index, 1)}
                  disabled={index === formData.socialLinks.length - 1}
                  className="p-0.5 text-[#86868b] hover:text-[#1d1d1f] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Avatar + Platform Label */}
              <div className="flex items-center gap-1.5 min-w-[80px]">
                {link.authenticated && link.avatarUrl && (
                  <img
                    src={link.avatarUrl}
                    alt={`${link.platform} avatar`}
                    className="w-6 h-6 rounded-full object-cover border border-[#e8e8ed]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span className="text-[12px] font-medium text-[#1d1d1f]">
                  {getPlatformLabel(link.platform)}
                </span>
              </div>

              {/* Input */}
              <div className="flex-1 flex items-center bg-white rounded-lg border border-[#e8e8ed] focus-within:border-[#0071e3]">
                {link.platform !== 'Other' && (
                  <span className="pl-2 text-[#86868b] text-[11px]">/</span>
                )}
                <input
                  type={link.platform === 'Other' ? 'url' : 'text'}
                  value={link.handle || ''}
                  onChange={(e) => updateSocialLink(link.id, 'handle', e.target.value)}
                  placeholder={link.platform === 'Other' ? 'https://...' : 'username'}
                  className="flex-1 px-2 py-1.5 bg-transparent border-0 text-[13px] text-[#1d1d1f] placeholder:text-[#c7c7c7] focus:outline-none"
                />
              </div>

              {/* Authenticate Button */}
              {link.authenticated ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1b5e20]" />
                  <span className="text-[10px] font-medium text-[#1b5e20]">Verified</span>
                </div>
              ) : canAuthenticate(link.platform) ? (
                <button
                  onClick={() => handleAuthenticate(link)}
                  disabled={!link.handle || authenticatingId === link.id}
                  className="flex items-center gap-1 px-2 py-1 bg-[#0071e3] text-white rounded-lg text-[10px] font-medium hover:bg-[#0077ed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authenticatingId === link.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3" />
                  )}
                  <span>Verify</span>
                </button>
              ) : (
                <span className="text-[10px] text-[#86868b] px-2">No OAuth</span>
              )}

              {/* Delete Button */}
              <button
                onClick={() => removeSocialLink(link.id)}
                className="p-1.5 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ffebee] rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {formData.socialLinks.length === 0 && (
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f5f5f7] flex items-center justify-center">
            <Link2 className="w-6 h-6 text-[#86868b]" />
          </div>
          <p className="text-[14px] text-[#1d1d1f] font-medium">No links added yet</p>
          <p className="text-[12px] text-[#86868b] mt-1">Select a platform above to add your first link</p>
        </div>
      )}

    </div>
  );
};

// Step 4: Profile Details
const Step4 = ({ formData, updateField }) => {
  return (
    <div className="space-y-4">
      {/* Profile Image */}
      <div>
        <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
          Profile image
        </label>

        {/* Fetched Avatars from Social Platforms */}
        {formData.fetchedAvatars && formData.fetchedAvatars.length > 0 && (
          <div className="mb-3">
            <p className="text-[11px] text-[#86868b] mb-2">Choose from your social profiles:</p>
            <div className="flex gap-2 flex-wrap">
              {formData.fetchedAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => updateField('profile_image_url', avatar.url)}
                  className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                    formData.profile_image_url === avatar.url
                      ? 'border-[#0071e3] scale-105'
                      : 'border-[#e8e8ed] hover:border-[#0071e3]'
                  }`}
                  title={`${avatar.platform}: @${avatar.handle}`}
                >
                  <img
                    src={avatar.url}
                    alt={`${avatar.platform} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                  {formData.profile_image_url === avatar.url && (
                    <div className="absolute inset-0 bg-[#0071e3]/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#0071e3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Avatar Preview */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center overflow-hidden border-2 border-[#e8e8ed]">
              {formData.profile_image_url ? (
                <img
                  src={formData.profile_image_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <User className="w-6 h-6 text-[#86868b]" />
              )}
            </div>
            {formData.profile_image_url && (
              <button
                onClick={() => updateField('profile_image_url', '')}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff3b30] text-white rounded-full flex items-center justify-center text-xs hover:bg-[#d63029] transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* URL Input */}
          <div className="flex-1">
            <input
              type="url"
              value={formData.profile_image_url || ''}
              onChange={(e) => updateField('profile_image_url', e.target.value)}
              placeholder="Or enter a custom URL..."
              className="w-full px-3 py-2.5 bg-[#f5f5f7] border-2 border-transparent rounded-xl text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
            />
          </div>
        </div>
        <p className="text-[11px] text-[#86868b] mt-2 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Choose from your social profiles or enter a custom URL
        </p>
      </div>

      {/* Nearest City */}
      <div>
        <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-2 block">
          Nearest city
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
          <input
            type="text"
            value={formData.nearest_city_name}
            onChange={(e) => updateField('nearest_city_name', e.target.value)}
            placeholder="Search for your city"
            className="w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-2 border-transparent rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
          />
        </div>
        <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Helps connect you with nearby Zcash users and meetups
        </p>
      </div>
    </div>
  );
};

// Step 5: Review
const Step5 = ({ formData, socialPlatforms }) => {
  return (
    <div className="space-y-3">
      <div className="bg-[#f5f5f7] rounded-xl p-4">
        <h3 className="font-semibold text-[#1d1d1f] text-[14px] mb-3">Profile Summary</h3>
        <dl className="space-y-2">
          <div className="flex justify-between items-center">
            <dt className="text-[#86868b] text-[13px]">Username</dt>
            <dd className="font-medium text-[#1d1d1f] text-[13px]">@{formData.name || '—'}</dd>
          </div>
          {formData.display_name && (
            <div className="flex justify-between items-center">
              <dt className="text-[#86868b] text-[13px]">Display Name</dt>
              <dd className="font-medium text-[#1d1d1f] text-[13px]">{formData.display_name}</dd>
            </div>
          )}
          <div className="flex justify-between items-center">
            <dt className="text-[#86868b] text-[13px]">Focus</dt>
            <dd className="font-medium text-[#1d1d1f] text-[13px]">{formData.mainFocus}</dd>
          </div>
          {formData.address && (
            <div className="flex justify-between items-center">
              <dt className="text-[#86868b] text-[13px]">Address</dt>
              <dd className="flex items-center gap-2">
                <code className="text-[12px] font-mono text-[#1d1d1f] bg-white px-2 py-0.5 rounded">
                  {formData.address.slice(0, 6)}...{formData.address.slice(-6)}
                </code>
                {formData.addressVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1b5e20]" />
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {formData.socialLinks.length > 0 && (
        <div className="bg-[#f5f5f7] rounded-xl p-4">
          <h3 className="font-semibold text-[#1d1d1f] text-[14px] mb-3">
            Social Links ({formData.socialLinks.length})
          </h3>
          <div className="space-y-2">
            {formData.socialLinks.map((link) => {
              const platform = socialPlatforms.find(p => p.value === link.platform);
              return (
                <div key={link.id} className="flex items-center justify-between">
                  <span className="text-[#1d1d1f] text-[13px] font-medium">{platform?.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#86868b] text-[12px]">@{link.handle}</span>
                    {link.authenticated && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1b5e20]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-[#e8f5e9] rounded-xl p-4 text-center">
        <p className="text-[13px] text-[#1b5e20]">
          Everything looks good? Click "Complete" to create your profile.
        </p>
      </div>
    </div>
  );
};

// Profile Card Preview
const MobilePreviewCard = ({ formData, socialPlatforms, cardThemes }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightX = useSpring(mouseX, { stiffness: 1000, damping: 100, mass: 0.1 });
  const spotlightY = useSpring(mouseY, { stiffness: 1000, damping: 100, mass: 0.1 });

  const spotlightBackground = useMotionTemplate`radial-gradient(300px circle at ${spotlightX}px ${spotlightY}px, rgba(255,255,255,0.12), transparent 80%)`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Get current theme
  const currentTheme = cardThemes.find(t => t.id === formData.cardTheme) || cardThemes[0];

  // Determine text color based on theme brightness
  const isLightTheme = currentTheme.isLight;
  const textColor = isLightTheme ? '#1d1d1f' : '#ffffff';
  const textMuted = isLightTheme ? 'rgba(29,29,31,0.6)' : 'rgba(255,255,255,0.7)';
  const accentColor = isLightTheme ? '#1d1d1f' : '#f5c542';

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'X':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'GitHub':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'Discord':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
          </svg>
        );
      case 'LinkedIn':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'Instagram':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
          </svg>
        );
      case 'TikTok':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'Reddit':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        );
      case 'Mastodon':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>
          </svg>
        );
      case 'Bluesky':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
          </svg>
        );
      case 'Snapchat':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.603.603 0 0 1 .272-.065c.203 0 .406.09.541.24.26.301.45.691.495 1.038.038.324-.035.595-.165.795-.195.301-.494.496-.834.63-.165.06-.33.105-.496.135-.07.016-.12.03-.165.045a.621.621 0 0 0-.225.12.56.56 0 0 0-.165.39c.015.24.09.465.195.69.015.03.03.06.045.09.156.33.365.75.556 1.08.24.39.556.84.961 1.275.855.93 1.68 1.335 2.096 1.485.12.045.21.075.27.095.345.12.59.315.67.585.06.195.015.42-.135.63-.32.4-.91.705-1.395.83-.27.075-.54.135-.795.18-.12.03-.21.045-.285.06-.045.015-.09.03-.135.045a.845.845 0 0 0-.18.105c-.045.045-.09.105-.12.195-.044.165-.074.375-.194.596-.165.315-.405.6-.72.795-.36.21-.765.315-1.215.315-.195 0-.39-.015-.6-.045a3.52 3.52 0 0 1-.495-.105 6.97 6.97 0 0 0-.72-.195 4.52 4.52 0 0 0-.915-.075c-.39 0-.78.045-1.17.135-.33.075-.63.165-.9.255-.15.06-.27.105-.36.135-.285.105-.57.165-.9.195-.06 0-.12.015-.18.015-.42 0-.825-.135-1.17-.375a2.19 2.19 0 0 1-.69-.72c-.12-.195-.165-.39-.195-.57-.015-.06-.015-.12-.03-.18-.015-.09-.03-.165-.06-.24a.632.632 0 0 0-.15-.195.655.655 0 0 0-.255-.135c-.06-.015-.12-.03-.195-.045-.135-.03-.285-.06-.45-.105a6.045 6.045 0 0 1-.795-.255c-.48-.195-.87-.465-1.155-.81a1.124 1.124 0 0 1-.21-.625c.015-.27.135-.495.375-.66.165-.12.39-.21.615-.27a.96.96 0 0 0 .18-.06c.075-.03.15-.06.225-.105a.63.63 0 0 0 .195-.165c.06-.075.12-.18.135-.345.015-.195-.06-.42-.195-.69l-.06-.12c-.15-.315-.345-.705-.51-1.05-.255-.57-.495-1.125-.585-1.695a2.04 2.04 0 0 1-.03-.42c0-.255.06-.495.15-.705a.951.951 0 0 1 .42-.465 1.27 1.27 0 0 1 .36-.15 1.962 1.962 0 0 1 .555-.06c.27 0 .51.045.72.12.165.06.285.12.375.18.075.045.13.075.16.09.09-.195.165-.39.255-.6.06-.165.105-.33.135-.495.015-.06.015-.105.015-.15-.105-1.905-.24-4.14.36-5.595C7.36.974 10.986.793 12.206.793Z"/>
          </svg>
        );
      case 'Telegram':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      case 'Other':
        return <Link2 className="w-4 h-4" />;
      default:
        return <Link2 className="w-4 h-4" />;
    }
  };

  // Get card background style
  const getCardBackground = () => {
    return { backgroundColor: currentTheme.bg };
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Profile Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="w-full h-full rounded-2xl overflow-hidden shadow-lg flex flex-col relative group"
        style={getCardBackground()}
      >
        {/* Passport Stamp Overlay */}
        {formData.addressVerified && (
          <div className="absolute z-20 pointer-events-none" style={{ top: '8%', right: '15%' }}>
            <svg width={80} height={80} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={isLightTheme ? 'text-emerald-600' : 'text-emerald-400'}>
              <g opacity="0.6">
                <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 4" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" />
                <path d="M 60 95 L 85 120 L 140 65" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <text x="100" y="35" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600" letterSpacing="2">VERIFIED</text>
                <text x="100" y="175" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="400" letterSpacing="1">2025</text>
              </g>
            </svg>
          </div>
        )}

        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBackground }}
        />
        <div className="relative pt-6 pb-4 px-4 flex-1 flex flex-col z-[1]">
          {/* Top icons */}
          <div className="absolute top-5 right-3 flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5" style={{ color: textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5" style={{ color: textMuted }} fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full p-0.5"
                style={{ border: `2px solid ${accentColor}` }}
              >
                <div className="w-full h-full rounded-full bg-[#faf6ed] flex items-center justify-center overflow-hidden">
                  {formData.profile_image_url ? (
                    <img src={formData.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#86868b]" />
                  )}
                </div>
              </div>
              {formData.addressVerified && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                  style={{ border: `2px solid ${currentTheme.bg}` }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-2">
            <h2
              className="text-xl mb-0.5"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: textColor }}
            >
              {formData.display_name || formData.name || 'Your Name'}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: textMuted }}>
              <span>/{formData.name || 'username'}</span>
              {formData.nearest_city_name && (
                <>
                  <span style={{ opacity: 0.5 }}>|</span>
                  <div className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{formData.nearest_city_name}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {formData.bio && (
            <p
              className="text-xs text-center mb-3 leading-relaxed line-clamp-2"
              style={{ color: textMuted }}
            >
              {formData.bio}
            </p>
          )}

          {/* Status */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            <span className="text-[10px]" style={{ color: textMuted }}>Ready to receive ZEC</span>
          </div>

          {/* Address */}
          <div
            className="rounded-lg p-2 mb-3"
            style={{ backgroundColor: isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between">
              <code className="text-xs font-mono" style={{ color: textColor, opacity: 0.9 }}>
                {formData.address ? `${formData.address.slice(0, 6)}...${formData.address.slice(-4)}` : 'u1abc...xyz1'}
              </code>
              <button
                className="p-1 rounded-md transition-colors"
                style={{ backgroundColor: isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
              >
                <svg className="w-3 h-3" style={{ color: textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Social Links */}
          {formData.socialLinks.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {formData.socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2" style={{ color: textMuted }}>
                  <span className="opacity-70">{getSocialIcon(link.platform)}</span>
                  <span className="text-xs">@{link.handle || 'username'}</span>
                  {link.authenticated && (
                    <CheckCircle2 className="w-3 h-3 text-[#4ade80] ml-auto" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer - pushed to bottom */}
          <div
            className="mt-auto flex items-center justify-between pt-3"
            style={{ borderTop: `1px solid ${isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}` }}
          >
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                color: accentColor,
                backgroundColor: isLightTheme ? `${accentColor}20` : `${accentColor}33`
              }}
            >
              NEW
            </span>
            <span className="text-[10px]" style={{ color: textMuted, opacity: 0.7 }}>
              {formData.nearest_city_name || 'Joined today'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZcasherOnboarding;
