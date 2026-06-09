const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ImageService {
    // Process and optimize image
    async processImage(filePath, options = {}) {
        const {
            width = 800,
            height = null,
            quality = 80,
            format = 'webp'
        } = options;
        
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);
        const outputPath = path.join(dir, `${baseName}.${format}`);
        
        let pipeline = sharp(filePath);
        
        // Resize if width specified
        if (width) {
            pipeline = pipeline.resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }
        
        // Convert format
        switch (format) {
            case 'webp':
                pipeline = pipeline.webp({ quality });
                break;
            case 'jpeg':
            case 'jpg':
                pipeline = pipeline.jpeg({ quality });
                break;
            case 'png':
                pipeline = pipeline.png({ quality });
                break;
            default:
                pipeline = pipeline.webp({ quality });
        }
        
        await pipeline.toFile(outputPath);
        
        // Remove original if different format
        if (outputPath !== filePath) {
            fs.unlinkSync(filePath);
        }
        
        return outputPath;
    }
    
    // Create thumbnail
    async createThumbnail(filePath, size = 150) {
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);
        const thumbnailPath = path.join(dir, `${baseName}_thumb${ext}`);
        
        await sharp(filePath)
            .resize(size, size, {
                fit: 'cover',
                position: 'centre'
            })
            .toFile(thumbnailPath);
        
        return thumbnailPath;
    }
    
    // Generate multiple sizes (for responsive images)
    async generateResponsiveImages(filePath) {
        const sizes = [400, 800, 1200];
        const results = [];
        
        for (const size of sizes) {
            const processed = await this.processImage(filePath, { width: size });
            const thumbnail = await this.createThumbnail(processed);
            results.push({
                size,
                path: processed,
                thumbnail
            });
        }
        
        return results;
    }
    
    // Get image metadata
    async getImageMetadata(filePath) {
        return await sharp(filePath).metadata();
    }
}

module.exports = new ImageService();