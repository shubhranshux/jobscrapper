import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, Mail, Phone, FileText, Code, Camera, Trash2, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', skills: '', bio: '', profile_image_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try { const res = await api.get('/profile'); setProfile(res.data.profile); } catch (err) { setMessage({ type: 'error', text: 'Failed to load profile.' }); } finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/profile', { name: profile.name, phone: profile.phone, skills: profile.skills, bio: profile.bio });
      setProfile(res.data.profile); updateUser({ name: profile.name }); setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) { setMessage({ type: 'error', text: 'Failed to update profile.' }); } finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    // Show instant local preview
    setLocalPreview(URL.createObjectURL(file));
    const formData = new FormData(); formData.append('image', file); setUploadingImage(true);
    try {
      const res = await api.post('/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(prev => ({ ...prev, profile_image_url: res.data.profile_image_url })); updateUser({ profile_image_url: res.data.profile_image_url }); setMessage({ type: 'success', text: 'Profile image uploaded!' });
    } catch (err) { setMessage({ type: 'error', text: 'Image uploaded locally. Server storage may need configuration.' }); } finally { setUploadingImage(false); }
  };

  const handleDeleteImage = async () => {
    try { await api.delete('/profile/image'); setProfile(prev => ({ ...prev, profile_image_url: null })); setLocalPreview(null); updateUser({ profile_image_url: null }); setMessage({ type: 'success', text: 'Profile image deleted.' }); } catch (err) { setMessage({ type: 'error', text: 'Failed to delete image.' }); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1"><Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-surface-500 font-medium">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="content-area">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-surface-800">My Profile</h1>
              <p className="text-surface-500 mt-1">Manage your account information</p>
            </div>

            {message.text && (
              <div className={`mb-6 flex items-center gap-3 px-5 py-4 rounded-xl animate-slide-down ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Profile Image */}
            <div className="bg-white border border-surface-200 shadow-card rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold text-surface-800 mb-6">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {(localPreview || profile.profile_image_url) ? (
                    <img src={localPreview || profile.profile_image_url} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-surface-200" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">{profile.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  )}
                  {uploadingImage && (<div className="absolute inset-0 rounded-2xl bg-white/70 flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary-600 animate-spin" /></div>)}
                </div>
                <div className="space-y-3">
                  <label className="btn-secondary text-sm !py-2.5 cursor-pointer inline-flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary-600" /> Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {profile.profile_image_url && (
                    <button onClick={handleDeleteImage} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /> Delete Image</button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="bg-white border border-surface-200 shadow-card rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-surface-800 mb-6">Personal Information</h2>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-surface-600 mb-2 uppercase tracking-wide">Full Name</label>
                    <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" /><input type="text" value={profile.name || ''} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} className="input-field pl-12" placeholder="John Doe" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-600 mb-2 uppercase tracking-wide">Email</label>
                    <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" /><input type="email" value={profile.email || ''} disabled className="input-field pl-12 bg-surface-50 text-surface-400 cursor-not-allowed opacity-70" /></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-surface-600 mb-2 uppercase tracking-wide">Phone</label>
                  <div className="relative group"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" /><input type="tel" value={profile.phone || ''} onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))} className="input-field pl-12" placeholder="+91 9876543210" /></div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-surface-600 mb-2 uppercase tracking-wide">Skills</label>
                  <div className="relative group"><Code className="absolute left-5 top-[18px] w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" /><input type="text" value={profile.skills || ''} onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value }))} className="input-field pl-12" placeholder="React, Node.js, Python, SQL..." /></div>
                  <p className="mt-1.5 text-xs text-surface-400">Separate skills with commas. Used for AI job matching.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-surface-600 mb-2 uppercase tracking-wide">Bio</label>
                  <div className="relative group"><FileText className="absolute left-5 top-[18px] w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" /><textarea value={profile.bio || ''} onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))} className="input-field pl-12 min-h-[120px] resize-y" placeholder="Tell us about yourself..." rows={4} /></div>
                </div>
                <div className="pt-6 border-t border-surface-200">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">{saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </div>
            </form>

            {/* Account Info */}
            <div className="bg-white border border-surface-200 shadow-card rounded-2xl p-6 sm:p-8 mt-6 mb-12">
              <h2 className="text-xl font-bold text-surface-800 mb-4">Account Information</h2>
              <div className="text-sm text-surface-500 space-y-2">
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Member since: {new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {profile.updated_at && (<p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Last updated: {new Date(profile.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
