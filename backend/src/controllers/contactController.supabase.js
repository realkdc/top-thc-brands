const supabase = require('../utils/supabaseClient');

/**
 * @desc    Submit a contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Create contact submission
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
          status: 'pending' // Default status
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getContactSubmissions = async (req, res) => {
  try {
    // Query all contact submissions, ordered by creation date (newest first)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get contact by ID
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
exports.getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;

    // Query contact by ID
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Contact not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update contact status
 * @route   PUT /api/contact/:id
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Update contact status
    const { data, error } = await supabase
      .from('contacts')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Contact not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete contact
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    // Delete contact
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId);

    if (error) throw error;

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: error.message });
  }
}; 