/* ============================================================================
 *  "WHENEVER YOU NEED ME" — the message library.
 *  ✎ These are placeholders written to sound like a person, not a card.
 *  Rewrite them in your own voice. Add as many as you like.
 *  Every message needs a unique, never-changing `id` (favourites use it).
 * ========================================================================== */

export const CATEGORIES = [
  { id: 'miss', label: 'When you miss me' },
  { id: 'sad', label: 'When you’re sad' },
  { id: 'hard', label: 'After a hard day' },
  { id: 'sleep', label: 'When you can’t sleep' },
  { id: 'smile', label: 'When you need a smile' },
  { id: 'beautiful', label: 'When you feel beautiful' },
  { id: 'brave', label: 'When you need courage' },
  { id: 'love', label: 'Just because' },
];

export const MESSAGES = [
  // When you miss me
  { id: 'm1', category: 'miss', text: 'I miss you too. I promise it’s mutual, and I promise it’s temporary.' },
  { id: 'm2', category: 'miss', text: 'Close your eyes and picture my stupid face making that noise you hate. There. I’m with you.' },
  { id: 'm3', category: 'miss', text: 'Somewhere right now I’m probably looking at something and thinking “she’d love this.”' },
  { id: 'm4', category: 'miss', text: 'Call me. Even if it’s late. Especially if it’s late.' },

  // When you're sad
  { id: 's1', category: 'sad', text: 'You don’t have to be okay right now. You just have to let me sit with you.' },
  { id: 's2', category: 'sad', text: 'Cry if you need to. Then drink some water. Then text me. In that order.' },
  { id: 's3', category: 'sad', text: 'This feeling is real, and it is also not the end of the story. I’ve read ahead. It gets better.' },
  { id: 's4', category: 'sad', text: 'I would take this one for you if I could. Since I can’t, I’ll just hold your hand through it.' },

  // After a hard day
  { id: 'h1', category: 'hard', text: 'Today is almost over. You did it, even the parts you think you didn’t do well.' },
  { id: 'h2', category: 'hard', text: 'Shoes off. Something warm. Phone face down — except for me.' },
  { id: 'h3', category: 'hard', text: 'Whoever made your day hard doesn’t get to have your evening too.' },
  { id: 'h4', category: 'hard', text: 'Tell me everything. I’m on your side before you even start.' },

  // When you can't sleep
  { id: 'n1', category: 'sleep', text: 'Count my bad jokes instead of sheep. You’ll be asleep by the fourth.' },
  { id: 'n2', category: 'sleep', text: 'Nothing needs solving tonight. Tomorrow-you will handle it. She’s very capable.' },
  { id: 'n3', category: 'sleep', text: 'Breathe slowly and imagine I’m stealing the covers. Familiar, right? Sleep now.' },
  { id: 'n4', category: 'sleep', text: 'If you’re awake, I hope I’m in the thought that’s keeping you up. Goodnight, love.' },

  // When you need a smile
  { id: 'q1', category: 'smile', text: 'Reminder: you once laughed so hard you snorted, and it’s still my favourite sound.' },
  { id: 'q2', category: 'smile', text: 'Somewhere a dog is wearing a tiny Christmas jumper. You’re welcome.' },
  { id: 'q3', category: 'smile', text: 'I just want you to know I think about your dance moves more than is healthy.' },
  { id: 'q4', category: 'smile', text: 'You are the reason I check my phone and grin like an idiot in public.' },

  // When you feel beautiful
  { id: 'b1', category: 'beautiful', text: 'You are. Go look. I’ll wait.' },
  { id: 'b2', category: 'beautiful', text: 'Feeling beautiful looks good on you. It always has, you just finally noticed.' },
  { id: 'b3', category: 'beautiful', text: 'Take a picture. Send it to me. That’s not a request.' },

  // When you need courage
  { id: 'c1', category: 'brave', text: 'You’ve done harder things than this. I watched you do them.' },
  { id: 'c2', category: 'brave', text: 'Scared and brave can happen at the same time. You’re very good at both.' },
  { id: 'c3', category: 'brave', text: 'Go do the thing. Then come home and tell me about it.' },
  { id: 'c4', category: 'brave', text: 'Whatever happens, you still come home to someone who thinks you’re extraordinary.' },

  // Just because
  { id: 'l1', category: 'love', text: 'No reason. I just love you, and it felt important to say so on a random Tuesday.' },
  { id: 'l2', category: 'love', text: 'Of all the people I could be sitting next to, I always pick you.' },
  { id: 'l3', category: 'love', text: 'You feel like home, which is strange, because I’ve never been anywhere this nice.' },
  { id: 'l4', category: 'love', text: 'I’m grateful for you in a quiet, everyday, every-single-day way.' },
  { id: 'l5', category: 'love', text: 'This button will work long after December. So will I.' },
];
