import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../Common/Loading';
import toast from 'react-hot-toast';

export default function CommentList({ taskId, onUpdate }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/tasks/${taskId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to load comments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        setDeleting(commentId);
        try {
            await api.delete(`/comments/${commentId}`);
            toast.success('Comment deleted');
            fetchComments();
            onUpdate();
        } catch (error) {
            toast.error('Failed to delete comment');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <Loading />;

    if (comments.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#718096', fontSize: '0.85rem' }}>
                No comments yet. Be the first to comment!
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            {comments.map(comment => (
                <div key={comment.id} style={{
                    background: '#f8f9fa',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <strong style={{ fontSize: '0.85rem' }}>
                                {comment.author?.username || 'Unknown'}
                            </strong>
                            <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{comment.content}</p>
                            <span style={{ fontSize: '0.7rem', color: '#718096' }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={deleting === comment.id}
                            className="btn-danger"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}