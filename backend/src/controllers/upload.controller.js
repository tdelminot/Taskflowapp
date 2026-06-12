const upload = require('../middlewares/upload.middleware');
const imageService = require('../services/image.service');
const fileService = require('../services/file.service');
const path = require('path');
class UploadController {
    // Upload single image (profile avatar, task attachment)
   // Modifier uploadImage pour accepter un taskId optionnel
async uploadImage(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const optimizedPath = await imageService.processImage(req.file.path, {
            width: 800,
            quality: 80,
            format: 'webp'
        });
        
        const thumbnailPath = await imageService.createThumbnail(optimizedPath, 150);
        
        // Save with optional task association
        const fileData = {
            ...req.file,
            path: optimizedPath,
            user_id: req.userId,
            type: 'image'
        };
        
        if (req.body.taskId) {
            fileData.task_id = req.body.taskId;
        }
        
        const savedFile = await fileService.saveFileMetadata(fileData, req.userId);
        
        res.status(201).json({
            message: 'Image uploaded successfully',
            file: {
                id: savedFile.id,
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

async uploadTaskImage(req, res, next) {
    try {
        const { taskId } = req.params;
        
        // Verify task exists and user has access
        const task = await taskRepository.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const project = await projectRepository.findById(task.project_id);
        if (!project || project.owner_id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const optimizedPath = await imageService.processImage(req.file.path, {
            width: 800,
            quality: 80,
            format: 'webp'
        });
        
        const thumbnailPath = await imageService.createThumbnail(optimizedPath, 150);
        
        const media = await MediaRepository.create({
            id: uuidv4(),
            original_name: req.file.originalname,
            filename: req.file.filename,
            path: optimizedPath,
            mime_type: req.file.mimetype,
            size: req.file.size,
            user_id: req.userId,
            task_id: taskId,
            type: 'image'
        });
        
        res.status(201).json({
            message: 'Image uploaded successfully',
            file: media
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