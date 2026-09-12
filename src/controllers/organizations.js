import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId
} from '../models/organizations.js';

const showOrganizationsPage = async (req, res) => {
    try {
        const title = 'Our Partner Organizations';
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title,
            organizations
        });
    } catch (error) {
        console.error('Error loading organizations:', error);
        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;

        const organization = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);

        if (!organization) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        res.render('organization', {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        console.error('Error loading organization details:', error);
        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};