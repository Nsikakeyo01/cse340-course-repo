import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    try {
        const title = 'Service Project Categories';
        const categories = await getAllCategories();

        res.render('categories', {
            title,
            categories
        });
    } catch (error) {
        console.error('Error loading categories:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryDetails(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);

        if (!category) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error('Error loading category details:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const showNewCategory = (req, res) => {
    res.render('new-category', {
        title: 'Create New Category'
    });
};

const createCategoryController = async (req, res) => {
    try {
        let { name } = req.body;

        name = name ? name.trim() : '';

        // Required validation
        if (!name) {
            return res.status(400).render('new-category', {
                title: 'Create New Category',
                error: 'Category name is required.',
                name
            });
        }

        // Minimum length validation
        if (name.length < 3) {
            return res.status(400).render('new-category', {
                title: 'Create New Category',
                error: 'Category name must be at least 3 characters long.',
                name
            });
        }

        // Maximum length validation
        if (name.length > 100) {
            return res.status(400).render('new-category', {
                title: 'Create New Category',
                error: 'Category name must not exceed 100 characters.',
                name
            });
        }

        await createCategory(name);

        req.flash('notice', 'Category created successfully.');

        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const showEditCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryDetails(categoryId);

        if (!category) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        res.render('edit-category', {
            title: 'Edit Category',
            category
        });
    } catch (error) {
        console.error('Error loading edit category page:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const editCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id;

        let { name } = req.body;

        name = name ? name.trim() : '';

        // Required validation
        if (!name) {
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                error: 'Category name is required.',
                category: {
                    category_id: categoryId,
                    name
                }
            });
        }

        // Minimum length validation
        if (name.length < 3) {
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                error: 'Category name must be at least 3 characters long.',
                category: {
                    category_id: categoryId,
                    name
                }
            });
        }

        // Maximum length validation
        if (name.length > 100) {
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                error: 'Category name must not exceed 100 characters.',
                category: {
                    category_id: categoryId,
                    name
                }
            });
        }

        const updatedCategory = await updateCategory(categoryId, name);

        if (!updatedCategory) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        req.flash('notice', 'Category updated successfully.');

        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategory,
    createCategoryController,
    showEditCategory,
    editCategoryController
};