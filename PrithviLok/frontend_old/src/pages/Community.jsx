// ============================================================
// Community Page — Posts Feed with Like, Comment & Delete
// ============================================================
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, Heart, MessageCircle, Plus, Wallet, Trash2, ChevronDown, ChevronUp, Camera, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import EcoLevelBadge from '../components/EcoLevelBadge';

const MEDIA_BASE_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '') ||
  'http://localhost:5000';

const Community = () => {
  const { user, web3Login } = useAuth();
  const { emit, on } = useSocket();
  const [posts, setPosts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [newPost, setNewPost] = useState('');
  const [postCategory, setPostCategory] = useState('discussion');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const chatEndRef = useRef(null);

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(''); // 'post' or 'chat'
  const [capturedPostPhoto, setCapturedPostPhoto] = useState(null); // File blob
  const [capturedChatPhoto, setCapturedChatPhoto] = useState(null); // Base64

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    fetchPosts();
    const unsubPost = on('community:post', (post) => setPosts((prev) => [post, ...prev]));
    const unsubChat = on('chat:message:receive', (msg) => setChatMessages((prev) => [...prev, msg]));
    return () => { unsubPost?.(); unsubChat?.(); };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const fetchPosts = async () => {
    setLoading(true);
    try { const { data } = await api.get('/community'); setPosts(data); }
    catch { toast.error('Failed to load posts', toastTheme); }
    finally { setLoading(false); }
  };

  const openCamera = async (mode) => {
    setCameraMode(mode);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;

      // Wait for next tick so React renders the video tag, then attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);

    } catch (err) {
      toast.error('Camera access denied or unavailable.', toastTheme);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg', 0.8);

      if (cameraMode === 'post') {
        canvas.toBlob((blob) => setCapturedPostPhoto(blob), 'image/jpeg', 0.8);
      } else if (cameraMode === 'chat') {
        setCapturedChatPhoto(base64Data);
      }
      stopCamera();
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !capturedPostPhoto) return;
    setPosting(true);
    try {
      const typedCaption = newPost.trim();
      const autoCaption = capturedPostPhoto ? autoCaptionByCategory[postCategory] : '';
      const finalCaption = typedCaption || autoCaption || 'Photo Post';
      const formData = new FormData();
      formData.append('content', finalCaption);
      formData.append('category', postCategory);
      if (capturedPostPhoto) {
        formData.append('image', capturedPostPhoto, capturedPostPhoto.name || 'webcam-capture.jpg');
      }

      const { data } = await api.post('/community', formData);
      setPosts((prev) => [data.post, ...prev]);
      setNewPost('');
      setCapturedPostPhoto(null);
      if (!typedCaption && capturedPostPhoto) {
        toast('Auto-caption added to your image post.', toastTheme);
      }
      toast.success(`Post created! +${data.ecoPoints?.pointsEarned || 5} pts`, { ...toastTheme, icon: '✅' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed', toastTheme); }
    finally { setPosting(false); }
  };

  const handleChatImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = h * (maxDim / w); w = maxDim; }
          else { w = w * (maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        setCapturedChatPhoto(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLike = async (postId) => {
    if (!user) { toast.error('Login to like', toastTheme); return; }
    try {
      const { data } = await api.post(`/community/${postId}/like`);
      setPosts((prev) => prev.map((p) =>
        p._id === postId ? { ...p, likes: data.isLiked ? [...p.likes, user._id] : p.likes.filter((id) => id !== user._id) } : p
      ));
    } catch { }
  };

  const handleComment = async (postId, content) => {
    if (!user) { toast.error('Login to comment', toastTheme); return; }
    if (!content.trim()) return;
    try {
      const { data } = await api.post(`/community/${postId}/comment`, { content });
      setPosts((prev) => prev.map((p) =>
        p._id === postId ? { ...p, comments: data.comments } : p
      ));
      toast.success('Comment added!', { ...toastTheme, icon: '💬' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to comment', toastTheme); }
  };

  const handleDelete = (postId) => {
    setDeleteTarget(postId);
  };

  const confirmDeletePost = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/community/${deleteTarget}`);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget));
      setDeleteTarget(null);
      toast.success('Post deleted', { ...toastTheme, icon: '???' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete', toastTheme); }
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() && !capturedChatPhoto) return;
    const msg = {
      content: chatInput,
      sender: user.name,
      senderId: user._id,
      timestamp: new Date().toISOString(),
      photo: capturedChatPhoto || null
    };
    setChatMessages((prev) => [...prev, msg]);
    emit('chat:message', msg);
    setChatInput('');
    setCapturedChatPhoto(null);
  };

  const catColors = { discussion: 'blue', tip: 'green', alert: 'red', achievement: 'yellow', question: 'purple' };
  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
  const activeContributors = new Set(posts.map((post) => post.author?._id || post.author?.name).filter(Boolean)).size;
  const toastTheme = {
    duration: 2600,
    style: {
      borderRadius: '12px',
      background: 'rgba(8, 15, 30, 0.95)',
      color: '#E2E8F0',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.35)'
    }
  };
  const autoCaptionByCategory = {
    discussion: 'Community discussion: sharing today’s eco observation and inviting ideas.',
    tip: 'Eco tip of the day: a practical step anyone can apply.',
    alert: 'Eco alert: please review this issue and take local action quickly.',
    achievement: 'Eco achievement unlocked: one more green milestone completed.',
    question: 'Community question: what is the best practical solution for this?'
  };

  // ── Time ago helper ──
  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10 }}>
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, padding: '32px 40px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div>
          <h1 className="text-gradient" style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Community</h1>
          <p style={{ fontSize: '15px', color: '#94A3B8' }}>Share local wins, ask smart questions, and coordinate real eco action.</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #3B82F6, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
          <MessageCircle size={24} color="#000" strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        <div className="card-glass" style={{ padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Posts</p>
          <p style={{ margin: '6px 0 0', fontSize: 22, color: '#fff', fontWeight: 800 }}>{posts.length}</p>
        </div>
        <div className="card-glass" style={{ padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Likes</p>
          <p style={{ margin: '6px 0 0', fontSize: 22, color: '#fff', fontWeight: 800 }}>{totalLikes}</p>
        </div>
        <div className="card-glass" style={{ padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Comments</p>
          <p style={{ margin: '6px 0 0', fontSize: 22, color: '#fff', fontWeight: 800 }}>{totalComments}</p>
        </div>
        <div className="card-glass" style={{ padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Contributors</p>
          <p style={{ margin: '6px 0 0', fontSize: 22, color: '#fff', fontWeight: 800 }}>{activeContributors}</p>
        </div>
      </div>

      {/* Web3 Banner */}
      {user && !user.walletAddress && (
        <div className="card-glass" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.1), rgba(249,115,22,0.02))', border: '1px solid rgba(249,115,22,0.3)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🦊</div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fb923c', marginBottom: '4px' }}>Connect MetaMask for Web3 features</p>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>Store posts immutably on IPFS and interact with EcoNFTs.</p>
            </div>
          </div>
          <button onClick={async () => {
            if (!window.ethereum) { toast.error('MetaMask not found!', toastTheme); return; }
            try { const accts = await window.ethereum.request({ method: 'eth_requestAccounts' }); await web3Login(accts[0]); }
            catch { toast.error('Web3 login failed', toastTheme); }
          }} className="btn-secondary" style={{ borderColor: 'rgba(249,115,22,0.4)', color: '#fb923c', height: '44px', padding: '0 24px' }}>
            <Wallet size={18} /> Connect Wallet
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {['posts', 'chat'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: 700, border: '1px solid', cursor: 'pointer',
              background: activeTab === tab ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.24), rgba(16, 185, 129, 0.1))' : 'rgba(15, 23, 42, 0.5)',
              borderColor: activeTab === tab ? 'rgba(34, 197, 94, 0.45)' : 'rgba(255,255,255,0.1)',
              color: activeTab === tab ? '#10B981' : '#A5B4C8',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab ? '0 8px 24px rgba(16, 185, 129, 0.2)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            {tab === 'chat' ? '🔴 Live Chat' : '📝 Posts Feed'}
          </button>
        ))}
      </div>

            {/* POSTS TAB */}
      {activeTab === 'posts' && (
        <div style={{ width: '100%', maxWidth: 940, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-glass" style={{ padding: 20, border: '1px solid rgba(34, 197, 94, 0.25)' }}>
            <h3 style={{ fontWeight: 800, fontSize: '19px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(34, 197, 94, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} style={{ color: '#22c55e' }} />
              </div>
              Create New Post
            </h3>
            {user ? (
              <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10B981' }}>Post Type (Highest Priority)</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{newPost.length}/2000 chars</p>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { key: 'discussion', label: 'Discussion' },
                    { key: 'tip', label: 'Tip' },
                    { key: 'alert', label: 'Alert' },
                    { key: 'achievement', label: 'Achievement' },
                    { key: 'question', label: 'Question' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setPostCategory(item.key)}
                      style={{
                        borderRadius: 999,
                        padding: '8px 12px',
                        border: `1px solid ${postCategory === item.key ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.14)'}`,
                        background: postCategory === item.key ? 'rgba(16, 185, 129, 0.16)' : 'rgba(15, 23, 42, 0.6)',
                        color: postCategory === item.key ? '#10B981' : '#CBD5E1',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="What happened on-ground today? Share one practical insight..." className="input-field" style={{ resize: 'none', height: 130, fontSize: '14px', padding: '14px 16px', background: 'rgba(15, 23, 42, 0.6)' }} maxLength={2000} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button type="button" onClick={() => openCamera('post')} style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60A5FA', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700 }}>
                      <Camera size={16} /> Camera
                    </button>
                    <label style={{ background: 'rgba(34, 197, 94, 0.16)', border: '1px solid rgba(34, 197, 94, 0.35)', color: '#34D399', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700 }}>
                      <ImageIcon size={15} /> Upload
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files[0]) setCapturedPostPhoto(e.target.files[0]); }} />
                    </label>
                    {capturedPostPhoto && (
                      <div style={{ position: 'relative', width: 42, height: 42 }}>
                        <img src={URL.createObjectURL(capturedPostPhoto)} alt="captured" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                        <button type="button" onClick={() => setCapturedPostPhoto(null)} style={{ position: 'absolute', top: -5, right: -5, background: 'rgba(239,68,68,0.95)', color: '#fff', borderRadius: '50%', border: 'none', width: 16, height: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={posting || (!newPost.trim() && !capturedPostPhoto)} className="btn-primary" style={{ minWidth: 220, fontSize: '14px', height: '44px', borderRadius: 14 }}>
                    {posting ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </form>
            ) : (
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>Please <a href="/login" style={{ color: '#10B981', fontWeight: 600 }}>login</a> to participate.</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
            ) : posts.length === 0 ? (
              <div className="card-glass" style={{ textAlign: 'center', padding: '64px' }}>
                <p style={{ color: '#94A3B8', fontSize: '15px' }}>No posts yet. Be the first to spark a discussion!</p>
              </div>
            ) : posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
                timeAgo={timeAgo}
                catColors={catColors}
              />
            ))}
          </div>
        </div>
      )}

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '68vh', minHeight: '520px', maxHeight: '760px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: 'rgba(2, 6, 23, 0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={16} color="#10B981" /></div>
              Global Eco Chat
            </h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', fontWeight: 600, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '100px' }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981' }} /> Live Network
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '32px' }}>
            {chatMessages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748B', fontSize: '15px', marginTop: 60 }}>Silence in the forest... Be the first to speak! 🌲</p>
            ) : chatMessages.map((msg, i) => {
              const isMine = msg.senderId === user?._id;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', borderRadius: '16px', padding: '16px 20px',
                    background: isMine ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isMine ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {!isMine && <p style={{ fontSize: '13px', color: '#10B981', fontWeight: 700, marginBottom: 6 }}>{msg.sender}</p>}
                    {msg.photo && (
                      <img src={msg.photo} alt="attachment" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', marginBottom: '8px', objectFit: 'cover' }} />
                    )}
                    <p style={{ fontSize: '15px', color: '#fff', lineHeight: 1.5 }}>{msg.content}</p>
                    <p style={{ fontSize: '11px', color: '#64748B', marginTop: 8, textAlign: isMine ? 'right' : 'left', fontWeight: 600 }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 32px', background: 'rgba(2, 6, 23, 0.4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {capturedChatPhoto && (
                <div style={{ position: 'relative', width: '80px', height: '80px', alignSelf: 'flex-start' }}>
                  <img src={capturedChatPhoto} alt="captured" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" onClick={() => setCapturedChatPhoto(null)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: '#fff', borderRadius: '50%', border: 'none', padding: 2, cursor: 'pointer' }}><X size={12} /></button>
                </div>
              )}
              <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button type="button" onClick={() => openCamera('chat')} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.5)', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'} title="WebRTC Scan">
                  <Camera size={20} />
                </button>
                <label style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'} title="Upload Image">
                  <ImageIcon size={20} />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChatImageUpload} />
                </label>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message to the community..." className="input-field" style={{ flex: 1, padding: '0 24px', fontSize: '15px', height: '48px', borderRadius: '100px', background: 'rgba(15, 23, 42, 0.8)' }} maxLength={500} />
                <button type="submit" disabled={!chatInput.trim() && !capturedChatPhoto} className="btn-primary" style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, flexShrink: 0 }}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', fontSize: '15px', color: '#94A3B8', padding: '24px', background: 'rgba(2, 6, 23, 0.4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <a href="/login" style={{ color: '#10B981', fontWeight: 600 }}>Login</a> to join the live chat.
            </div>
          )}
        </div>
      )}

      {/* CAMERA MODAL */}
      {showCamera && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #3b82f6', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button onClick={capturePhoto} style={{ padding: '14px 24px', borderRadius: '12px', background: '#10B981', color: '#000', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Camera size={18} /> Take Photo
            </button>
            <button onClick={stopCamera} style={{ padding: '14px 24px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 800, fontSize: '15px', border: '1px solid rgba(239, 68, 68, 0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(2, 6, 23, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card-glass" style={{ width: '100%', maxWidth: 420, padding: 24, border: '1px solid rgba(239, 68, 68, 0.35)' }}>
            <h3 style={{ margin: 0, marginBottom: 10, color: '#fff', fontSize: 20, fontWeight: 800 }}>Delete this post?</h3>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>This action cannot be undone.</p>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setDeleteTarget(null)} style={{ height: 40, padding: '0 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#CBD5E1', cursor: 'pointer', fontWeight: 700 }}>
                Cancel
              </button>
              <button type="button" onClick={confirmDeletePost} style={{ height: 40, padding: '0 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.16)', color: '#FCA5A5', cursor: 'pointer', fontWeight: 700 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


// ════════════════════════════════════════════════════════════════
// POST CARD — with Like animation, Comments section, Delete
// ════════════════════════════════════════════════════════════════
const PostCard = ({ post, user, onLike, onComment, onDelete, timeAgo, catColors }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const canDelete = user && (post.author?._id === user._id || user.role === 'admin' || user.isAdmin);
  const isLiked = post.likes?.includes(user?._id);

  const handleLikeClick = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    onLike(post._id);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setSubmitting(true);
    await onComment(post._id, commentInput);
    setCommentInput('');
    setSubmitting(false);
  };

  return (
    <div className="card-glass" style={{ padding: 0, overflow: 'hidden', transition: 'all 0.25s ease', position: 'relative', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 28px rgba(0,0,0,0.25)' }}>

      {/* Post Header */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
          {post.author?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{post.author?.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <EcoLevelBadge level={post.author?.ecoLevel} />
            <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 4, height: 4, background: '#64748B', borderRadius: '50%' }} />
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="badge" style={{ background: `var(--badge-${catColors[post.category]}-bg, rgba(255,255,255,0.1))`, color: `var(--badge-${catColors[post.category]}-text, #fff)`, border: `1px solid var(--badge-${catColors[post.category]}-border, rgba(255,255,255,0.2))`, textTransform: 'capitalize' }}>
            {post.category}
          </span>
          {canDelete && (
            <button
              onClick={() => onDelete(post._id)}
              title="Delete Post"
              style={{
                width: 32, height: 32,
                background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#94A3B8', padding: 0, cursor: 'pointer',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease', flexShrink: 0
              }}
              onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
              onMouseOut={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(15,23,42,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div style={{ padding: '18px 22px' }}>
        {post.content && post.content !== 'Photo Post' && (
          <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: 1.7, marginBottom: 0, whiteSpace: 'pre-wrap' }}>{post.content}</p>
        )}

        {post.image && (
          <>
            <div style={{
              marginTop: '16px', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)', position: 'relative',
              background: 'rgba(255,255,255,0.02)', cursor: 'pointer',
              minHeight: !imageLoaded ? '200px' : 'auto'
            }}
              onClick={() => setIsFullScreen(true)}
              onMouseOver={e => { if (imageLoaded) e.currentTarget.querySelector('img').style.transform = 'scale(1.03)'; }}
              onMouseOut={e => { if (imageLoaded) e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}
            >
              {!imageLoaded && (
                <div className="skeleton-loader" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)', backgroundSize: '200% 100%', animation: 'skeleton 1.5s infinite' }} />
              )}
              <img
                src={`${MEDIA_BASE_URL}${post.image}`}
                alt="Community uploaded content"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                style={{
                  width: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  opacity: imageLoaded ? 1 : 0
                }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>

            {/* Full Screen Image Modal */}
            {isFullScreen && (
              <div
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
                onClick={() => setIsFullScreen(false)}
              >
                <img
                  src={`${MEDIA_BASE_URL}${post.image}`}
                  alt="Full screen preview"
                  style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions Bar — Like & Comment toggle */}
      <div style={{ display: 'flex', gap: 10, padding: '0 22px 16px', alignItems: 'center' }}>
        {/* Like Button */}
        <button onClick={handleLikeClick} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: isLiked ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isLiked ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
          color: isLiked ? '#EF4444' : '#94A3B8', fontSize: '14px', fontWeight: 600,
          transition: 'all 0.2s', transform: likeAnim ? 'scale(1.15)' : 'scale(1)',
        }}
          onMouseOver={e => { if (!isLiked) e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
          onMouseOut={e => { if (!isLiked) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <Heart size={16} style={{ fill: isLiked ? '#EF4444' : 'none', transition: 'all 0.2s' }} />
          {post.likes?.length || 0}
        </button>

        {/* Comment Toggle */}
        <button onClick={() => setCommentsOpen(!commentsOpen)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: commentsOpen ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${commentsOpen ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
          color: commentsOpen ? '#3B82F6' : '#94A3B8', fontSize: '14px', fontWeight: 600,
          transition: 'all 0.2s',
        }}>
          <MessageCircle size={16} />
          {post.comments?.length || 0}
          {commentsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {post.ipfsHash && <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 600, color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>🔗 IPFS</span>}
      </div>

      {/* Comments Section */}
      {commentsOpen && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,6,23,0.3)' }}>
          {/* Existing Comments */}
          <div style={{ maxHeight: 300, overflowY: 'auto', padding: '16px 28px' }}>
            {(!post.comments || post.comments.length === 0) ? (
              <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>No comments yet. Be the first! 💬</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {post.comments.map((c, i) => (
                  <div key={c._id || i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#000', fontWeight: 800, fontSize: '12px'
                    }}>
                      {c.author?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>{c.author?.name || 'User'}</span>
                        <span style={{ fontSize: '11px', color: '#475569' }}>{timeAgo(c.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment Input */}
          {user && (
            <form onSubmit={handleSubmitComment} style={{
              display: 'flex', gap: 10, padding: '14px 28px 18px',
              borderTop: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: 800, fontSize: '13px'
              }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <input
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                maxLength={500}
                style={{
                  flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '0 16px', color: '#fff', fontSize: '13px',
                  height: 36, outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || submitting}
                style={{
                  background: commentInput.trim() ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(255,255,255,0.05)',
                  border: 'none', borderRadius: 10, padding: '0 16px',
                  color: commentInput.trim() ? '#000' : '#475569',
                  fontWeight: 700, fontSize: '13px', cursor: commentInput.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', gap: 6, height: 36,
                  transition: 'all 0.2s',
                }}
              >
                <Send size={14} /> {submitting ? '...' : 'Post'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Community;



