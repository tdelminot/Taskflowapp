// Base repository with common CRUD operations
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    // Find all records with optional filters
    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    // Find one record by id
    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    // Find one record by condition
    async findOne(condition, options = {}) {
        return await this.model.findOne({ where: condition, ...options });
    }

    // Create a new record
    async create(data) {
        return await this.model.create(data);
    }

    // Update a record
     async update(id, data) {
        const record = await this.findById(id);
        if (!record) return null;
        await record.update(data);
        return record;   
    }

    // Delete a record (hard delete)
    async delete(id) {
        const record = await this.findById(id);
        if (!record) return null;
        await record.destroy({ force: true });
        return true;
    }

    // Soft delete a record
    async softDelete(id) {
        const record = await this.findById(id);
        if (!record) return null;
        await record.destroy();
        return true;
    }

    // Count records
    async count(condition = {}) {
        return await this.model.count({ where: condition });
    }

    // Pagination
    async paginate({ page = 1, limit = 10, condition = {}, order = [['createdAt', 'DESC']] }) {
        const offset = (page - 1) * limit;
        const { count, rows } = await this.model.findAndCountAll({
            where: condition,
            limit,
            offset,
            order
        });
        return {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            data: rows
        };
    }
}

module.exports = BaseRepository;