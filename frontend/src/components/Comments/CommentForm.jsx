import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CommentForm({ taskId, onCommentAdded }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Please enter a comment');
            return;
        }
        
        setLoading(true);
        try {
            await api.post(`/tasks/${taskId}/comments`, { content });
            toast.success('Comment added');
            setContent('');
            onCommentAdded();
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
                <textarea
                    rows="2"
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}