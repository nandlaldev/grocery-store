import { validationResult } from 'express-validator';
import Ticket from '../models/Ticket.js';

export async function createTicket(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]?.msg || 'Invalid input' });
    }

    const ticket = await Ticket.create({
      user: req.userId || null,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone || '',
      subject: req.body.subject,
      message: req.body.message,
    });

    return res.status(201).json({
      id: ticket._id,
      status: ticket.status,
      createdAt: ticket.createdAt,
      message: 'Ticket raised successfully',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to raise ticket' });
  }
}
