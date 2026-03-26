import { Router, type Request, type Response } from 'express';
import { sendGroupMessage, listGroups, getConnectionStatus } from './whatsapp';

const router = Router();

// GET /status - WhatsApp connection status
router.get('/status', (_req: Request, res: Response) => {
  res.json({ connected: getConnectionStatus() });
});

// GET /groups - List all groups the account is in
router.get('/groups', async (_req: Request, res: Response) => {
  try {
    const groups = await listGroups();
    res.json({ groups });
  } catch (err) {
    res.status(503).json({ error: (err as Error).message });
  }
});

// POST /send - Send a message to a group
// Body: { groupId: string, message: string }
router.post('/send', async (req: Request, res: Response) => {
  const { groupId, message } = req.body as { groupId?: string; message?: string };

  if (!groupId || !message) {
    res.status(400).json({ error: 'groupId and message are required' });
    return;
  }

  try {
    await sendGroupMessage(groupId, message);
    res.json({ success: true, groupId, message });
  } catch (err) {
    res.status(503).json({ error: (err as Error).message });
  }
});

export default router;