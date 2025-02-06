const Work = require('../models/Work');

// Fetch all works
exports.getAllWorks = async (req, res) => {
    try {
        const works = await Work.findAll();
        res.status(200).json(works);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching works', error: error.message });
    }
};

// Fetch specific work by ID
exports.getWorkById = async (req, res) => {
    const { id } = req.params;
    try {
        const work = await Work.findByPk(id);
        if (!work) {
            return res.status(404).json({ message: 'Work not found' });
        }
        res.status(200).json(work);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching work', error: error.message });
    }
};

// Create a new work
exports.createWork = async (req, res) => {
    const { title, description, image, location, category } = req.body;
    const userId = req.user ? req.user.id : null; // Safeguard in case the userId is not attached

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required for creating work' });
    }

    // Simple validation checks
    if (!title || !description || !image || !location || !category) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new work entry
        const newWork = await Work.create({
            userId,
            title,
            description,
            image,
            location,
            category,
        });

        // Return the created work entry
        res.status(201).json(newWork);
    } catch (error) {
        if (error instanceof Error && error.message.includes('maximum of')) {
            return res.status(400).json({ message: error.message });
        }
        
        console.error('Error creating work:', error.message);
        res.status(500).json({ message: 'Error creating work', error: error.message });
    }
};

// Update specific work by ID
exports.updateWork = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, location, category } = req.body;
    const userId = req.user.id;

    try {
        const work = await Work.findByPk(id);
        if (!work) {
            return res.status(404).json({ message: 'Work not found' });
        }

        // Check if the user is the creator of the work
        if (work.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this work' });
        }

        await work.update({
            title,
            description,
            image,
            location,
            category,
        });

        res.status(200).json(work);
    } catch (error) {
        res.status(400).json({ message: 'Error updating work', error: error.message });
    }
};

// Delete a work by ID
exports.deleteWork = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const work = await Work.findByPk(id);
        if (!work) {
            return res.status(404).json({ message: 'Work not found' });
        }

        // Check if the user is the creator of the work
        if (work.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this work' });
        }

        await work.destroy();
        res.status(204).json({ message: 'Work deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting work', error: error.message });
    }
};
