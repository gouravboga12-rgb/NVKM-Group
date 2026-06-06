const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const { readData, writeData } = require('../utils/mockDb');

// @route   POST /api/contacts
// @desc    Submit a new contact message
// @access  Public
router.post('/', async (req, res) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (Name, Phone, and Message).' });
  }

  // --- MOCK FALLBACK MODE ---
  if (!supabase.isConfigured) {
    const contacts = readData('contacts.json');
    const newContact = {
      id: 'contact-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').toLowerCase().trim(),
      subject: subject || 'General Inquiry',
      message: message.trim(),
      created_at: new Date().toISOString()
    };

    contacts.unshift(newContact);
    writeData('contacts.json', contacts);

    // Also write to activity logs for admin dashboard tracker
    const logs = readData('activity_logs.json');
    logs.unshift({
      id: 'log-' + Date.now(),
      action: 'Contact Submitted',
      details: `New message from ${newContact.name} regarding "${newContact.subject}"`,
      performed_by: 'Customer / Visitor',
      created_at: new Date().toISOString()
    });
    writeData('activity_logs.json', logs);

    return res.status(201).json({ message: 'Thank you for contacting NVKM GROUP! We will respond within 24 hours.' });
  }

  // --- SUPABASE MODE ---
  try {
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: (email || '').toLowerCase().trim(),
        subject: subject || 'General Inquiry',
        message: message.trim()
      })
      .select()
      .single();

    if (error) throw error;

    // Log the event in activity logs
    await supabase.from('activity_logs').insert({
      action: 'Contact Submitted',
      details: `New message from ${contact.name} regarding "${contact.subject}"`,
      performed_by: 'Customer / Visitor'
    });

    res.status(201).json({ message: 'Thank you for contacting NVKM GROUP! We will respond within 24 hours.' });
  } catch (error) {
    console.error('Contact submission error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
