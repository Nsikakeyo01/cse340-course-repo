import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
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

export {
    showCategoriesPage,
    showCategoryDetailsPage
};