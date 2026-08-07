import { useEffect, useState } from "react";
import { MessageCircle, Trash2, Send, X } from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";

const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";
const cardBg = "#1c1916";
const border = "#2d2824";

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await adminService.getComments();
      setComments(data);
    } catch { toast.error("Failed to load questions"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const startReply = (c) => {
    setReplyingId(c.id);
    setReplyText(c.admin_reply || "");
  };

  const cancelReply = () => {
    setReplyingId(null);
    setReplyText("");
  };

  const submitReply = async (id) => {
    if (!replyText.trim()) return;
    setSaving(true);
    try {
      const { data } = await adminService.replyToComment(id, replyText.trim());
      setComments(prev => prev.map(c => c.id === id ? data : c));
      toast.success("Reply posted");
      cancelReply();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to post reply");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await adminService.deleteComment(id);
      toast.success("Deleted");
      setComments(prev => prev.filter(c => c.id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  const unanswered = comments.filter(c => !c.admin_reply).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Questions & Comments</h1>
        <p className="text-xs mt-0.5" style={{ color: creamDim }}>
          {comments.length} total {unanswered > 0 && <span style={{ color: "#f87171" }}>· {unanswered} awaiting reply</span>}
        </p>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}` }}>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: creamDim }}>Loading...</div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MessageCircle size={36} style={{ color: border }} />
            <p className="text-sm" style={{ color: creamDim }}>No questions yet</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: border }}>
            {comments.map((c) => {
              const isReplying = replyingId === c.id;
              return (
                <div key={c.id} className="p-5" style={{ borderBottom: `1px solid ${border}` }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: gold }}>{c.product_name || "Unknown product"}</p>
                      <p className="text-xs mt-0.5" style={{ color: creamDim }}>
                        {c.user_name} {c.user_email && `· ${c.user_email}`} · {fmtDate(c.created_at)}
                      </p>
                    </div>
                    {!c.admin_reply && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[10px] tracking-wider uppercase"
                        style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.4)" }}>
                        Awaiting Reply
                      </span>
                    )}
                  </div>

                  <p className="text-sm mb-3" style={{ color: cream }}>{c.message}</p>

                  {c.admin_reply && !isReplying && (
                    <div className="mb-3 ml-4 pl-4 py-2" style={{ borderLeft: `2px solid ${gold}` }}>
                      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: gold }}>Your Reply</p>
                      <p className="text-sm" style={{ color: creamDim }}>{c.admin_reply}</p>
                    </div>
                  )}

                  {isReplying ? (
                    <div className="space-y-2">
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                        rows={3} placeholder="Write a reply..."
                        className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
                        style={{ background: "#0f0d0c", border: `1px solid ${border}`, color: cream }}
                        onFocus={e => e.target.style.borderColor = gold}
                        onBlur={e => e.target.style.borderColor = border}
                        autoFocus />
                      <div className="flex items-center gap-2">
                        <button onClick={() => submitReply(c.id)} disabled={saving || !replyText.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-widest uppercase disabled:opacity-50"
                          style={{ background: gold, color: "#0c0a09" }}>
                          <Send size={12} /> {saving ? "Sending..." : "Send Reply"}
                        </button>
                        <button onClick={cancelReply}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs tracking-widest uppercase"
                          style={{ border: `1px solid ${border}`, color: creamDim }}>
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button onClick={() => startReply(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors"
                        style={{ color: "#60a5fa" }}>
                        <MessageCircle size={13} /> {c.admin_reply ? "Edit Reply" : "Reply"}
                      </button>
                      <button onClick={() => handleDelete(c.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors"
                        style={{ color: "#f87171" }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
