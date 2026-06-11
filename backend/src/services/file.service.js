const fs = require('fs-extra');
const path = require('path');
const imageService = require('./image.service');

class FileService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    }
    
    // Save file metadata to database (call from controller)
    async saveFileMetadata(file, userId, type = 'generic') {
        const fileData = {
            id: require('uuid').v4(),
            original_name: file.originalname,
            filename: file.filename,
            path: file.path,
            mime_type: file.mimetype,
            size: file.size,
            user_id: userId,
            type: type
        };
        
        // Get image dimensions if it's an image
        if (file.mimetype.startsWith('image/')) {
            try {
                const metadata = await imageService.getImageMetadata(file.path);
                fileData.width = metadata.width;
                fileData.height = metadata.height;
            } catch (err) {
                console.error('Failed to get image metadata:', err);
            }
        }
        
        // TODO: Save to database using Media model
        // const media = await MediaRepository.create(fileData);
        
        return fileData;
    }
    
    // Delete file from disk
    async deleteFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                await fs.unlink(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    
    // Get file size in readable format
    getReadableSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Check if file exists
    async fileExists(filePath) {
        return fs.existsSync(filePath);
    }
    
    // Move file to another location
    async moveFile(oldPath, newPath) {
        await fs.move(oldPath, newPath, { overwrite: true });
        return newPath;
    }
}

module.exports = new FileService();