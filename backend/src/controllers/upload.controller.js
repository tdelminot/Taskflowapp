const upload = require('../middlewares/upload.middleware');
const imageService = require('../services/image.service');
const fileService = require('../services/file.service');

class UploadController {
    // Upload single image (profile avatar, task attachment)
    async uploadImage(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            // Process image (optimize, convert to webp)
            const optimizedPath = await imageService.processImage(req.file.path, {
                width: 800,
                quality: 80,
                format: 'webp'
            });
            
            // Create thumbnail
            const thumbnailPath = await imageService.createThumbnail(optimizedPath, 150);
            
            // Save metadata
            const fileData = await fileService.saveFileMetadata(
                { ...req.file, path: optimizedPath },
                req.userId,
                'image'
            );
            
            res.status(201).json({
                message: 'Image uploaded successfully',
                file: {
                    originalName: req.file.originalname,
                    url: `/uploads/${path.basename(optimizedPath)}`,
                    thumbnailUrl: `/uploads/${path.basename(thumbnailPath)}`,
                    size: fileService.getReadableSize(req.file.size)
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    // Upload multiple images
    async uploadMultipleImages(req, res, next) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            
            const results = [];
            
            for (const file of req.files) {
                const optimizedPath = await imageService.processImage(file.path);
                const thumbnailPath = await imageService.createThumbnail(optimizedPath);
                
                results.push({
                    originalName: file.originalname,
                    url: `/uploads/${path.basename(optimizedPath)}`,
                    thumbnailUrl: `/uploads/${path.basename(thumbnailPath)}`,
                    size: fileService.getReadableSize(file.size)
                });
            }
            
            res.status(201).json({
                message: `${results.length} images uploaded successfully`,
                files: results
            });
        } catch (error) {
            next(error);
        }
    }
    
    // Upload task attachment (any allowed file)
    async uploadAttachment(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            const fileData = await fileService.saveFileMetadata(req.file, req.userId, 'attachment');
            
            res.status(201).json({
                message: 'File uploaded successfully',
                file: {
                    originalName: req.file.originalname,
                    url: `/uploads/${req.file.filename}`,
                    size: fileService.getReadableSize(req.file.size),
                    type: req.file.mimetype
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UploadController();