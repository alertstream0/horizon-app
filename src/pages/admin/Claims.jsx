import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { MoreHorizontal, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { db, appId } from '../../services/firebase';
import { updateTicketStatus, updateTicketPriority } from '../../services/admin';
import { useApp } from '../../context/AppContext';

const Claims = () => {
    const { user } = useApp();
    const navigate = useNavigate();
    const [claims, setClaims] = useState([]);
    
    useEffect(() => {
        if(!user) return;
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            setClaims(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        });
        return () => unsub();
    }, [user]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">DATA LOGS</h2>
            </div>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-sm text-left text-white/70">
                    <thead className="bg-white/5 text-white/40 font-mono uppercase text-xs">
                        <tr>
                            <th className="p-4">Ref</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Loc</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {claims.map((claim) => (
                            <tr 
                                key={claim.id} 
                                onClick={() => navigate(`/admin/claims/${claim.id}`)}
                                className="hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                <td className="p-4 font-mono text-cyan-400">{claim.refId}</td>
                                <td className="p-4 capitalize">{claim.type}</td>
                                <td className="p-4">{claim.location}</td>
                                <td className="p-4">
                                   <select 
                                      value={claim.priority}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => updateTicketPriority(claim.id, e.target.value)}
                                      className={`bg-transparent border-none outline-none cursor-pointer uppercase font-bold text-[10px] tracking-wider ${claim.priority === 'high' ? 'text-red-400' : 'text-blue-400'}`}
                                   >
                                      <option value="low" className="bg-slate-900 text-slate-100">Low</option>
                                      <option value="medium" className="bg-slate-900 text-slate-100">Medium</option>
                                      <option value="high" className="bg-slate-900 text-slate-100">High</option>
                                   </select>
                                </td>
                                <td className="p-4">
                                     <select 
                                      value={claim.status}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => updateTicketStatus(claim.id, e.target.value)}
                                      className={`bg-transparent border-none outline-none cursor-pointer uppercase font-bold text-[10px] tracking-wider ${claim.status === 'new' ? 'text-cyan-400' : claim.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'}`}
                                   >
                                      <option value="new" className="bg-slate-900 text-slate-100">New</option>
                                      <option value="in_progress" className="bg-slate-900 text-slate-100">In Progress</option>
                                      <option value="resolved" className="bg-slate-900 text-slate-100">Resolved</option>
                                   </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Claims;
