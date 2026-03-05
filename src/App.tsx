import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, User, KeyRound, ArrowRight, Camera, CheckCircle2, MessageSquare, Phone, Users, Settings, Plus, MoreVertical, Search, Mic, FileText, UserPlus, Trash2, ShieldCheck, ArrowLeft, Pencil, AlertTriangle, Bot, Server, UserCheck, X, Check, Image as ImageIcon, Globe, Lock as LockIcon, EyeOff, Gamepad2, Video, LogOut, Send, Play, Pause, VideoOff, MicOff, Volume2, VolumeX, UserMinus, ChevronRight, Eye, Smartphone, Monitor, PhoneOff } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { GoogleGenAI } from '@google/genai';

const SECURITY = {
  KEY: "_lKbXyqVEc0v62GZA",
  TEMP: "template_d3a0otj",
  SERV: "service_6izqusf"
};

// Initialize EmailJS with the public key
emailjs.init(SECURITY.KEY);

const LogoCircle = ({ animated = false, size = 'normal' }: { animated?: boolean, size?: 'normal' | 'small' }) => {
  const containerClass = size === 'normal' 
    ? "w-56 h-56" 
    : "w-32 h-32";
    
  const svgContainerClass = size === 'normal'
    ? "w-24 h-24 mt-2"
    : "w-14 h-14 mt-1";
    
  const textClass = size === 'normal'
    ? "text-xl mt-2"
    : "text-sm mt-1";
    
  const oClass = size === 'normal'
    ? "text-lg mt-0.5 mx-0.5"
    : "text-[10px] mt-0.5 mx-0.5";
    
  const lockClass = size === 'normal'
    ? "w-2.5 h-2.5"
    : "w-1.5 h-1.5";

  const content = (
    <div className={`${containerClass} bg-black rounded-full flex flex-col items-center justify-center shadow-[0_15px_50px_rgba(0,0,0,0.2)] border border-gray-800`}>
      <div className={`relative flex items-center justify-center ${svgContainerClass}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer Circle */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="5" />
          
          {/* W Shape */}
          <path 
            d="M12 35 L25 35 L40 82 L50 20 L60 82 L75 35 L88 35" 
            fill="none" 
            stroke="white" 
            strokeWidth="6" 
            strokeLinejoin="miter" 
            strokeMiterlimit="10" 
          />
          
          {/* Blue dot */}
          <circle cx="50" cy="48" r="4.5" fill="#0066cc" />
        </svg>
      </div>
      <h1 className={`text-white font-bold tracking-widest flex items-center justify-center ${textClass}`}>
        W
        <span className={`relative flex items-center justify-center ${oClass}`}>
          O
          <Lock className={`absolute text-[#0066cc] ${lockClass}`} strokeWidth={4} />
        </span>
        TOX
      </h1>
    </div>
  );

  if (animated) {
    return (
      <motion.div 
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {content}
      </motion.div>
    );
  }
  return content;
};

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'terms' | 'login' | 'signup' | 'verify' | 'profileSetup' | 'pinSetup' | 'enterPin' | 'home' | 'forgotPinEmail' | 'forgotPinVerify' | 'forgotPinSetup' | 'forgotPassEmail' | 'forgotPassVerify' | 'forgotPassSetup'>('splash');
  const [progress, setProgress] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [closed, setClosed] = useState(false);

  // Form States
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [profileData, setProfileData] = useState({ pic: '', banner: '', username: '', wotoxId: '' });
  const [pinForm, setPinForm] = useState({ pin: '', confirmPin: '' });
  const [loginPin, setLoginPin] = useState('');
  
  // Mock Database (State)
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  
  // UI States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'settings' | 'settingsAccount' | 'settingsAccountAdd' | 'settingsAccountChangeEmail' | 'settingsAccountChangeEmailVerify' | 'settingsAccountTwoStep' | 'settingsAccountTwoStepVerify' | 'settingsAccountDeleteWarning' | 'settingsAccountDeleteConfirm' | 'profile' | 'settingsApp' | 'admin'>('chats');
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'servers' | 'friends'>('all');
  const [appTheme, setAppTheme] = useState<'light' | 'dark' | 'default'>('light');
  const [appNotifications, setAppNotifications] = useState(true);
  
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [tempBannedUsers, setTempBannedUsers] = useState<Record<string, number>>({});
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [moderators, setModerators] = useState<string[]>(['austudiopklap@gmail.com']);

  useEffect(() => {
    const savedBans = localStorage.getItem('wotox_bans');
    const savedTempBans = localStorage.getItem('wotox_temp_bans');
    const savedBlocks = localStorage.getItem('wotox_blocks');
    const savedMods = localStorage.getItem('wotox_mods');
    
    if (savedBans) setBannedUsers(JSON.parse(savedBans));
    if (savedTempBans) setTempBannedUsers(JSON.parse(savedTempBans));
    if (savedBlocks) setBlockedUsers(JSON.parse(savedBlocks));
    if (savedMods) setModerators(JSON.parse(savedMods));
  }, []);

  useEffect(() => {
    localStorage.setItem('wotox_bans', JSON.stringify(bannedUsers));
    localStorage.setItem('wotox_temp_bans', JSON.stringify(tempBannedUsers));
    localStorage.setItem('wotox_blocks', JSON.stringify(blockedUsers));
    localStorage.setItem('wotox_mods', JSON.stringify(moderators));
  }, [bannedUsers, tempBannedUsers, blockedUsers, moderators]);

  const isDarkMode = appTheme === 'dark' || (appTheme === 'default' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Settings Forms
  const [changeEmailForm, setChangeEmailForm] = useState({ originalEmail: '', newEmail: '' });
  const [twoStepForm, setTwoStepForm] = useState({ email: '' });
  const [settingsOtpCode, setSettingsOtpCode] = useState('');
  const [settingsEnteredOtp, setSettingsEnteredOtp] = useState('');
  const [isEditingTwoStepEmail, setIsEditingTwoStepEmail] = useState(false);
  const [forgotPinEmailInput, setForgotPinEmailInput] = useState('');
  const [forgotPinOtpCode, setForgotPinOtpCode] = useState('');
  const [forgotPinEnteredOtp, setForgotPinEnteredOtp] = useState('');
  const [newPinForm, setNewPinForm] = useState({ pin: '', confirmPin: '' });
  const [deleteAccountForm, setDeleteAccountForm] = useState({ email: '', password: '', pin: '' });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showWhatNewModal, setShowWhatNewModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [userGameActivity, setUserGameActivity] = useState<Record<string, string>>({}); // email -> game name
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [showJoinServerModal, setShowJoinServerModal] = useState(false);
  const [joinServerHandle, setJoinServerHandle] = useState('');
  const [openMessageMenu, setOpenMessageMenu] = useState<string | null>(null);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [serverSettingsTab, setServerSettingsTab] = useState<'members' | 'about' | 'settings'>('members');
  const [showServerAbout, setShowServerAbout] = useState(false);
  const [showServerInfo, setShowServerInfo] = useState(false);
  const [serverForm, setServerForm] = useState<{ name: string, handle: string, visibility: string, category: string, game: string, tags: string[], password?: string, pic?: string }>({ name: '', handle: '', visibility: 'public', category: '', game: '', tags: [], password: '', pic: '' });
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const savedMessages = localStorage.getItem('wotox_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse messages", e);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem('wotox_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const [friendSearch, setFriendSearch] = useState({ name: '', wotoxId: '' });
  const [friendSearchResult, setFriendSearchResult] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ username: '', wotoxId: '', pic: '' });
  
  const [forgotPassEmail, setForgotPassEmail] = useState('');
  const [forgotPassOtp, setForgotPassOtp] = useState('');
  const [forgotPassEnteredOtp, setForgotPassEnteredOtp] = useState('');
  const [forgotPassForm, setForgotPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<any>(null);
  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video', user: any } | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callIntervalRef = useRef<any>(null);

  const handleStartCall = (type: 'voice' | 'video', user: any) => {
    setActiveCall({ type, user });
    setCallAccepted(true); // Auto-accept for demo/outgoing
    setCallDuration(0);
    callIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setCallAccepted(false);
    if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    setCallDuration(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentType, setAttachmentType] = useState<'image' | 'video' | 'file' | null>(null);

  const handleAttachmentClick = (type: 'image' | 'video' | 'file') => {
    setAttachmentType(type);
    setShowAttachmentMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChat) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newMessage = {
          id: Date.now().toString(),
          sender: registeredUser.email,
          text: `Sent a ${attachmentType}: ${file.name}`,
          file: {
            name: file.name,
            type: attachmentType,
            url: base64String
          },
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), newMessage]
        }));
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    if (window.confirm('Delete this message?')) {
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].filter(m => m.id !== messageId)
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;
    
    const text = messageInput;
    const newMessage = {
      id: Date.now().toString(),
      sender: registeredUser.email,
      text: text,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    
    setMessageInput('');

    // AI Malicious Action Detection
    if (activeChat.startsWith('server_')) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analyze this message for malicious intent, hacking attempts, or severe harassment in a chat server context. Message: "${text}". Reply with ONLY "MALICIOUS" or "SAFE".`,
        });
        
        if (response.text.trim().toUpperCase() === 'MALICIOUS') {
          console.warn("AI detected malicious message from", registeredUser.email);
        }
      } catch (e) {
        console.error("AI moderation failed", e);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  // Multi-account State
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('wotox_users');
    const activeEmail = localStorage.getItem('wotox_active_email');
    const oldSavedUser = localStorage.getItem('wotox_user'); // Fallback for old single user data
    
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setAllUsers(parsedUsers);
      if (activeEmail) {
        const active = parsedUsers.find((u: any) => u.email === activeEmail);
        if (active) setRegisteredUser(active);
      } else if (parsedUsers.length > 0) {
        setRegisteredUser(parsedUsers[0]);
      }
    } else if (oldSavedUser) {
      const parsed = JSON.parse(oldSavedUser);
      setAllUsers([parsed]);
      setRegisteredUser(parsed);
      localStorage.setItem('wotox_users', JSON.stringify([parsed]));
      localStorage.setItem('wotox_active_email', parsed.email);
    }
  }, []);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              const savedUsers = localStorage.getItem('wotox_users');
              const oldSavedUser = localStorage.getItem('wotox_user');
              if ((savedUsers && JSON.parse(savedUsers).length > 0) || oldSavedUser) {
                setScreen('enterPin');
              } else {
                setScreen('terms');
              }
            }, 500);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [screen]);

  const updateCurrentUser = (updates: any, oldEmail?: string) => {
    const newUser = { ...registeredUser, ...updates };
    setRegisteredUser(newUser);
    
    setAllUsers(prev => {
      const emailToRemove = oldEmail || newUser.email;
      const filtered = prev.filter(u => u.email !== emailToRemove);
      const updated = [...filtered, newUser];
      localStorage.setItem('wotox_users', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('wotox_active_email', newUser.email);
  };

  const handleSignup = async () => {
    setError('');
    if (!signupForm.fullName || !signupForm.email || !signupForm.password) {
      setError('Please fill all fields');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);

    try {
      await emailjs.send(
        SECURITY.SERV,
        SECURITY.TEMP,
        {
          to_email: signupForm.email,
          to_name: signupForm.fullName,
          from_name: "WoTOX SYSTEM",
          passcode: code,
          message: code,
          code: code,
          verification_code: code
        }
      );
      setScreen('verify');
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    setError('');
    if (enteredCode === verificationCode) {
      setRegisteredUser({
        fullName: signupForm.fullName,
        email: signupForm.email,
        password: signupForm.password,
        createdAt: new Date().toISOString()
      });
      setScreen('profileSetup');
      setEnteredCode('');
    } else {
      setError('Incorrect verification code');
    }
  };

  const handleLogin = () => {
    setError('');
    if (!loginForm.email || !loginForm.password) {
      setError('Please enter email and password');
      return;
    }

    if (bannedUsers.includes(loginForm.email)) {
      setError('Your account has been permanently banned.');
      return;
    }
    if (tempBannedUsers[loginForm.email] && tempBannedUsers[loginForm.email] > Date.now()) {
      const remaining = Math.ceil((tempBannedUsers[loginForm.email] - Date.now()) / (1000 * 60 * 60));
      setError(`Your account is temporarily banned. Try again in ${remaining} hours.`);
      return;
    }

    const currentUsers = JSON.parse(localStorage.getItem('wotox_users') || '[]');
    const foundUser = currentUsers.find((u: any) => u.email === loginForm.email && u.password === loginForm.password);
    if (foundUser) {
      setRegisteredUser(foundUser);
      localStorage.setItem('wotox_active_email', foundUser.email);
      setScreen('enterPin');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleEnterPin = () => {
    setError('');
    if (registeredUser && loginPin === registeredUser.pin) {
      setScreen('home');
      setLoginPin('');
    } else {
      setError('Invalid PIN');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData({ ...profileData, pic: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveProfile = () => {
    setError('');
    if (!profileData.username) {
      setError('Please enter a username');
      return;
    }
    if (!profileData.wotoxId) {
      setError('Please enter a WoTOX ID');
      return;
    }
    if (!profileData.wotoxId.startsWith('@')) {
      setError('WoTOX ID must start with @');
      return;
    }
    if (profileData.wotoxId.length !== 10) {
      setError('WoTOX ID must have exactly 9 characters after @');
      return;
    }
    const currentUsers = JSON.parse(localStorage.getItem('wotox_users') || '[]');
    const isIdTaken = currentUsers.some((u: any) => u.wotoxId === profileData.wotoxId);
    if (isIdTaken) {
      setError('This WoTOX ID is already taken');
      return;
    }
    setScreen('pinSetup');
  };

  const handleSavePin = () => {
    setError('');
    if (pinForm.pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }
    if (pinForm.pin !== pinForm.confirmPin) {
      setError('PINs do not match');
      return;
    }
    
    const newUser = {
      ...registeredUser,
      pic: profileData.pic,
      username: profileData.username,
      wotoxId: profileData.wotoxId,
      pin: pinForm.pin
    };
    
    setRegisteredUser(newUser);
    
    const currentUsers = JSON.parse(localStorage.getItem('wotox_users') || '[]');
    const filtered = currentUsers.filter((u: any) => u.email !== newUser.email);
    const updated = [...filtered, newUser];
    
    setAllUsers(updated);
    localStorage.setItem('wotox_users', JSON.stringify(updated));
    localStorage.setItem('wotox_active_email', newUser.email);
    
    setScreen('login');
    setSignupForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    setProfileData({ pic: '', username: '', wotoxId: '' });
    setPinForm({ pin: '', confirmPin: '' });
  };

  const handleChangeEmailRequest = async () => {
    setError('');
    if (changeEmailForm.originalEmail !== registeredUser?.email) {
      setError('Original email is incorrect');
      return;
    }
    if (!changeEmailForm.newEmail) {
      setError('Please enter a new email');
      return;
    }
    setIsLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSettingsOtpCode(code);
    try {
      await emailjs.send(
        SECURITY.SERV,
        SECURITY.TEMP,
        {
          to_email: changeEmailForm.newEmail,
          to_name: registeredUser.fullName,
          from_name: "WoTOX SYSTEM",
          passcode: code,
          message: code,
          code: code,
          verification_code: code
        }
      );
      setActiveTab('settingsAccountChangeEmailVerify');
      setSettingsEnteredOtp('');
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmailVerify = () => {
    setError('');
    if (settingsEnteredOtp === settingsOtpCode) {
      updateCurrentUser({ email: changeEmailForm.newEmail }, registeredUser.email);
      setActiveTab('settingsAccount');
      setChangeEmailForm({ originalEmail: '', newEmail: '' });
      setSettingsEnteredOtp('');
    } else {
      setError('Incorrect verification code');
    }
  };

  const handleTwoStepRequest = async () => {
    setError('');
    if (!twoStepForm.email) {
      setError('Please enter your email');
      return;
    }
    setIsLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSettingsOtpCode(code);
    try {
      await emailjs.send(
        SECURITY.SERV,
        SECURITY.TEMP,
        {
          to_email: twoStepForm.email,
          to_name: registeredUser.fullName,
          from_name: "WoTOX SYSTEM",
          passcode: code,
          message: code,
          code: code,
          verification_code: code
        }
      );
      setActiveTab('settingsAccountTwoStepVerify');
      setSettingsEnteredOtp('');
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoStepVerify = () => {
    setError('');
    if (settingsEnteredOtp === settingsOtpCode) {
      updateCurrentUser({ twoStepEnabled: true, twoStepEmail: twoStepForm.email });
      setActiveTab('settingsAccount');
      setIsEditingTwoStepEmail(false);
      setTwoStepForm({ email: '' });
      setSettingsEnteredOtp('');
    } else {
      setError('Incorrect verification code');
    }
  };

  const handleForgotPassRequest = async () => {
    setError('');
    const currentUsers = JSON.parse(localStorage.getItem('wotox_users') || '[]');
    const user = currentUsers.find((u: any) => u.email === forgotPassEmail);
    if (!user) {
      setError('Account not found');
      return;
    }
    setIsLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotPassOtp(code);
    try {
      await emailjs.send(
        SECURITY.SERV,
        SECURITY.TEMP,
        {
          to_email: user.email,
          to_name: user.fullName || user.username,
          from_name: "WoTOX SYSTEM",
          passcode: code,
          message: code,
          code: code,
          verification_code: code
        }
      );
      setScreen('forgotPassVerify');
      setForgotPassEnteredOtp('');
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassVerify = () => {
    setError('');
    if (forgotPassEnteredOtp === forgotPassOtp) {
      setScreen('forgotPassSetup');
    } else {
      setError('Incorrect OTP');
    }
  };

  const handleForgotPassSave = () => {
    setError('');
    if (!forgotPassForm.oldPassword || !forgotPassForm.newPassword || !forgotPassForm.confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (forgotPassForm.newPassword !== forgotPassForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    const currentUsers = JSON.parse(localStorage.getItem('wotox_users') || '[]');
    const userToUpdate = currentUsers.find((u: any) => u.email === forgotPassEmail);
    
    if (userToUpdate) {
      if (userToUpdate.password !== forgotPassForm.oldPassword) {
        setError('Incorrect old password');
        return;
      }
      const updatedUser = { ...userToUpdate, password: forgotPassForm.newPassword };
      const filtered = currentUsers.filter((u: any) => u.email !== updatedUser.email);
      const updated = [...filtered, updatedUser];
      
      setAllUsers(updated);
      localStorage.setItem('wotox_users', JSON.stringify(updated));
      
      setScreen('login');
      setForgotPassEmail('');
      setForgotPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setLoginForm({ email: updatedUser.email, password: forgotPassForm.newPassword });
    }
  };

  const handleForgotPinRequest = async () => {
    setError('');
    const user = allUsers.find(u => u.email === forgotPinEmailInput);
    if (!user) {
      setError('Account not found');
      return;
    }
    setIsLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotPinOtpCode(code);
    try {
      await emailjs.send(
        SECURITY.SERV,
        SECURITY.TEMP,
        {
          to_email: user.email,
          to_name: user.fullName || user.username,
          from_name: "WoTOX SYSTEM",
          passcode: code,
          message: code,
          code: code,
          verification_code: code
        }
      );
      setScreen('forgotPinVerify');
      setForgotPinEnteredOtp('');
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPinVerify = () => {
    setError('');
    if (forgotPinEnteredOtp === forgotPinOtpCode) {
      setScreen('forgotPinSetup');
    } else {
      setError('Incorrect OTP');
    }
  };

  const handleForgotPinSave = () => {
    setError('');
    if (newPinForm.pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }
    if (newPinForm.pin !== newPinForm.confirmPin) {
      setError('PINs do not match');
      return;
    }
    
    const userToUpdate = allUsers.find(u => u.email === forgotPinEmailInput);
    if (userToUpdate) {
      const updatedUser = { ...userToUpdate, pin: newPinForm.pin };
      setAllUsers(prev => {
        const filtered = prev.filter(u => u.email !== updatedUser.email);
        const updated = [...filtered, updatedUser];
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
      setRegisteredUser(updatedUser);
      localStorage.setItem('wotox_active_email', updatedUser.email);
      setScreen('home');
      setForgotPinEmailInput('');
      setNewPinForm({ pin: '', confirmPin: '' });
    }
  };

  const handleToggleMuteUser = (serverId: string, userEmail: string) => {
    const updatedUser = { ...registeredUser };
    const serverIndex = updatedUser.servers.findIndex((s: any) => s.id === serverId);
    if (serverIndex !== -1) {
      const server = { ...updatedUser.servers[serverIndex] };
      const mutedMembers = server.mutedMembers || [];
      if (mutedMembers.includes(userEmail)) {
        server.mutedMembers = mutedMembers.filter((e: string) => e !== userEmail);
      } else {
        server.mutedMembers = [...mutedMembers, userEmail];
      }
      updatedUser.servers[serverIndex] = server;
      setRegisteredUser(updatedUser);
      setAllUsers(prev => {
        const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem('wotox_active_email', updatedUser.email);
    }
  };

  const handleKickUser = (serverId: string, userEmail: string) => {
    const updatedUser = { ...registeredUser };
    const serverIndex = updatedUser.servers.findIndex((s: any) => s.id === serverId);
    if (serverIndex !== -1) {
      const server = { ...updatedUser.servers[serverIndex] };
      server.members = server.members.filter((e: string) => e !== userEmail);
      updatedUser.servers[serverIndex] = server;
      setRegisteredUser(updatedUser);
      setAllUsers(prev => {
        const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem('wotox_active_email', updatedUser.email);
    }
  };

  const handleToggleServerMute = (serverId: string) => {
    const updatedUser = { ...registeredUser };
    const serverIndex = updatedUser.servers.findIndex((s: any) => s.id === serverId);
    if (serverIndex !== -1) {
      updatedUser.servers[serverIndex].isMuted = !updatedUser.servers[serverIndex].isMuted;
      setRegisteredUser(updatedUser);
      setAllUsers(prev => {
        const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleToggleServerPause = (serverId: string) => {
    const updatedUser = { ...registeredUser };
    const serverIndex = updatedUser.servers.findIndex((s: any) => s.id === serverId);
    if (serverIndex !== -1) {
      updatedUser.servers[serverIndex].isPaused = !updatedUser.servers[serverIndex].isPaused;
      setRegisteredUser(updatedUser);
      setAllUsers(prev => {
        const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleEndServer = (serverId: string) => {
    const updatedUser = { ...registeredUser };
    const serverIndex = updatedUser.servers.findIndex((s: any) => s.id === serverId);
    if (serverIndex !== -1) {
      updatedUser.servers[serverIndex].isEnded = true;
      setRegisteredUser(updatedUser);
      setAllUsers(prev => {
        const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleToggleServerNotifications = (serverId: string) => {
    const updatedUser = { ...registeredUser };
    const serverIndex = updatedUser.servers.findIndex((s: any) => s.id === serverId);
    if (serverIndex !== -1) {
      updatedUser.servers[serverIndex].notificationsEnabled = !updatedUser.servers[serverIndex].notificationsEnabled;
      setRegisteredUser(updatedUser);
      setAllUsers(prev => {
        const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleUpdateProfile = () => {
    if (!editProfileForm.username || !editProfileForm.wotoxId) {
      setError('Username and WoTOX ID are required');
      return;
    }
    if (!editProfileForm.wotoxId.startsWith('@')) {
      setError('WoTOX ID must start with @');
      return;
    }
    updateCurrentUser({
      username: editProfileForm.username,
      wotoxId: editProfileForm.wotoxId,
      pic: editProfileForm.pic
    });
    setIsEditingProfile(false);
  };

  const handleToggleTheme = (theme: 'light' | 'dark' | 'default') => {
    setAppTheme(theme);
  };

  const handleToggleAppNotifications = () => {
    setAppNotifications(!appNotifications);
  };

  const handleJoinServer = () => {
    setError('');
    if (!joinServerHandle.startsWith('#')) {
      setError('Server handle must start with #');
      return;
    }

    if (blockedUsers.includes(registeredUser.email)) {
      setError('You are blocked from joining any servers.');
      return;
    }

    // Search for server in all users' servers
    let foundServer: any = null;
    let serverOwner: any = null;

    allUsers.forEach(u => {
      const s = u.servers?.find((srv: any) => srv.handle === joinServerHandle);
      if (s) {
        foundServer = s;
        serverOwner = u;
      }
    });

    if (!foundServer) {
      setError('Server not found');
      return;
    }

    if (foundServer.members.includes(registeredUser.email)) {
      setError('You are already a member of this server');
      return;
    }

    if (foundServer.visibility === 'private') {
      const pass = prompt('Enter server password:');
      if (pass !== foundServer.password) {
        setError('Incorrect password');
        return;
      }
    }

    const updatedServer = {
      ...foundServer,
      members: [...foundServer.members, registeredUser.email]
    };

    const updatedOwner = {
      ...serverOwner,
      servers: serverOwner.servers.map((s: any) => s.id === foundServer.id ? updatedServer : s)
    };

    const updatedCurrentUser = {
      ...registeredUser,
      servers: [...(registeredUser.servers || []), updatedServer]
    };

    setAllUsers(prev => {
      const updated = prev.map(u => {
        if (u.email === serverOwner.email) return updatedOwner;
        if (u.email === registeredUser.email) return updatedCurrentUser;
        return u;
      });
      localStorage.setItem('wotox_users', JSON.stringify(updated));
      return updated;
    });

    setRegisteredUser(updatedCurrentUser);
    setShowJoinServerModal(false);
    setJoinServerHandle('');
    setActiveChat(`server_${foundServer.id}`);
  };

  const handleCreateServer = () => {
    setError('');
    if (!serverForm.name || !serverForm.handle || !serverForm.visibility || !serverForm.category) {
      setError('Please fill all required fields');
      return;
    }
    if (!serverForm.handle.startsWith('#')) {
      setError('Server handle must start with #');
      return;
    }
    if (serverForm.handle.length < 8) {
      setError('Server handle must have at least 7 characters after #');
      return;
    }
    if (serverForm.category === 'game' && !serverForm.game) {
      setError('Please select a game');
      return;
    }

    const newServer = {
      id: Date.now().toString(),
      name: serverForm.name,
      handle: serverForm.handle,
      visibility: serverForm.visibility,
      category: serverForm.category,
      game: serverForm.game,
      tags: serverForm.tags,
      password: serverForm.visibility === 'private' ? serverForm.password : undefined,
      unlistedLink: serverForm.visibility === 'unlisted' ? `https://wotox.app/join/${Math.random().toString(36).substring(2, 15)}` : undefined,
      creator: registeredUser.email,
      members: [registeredUser.email],
      pic: serverForm.pic || profileData.pic || '',
      isEnded: false,
      isMuted: false,
      isPaused: false,
      notificationsEnabled: true,
      createdAt: new Date().toISOString()
    };

    const updatedUser = {
      ...registeredUser,
      servers: [...(registeredUser.servers || []), newServer]
    };

    setRegisteredUser(updatedUser);
    setAllUsers(prev => {
      const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
      localStorage.setItem('wotox_users', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('wotox_active_email', updatedUser.email);

    setShowAddServerModal(false);
    setServerForm({ name: '', handle: '', visibility: 'public', category: '', game: '', tags: [] });
    setActiveChat(`server_${newServer.id}`);
  };

  const handleDisableTwoStep = () => {
    updateCurrentUser({ twoStepEnabled: false, twoStepEmail: '' });
  };

  const handleSearchFriend = () => {
    const found = allUsers.find(u => 
      u.email !== registeredUser?.email && 
      (u.username === friendSearch.name || u.fullName === friendSearch.name) &&
      u.wotoxId === friendSearch.wotoxId
    );
    setFriendSearchResult(found || 'not_found');
  };

  const handleSendRequest = () => {
    if (friendSearchResult && friendSearchResult !== 'not_found') {
      const targetEmail = friendSearchResult.email;
      setAllUsers(prev => {
        const updated = prev.map(u => {
          if (u.email === targetEmail) {
            const reqs = u.friendRequests || [];
            if (!reqs.includes(registeredUser.email)) {
              return { ...u, friendRequests: [...reqs, registeredUser.email] };
            }
          }
          return u;
        });
        localStorage.setItem('wotox_users', JSON.stringify(updated));
        return updated;
      });
      setShowAddFriendModal(false);
      setFriendSearchResult(null);
      setFriendSearch({name: '', pic: ''});
      alert('Friend request sent!');
    }
  };

  const handleAcceptRequest = (requesterEmail: string) => {
    const updatedCurrentUser = {
      ...registeredUser,
      friendRequests: (registeredUser.friendRequests || []).filter((e: string) => e !== requesterEmail),
      friends: [...(registeredUser.friends || []), requesterEmail]
    };
    
    setRegisteredUser(updatedCurrentUser);
    
    setAllUsers(prev => {
      const updated = prev.map(u => {
        if (u.email === registeredUser.email) return updatedCurrentUser;
        if (u.email === requesterEmail) {
          return { ...u, friends: [...(u.friends || []), registeredUser.email] };
        }
        return u;
      });
      localStorage.setItem('wotox_users', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('wotox_active_email', updatedCurrentUser.email);
  };

  const handleDeleteAccount = () => {
    setError('');
    if (deleteAccountForm.email !== registeredUser.email ||
        deleteAccountForm.password !== registeredUser.password ||
        deleteAccountForm.pin !== registeredUser.pin) {
      setError('Incorrect email, password, or PIN');
      return;
    }
    
    const remainingUsers = allUsers.filter(u => u.email !== registeredUser.email);
    setAllUsers(remainingUsers);
    localStorage.setItem('wotox_users', JSON.stringify(remainingUsers));
    
    if (remainingUsers.length > 0) {
      setRegisteredUser(remainingUsers[0]);
      localStorage.setItem('wotox_active_email', remainingUsers[0].email);
      setActiveTab('chats');
      setScreen('enterPin');
    } else {
      setRegisteredUser(null);
      localStorage.removeItem('wotox_active_email');
      setScreen('terms');
    }
    setDeleteAccountForm({ email: '', password: '', pin: '' });
  };

  useEffect(() => {
    // Mock game activity for some users
    const mockActivity: Record<string, string> = {
      'friend1@example.com': 'Free Fire',
      'friend2@example.com': 'Minecraft',
      'friend3@example.com': 'Roblox'
    };
    setUserGameActivity(mockActivity);
  }, []);

  const handleLogout = () => {
    setRegisteredUser(null);
    localStorage.removeItem('wotox_active_email');
    setScreen('login');
    setLoginPin('');
    setActiveTab('chats');
  };

  if (closed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <p className="text-gray-500 font-medium">App closed.</p>
      </div>
    );
  }

  if (screen === 'splash') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-between p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="flex-1"></div>
        
        <div className="flex flex-col items-center justify-center flex-[2] w-full max-w-md">
          <LogoCircle animated={true} />
          
          {/* Loading Bar */}
          <div className="flex items-center w-64 mt-12">
            <div className={`flex-1 h-1.5 rounded-full overflow-hidden relative ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-75 ease-linear ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`ml-4 text-sm font-bold w-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>{progress}%</span>
          </div>
        </div>

        <div className="flex-1 flex items-end justify-center pb-6">
          <div className={`flex items-center space-x-2 text-xs font-bold tracking-wide ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
            <span>SECURE END-TO-END ENCRYPTED</span>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'terms') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-8">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="mt-10 w-full max-w-md flex flex-col items-center">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>WoTOX Terms and Conditions</h2>
          
          <div className={`p-6 rounded-xl border text-sm mb-8 h-64 overflow-y-auto w-full shadow-inner custom-scrollbar ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <p className="mb-4">Welcome to WoTOX. By using our app, you agree to these terms and conditions.</p>
            <p className="mb-4">1. <strong>Privacy:</strong> We value your privacy. Your messages are end-to-end encrypted, meaning nobody, not even us, can read them.</p>
            <p className="mb-4">2. <strong>Usage:</strong> You agree to use this app for lawful purposes only. Harassment, spamming, and illegal activities are strictly prohibited.</p>
            <p className="mb-4">3. <strong>Data:</strong> We do not store your personal messages on our servers after they are delivered.</p>
            <p className="mb-4">4. <strong>Account:</strong> You are responsible for maintaining the security of your account and device.</p>
            <p>5. <strong>Changes:</strong> We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of the new terms.</p>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer mb-10 self-start ml-2">
            <input 
              type="checkbox" 
              className={`w-5 h-5 rounded border-gray-300 cursor-pointer ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-white' : 'text-black focus:ring-black'}`}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className={`font-medium select-none ${isDarkMode ? 'text-zinc-300' : 'text-gray-800'}`}>I agree to the Terms and Conditions</span>
          </label>

          <div className="flex w-full space-x-4">
            <button 
              onClick={() => setClosed(true)}
              className={`flex-1 py-3 rounded-lg font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button 
              disabled={!agreed}
              onClick={() => {
                setError('');
                setScreen('login');
              }}
              className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                agreed 
                  ? (isDarkMode ? 'bg-white text-black hover:bg-gray-200 shadow-lg' : 'bg-black text-white hover:bg-gray-800 shadow-lg')
                  : (isDarkMode ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-12 mb-8">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="w-full max-w-sm flex flex-col">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Welcome Back</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Login to continue to WoTOX</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-4 text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Email Address"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Password"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 mb-8">
            <button 
              onClick={() => { setScreen('forgotPassEmail'); setError(''); }}
              className={`text-sm transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black'}`}
            >
              Forgot Password?
            </button>
          </div>
          
          <button 
            onClick={handleLogin}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <button 
              onClick={() => {
                setError('');
                setScreen('signup');
              }}
              className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'signup') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-8 mb-6">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="w-full max-w-sm flex flex-col">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Create Account</h2>
          <p className={`text-center mb-8 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Join WoTOX for secure messaging</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-4 text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={signupForm.fullName}
                onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                value={signupForm.email}
                onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Email Address"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                value={signupForm.password}
                onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Password"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Confirm Password"
              />
            </div>
          </div>
          
          <button 
            onClick={handleSignup}
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isLoading ? (isDarkMode ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gray-400 text-white cursor-not-allowed') : (isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')}`}
          >
            <span>{isLoading ? 'Sending Code...' : 'Sign Up'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <button 
              onClick={() => {
                setError('');
                setScreen('login');
              }}
              className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'verify') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-12 mb-8">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Verify Email</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>We sent a 6-digit code to <br/><span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{signupForm.email}</span></p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-4 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <input 
              type="text" 
              maxLength={6}
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
              className={`w-full border rounded-xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-300'}`} 
              placeholder="------"
            />
          </div>
          
          <button 
            onClick={handleVerify}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Verify & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
            <button 
              onClick={() => {
                setError('');
                setScreen('signup');
              }}
              className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Back to Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'profileSetup') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-12 mb-8">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Set up Profile</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Add a photo and username to complete your profile</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full mb-8 space-y-4">
            <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Profile Banner</p>
            <label className={`relative cursor-pointer w-full h-32 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors group ${isDarkMode ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
              {profileData.banner ? (
                <img src={profileData.banner} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className={`flex flex-col items-center transition-colors ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">Add Banner</span>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setProfileData({...profileData, banner: reader.result as string});
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            </label>

            <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Profile Photo</p>
            <div className="flex justify-center">
              <label className={`relative cursor-pointer w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors group ${isDarkMode ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
                {profileData.pic ? (
                  <img src={profileData.pic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`flex flex-col items-center transition-colors ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-xs font-medium">Add Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleProfileImageChange} 
                />
              </label>
            </div>
          </div>

          <div className="w-full space-y-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Choose a Username"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 font-bold">@</span>
              </div>
              <input 
                type="text" 
                value={profileData.wotoxId}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('@')) val = '@' + val.replace(/@/g, '');
                  if (val.length <= 10) setProfileData({...profileData, wotoxId: val});
                }}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="WoTOX ID (9 chars)"
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
                  let randomId = '@';
                  for (let i = 0; i < 9; i++) {
                    randomId += chars.charAt(Math.floor(Math.random() * chars.length));
                  }
                  setProfileData({...profileData, wotoxId: randomId});
                }}
                className="text-xs text-[#0066cc] font-medium hover:underline"
              >
                Browse ID
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleSaveProfile}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Save & Confirm</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }


  if (screen === 'pinSetup') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-12 mb-8">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Security PIN</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Create a 6-digit PIN to secure your account</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                maxLength={6}
                value={pinForm.pin}
                onChange={(e) => setPinForm({...pinForm, pin: e.target.value.replace(/\D/g, '')})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Create 6-digit PIN"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CheckCircle2 className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                maxLength={6}
                value={pinForm.confirmPin}
                onChange={(e) => setPinForm({...pinForm, confirmPin: e.target.value.replace(/\D/g, '')})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Confirm Security PIN"
              />
            </div>
          </div>
          
          <button 
            onClick={handleSavePin}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Save & Open</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'enterPin') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-12 mb-8">
          <LogoCircle animated={false} size="small" />
        </div>
        
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Enter Secure PIN</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter your 6-digit PIN to unlock WoTOX</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                maxLength={6}
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="------"
              />
            </div>
          </div>
          
          <button 
            onClick={handleEnterPin}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Unlock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => { setScreen('forgotPinEmail'); setError(''); }}
            className={`mt-6 text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black'}`}
          >
            Forgot PIN?
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'forgotPinEmail') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-full max-w-sm flex flex-col items-center mt-20">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Forgot PIN</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter your email address to reset your PIN</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                value={forgotPinEmailInput}
                onChange={(e) => setForgotPinEmailInput(e.target.value)}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Email Address"
              />
            </div>
          </div>
          
          <button 
            onClick={handleForgotPinRequest}
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 disabled:opacity-70 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>{isLoading ? 'Sending OTP...' : 'Confirm'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <button onClick={() => setScreen('enterPin')} className={`mt-6 text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'forgotPinVerify') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-full max-w-sm flex flex-col items-center mt-20">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Verify OTP</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter the 6-digit code sent to <span className={isDarkMode ? 'text-white' : 'text-black'}>{forgotPinEmailInput}</span></p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                maxLength={6}
                value={forgotPinEnteredOtp}
                onChange={(e) => setForgotPinEnteredOtp(e.target.value.replace(/\D/g, ''))}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="------"
              />
            </div>
          </div>
          
          <button 
            onClick={handleForgotPinVerify}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Verify</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'forgotPinSetup') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-full max-w-sm flex flex-col items-center mt-20">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Create New PIN</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Set a new 6-digit security PIN</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                maxLength={6}
                value={newPinForm.pin}
                onChange={(e) => setNewPinForm({...newPinForm, pin: e.target.value.replace(/\D/g, '')})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="New PIN"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                maxLength={6}
                value={newPinForm.confirmPin}
                onChange={(e) => setNewPinForm({...newPinForm, confirmPin: e.target.value.replace(/\D/g, '')})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Confirm New PIN"
              />
            </div>
          </div>
          
          <button 
            onClick={handleForgotPinSave}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Confirm Security PIN</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'forgotPassEmail') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-full max-w-sm flex flex-col items-center mt-20">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Forgot Password</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter your email address to reset your password</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                value={forgotPassEmail}
                onChange={(e) => setForgotPassEmail(e.target.value)}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Email Address"
              />
            </div>
          </div>
          
          <button 
            onClick={handleForgotPassRequest}
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 disabled:opacity-70 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>{isLoading ? 'Sending OTP...' : 'Confirm'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <button onClick={() => setScreen('login')} className={`mt-6 text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'forgotPassVerify') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-full max-w-sm flex flex-col items-center mt-20">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Verify OTP</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter the 6-digit code sent to <span className={isDarkMode ? 'text-white' : 'text-black'}>{forgotPassEmail}</span></p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                maxLength={6}
                value={forgotPassEnteredOtp}
                onChange={(e) => setForgotPassEnteredOtp(e.target.value.replace(/\D/g, ''))}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="------"
              />
            </div>
          </div>
          
          <button 
            onClick={handleForgotPassVerify}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Verify</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'forgotPassSetup') {
    return (
      <div className={`min-h-screen flex flex-col items-center p-8 font-sans ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-full max-w-sm flex flex-col items-center mt-20">
          <h2 className={`text-3xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Change Password</h2>
          <p className={`text-center mb-10 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter your old and new password</p>
          
          {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}

          <div className="w-full space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                value={forgotPassForm.oldPassword}
                onChange={(e) => setForgotPassForm({...forgotPassForm, oldPassword: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Old Password"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                value={forgotPassForm.newPassword}
                onChange={(e) => setForgotPassForm({...forgotPassForm, newPassword: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="New Password"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                value={forgotPassForm.confirmPassword}
                onChange={(e) => setForgotPassForm({...forgotPassForm, confirmPassword: e.target.value})}
                className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-700' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                placeholder="Confirm Password"
              />
            </div>
          </div>
          
          <button 
            onClick={handleForgotPassSave}
            className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-8 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <span>Change Password</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }


  if (screen === 'home') {
    return (
      <div className={`flex h-[100dvh] w-screen overflow-hidden ${isDarkMode ? 'bg-black text-white' : 'bg-[#f8f9fa] text-black'}`}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        {/* Leftmost Sidebar */}
        <div className={`hidden md:flex w-24 border-r flex-col items-center py-4 justify-between z-10 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex flex-col items-center space-y-4 w-full">
            {/* App Logo */}
            <div className="flex flex-col items-center w-full relative">
              <div className="cursor-pointer transform scale-[0.25] -mt-10 -mb-10">
                <LogoCircle animated={false} size="small" />
              </div>
              
              {/* Removed update three-dot icon */}
            </div>

            {/* More Options Button (Moved Up and Resized) */}
            <div className="relative w-full px-2">
              <button 
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`w-full flex flex-col items-center py-3 rounded-2xl transition-all transform hover:scale-105 ${showAddMenu ? (isDarkMode ? 'bg-zinc-800 text-white' : 'bg-blue-50 text-[#0066cc]') : (isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')}`}
              >
                <Plus className="w-7 h-7" />
                <span className="text-[10px] font-bold mt-1">Options</span>
              </button>
              {showAddMenu && (
                <div className={`absolute left-full top-0 ml-2 w-48 rounded-xl shadow-2xl border py-2 z-[100] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                  <button 
                    onClick={() => { setShowAddFriendModal(true); setShowAddMenu(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center text-sm ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <UserPlus className="w-5 h-5 mr-3" /> Add Friend
                  </button>
                  <button 
                    onClick={() => { setShowAddServerModal(true); setShowAddMenu(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center text-sm ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <Server className="w-5 h-5 mr-3" /> Add Server
                  </button>
                  <button 
                    onClick={() => { setShowJoinServerModal(true); setShowAddMenu(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center text-sm ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <Search className="w-5 h-5 mr-3" /> Join Server
                  </button>
                  {registeredUser.email === 'austudiopklap@gmail.com' && (
                    <button 
                      onClick={() => { setActiveTab('admin'); setShowAddMenu(false); }}
                      className={`w-full text-left px-4 py-3 flex items-center text-sm ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      <ShieldCheck className="w-5 h-5 mr-3 text-red-500" /> Admin Panel
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Nav Icons with Text */}
            <button 
              onClick={() => { setActiveTab('chats'); setSidebarFilter('all'); setActiveChat(null); }}
              className={`w-full flex flex-col items-center py-2 transition-colors ${activeTab === 'chats' && sidebarFilter === 'all' ? (isDarkMode ? 'text-white' : 'text-[#0066cc]') : (isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')}`}
            >
              <div className={`p-2 rounded-xl mb-1 ${activeTab === 'chats' && sidebarFilter === 'all' ? (isDarkMode ? 'bg-zinc-800' : 'bg-blue-50') : ''}`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Messages</span>
            </button>

            <button 
              onClick={() => { setActiveTab('chats'); setSidebarFilter('servers'); setActiveChat(null); }}
              className={`w-full flex flex-col items-center py-2 transition-colors ${activeTab === 'chats' && sidebarFilter === 'servers' ? (isDarkMode ? 'text-white' : 'text-[#0066cc]') : (isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')}`}
            >
              <div className={`p-2 rounded-xl mb-1 ${activeTab === 'chats' && sidebarFilter === 'servers' ? (isDarkMode ? 'bg-zinc-800' : 'bg-blue-50') : ''}`}>
                <Server className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Server</span>
            </button>

            <button 
              onClick={() => { setActiveTab('chats'); setSidebarFilter('friends'); setActiveChat(null); }}
              className={`w-full flex flex-col items-center py-2 transition-colors ${activeTab === 'chats' && sidebarFilter === 'friends' ? (isDarkMode ? 'text-white' : 'text-[#0066cc]') : (isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')}`}
            >
              <div className={`p-2 rounded-xl mb-1 ${activeTab === 'chats' && sidebarFilter === 'friends' ? (isDarkMode ? 'bg-zinc-800' : 'bg-blue-50') : ''}`}>
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Friend</span>
            </button>

            <button 
              onClick={() => { setActiveTab('settings'); setActiveChat(null); }}
              className={`w-full flex flex-col items-center py-2 transition-colors ${activeTab.startsWith('settings') ? (isDarkMode ? 'text-white' : 'text-[#0066cc]') : (isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')}`}
            >
              <div className={`p-2 rounded-xl mb-1 ${activeTab.startsWith('settings') ? (isDarkMode ? 'bg-zinc-800' : 'bg-blue-50') : ''}`}>
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">Settings</span>
            </button>
          </div>

          <div className="flex flex-col items-center w-full mb-2">
            <button 
              onClick={() => { setActiveTab('profile'); setActiveChat(null); }}
              className={`w-full flex flex-col items-center py-2 transition-colors ${activeTab === 'profile' ? (isDarkMode ? 'text-white' : 'text-[#0066cc]') : (isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')}`}
            >
              <div className={`w-8 h-8 rounded-full overflow-hidden border mb-1 transition-colors ${activeTab === 'profile' ? (isDarkMode ? 'border-white' : 'border-[#0066cc]') : (isDarkMode ? 'border-zinc-700 hover:border-white' : 'border-gray-300 hover:border-black')}`}>
                {registeredUser?.pic ? (
                  <img src={registeredUser.pic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                    <User className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`} />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </div>

        {/* Second Sidebar */}
        <div className={`${activeChat || activeTab.startsWith('settingsAccount') || activeTab === 'profile' ? 'hidden' : 'flex'} w-full md:w-80 border-r flex-col h-[calc(100vh-64px)] md:h-screen relative ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'}`}>
          {activeTab === 'chats' ? (
            <>
              {/* Header */}
              <div className="p-4 flex items-center justify-between relative">
                <div className="flex space-x-2">
                  {/* Camera icon removed */}
                </div>
              </div>

              {/* Search */}
              <div className="px-4 pb-2">
                <div className={`relative rounded-full flex items-center px-4 py-2 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                  <Search className={`h-5 w-5 mr-3 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent border-none w-full focus:outline-none text-base ${isDarkMode ? 'text-white placeholder-zinc-600' : 'text-black placeholder-gray-500'}`} 
                    placeholder="Ask Wotox AI or Search"
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="px-4 py-2 flex space-x-2 overflow-x-auto custom-scrollbar pb-2">
                <button 
                  onClick={() => setSidebarFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${sidebarFilter === 'all' ? 'bg-blue-100 text-[#0066cc]' : (isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-gray-100 text-gray-600')}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setSidebarFilter('servers')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${sidebarFilter === 'servers' ? 'bg-blue-100 text-[#0066cc]' : (isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-gray-100 text-gray-600')}`}
                >
                  Servers
                </button>
                <button 
                  onClick={() => setSidebarFilter('friends')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${sidebarFilter === 'friends' ? 'bg-blue-100 text-[#0066cc]' : (isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-gray-100 text-gray-600')}`}
                >
                  Friends
                </button>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Friend Requests */}
                {registeredUser?.friendRequests && registeredUser.friendRequests.length > 0 && (
                  <div className="mb-4">
                    <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Friend Requests</div>
                    {registeredUser.friendRequests.map((reqEmail: string) => {
                      const reqUser = allUsers.find(u => u.email === reqEmail);
                      if (!reqUser) return null;
                      return (
                        <div key={reqEmail} className={`flex items-center justify-between px-4 py-3 border-l-4 border-[#0066cc] ${isDarkMode ? 'bg-zinc-900/50' : 'bg-blue-50'}`}>
                          <div className="flex items-center overflow-hidden">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {reqUser.pic ? <img src={reqUser.pic} alt="User" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-500 m-2.5" />}
                            </div>
                            <div className="ml-3 overflow-hidden">
                              <p className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{reqUser.username || reqUser.fullName}</p>
                              <p className={`text-xs truncate ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>wants to connect</p>
                            </div>
                          </div>
                          <button onClick={() => handleAcceptRequest(reqEmail)} className="p-1.5 bg-[#0066cc] text-white rounded-full hover:bg-blue-700">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(sidebarFilter === 'all' || sidebarFilter === 'servers') && (
                  <>
                    <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider mt-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Servers</div>
                    {(() => {
                      const filteredServers = (registeredUser?.servers || []).filter((s: any) => 
                        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.handle.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (filteredServers.length > 0) {
                        return filteredServers.map((server: any) => (
                          <div key={server.id} onClick={() => setActiveChat(`server_${server.id}`)} className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${activeChat === `server_${server.id}` ? (isDarkMode ? 'bg-zinc-900' : 'bg-gray-100') : (isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-50')}`}>
                            <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                              {server.pic ? <img src={server.pic} alt="Server" className="w-full h-full object-cover" /> : <Server className={`w-6 h-6 m-3 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`} />}
                              <div className={`absolute bottom-0 right-0 rounded-full p-0.5 shadow-sm ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                                {server.visibility === 'public' && <Globe className="w-3 h-3 text-blue-500" />}
                                {server.visibility === 'private' && <LockIcon className="w-3 h-3 text-red-500" />}
                                {server.visibility === 'unlisted' && <EyeOff className="w-3 h-3 text-gray-500" />}
                              </div>
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                              <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{server.name}</h3>
                              <p className={`text-xs truncate ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{server.handle}</p>
                            </div>
                          </div>
                        ));
                      } else if (searchQuery && sidebarFilter === 'servers') {
                        return (
                          <div className={`px-4 py-4 text-center text-xs ${isDarkMode ? 'text-zinc-600' : 'text-gray-500'}`}>
                            No servers found matching "{searchQuery}"
                          </div>
                        );
                      } else if (!searchQuery && sidebarFilter === 'servers') {
                        return (
                          <div className={`px-4 py-4 text-center text-xs ${isDarkMode ? 'text-zinc-600' : 'text-gray-500'}`}>
                            No servers yet.
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}

                {(sidebarFilter === 'all' || sidebarFilter === 'friends') && (
                  <>
                    <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider mt-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Direct Messages</div>
                    {(() => {
                      const filteredFriends = (registeredUser?.friends || []).filter((email: string) => {
                        const friend = allUsers.find(u => u.email === email);
                        return friend && (
                          friend.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                      });

                      if (filteredFriends.length > 0) {
                        return filteredFriends.map((friendEmail: string) => {
                          const friend = allUsers.find(u => u.email === friendEmail);
                          if (!friend) return null;
                          return (
                            <div key={friendEmail} onClick={() => setActiveChat(friendEmail)} className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${activeChat === friendEmail ? (isDarkMode ? 'bg-zinc-900' : 'bg-gray-100') : (isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-50')}`}>
                              <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                                {friend.pic ? <img src={friend.pic} alt="User" className="w-full h-full object-cover" /> : <User className={`w-6 h-6 m-3 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`} />}
                              </div>
                              <div className="ml-3 flex-1 overflow-hidden">
                                <div className="flex items-center justify-between">
                                  <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{friend.username || friend.fullName}</h3>
                                  {userGameActivity[friendEmail] && (
                                    <div className="flex items-center text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                      <Gamepad2 className="w-3 h-3 mr-1" />
                                      {userGameActivity[friendEmail]}
                                    </div>
                                  )}
                                </div>
                                <p className={`text-xs truncate ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                                  {userGameActivity[friendEmail] ? `Playing ${userGameActivity[friendEmail]}` : 'Tap to view chat'}
                                </p>
                              </div>
                            </div>
                          );
                        });
                      } else if (searchQuery && sidebarFilter === 'friends') {
                        return (
                          <div className={`px-4 py-4 text-center text-xs ${isDarkMode ? 'text-zinc-600' : 'text-gray-500'}`}>
                            No friends found matching "{searchQuery}"
                          </div>
                        );
                      } else if (!searchQuery && sidebarFilter === 'friends') {
                        return (
                          <div className={`px-4 py-6 text-center text-sm ${isDarkMode ? 'text-zinc-600' : 'text-gray-500'}`}>
                            No friends yet. Click + to add a friend.
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}
              </div>
            </>
          ) : activeTab === 'settings' ? (
            <>
              {/* Settings Header */}
              <div className="p-4 flex items-center">
                <button onClick={() => setActiveTab('chats')} className={`md:hidden mr-3 p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Settings</h1>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {[
                  { id: 'settingsAccount', title: 'Account', desc: 'Privacy, security, change number', icon: KeyRound },
                  { id: 'settingsApp', title: 'App settings', desc: 'Theme, notifications, and more', icon: Settings },
                  { id: 'privacy', title: 'Privacy', desc: 'Block contacts, disappearing messages', icon: LockIcon },
                  { id: 'security', title: 'Security', desc: 'Two-step verification, security notifications', icon: ShieldCheck },
                  { id: 'notifications', title: 'Notifications', desc: 'Message, group & call tones', icon: Bot },
                  { id: 'storage', title: 'Storage and Data', desc: 'Network usage, auto-download', icon: Globe },
                  { id: 'help', title: 'Help', desc: 'Help center, contact us, privacy policy', icon: AlertTriangle },
                ].map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center px-4 py-4 cursor-pointer transition-colors border-b ${activeTab === item.id ? (isDarkMode ? 'bg-zinc-900' : 'bg-gray-100') : (isDarkMode ? 'hover:bg-zinc-900 border-zinc-800' : 'hover:bg-gray-50 border-gray-100')}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-700'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.title}</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
                <div 
                  onClick={handleLogout}
                  className={`flex items-center px-4 py-4 cursor-pointer transition-colors border-b ${isDarkMode ? 'hover:bg-red-900/20 border-zinc-800' : 'hover:bg-red-50 border-gray-100'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-red-600">Log Out</h3>
                    <p className="text-xs text-red-400">Sign out of your account</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 flex items-center">
                <button onClick={() => setActiveTab('chats')} className={`md:hidden mr-3 p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className={`text-2xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-black'}`}>{activeTab}</h1>
              </div>
              <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                  {activeTab === 'calls' && <Phone className={`w-8 h-8 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`} />}
                  {activeTab === 'communities' && <Users className={`w-8 h-8 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`} />}
                  {activeTab === 'updates' && <div className={`w-8 h-8 border-2 rounded-full border-dashed ${isDarkMode ? 'border-zinc-600' : 'border-gray-400'}`}></div>}
                </div>
                <h3 className={`text-lg font-medium mb-1 capitalize ${isDarkMode ? 'text-zinc-300' : 'text-gray-900'}`}>{activeTab}</h3>
                <p className="text-sm">This feature is coming soon.</p>
              </div>
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div className={`${!activeChat && !activeTab.startsWith('settingsAccount') ? 'hidden md:flex' : 'flex'} flex-1 flex-col items-center justify-center relative h-screen ${isDarkMode ? 'bg-black' : 'bg-[#f8f9fa]'}`}>
          {activeTab === 'chats' && (
            activeChat?.startsWith('server_') ? (
              <div className={`w-full h-full flex flex-col ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center">
                    <button onClick={() => setActiveChat(null)} className={`mr-3 p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                      {registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.pic ? (
                        <img src={registeredUser.servers.find((s: any) => `server_${s.id}` === activeChat).pic} alt="Server" className="w-full h-full object-cover" />
                      ) : (
                        <Server className={`w-5 h-5 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.name || 'Server'}</h2>
                      <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleStartCall('voice', { username: registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.name, pic: registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.pic })}
                      className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleStartCall('video', { username: registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.name, pic: registeredUser?.servers?.find((s: any) => `server_${s.id}` === activeChat)?.pic })}
                      className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowServerSettings(true)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className={`flex-1 p-6 overflow-y-auto flex flex-col ${isDarkMode ? 'bg-black' : 'bg-[#f8f9fa]'}`}>
                  <div className={`text-center text-sm mb-6 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Welcome to the server!</div>
                  
                  <div className="space-y-4 flex-1">
                    {(messages[activeChat] || []).map((msg: any) => {
                      const sender = allUsers.find(u => u.email === msg.sender);
                      const isMe = msg.sender === registeredUser.email;
                      
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                          <div className={`max-w-[80%] rounded-2xl p-3 relative ${isMe ? 'bg-[#0066cc] text-white shadow-md' : (isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black shadow-sm')}`}>
                            {!isMe && (
                              <div className="flex items-center mb-1">
                                <p className="text-[10px] font-bold opacity-70">{sender?.username || sender?.fullName}</p>
                                {moderators.includes(msg.sender) && <CheckCircle2 className="w-3 h-3 ml-1 text-[#0066cc]" />}
                              </div>
                            )}
                            <div className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="relative">
                                <button 
                                  onClick={() => setOpenMessageMenu(openMessageMenu === msg.id ? null : msg.id)}
                                  className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-gray-200 text-gray-400'}`}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {openMessageMenu === msg.id && (
                                  <div className={`absolute right-0 top-full mt-1 w-32 rounded-xl shadow-xl border py-1 z-50 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
                                    <button 
                                      onClick={() => { handleDeleteMessage(activeChat, msg.id); setOpenMessageMenu(null); }}
                                      className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center"
                                    >
                                      <Trash2 className="w-3 h-3 mr-2" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {msg.file ? (
                              <div className="space-y-2">
                                {msg.file.type === 'image' ? (
                                  <img 
                                    src={msg.file.url} 
                                    alt="Uploaded" 
                                    className="rounded-lg max-w-[150px] max-h-[150px] object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                                    onClick={() => setSelectedImage(msg.file.url)}
                                  />
                                ) : msg.file.type === 'video' ? (
                                  <video src={msg.file.url} controls className="rounded-lg max-w-[150px] max-h-[150px]" />
                                ) : msg.file.type === 'audio' ? (
                                  <div className={`p-3 rounded-xl border flex items-center ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                    <Mic className="w-4 h-4 mr-2" />
                                    <span className="text-xs italic">Voice message (deprecated)</span>
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => window.open(msg.file.url, '_blank')}
                                    className={`flex items-center p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${isMe ? 'bg-blue-800' : (isDarkMode ? 'bg-zinc-800' : 'bg-gray-100')}`}
                                  >
                                    <FileText className="w-5 h-5 mr-2" />
                                    <span className="text-xs truncate">{msg.file.name}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            )}
                            <p className={`text-[10px] mt-1 text-right opacity-50`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className={`p-2 px-4 border-t ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'}`}>
                  {(() => {
                    const serverId = activeChat.replace('server_', '');
                    const server = registeredUser?.servers?.find((s: any) => s.id === serverId);
                    if (server?.isEnded) {
                      return (
                        <div className={`p-4 text-center rounded-xl ${isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                          <p className="font-bold mb-1">This server has been ended.</p>
                          <p className="text-xs">You need to join. You can join another server.</p>
                        </div>
                      );
                    }
                    
                    const isMuted = server?.isMuted && registeredUser.email !== server.creator;
                    if (isMuted) {
                      return (
                        <div className={`p-4 text-center rounded-xl ${isDarkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-gray-100 text-gray-400'}`}>
                          <p className="text-sm">This server is muted. Only the host can send messages.</p>
                        </div>
                      );
                    }

                    const isPaused = server?.isPaused;
                    if (isPaused) {
                      const isHost = registeredUser.email === server.creator;
                      return (
                        <div className={`p-4 flex items-center justify-between rounded-xl ${isDarkMode ? 'bg-zinc-900 border border-orange-500/20' : 'bg-orange-50 border border-orange-100'}`}>
                          <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mr-3" />
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>The server has been paused.</p>
                          </div>
                          {isHost && (
                            <button 
                              onClick={() => {
                                const updatedServers = registeredUser.servers.map((s: any) => 
                                  s.id === serverId ? { ...s, isPaused: false } : s
                                );
                                updateCurrentUser({ servers: updatedServers });
                              }}
                              className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors"
                            >
                              Resume
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="relative flex items-center">
                        <div className="relative">
                          <button 
                            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                            className={`p-2 transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                          {showAttachmentMenu && (
                            <div className={`absolute bottom-full left-0 mb-2 w-48 rounded-xl shadow-lg border py-2 z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                              <button onClick={() => handleAttachmentClick('image')} className={`w-full text-left px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <ImageIcon className="w-4 h-4 mr-3" /> Upload Image
                              </button>
                              <button onClick={() => handleAttachmentClick('video')} className={`w-full text-left px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <Video className="w-4 h-4 mr-3" /> Upload Video
                              </button>
                              <button onClick={() => handleAttachmentClick('file')} className={`w-full text-left px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <FileText className="w-4 h-4 mr-3" /> Upload File
                              </button>
                            </div>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Message server..." 
                          className={`flex-1 border-none rounded-full py-2 pl-4 pr-12 mx-2 focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-zinc-900 text-white focus:ring-zinc-700 placeholder-zinc-600' : 'bg-gray-100 text-black focus:ring-gray-300 placeholder-gray-500'}`} 
                        />
                        {messageInput.trim() ? (
                          <button 
                            onClick={handleSendMessage}
                            className="p-2 bg-[#0066cc] text-white rounded-full hover:bg-blue-700 transition-colors"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        ) : (
                          <div className="w-9 h-9" />
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : activeChat ? (
              <div className={`w-full h-full flex flex-col ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center">
                    <button onClick={() => setActiveChat(null)} className={`mr-3 p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                      {allUsers.find(u => u.email === activeChat)?.pic ? (
                        <img src={allUsers.find(u => u.email === activeChat)?.pic} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className={`w-5 h-5 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{allUsers.find(u => u.email === activeChat)?.username || 'User'}</h2>
                      <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Tap here for contact info</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleStartCall('voice', allUsers.find(u => u.email === activeChat))}
                      className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleStartCall('video', allUsers.find(u => u.email === activeChat))}
                      className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className={`flex-1 p-6 overflow-y-auto flex flex-col ${isDarkMode ? 'bg-black' : 'bg-[#f8f9fa]'}`}>
                  <div className={`text-center text-sm mb-6 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>This is the beginning of your chat history.</div>
                  
                  <div className="space-y-4 flex-1">
                    {(messages[activeChat] || []).map((msg: any) => {
                      const isMe = msg.sender === registeredUser.email;
                      
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                          <div className={`max-w-[80%] rounded-2xl p-3 relative ${isMe ? 'bg-[#0066cc] text-white' : (isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black shadow-sm')}`}>
                            {isMe && (
                              <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleDeleteMessage(activeChat, msg.id)}
                                  className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-gray-200 text-gray-400'}`}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {msg.file ? (
                              <div className="space-y-2">
                                {msg.file.type === 'image' ? (
                                  <img 
                                    src={msg.file.url} 
                                    alt="Uploaded" 
                                    className="rounded-lg max-w-[150px] max-h-[150px] object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                                    onClick={() => setSelectedImage(msg.file.url)}
                                  />
                                ) : msg.file.type === 'video' ? (
                                  <video src={msg.file.url} controls className="rounded-lg max-w-[150px] max-h-[150px]" />
                                ) : msg.file.type === 'audio' ? (
                                  <div className={`p-3 rounded-xl border flex items-center ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                    <Mic className="w-4 h-4 mr-2" />
                                    <span className="text-xs italic">Voice message (deprecated)</span>
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => window.open(msg.file.url, '_blank')}
                                    className={`flex items-center p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${isMe ? 'bg-blue-800' : (isDarkMode ? 'bg-zinc-800' : 'bg-gray-100')}`}
                                  >
                                    <FileText className="w-5 h-5 mr-2" />
                                    <span className="text-xs truncate">{msg.file.name}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            )}
                            <p className={`text-[10px] mt-1 text-right opacity-50`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className={`p-2 px-4 border-t ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'}`}>
                  <div className="relative flex items-center">
                    <div className="relative">
                      <button 
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className={`p-2 transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      {showAttachmentMenu && (
                        <div className={`absolute bottom-full left-0 mb-2 w-48 rounded-xl shadow-lg border py-2 z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                          <button onClick={() => handleAttachmentClick('image')} className={`w-full text-left px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                            <ImageIcon className="w-4 h-4 mr-3" /> Upload Image
                          </button>
                          <button onClick={() => handleAttachmentClick('video')} className={`w-full text-left px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                            <Video className="w-4 h-4 mr-3" /> Upload Video
                          </button>
                          <button onClick={() => handleAttachmentClick('file')} className={`w-full text-left px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                            <FileText className="w-4 h-4 mr-3" /> Upload File
                          </button>
                        </div>
                      )}
                    </div>
                    <input 
                      type="text" 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..." 
                      className={`flex-1 border-none rounded-full py-2 pl-4 pr-12 mx-2 focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-zinc-900 text-white focus:ring-zinc-700 placeholder-zinc-600' : 'bg-gray-100 text-black focus:ring-gray-300 placeholder-gray-500'}`} 
                    />
                    {messageInput.trim() ? (
                      <button 
                        onClick={handleSendMessage}
                        className="p-2 bg-[#0066cc] text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="w-9 h-9" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full shadow-sm border flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                  <MessageSquare className={`w-10 h-10 ${isDarkMode ? 'text-zinc-700' : 'text-gray-300'}`} />
                </div>
                <h2 className={`text-xl font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Select a chat to start messaging</h2>
              </div>
            )
          )}
          
          {activeTab === 'settings' && (
            <div className="w-full h-full flex flex-col items-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="w-full max-w-2xl space-y-6">
                <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab('settingsAccount')}
                    className={`p-6 rounded-2xl border flex flex-col items-start transition-all transform hover:scale-[1.02] ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-gray-100 hover:shadow-md text-black'}`}
                  >
                    <User className="w-8 h-8 mb-4 text-[#0066cc]" />
                    <h3 className="font-bold text-lg">Account</h3>
                    <p className="text-sm opacity-50">Security, accounts, delete account</p>
                  </button>

                  <button 
                    onClick={() => setActiveTab('settingsApp')}
                    className={`p-6 rounded-2xl border flex flex-col items-start transition-all transform hover:scale-[1.02] ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-gray-100 hover:shadow-md text-black'}`}
                  >
                    <Smartphone className="w-8 h-8 mb-4 text-[#0066cc]" />
                    <h3 className="font-bold text-lg">App Settings</h3>
                    <p className="text-sm opacity-50">Theme, notifications</p>
                  </button>

                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to logout?')) {
                        setRegisteredUser(null);
                        setScreen('splash');
                        localStorage.removeItem('wotox_active_email');
                      }
                    }}
                    className={`p-6 rounded-2xl border flex flex-col items-start transition-all transform hover:scale-[1.02] ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-gray-100 hover:shadow-md text-black'}`}
                  >
                    <LogOut className="w-8 h-8 mb-4 text-red-500" />
                    <h3 className="font-bold text-lg">Logout</h3>
                    <p className="text-sm opacity-50">Sign out of your account</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="w-full h-full flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Admin Panel</h2>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Super Admin</span>
                  </div>
                </div>

                <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>User Management</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        className={`pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-gray-50 border-gray-200 text-black'}`}
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {allUsers.map(user => {
                      const isMod = moderators.includes(user.email);
                      const isBanned = bannedUsers.includes(user.email);
                      const isTempBanned = tempBannedUsers[user.email] && tempBannedUsers[user.email] > Date.now();
                      const isBlocked = blockedUsers.includes(user.email);

                      return (
                        <div key={user.email} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                              {user.pic ? <img src={user.pic} alt="User" className="w-full h-full object-cover" /> : <User className="w-6 h-6 m-3 text-gray-400" />}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.username || user.fullName}</p>
                                {isMod && <CheckCircle2 className="w-4 h-4 ml-1.5 text-[#0066cc]" />}
                              </div>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {isBanned && <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Banned</span>}
                            {isTempBanned && <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">Temp Ban</span>}
                            {isBlocked && <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded uppercase">Blocked</span>}
                            
                            {!isMod && (
                              <div className="relative group">
                                <button className={`p-2 rounded-full hover:bg-gray-100 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                                <div className={`absolute right-0 top-full mt-1 w-48 rounded-xl shadow-2xl border py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
                                  <button 
                                    onClick={() => {
                                      if (isBlocked) setBlockedUsers(prev => prev.filter(e => e !== user.email));
                                      else setBlockedUsers(prev => [...prev, user.email]);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                  >
                                    {isBlocked ? 'Unblock User' : 'Block User'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (isTempBanned) {
                                        const newTemp = { ...tempBannedUsers };
                                        delete newTemp[user.email];
                                        setTempBannedUsers(newTemp);
                                      } else {
                                        setTempBannedUsers(prev => ({ ...prev, [user.email]: Date.now() + 24 * 60 * 60 * 1000 }));
                                      }
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                  >
                                    {isTempBanned ? 'Remove Temp Ban' : 'Temporarily Ban (24h)'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (isBanned) setBannedUsers(prev => prev.filter(e => e !== user.email));
                                      else setBannedUsers(prev => [...prev, user.email]);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm text-red-500 ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-50'}`}
                                  >
                                    {isBanned ? 'Unban User' : 'Permanently Ban'}
                                  </button>
                                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                  <button 
                                    onClick={() => setModerators(prev => [...prev, user.email])}
                                    className={`w-full text-left px-4 py-2 text-sm text-[#0066cc] ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-50'}`}
                                  >
                                    Promote to Moderator
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

           {activeTab === 'profile' && (
            <div className="w-full h-full overflow-y-auto custom-scrollbar bg-zinc-50 dark:bg-black">
              <div className="max-w-4xl mx-auto pb-20">
                {/* Profile Header */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  {registeredUser?.banner ? (
                    <img src={registeredUser.banner} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Banner Edit Button */}
                  <button 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateCurrentUser({ banner: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Info Card */}
                <div className="px-4 md:px-8 -mt-20 relative z-10">
                  <div className={`rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`}>
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                          {/* Avatar */}
                          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 overflow-hidden shadow-2xl ${isDarkMode ? 'border-zinc-900 bg-zinc-800' : 'border-white bg-gray-100'}`}>
                            {registeredUser?.pic ? (
                              <img src={registeredUser.pic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className={`w-16 h-16 ${isDarkMode ? 'text-zinc-700' : 'text-gray-300'}`} />
                              </div>
                            )}
                          </div>
                          
                          <div className="text-center md:text-left pb-2">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                              <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                {registeredUser?.username || registeredUser?.fullName}
                              </h1>
                              {moderators.includes(registeredUser?.email) && (
                                <div className="bg-blue-500/10 p-1 rounded-full">
                                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                </div>
                              )}
                            </div>
                            <p className="text-blue-500 font-bold text-xl mt-1">{registeredUser?.wotoxId}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setEditProfileForm({
                                username: registeredUser.username || registeredUser.fullName || '',
                                wotoxId: registeredUser.wotoxId || '',
                                pic: registeredUser.pic || ''
                              });
                              setIsEditingProfile(true);
                            }}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>

                      {/* Stats/Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
                          <p className={`text-[10px] uppercase tracking-widest font-black mb-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Member ID</p>
                          <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{registeredUser?.wotoxId?.replace('@', '')}</p>
                        </div>
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
                          <p className={`text-[10px] uppercase tracking-widest font-black mb-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Status</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Online</p>
                          </div>
                        </div>
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
                          <p className={`text-[10px] uppercase tracking-widest font-black mb-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Joined</p>
                          <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {registeredUser?.createdAt ? new Date(registeredUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Mar 2026'}
                          </p>
                        </div>
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
                          <p className={`text-[10px] uppercase tracking-widest font-black mb-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>Security</p>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Verified</p>
                          </div>
                        </div>
                      </div>

                      {/* Bio/About Section */}
                      <div className="mt-12">
                        <h3 className={`text-lg font-black mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>About Me</h3>
                        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-zinc-800/20 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
                          <p className={`leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Welcome to my profile! I'm using WoTOX to connect with friends and join amazing communities. 
                            Feel free to message me or invite me to your server!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Modal */}
              {isEditingProfile && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}
                  >
                    <div className="p-6 border-b flex items-center justify-between">
                      <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Edit Profile</h2>
                      <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setEditProfileForm({...editProfileForm, pic: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}>
                          <div className={`w-28 h-28 rounded-3xl overflow-hidden border-2 ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
                            {editProfileForm.pic ? (
                              <img src={editProfileForm.pic} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Username</label>
                          <input 
                            type="text" 
                            value={editProfileForm.username}
                            onChange={(e) => setEditProfileForm({...editProfileForm, username: e.target.value})}
                            className={`w-full border rounded-2xl py-4 px-5 focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-black focus:border-blue-500'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>WoTOX ID</label>
                          <input 
                            type="text" 
                            value={editProfileForm.wotoxId}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (!val.startsWith('@')) val = '@' + val.replace(/@/g, '');
                              if (val.length <= 15) setEditProfileForm({...editProfileForm, wotoxId: val});
                            }}
                            className={`w-full border rounded-2xl py-4 px-5 focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-black focus:border-blue-500'}`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          className={`flex-1 py-4 rounded-2xl font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            updateCurrentUser({
                              username: editProfileForm.username,
                              wotoxId: editProfileForm.wotoxId,
                              pic: editProfileForm.pic
                            });
                            setIsEditingProfile(false);
                          }}
                          className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settingsApp' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settings')} className={`mr-4 p-2 rounded-full transition-colors -ml-2 ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>App Settings</h2>
              </div>

              <div className={`w-full rounded-2xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                <div className="p-6 border-b border-gray-100">
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>App theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'default'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setAppTheme(theme as any)}
                        className={`py-3 rounded-xl border font-medium capitalize transition-colors ${appTheme === theme ? 'bg-[#0066cc] text-white border-[#0066cc]' : (isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')}`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>App notifications</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Receive notifications for new messages</p>
                  </div>
                  <button 
                    onClick={() => setAppNotifications(!appNotifications)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${appNotifications ? 'bg-[#0066cc]' : (isDarkMode ? 'bg-zinc-800' : 'bg-gray-200')}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${appNotifications ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settingsAccount' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settings')} className={`mr-4 p-2 rounded-full transition-colors -ml-2 ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Account</h2>
              </div>
              
              <div className={`w-full rounded-2xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                <div 
                  onClick={() => setActiveTab('settingsAccountAdd')}
                  className={`flex items-center px-6 py-5 cursor-pointer transition-colors border-b ${isDarkMode ? 'hover:bg-zinc-800 border-zinc-800' : 'hover:bg-gray-50 border-gray-100'}`}
                >
                  <UserPlus className={`w-6 h-6 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`} />
                  <span className={`ml-5 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Add account</span>
                </div>
                <div 
                  onClick={() => setActiveTab('settingsAccountChangeEmail')}
                  className={`flex items-center px-6 py-5 cursor-pointer transition-colors border-b ${isDarkMode ? 'hover:bg-zinc-800 border-zinc-800' : 'hover:bg-gray-50 border-gray-100'}`}
                >
                  <Mail className={`w-6 h-6 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`} />
                  <span className={`ml-5 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Change email address</span>
                </div>
                <div 
                  onClick={() => setActiveTab('settingsAccountTwoStep')}
                  className={`flex items-center px-6 py-5 cursor-pointer transition-colors border-b ${isDarkMode ? 'hover:bg-zinc-800 border-zinc-800' : 'hover:bg-gray-50 border-gray-100'}`}
                >
                  <ShieldCheck className={`w-6 h-6 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`} />
                  <span className={`ml-5 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Two step verification</span>
                </div>
                <div 
                  onClick={() => { setActiveTab('settingsAccountDeleteWarning'); setError(''); }}
                  className={`flex items-center px-6 py-5 cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-50 text-red-600'}`}
                >
                  <Trash2 className="w-6 h-6" />
                  <span className="ml-5 text-lg font-medium">Delete account</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settingsAccountDeleteWarning' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccount')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-red-600">Delete Account</h2>
              </div>
              
              <div className={`p-6 rounded-2xl mb-8 w-full max-w-lg border ${isDarkMode ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Warning</h3>
                </div>
                <p className={`leading-relaxed mb-4 ${isDarkMode ? 'text-red-400/80' : 'text-red-700'}`}>
                  Deleting your account is permanent and cannot be undone. All your messages, contacts, and settings will be permanently removed.
                </p>
                <div className="mt-4">
                  <p className={`font-medium mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Please type <span className="font-bold">delete my account</span> to confirm:</p>
                  <input 
                    type="text" 
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors ${isDarkMode ? 'bg-zinc-900 border-red-900/30 text-white placeholder-zinc-700' : 'bg-white border-red-300 text-black placeholder-gray-400'}`} 
                    placeholder="delete my account"
                  />
                </div>
              </div>
              
              <button 
                disabled={deleteConfirmText.toLowerCase() !== 'delete my account'}
                onClick={() => { setActiveTab('settingsAccountDeleteConfirm'); setError(''); setDeleteConfirmText(''); }}
                className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Delete
              </button>
            </div>
          )}

          {activeTab === 'settingsAccountAdd' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccount')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Accounts</h2>
              </div>
              
              <div className="w-full max-w-md space-y-4">
                {allUsers.map((user, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (user.email !== registeredUser?.email) {
                        setRegisteredUser(user);
                        localStorage.setItem('wotox_active_email', user.email);
                        setScreen('enterPin');
                        setActiveTab('chats');
                      }
                    }}
                    className={`flex items-center p-4 border rounded-2xl shadow-sm transition-colors ${user.email === registeredUser?.email ? (isDarkMode ? 'border-[#0066cc] bg-zinc-900/50 cursor-default' : 'border-[#0066cc] bg-blue-50 cursor-default') : (isDarkMode ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 cursor-pointer' : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer')}`}
                  >
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                      {user.pic ? (
                        <img src={user.pic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className={`w-6 h-6 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1 overflow-hidden">
                      <p className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.username || user.fullName}</p>
                      <p className={`text-sm truncate ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{user.email}</p>
                    </div>
                    {user.email === registeredUser?.email && (
                      <div className="ml-auto">
                        <CheckCircle2 className="w-6 h-6 text-[#0066cc]" />
                      </div>
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    setScreen('signup');
                    setActiveTab('chats');
                  }}
                  className={`w-full flex items-center justify-center p-4 border border-dashed rounded-2xl transition-colors font-medium mt-6 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-black'}`}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add another account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settingsAccountChangeEmail' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccount')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Change Email</h2>
              </div>
              
              <div className="w-full max-w-md">
                {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={changeEmailForm.originalEmail}
                      onChange={(e) => setChangeEmailForm({...changeEmailForm, originalEmail: e.target.value})}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="Original Email"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={changeEmailForm.newEmail}
                      onChange={(e) => setChangeEmailForm({...changeEmailForm, newEmail: e.target.value})}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="New Email"
                    />
                  </div>
                  
                  <button 
                    onClick={handleChangeEmailRequest}
                    disabled={isLoading}
                    className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    <span>{isLoading ? 'Sending OTP...' : 'Change Email'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settingsAccountChangeEmailVerify' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccountChangeEmail')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Verify New Email</h2>
              </div>
              
              <div className="w-full max-w-md">
                <p className={`mb-6 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter the 6-digit code sent to {changeEmailForm.newEmail}</p>
                {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={settingsEnteredOtp}
                      onChange={(e) => setSettingsEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="------"
                    />
                  </div>
                  
                  <button 
                    onClick={handleChangeEmailVerify}
                    className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-4 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    <span>Verify & Change Email</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settingsAccountTwoStep' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => { setActiveTab('settingsAccount'); setIsEditingTwoStepEmail(false); }} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Two Step Verification</h2>
              </div>
              
              <div className="w-full max-w-md">
                {registeredUser?.twoStepEnabled && !isEditingTwoStepEmail ? (
                  <div className={`flex flex-col items-center text-center p-6 rounded-2xl border mb-6 ${isDarkMode ? 'bg-green-900/20 border-green-900/30' : 'bg-green-50 border-green-100'}`}>
                    <ShieldCheck className="w-12 h-12 text-green-500 mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>Account Verified</h3>
                    <p className={`text-sm mb-6 ${isDarkMode ? 'text-green-500/80' : 'text-green-700'}`}>Your account is now secured by adding an extra layer. You can also change verification email.</p>
                    
                    <div className={`flex items-center justify-between w-full p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-green-900/30' : 'bg-white border-green-200'}`}>
                      <div className="flex items-center text-left">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{registeredUser.twoStepEmail}</span>
                      </div>
                      <button onClick={() => setIsEditingTwoStepEmail(true)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleDisableTwoStep}
                      className={`mt-6 w-full font-bold py-3 rounded-xl transition-colors ${isDarkMode ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    >
                      Disable Two-Step Verification
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={`mb-6 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                      {isEditingTwoStepEmail ? "Enter a new email for two-step verification." : "Add an extra layer of security to your account."}
                    </p>
                    {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                    
                    <div className="space-y-5">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="email" 
                          value={twoStepForm.email}
                          onChange={(e) => setTwoStepForm({...twoStepForm, email: e.target.value})}
                          className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                          placeholder="Email Address"
                        />
                      </div>
                      
                      <button 
                        onClick={handleTwoStepRequest}
                        disabled={isLoading}
                        className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                      >
                        <span>{isLoading ? 'Sending OTP...' : (isEditingTwoStepEmail ? 'Send OTP' : 'Secure Account')}</span>
                        {!isLoading && <ShieldCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settingsAccountTwoStepVerify' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccountTwoStep')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Verify Account</h2>
              </div>
              
              <div className="w-full max-w-md">
                <p className={`mb-6 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter the 6-digit code sent to {twoStepForm.email}</p>
                {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={settingsEnteredOtp}
                      onChange={(e) => setSettingsEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="------"
                    />
                  </div>
                  
                  <button 
                    onClick={handleTwoStepVerify}
                    className={`w-full font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 mt-4 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    <span>Verify Account</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settingsAccountDeleteWarning' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccount')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-red-600">Delete Account</h2>
              </div>
              
              <div className={`p-6 rounded-2xl mb-8 w-full max-w-lg border ${isDarkMode ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Warning</h3>
                </div>
                <p className={`leading-relaxed mb-4 ${isDarkMode ? 'text-red-400/80' : 'text-red-700'}`}>
                  Deleting your account is permanent and cannot be undone. All your messages, contacts, and settings will be permanently removed.
                </p>
                <div className="mt-4">
                  <p className={`font-medium mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Please type <span className="font-bold">delete my account</span> to confirm:</p>
                  <input 
                    type="text" 
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors ${isDarkMode ? 'bg-zinc-900 border-red-900/30 text-white placeholder-zinc-700' : 'bg-white border-red-300 text-black placeholder-gray-400'}`} 
                    placeholder="delete my account"
                  />
                </div>
              </div>
              
              <button 
                disabled={deleteConfirmText.toLowerCase() !== 'delete my account'}
                onClick={() => { setActiveTab('settingsAccountDeleteConfirm'); setError(''); setDeleteConfirmText(''); }}
                className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Delete
              </button>
            </div>
          )}

          {activeTab === 'settingsAccountDeleteConfirm' && (
            <div className="w-full h-full flex flex-col items-start justify-start p-6 md:p-12 max-w-3xl mx-auto">
              <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('settingsAccountDeleteWarning')} className={`mr-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-gray-100 text-black'}`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Confirm Deletion</h2>
              </div>
              
              <div className="w-full max-w-md">
                <p className={`mb-6 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Please enter your credentials to confirm account deletion.</p>
                {error && <div className={`p-3 rounded-lg text-sm mb-6 w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={deleteAccountForm.email}
                      onChange={(e) => setDeleteAccountForm({...deleteAccountForm, email: e.target.value})}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400'}`} 
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      value={deleteAccountForm.password}
                      onChange={(e) => setDeleteAccountForm({...deleteAccountForm, password: e.target.value})}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400'}`} 
                      placeholder="Password"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      maxLength={6}
                      value={deleteAccountForm.pin}
                      onChange={(e) => setDeleteAccountForm({...deleteAccountForm, pin: e.target.value.replace(/\D/g, '')})}
                      className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-colors tracking-widest text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400'}`} 
                      placeholder="Security PIN"
                    />
                  </div>
                  
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center space-x-2 mt-4"
                  >
                    <span>Permanently Delete Account</span>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Friend Modal */}
          {showAddFriendModal && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Add Friend</h2>
                  <button onClick={() => { setShowAddFriendModal(false); setFriendSearchResult(null); setFriendSearch({name: '', wotoxId: ''}); }} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter the exact username and WoTOX ID to find a user.</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={friendSearch.name}
                      onChange={(e) => setFriendSearch({...friendSearch, name: e.target.value})}
                      className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="Username"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-bold">@</span>
                    </div>
                    <input 
                      type="text" 
                      value={friendSearch.wotoxId}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith('@')) val = '@' + val.replace(/@/g, '');
                        if (val.length <= 10) setFriendSearch({...friendSearch, wotoxId: val});
                      }}
                      className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="WoTOX ID"
                    />
                  </div>
                  <button 
                    onClick={handleSearchFriend}
                    className={`w-full font-bold py-3 rounded-xl transition-colors mt-2 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black'}`}
                  >
                    Search
                  </button>

                  {friendSearchResult === 'not_found' && (
                    <div className={`mt-4 p-4 rounded-xl text-center text-sm border ${isDarkMode ? 'bg-red-900/20 text-red-400 border-red-900/30' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      User not found. Please check the details and try again.
                    </div>
                  )}

                  {friendSearchResult && friendSearchResult !== 'not_found' && (
                    <div className={`mt-6 border rounded-xl p-4 flex flex-col items-center ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
                      <div className={`w-20 h-20 rounded-full overflow-hidden mb-3 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                        {friendSearchResult.pic ? (
                          <img src={friendSearchResult.pic} alt="Found User" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-gray-500 m-5" />
                        )}
                      </div>
                      <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{friendSearchResult.username || friendSearchResult.fullName}</h3>
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{friendSearchResult.email}</p>
                      <button 
                        onClick={handleSendRequest}
                        className="w-full bg-[#0066cc] text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Add User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Mobile Bottom Nav */}
          <div className={`${activeChat || activeTab.startsWith('settingsAccount') || activeTab === 'profile' ? 'hidden' : 'flex'} md:hidden fixed bottom-0 left-0 right-0 border-t justify-around items-center h-16 z-50 pb-safe ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'}`}>
            <button onClick={() => { setActiveTab('chats'); setActiveChat(null); }} className="flex-1 py-2 flex flex-col items-center">
              <div className={`px-4 py-1 rounded-full ${activeTab === 'chats' ? (isDarkMode ? 'bg-zinc-900' : 'bg-blue-100') : ''}`}>
                <MessageSquare className={`w-6 h-6 ${activeTab === 'chats' ? 'text-[#0066cc]' : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`} />
              </div>
              <span className={`text-[11px] mt-1 font-medium ${activeTab === 'chats' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`}>Chats</span>
            </button>
            <button onClick={() => { setActiveTab('updates'); setActiveChat(null); }} className="flex-1 py-2 flex flex-col items-center">
              <div className={`px-4 py-1 rounded-full ${activeTab === 'updates' ? (isDarkMode ? 'bg-zinc-900' : 'bg-blue-100') : ''}`}>
                <div className="relative">
                  <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${activeTab === 'updates' ? 'border-[#0066cc]' : (isDarkMode ? 'border-zinc-500' : 'border-gray-600')}`}>
                    <div className={`w-2 h-2 rounded-full ${activeTab === 'updates' ? 'bg-[#0066cc]' : (isDarkMode ? 'bg-zinc-500' : 'bg-gray-600')}`}></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0066cc] rounded-full border-2 border-white"></div>
                </div>
              </div>
              <span className={`text-[11px] mt-1 font-medium ${activeTab === 'updates' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`}>Updates</span>
            </button>
            <button onClick={() => { setActiveTab('communities'); setActiveChat(null); }} className="flex-1 py-2 flex flex-col items-center">
              <div className={`px-4 py-1 rounded-full ${activeTab === 'communities' ? (isDarkMode ? 'bg-zinc-900' : 'bg-blue-100') : ''}`}>
                <Users className={`w-6 h-6 ${activeTab === 'communities' ? 'text-[#0066cc]' : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`} />
              </div>
              <span className={`text-[11px] mt-1 font-medium ${activeTab === 'communities' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`}>Communities</span>
            </button>
            <button onClick={() => { setActiveTab('profile'); setActiveChat(null); }} className="flex-1 py-2 flex flex-col items-center">
              <div className={`px-4 py-1 rounded-full ${activeTab === 'profile' ? (isDarkMode ? 'bg-zinc-900' : 'bg-blue-100') : ''}`}>
                <User className={`w-6 h-6 ${activeTab === 'profile' ? 'text-[#0066cc]' : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`} />
              </div>
              <span className={`text-[11px] mt-1 font-medium ${activeTab === 'profile' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`}>Profile</span>
            </button>
          </div>

          {/* Add Server Modal */}
          {showJoinServerModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Join Server</h3>
                  <button onClick={() => setShowJoinServerModal(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {error && <div className={`p-3 rounded-lg text-sm text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Server Handle</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold">#</span>
                      </div>
                      <input 
                        type="text" 
                        value={joinServerHandle}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (!val.startsWith('#')) val = '#' + val.replace(/#/g, '');
                          setJoinServerHandle(val);
                        }}
                        className={`w-full border rounded-xl py-3.5 pl-10 pr-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                        placeholder="e.g. #WotoxOfficial"
                      />
                    </div>
                    <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Enter the server handle starting with # to join.</p>
                  </div>

                  <button 
                    onClick={handleJoinServer}
                    className="w-full py-4 rounded-xl font-bold bg-[#0066cc] text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
                  >
                    <span>Join Server</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {showWhatNewModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}
              >
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>What's New in WoTOX</h2>
                  <button onClick={() => setShowWhatNewModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Enhanced Security</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>New server security features including pause, mute, and about sections.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Gamepad2 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Game Activity</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>See what your friends are playing in real-time with our new game status.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Persistent Media</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Files and videos now persist across app restarts for a smoother experience.</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowWhatNewModal(false)}
                    className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {showAddServerModal && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Create New Server</h2>
                  <button onClick={() => { setShowAddServerModal(false); setServerForm({ name: '', handle: '', visibility: 'public', category: '', game: '', tags: [] }); setError(''); }} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                  {error && <div className={`p-3 rounded-lg text-sm w-full text-center ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>{error}</div>}
                  
                  <div className="flex flex-col items-center mb-4">
                    <div 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setServerForm({...serverForm, pic: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${isDarkMode ? 'border-zinc-700 hover:border-zinc-500 bg-zinc-800' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                    >
                      {serverForm.pic ? (
                        <img src={serverForm.pic} alt="Server" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-[10px] text-gray-500">Upload Icon</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Server Name</label>
                    <input 
                      type="text" 
                      value={serverForm.name}
                      onChange={(e) => setServerForm({...serverForm, name: e.target.value})}
                      className={`w-full border rounded-xl py-3 px-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="Enter server name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Server Handle</label>
                    <input 
                      type="text" 
                      value={serverForm.handle}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith('#')) val = '#' + val.replace(/#/g, '');
                        setServerForm({...serverForm, handle: val});
                      }}
                      className={`w-full border rounded-xl py-3 px-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                      placeholder="#yourhandle"
                    />
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Must start with # and have at least 7 characters.</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Visibility</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setServerForm({...serverForm, visibility: 'public'})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${serverForm.visibility === 'public' ? (isDarkMode ? 'border-[#0066cc] bg-blue-900/20 text-[#0066cc]' : 'border-[#0066cc] bg-blue-50 text-[#0066cc]') : (isDarkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}`}
                      >
                        <Globe className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Public</span>
                      </button>
                      <button 
                        onClick={() => setServerForm({...serverForm, visibility: 'private'})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${serverForm.visibility === 'private' ? (isDarkMode ? 'border-[#0066cc] bg-blue-900/20 text-[#0066cc]' : 'border-[#0066cc] bg-blue-50 text-[#0066cc]') : (isDarkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}`}
                      >
                        <LockIcon className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Private</span>
                      </button>
                      <button 
                        onClick={() => setServerForm({...serverForm, visibility: 'unlisted'})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${serverForm.visibility === 'unlisted' ? (isDarkMode ? 'border-[#0066cc] bg-blue-900/20 text-[#0066cc]' : 'border-[#0066cc] bg-blue-50 text-[#0066cc]') : (isDarkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}`}
                      >
                        <EyeOff className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Unlisted</span>
                      </button>
                    </div>
                  </div>

                  {serverForm.visibility === 'private' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Create Private Server Password</label>
                      <input 
                        type="password" 
                        value={serverForm.password}
                        onChange={(e) => setServerForm({...serverForm, password: e.target.value})}
                        className={`w-full border rounded-xl py-3 px-4 focus:outline-none transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white placeholder-zinc-600' : 'bg-gray-50 border-gray-200 text-black focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400'}`} 
                        placeholder="Enter password"
                      />
                    </div>
                  )}

                  {serverForm.visibility === 'unlisted' && (
                    <div className="animate-in fade-in slide-in-from-top-2 p-4 rounded-xl border border-dashed border-[#0066cc] bg-blue-50/50">
                      <p className="text-xs text-[#0066cc] font-medium mb-1">Unlisted Server Link:</p>
                      <p className="text-xs font-mono break-all text-blue-800">https://wotox.app/join/{Math.random().toString(36).substring(2, 10)}</p>
                      <p className="text-[10px] text-gray-500 mt-2">Only people with this link can join. This server won't appear in search results.</p>
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setServerForm({...serverForm, category: 'chat', game: '', tags: []})}
                        className={`flex items-center justify-center p-3 rounded-xl border transition-colors ${serverForm.category === 'chat' ? (isDarkMode ? 'border-[#0066cc] bg-blue-900/20 text-[#0066cc]' : 'border-[#0066cc] bg-blue-50 text-[#0066cc]') : (isDarkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Chat Room</span>
                      </button>
                      <button 
                        onClick={() => setServerForm({...serverForm, category: 'game', tags: []})}
                        className={`flex items-center justify-center p-3 rounded-xl border transition-colors ${serverForm.category === 'game' ? (isDarkMode ? 'border-[#0066cc] bg-blue-900/20 text-[#0066cc]' : 'border-[#0066cc] bg-blue-50 text-[#0066cc]') : (isDarkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}`}
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Game Room</span>
                      </button>
                    </div>
                  </div>

                  {serverForm.category === 'game' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Select Game</label>
                      <select 
                        value={serverForm.game}
                        onChange={(e) => setServerForm({...serverForm, game: e.target.value})}
                        className={`w-full border rounded-xl py-3 px-4 focus:outline-none transition-colors appearance-none ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-white' : 'bg-gray-50 border-gray-200 text-black focus:border-black'}`}
                      >
                        <option value="" disabled>Select a game...</option>
                        <option value="Minecraft">Minecraft</option>
                        <option value="Roblox">Roblox</option>
                        <option value="Valorant">Valorant</option>
                        <option value="CS:GO">CS:GO</option>
                        <option value="GTA V">GTA V</option>
                        <option value="Among Us">Among Us</option>
                      </select>
                    </div>
                  )}

                  {serverForm.category && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-700'}`}>Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {(serverForm.category === 'chat' 
                          ? ['General', 'Chill', 'Tech', 'Music', 'Art', 'Anime', 'Movies', 'Study']
                          : ['FPS', 'RPG', 'Strategy', 'Casual', 'Competitive', 'Co-op', 'Survival', 'Sandbox']
                        ).map(tag => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (serverForm.tags.includes(tag)) {
                                setServerForm({...serverForm, tags: serverForm.tags.filter(t => t !== tag)});
                              } else if (serverForm.tags.length < 3) {
                                setServerForm({...serverForm, tags: [...serverForm.tags, tag]});
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${serverForm.tags.includes(tag) ? 'bg-[#0066cc] text-white border-[#0066cc]' : (isDarkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Select up to 3 tags.</p>
                    </div>
                  )}

                  <button 
                    onClick={handleCreateServer}
                    className="w-full bg-[#0066cc] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg mt-4"
                  >
                    Create Server
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Server Settings Modal */}
          {showServerSettings && activeChat?.startsWith('server_') && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Server Settings</h2>
                  <button onClick={() => { setShowServerSettings(false); setServerSettingsTab('members'); }} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className={`flex border-b ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
                  <button 
                    onClick={() => setServerSettingsTab('members')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${serverSettingsTab === 'members' ? 'border-[#0066cc] text-[#0066cc]' : (isDarkMode ? 'border-transparent text-zinc-500 hover:text-zinc-300' : 'border-transparent text-gray-500 hover:text-gray-700')}`}
                  >
                    Members
                  </button>
                  <button 
                    onClick={() => setServerSettingsTab('about')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${serverSettingsTab === 'about' ? 'border-[#0066cc] text-[#0066cc]' : (isDarkMode ? 'border-transparent text-zinc-500 hover:text-zinc-300' : 'border-transparent text-gray-500 hover:text-gray-700')}`}
                  >
                    About
                  </button>
                  <button 
                    onClick={() => setServerSettingsTab('settings')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${serverSettingsTab === 'settings' ? 'border-[#0066cc] text-[#0066cc]' : (isDarkMode ? 'border-transparent text-zinc-500 hover:text-zinc-300' : 'border-transparent text-gray-500 hover:text-gray-700')}`}
                  >
                    Settings
                  </button>
                </div>

                <div className="p-4 overflow-y-auto custom-scrollbar">
                  {(() => {
                    const serverId = activeChat.replace('server_', '');
                    const server = registeredUser?.servers?.find((s: any) => s.id === serverId);
                    if (!server) return null;
                    
                    if (serverSettingsTab === 'members') {
                      const members = server.members || [];
                      const creator = server.creator;
                      const sortedMembers = [...members].sort((a, b) => {
                        if (a === creator) return -1;
                        if (b === creator) return 1;
                        return 0;
                      });

                      return sortedMembers.map((memberEmail: string) => {
                        const user = allUsers.find(u => u.email === memberEmail);
                        if (!user) return null;
                        const isCreator = memberEmail === creator;
                        const isMuted = server.mutedMembers?.includes(memberEmail);
                        
                        return (
                          <div key={memberEmail} className={`flex items-center justify-between py-3 border-b last:border-0 ${isDarkMode ? 'border-zinc-800' : 'border-gray-50'}`}>
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                                {user.pic ? <img src={user.pic} alt="User" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-500 m-2.5" />}
                              </div>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.username || user.fullName}</h3>
                                  {isCreator && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-[#0066cc] text-[10px] font-bold rounded-full uppercase">Host</span>}
                                  {isMuted && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase">Muted</span>}
                                </div>
                                <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{user.email}</p>
                              </div>
                            </div>
                            {registeredUser.email === creator && !isCreator && (
                              <div className="relative group">
                                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                                <div className={`absolute right-0 top-full mt-1 w-32 rounded-xl shadow-lg border py-1 hidden group-hover:block z-50 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
                                  <button 
                                    onClick={() => handleToggleMuteUser(serverId, memberEmail)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDarkMode ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                  >
                                    {isMuted ? 'Unmute User' : 'Mute User'}
                                  </button>
                                  <button 
                                    onClick={() => handleKickUser(serverId, memberEmail)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                                  >
                                    Kick User
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      });
                    }

                    if (serverSettingsTab === 'about') {
                      const host = allUsers.find(u => u.email === server.creator);
                      return (
                        <div className="space-y-6 py-2">
                          <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Server Name</label>
                            <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{server.name}</p>
                          </div>
                          <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Server Handle</label>
                            <p className={`text-lg font-semibold text-[#0066cc]`}>{server.handle}</p>
                          </div>
                          <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Server Host</label>
                            <div className="flex items-center mt-1">
                              <div className={`w-8 h-8 rounded-full overflow-hidden mr-2 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                                {host?.pic ? <img src={host.pic} alt="Host" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-gray-500 m-2" />}
                              </div>
                              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{host?.username || host?.fullName}</p>
                            </div>
                          </div>
                          <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Related Details</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-600'}`}>{server.category === 'chat' ? 'Chat Room' : 'Game Room'}</span>
                              {server.game && <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-600'}`}>{server.game}</span>}
                              {server.tags?.map((tag: string) => (
                                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (serverSettingsTab === 'settings') {
                      const isHost = registeredUser.email === server.creator;
                      return (
                        <div className="space-y-6 py-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Server notifications</h4>
                              <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Receive alerts for this server</p>
                            </div>
                            <button 
                              onClick={() => {
                                const updatedServers = registeredUser.servers.map((s: any) => 
                                  s.id === serverId ? { ...s, notifications: !s.notifications } : s
                                );
                                updateCurrentUser({ servers: updatedServers });
                              }}
                              className={`w-12 h-6 rounded-full relative transition-colors ${server.notifications !== false ? 'bg-[#0066cc]' : (isDarkMode ? 'bg-zinc-800' : 'bg-gray-200')}`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${server.notifications !== false ? 'left-6.5' : 'left-0.5'}`}></div>
                            </button>
                          </div>

                          {isHost && (
                            <>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Mute server</h4>
                                  <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Only host can send messages</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    const updatedServers = registeredUser.servers.map((s: any) => 
                                      s.id === serverId ? { ...s, isMuted: !s.isMuted } : s
                                    );
                                    updateCurrentUser({ servers: updatedServers });
                                  }}
                                  className={`w-12 h-6 rounded-full relative transition-colors ${server.isMuted ? 'bg-red-600' : (isDarkMode ? 'bg-zinc-800' : 'bg-gray-200')}`}
                                >
                                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${server.isMuted ? 'left-6.5' : 'left-0.5'}`}></div>
                                </button>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Pause server</h4>
                                  <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Prevent extra notifications</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    const updatedServers = registeredUser.servers.map((s: any) => 
                                      s.id === serverId ? { ...s, isPaused: !s.isPaused } : s
                                    );
                                    updateCurrentUser({ servers: updatedServers });
                                  }}
                                  className={`w-12 h-6 rounded-full relative transition-colors ${server.isPaused ? 'bg-orange-500' : (isDarkMode ? 'bg-zinc-800' : 'bg-gray-200')}`}
                                >
                                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${server.isPaused ? 'left-6.5' : 'left-0.5'}`}></div>
                                </button>
                              </div>

                              <button 
                                onClick={() => {
                                  const updatedServers = registeredUser.servers.map((s: any) => 
                                    s.id === serverId ? { ...s, isEnded: true } : s
                                  );
                                  updateCurrentUser({ servers: updatedServers });
                                  setShowServerSettings(false);
                                }}
                                className="w-full py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors mt-4"
                              >
                                End Server
                              </button>
                            </>
                          )}
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Call Overlay */}
        {activeCall && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black pointer-events-none" />
            
            {!callAccepted ? (
              <div className="flex flex-col items-center z-10">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-[#0066cc] animate-pulse">
                  {activeCall.user.pic ? <img src={activeCall.user.pic} alt="Caller" className="w-full h-full object-cover" /> : <User className="w-16 h-16 m-8 text-zinc-500" />}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{activeCall.user.username || activeCall.user.fullName}</h2>
                <p className="text-zinc-400 mb-12">Incoming {activeCall.type} call...</p>
                
                <div className="flex space-x-12">
                  <button onClick={handleEndCall} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                    <PhoneOff className="w-8 h-8" />
                  </button>
                  <button onClick={() => setCallAccepted(true)} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                    <Phone className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-lg flex flex-col items-center z-10 h-full">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-zinc-800">
                    {activeCall.user.pic ? <img src={activeCall.user.pic} alt="Caller" className="w-full h-full object-cover" /> : <User className="w-10 h-10 m-5 text-zinc-500" />}
                  </div>
                  <h2 className="text-xl font-bold text-white">{activeCall.user.username || activeCall.user.fullName}</h2>
                  <p className="text-zinc-500 text-sm font-mono mt-1">{formatTime(callDuration)}</p>
                </div>

                {activeCall.type === 'video' && (
                  <div className="flex-1 w-full bg-zinc-900 rounded-3xl overflow-hidden relative mb-8 border border-zinc-800 shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Video className="w-20 h-20 mb-4" />
                        <p className="text-sm font-medium">Remote Video Feed</p>
                      </div>
                    </div>
                    {/* Self view */}
                    <div className="absolute bottom-4 right-4 w-32 h-48 bg-black rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                      <div className="w-full h-full flex items-center justify-center">
                        {registeredUser?.pic ? <img src={registeredUser.pic} alt="Self" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-zinc-800" />}
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[8px] text-white font-bold uppercase tracking-wider">You</div>
                    </div>
                  </div>
                )}

                {activeCall.type === 'voice' && (
                  <div className="flex-1 flex items-center justify-center w-full mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0066cc]/20 rounded-full blur-3xl animate-pulse" />
                      <div className="w-48 h-48 rounded-full border-2 border-[#0066cc]/30 flex items-center justify-center relative">
                        <div className="w-40 h-40 rounded-full border border-[#0066cc]/50 flex items-center justify-center animate-spin-slow">
                          <div className="w-4 h-4 bg-[#0066cc] rounded-full absolute -top-2" />
                        </div>
                        <Mic className="w-16 h-16 text-[#0066cc]" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-6 p-6 bg-zinc-900/50 backdrop-blur-xl rounded-full border border-zinc-800 mb-8">
                  <button className="p-4 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                    <MicOff className="w-6 h-6" />
                  </button>
                  <button onClick={handleEndCall} className="p-5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg shadow-red-500/40">
                    <PhoneOff className="w-8 h-8" />
                  </button>
                  <button className="p-4 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Viewer Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Full view" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    );
  }

  return null;
}
