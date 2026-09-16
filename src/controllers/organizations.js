import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
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

const showNewOrganization = (req, res) => {
    res.render('new-organization', {
        title: 'Create New Organization'
    });
};

const createOrganizationController = async (req, res) => {
    try {
        let {
            name,
            description,
            contact_email,
            logo_filename
        } = req.body;

        name = name ? name.trim() : '';
        description = description ? description.trim() : '';
        contact_email = contact_email ? contact_email.trim() : '';
        logo_filename = logo_filename ? logo_filename.trim() : '';

        if (!name) {
            return res.status(400).render('new-organization', {
                title: 'Create New Organization',
                error: 'Organization name is required.',
                name,
                description,
                contact_email,
                logo_filename
            });
        }

        if (name.length < 3) {
            return res.status(400).render('new-organization', {
                title: 'Create New Organization',
                error: 'Organization name must be at least 3 characters long.',
                name,
                description,
                contact_email,
                logo_filename
            });
        }

        if (name.length > 100) {
            return res.status(400).render('new-organization', {
                title: 'Create New Organization',
                error: 'Organization name must not exceed 100 characters.',
                name,
                description,
                contact_email,
                logo_filename
            });
        }

        await createOrganization(
            name,
            description,
            contact_email,
            logo_filename
        );

        req.flash('notice', 'Organization created successfully.');

        res.redirect('/organizations');
    } catch (error) {
        console.error('Error creating organization:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const showEditOrganization = async (req, res) => {
    try {
        const organizationId = req.params.id;

        const organization = await getOrganizationDetails(organizationId);

        if (!organization) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        res.render('edit-organization', {
            title: 'Edit Organization',
            organization: {
                organization_id: organization.organization_id,
                name: organization.name || '',
                description: organization.description || '',
                contact_email: organization.contact_email || '',
                logo_filename: organization.logo_filename || ''
            }
        });
    } catch (error) {
        console.error('Error loading edit organization page:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const editOrganizationController = async (req, res) => {
    try {
        const organizationId = req.params.id;

        let {
            name,
            description,
            contact_email,
            logo_filename
        } = req.body;

        name = name ? name.trim() : '';
        description = description ? description.trim() : '';
        contact_email = contact_email ? contact_email.trim() : '';
        logo_filename = logo_filename ? logo_filename.trim() : '';

        if (!name) {
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                error: 'Organization name is required.',
                organization: {
                    organization_id: organizationId,
                    name,
                    description,
                    contact_email,
                    logo_filename
                }
            });
        }

        if (name.length < 3) {
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                error: 'Organization name must be at least 3 characters long.',
                organization: {
                    organization_id: organizationId,
                    name,
                    description,
                    contact_email,
                    logo_filename
                }
            });
        }

        if (name.length > 100) {
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                error: 'Organization name must not exceed 100 characters.',
                organization: {
                    organization_id: organizationId,
                    name,
                    description,
                    contact_email,
                    logo_filename
                }
            });
        }

        const updatedOrganization = await updateOrganization(
            organizationId,
            name,
            description,
            contact_email,
            logo_filename
        );

        if (!updatedOrganization) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        req.flash('notice', 'Organization updated successfully.');

        res.redirect('/organizations');
    } catch (error) {
        console.error('Error updating organization:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganization,
    createOrganizationController,
    showEditOrganization,
    editOrganizationController
};