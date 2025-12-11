import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, MapPin, Tag, Plane, CheckCircle, Send, Sparkles, MessageSquare, Maximize2 } from 'lucide-react';
import { db, appId } from '../../services/firebase';
import { useApp } from '../../context/AppContext';
import GlassCard from '../../components/ui/GlassCard';
import NeonButton from '../../components/ui/NeonButton';
import NotificationOverlay from '../../components/admin/NotificationOverlay';

const ClaimDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [reply, setReply] = useState('');
    const [showNotify, setShowNotify] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useApp();

    useEffect(() => {
        const fetchClaim = async () => {
            setError(null);
            if (!id) return;

            try {
                const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setClaim({ id: docSnap.id, ...data });
                    
                    // Safe AI Mock
                    setTimeout(() => {
                        setAiAnalysis({
                            sentiment: (data.priority === 'high') ? 'frustrated' : 'neutral',
                            sentimentScore: 0.8,
                            summary: `Passenger reported: "${data.desc?.substring(0, 50) || 'Issue'}..."`,
                            suggestedAction: "Review and respond.",
                            entities: { flight: data.flightNumber || 'N/A' }
                        });
                        setReply(data.replyDraft || "Hello, we are looking into your case.");
                    }, 500);
                } else {
                    setError("Document not found");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchClaim();
    }, [id]);

    const handleAction = async (newStatus) => {
        if (!claim) return;
        if (newStatus === 'resolved') {
           setShowNotify(true);
           
           // Send Email if contact info exists
           if (claim.contactMethod === 'email' && claim.contactValue) {
               try {
                   const { emailService } = await import('../../services/email');
                   await emailService.sendResolution(
                       claim.contactValue, 
                       claim.name || 'Passenger', 
                       claim.refId, 
                       reply
                   );
               } catch (e) {
                   console.error("Failed to send email:", e);
               }
           }
        }
        
        try {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', id);
            await updateDoc(docRef, { status: newStatus });
            setClaim(prev => ({ ...prev, status: newStatus }));
        } catch (e) {
            alert("Update Failed: " + e.message);
        }
    };

    if (loading) return <div className="p-10 text-white animate-pulse">Loading Case {id}...</div>;
    if (error) return <div className="p-10 text-red-400">Error: {error}</div>;
    if (!claim) return <div className="p-10 text-white">Signal lost.</div>;

    const statusLabel = claim.status?.replace('_', ' ') || 'Unknown';
    const dateStr = claim.createdAt?.seconds ? new Date(claim.createdAt.seconds * 1000).toLocaleString() : 'Just now';

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full transition-colors" style={{ color: 'var(--glass-text-muted)', backgroundColor: 'var(--glass-border)' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--glass-text)' }}>CASE #{claim.refId || '???'}</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)', borderWidth: '1px' }}>
                                {statusLabel}
                            </span>
                        </div>
                        <p className="text-xs font-mono mt-1" style={{ color: 'var(--glass-text-muted)' }}>OPENED {dateStr}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                     <NeonButton onClick={() => handleAction('resolved')} className="!py-2 !px-6 !text-xs">
                        Resolve Case
                    </NeonButton>
                </div>
            </div>

            {/* Content - Split View */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                
                {/* LEFT: Evidence */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
                    <GlassCard className="p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {(claim.userId || 'U').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold" style={{ color: 'var(--glass-text)' }}>
                                        {claim.name || `Psgr: ${(claim.userId || '...').slice(0, 8)}`}
                                    </h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                         <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--glass-text-muted)' }}><Plane size={12}/> {claim.flightNumber || 'No Flight'}</span>
                                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--glass-text-muted)' }}><MapPin size={12}/> {claim.location || 'Unknown'}</span>
                                         </div>
                                         {claim.contactValue && (
                                            <span className="text-xs font-mono px-2 py-0.5 rounded w-fit" style={{ color: 'var(--accent-color)', backgroundColor: 'var(--glass-border)' }}>
                                                {claim.contactMethod === 'email' ? '✉️' : '📞'} {claim.contactValue}
                                            </span>
                                         )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                            <p className="leading-relaxed text-sm" style={{ color: 'var(--glass-text)' }}>"{claim.desc}"</p>
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-4">
                         {claim.files && claim.files.length > 0 ? claim.files.map((f, i) => (
                             <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/40">
                                <img src={f} className="w-full h-full object-cover" alt="Evidence" />
                            </div>
                        )) : <div className="col-span-2 text-white/20 text-center py-10">No Evidence Uploaded</div>}
                    </div>
                </div>

                {/* RIGHT: AI Copilot */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                    <GlassCard className="p-5 relative overflow-hidden" 
                               style={{ borderColor: 'var(--color-purple)' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={16} style={{ color: 'var(--color-purple)' }} />
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-purple)' }}>AI Analysis</h3>
                        </div>
                        {aiAnalysis ? (
                            <div className="space-y-4">
                                <p className="text-sm" style={{ color: 'var(--glass-text)' }}>{aiAnalysis.summary}</p> 
                                <span className="text-xs" style={{ color: 'var(--color-purple)' }}>Sentiment: {aiAnalysis.sentiment}</span>
                            </div>
                        ) : <div className="text-xs" style={{ color: 'var(--glass-text-muted)' }}>Analysis pending...</div>}
                    </GlassCard>

                    <GlassCard className="flex-1 flex flex-col p-5">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--glass-text-muted)' }}>
                                <Send size={12} /> Smart Reply
                            </h3>
                        </div>
                        <textarea 
                            className="flex-1 rounded-lg border p-4 text-sm resize-none"
                            style={{ 
                                backgroundColor: 'var(--glass-bg)', 
                                borderColor: 'var(--glass-border)', 
                                color: 'var(--glass-text)' 
                            }}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                        <NeonButton onClick={() => handleAction('resolved')} className="mt-4 !py-2 !text-xs">
                                Send & Resolve
                        </NeonButton>
                    </GlassCard>
                </div>
            </div>
            
            <NotificationOverlay 
                show={showNotify} 
                onClose={() => setShowNotify(false)} 
                recipient={claim.userId || 'Passenger'} 
            />
            
             <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-[10px] text-white/30 p-1 text-center font-mono pointer-events-none">
                DEBUG: User={user ? 'AUTH' : 'NULL'} | ID={id} | AppID={appId}
            </div>
        </div>
    );
};

export default ClaimDetail;
