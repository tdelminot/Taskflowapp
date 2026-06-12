import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FileUpload({ onUploadSuccess, multiple = false, maxFiles = 5, accept = 'image/*' }) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);

    const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            toast.error(`Files rejected: ${rejectedFiles.map(f => f.file.name).join(', ')}`);
            return;
        }

        if (acceptedFiles.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Create previews
        const newPreviews = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            uploading: true
        }));
        setPreviews(prev => [...prev, ...newPreviews]);

        // Upload files
        setUploading(true);
        
        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append(multiple ? 'images' : 'image', file);
        });

        const endpoint = multiple ? '/upload/images' : '/upload/image';

        try {
            const response = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const uploadedFiles = response.data.files || [response.data.file];
            setPreviews(prev => prev.filter(p => !acceptedFiles.includes(p.file)));
            toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
            
            if (onUploadSuccess) {
                onUploadSuccess(uploadedFiles);
            }
        } catch (error) {
            toast.error('Upload failed');
            setPreviews(prev => prev.filter(p => !acceptedFiles.includes(p.file)));
        } finally {
            setUploading(false);
        }
    }, [multiple, maxFiles, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple,
        maxFiles
    });

    const removePreview = (index) => {
        URL.revokeObjectURL(previews[index].preview);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #cbd5e0',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0f5ff' : '#fafafa',
                    transition: 'all 0.2s'
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here...</p>
                ) : (
                    <div>
                        <p style={{ margin: 0, fontSize: '2rem' }}>📁</p>
                        <p style={{ margin: '0.5rem 0 0', color: '#718096' }}>
                            Drag & drop images here, or click to select
                        </p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#a0aec0' }}>
                            Max {maxFiles} files, JPG/PNG/GIF/WebP up to 5MB each
                        </p>
                    </div>
                )}
            </div>

            {previews.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Uploading...</h4>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {previews.map((preview, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '80px' }}>
                                <img
                                    src={preview.preview}
                                    alt="Preview"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}
                                />
                                {preview.uploading && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div className="loading" style={{ width: '20px', height: '20px' }} />
                                    </div>
                                )}
                                <button
                                    onClick={() => removePreview(idx)}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {uploading && (
                <div style={{ textAlign: 'center', marginTop: '1rem', color: '#667eea' }}>
                    Uploading...
                </div>
            )}
        </div>
    );
}