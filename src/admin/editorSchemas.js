/* ============================================================================
 *  EDITOR SCHEMAS — what the admin content editor shows for each day.
 *
 *  A field is { path, label, kind, ... } where `path` points into the day
 *  object (e.g. 'content.headline'). Kinds:
 *    text · url · path (file path, '' → null) · textarea (string)
 *    paragraphs (string[] split on blank lines) · lines (string[] one per line)
 *    select (options) · toggle · index (0-based number shown 1-based)
 *    list (array of objects: itemFields, idPrefix → auto ids for new items)
 *  `when(day)` hides a field unless it applies.
 *  To support a new field, add it here — no component changes needed.
 * ========================================================================== */

export const TYPE_LABELS = {
  letter: 'Letter',
  photo: 'Photo memory',
  video: 'Video',
  song: 'Song / playlist',
  gift: 'Physical gift reveal',
  coupon: 'Coupon',
  date: 'Date invitation',
  game: 'Mini-game',
  secret: 'Secret message',
  dream: 'Future dream',
  reasons: 'Love reasons',
  finale: 'Christmas finale',
};

const photoItem = [
  { path: 'caption', label: 'Caption', kind: 'text' },
  { path: 'src', label: 'Image file', kind: 'path', hint: 'e.g. /photos/day-04.jpg — leave empty for the placeholder frame' },
  { path: 'date', label: 'Date label', kind: 'text' },
  { path: 'alt', label: 'Description for screen readers', kind: 'text' },
];

/* ---------------- Tab: Gift ---------------- */
export const GIFT_TAB = [
  {
    title: 'Calendar tile & header',
    fields: [
      { path: 'title', label: 'Title', kind: 'text', required: true },
      { path: 'subtitle', label: 'Subtitle', kind: 'text' },
      { path: 'teaser', label: 'Teaser (shown on Home before opening)', kind: 'text' },
    ],
  },
  {
    title: 'Physical gift(s)',
    hint: 'Two or more gifts on a gift-reveal day are listed together once unwrapped.',
    fields: [
      {
        path: 'gifts',
        label: 'Gifts behind this door',
        kind: 'list',
        idPrefix: 'gift',
        addLabel: 'Add a gift',
        itemFields: [
          { path: 'name', label: 'Gift name', kind: 'text' },
          { path: 'brand', label: 'Brand (optional)', kind: 'text' },
          { path: 'note', label: 'Private note (admin only)', kind: 'text' },
        ],
      },
    ],
  },
  {
    title: 'How she unwraps it',
    when: (d) => d.type === 'gift',
    fields: [
      { path: 'content.reveal', label: 'Reveal interaction', kind: 'select', options: [['unwrap', 'Tap to unwrap'], ['scratch', 'Scratch card'], ['findHeart', 'Find the hidden heart']] },
      { path: 'content.headline', label: 'Headline', kind: 'text' },
      { path: 'content.message', label: 'Gift description', kind: 'paragraphs' },
      { path: 'content.clue', label: 'Where to find it', kind: 'text' },
      { path: 'content.image.src', label: 'Hint photo (optional)', kind: 'path' },
      { path: 'content.image.caption', label: 'Hint photo caption', kind: 'text' },
    ],
  },
];

/* ---------------- Tab: Surprise (type-specific digital surprise) ---------------- */
export const SURPRISE_TAB = {
  letter: [
    {
      title: 'Letter',
      fields: [
        { path: 'content.variant', label: 'Style', kind: 'select', options: [['letter', 'Letter'], ['note', 'Small note'], ['comfort', 'Comfort letter'], ['eve', 'Long-form, gilded']] },
        { path: 'content.dateLine', label: 'Date line (optional)', kind: 'text' },
        { path: 'content.greeting', label: 'Greeting', kind: 'text' },
        { path: 'content.body', label: 'Letter', kind: 'paragraphs' },
        { path: 'content.signature', label: 'Signature', kind: 'text' },
      ],
    },
    { title: 'Photos in the letter', fields: [{ path: 'content.photos', label: 'Photos', kind: 'list', addLabel: 'Add a photo', itemFields: photoItem }] },
  ],
  photo: [
    {
      title: 'Photo memory',
      fields: [
        { path: 'content.intro', label: 'Intro line', kind: 'text' },
        { path: 'content.photos', label: 'Photos', kind: 'list', addLabel: 'Add a photo', itemFields: photoItem },
        { path: 'content.story', label: 'The story', kind: 'textarea' },
      ],
    },
  ],
  video: [
    {
      title: 'Video',
      fields: [
        { path: 'content.intro', label: 'Intro line', kind: 'text' },
        { path: 'content.src', label: 'Video file', kind: 'path', hint: 'e.g. /videos/day-11.mp4' },
        { path: 'content.embed', label: 'or embed URL', kind: 'url', hint: 'e.g. https://www.youtube-nocookie.com/embed/ID' },
        { path: 'content.poster', label: 'Poster image (optional)', kind: 'path' },
        { path: 'content.caption', label: 'Caption', kind: 'text' },
        { path: 'content.fallbackText', label: 'Text shown if there is no video', kind: 'paragraphs' },
      ],
    },
  ],
  song: [
    {
      title: 'Song dedication',
      fields: [
        { path: 'content.song', label: 'Song / playlist title', kind: 'text' },
        { path: 'content.artist', label: 'Artist', kind: 'text' },
        { path: 'content.lyric', label: 'Favourite lyric', kind: 'text' },
        { path: 'content.why', label: 'Why this song', kind: 'paragraphs' },
        { path: 'content.link', label: 'Song link', kind: 'url' },
        { path: 'content.linkLabel', label: 'Link button label', kind: 'text' },
        { path: 'content.embed', label: 'Player embed URL (optional)', kind: 'url' },
        { path: 'content.tracks', label: 'Playlist tracks', kind: 'list', addLabel: 'Add a track', itemFields: [
          { path: 'title', label: 'Title', kind: 'text' },
          { path: 'artist', label: 'Artist', kind: 'text' },
          { path: 'note', label: 'Note', kind: 'text' },
        ] },
      ],
    },
  ],
  gift: [
    {
      title: 'The surprise is the gift itself',
      hint: 'Edit the headline, description and hiding place in the Gift tab. Add a note, song or poem in Extras.',
      fields: [],
    },
  ],
  coupon: [
    {
      title: 'Coupon / date details',
      fields: [
        { path: 'content.intro', label: 'Intro', kind: 'textarea' },
        { path: 'content.choose', label: 'She chooses one of several', kind: 'toggle' },
        { path: 'content.coupons', label: 'Coupons', kind: 'list', idPrefix: 'coupon', addLabel: 'Add a coupon', itemFields: [
          { path: 'title', label: 'Title', kind: 'text' },
          { path: 'description', label: 'Description', kind: 'textarea' },
          { path: 'terms', label: 'Terms', kind: 'text' },
          { path: 'expires', label: 'Expires', kind: 'text' },
        ] },
      ],
    },
  ],
  date: [
    {
      title: 'Date invitation',
      fields: [
        { path: 'content.invitation', label: 'Opening line', kind: 'text' },
        { path: 'content.event', label: 'Event', kind: 'text' },
        { path: 'content.when', label: 'When', kind: 'text' },
        { path: 'content.where', label: 'Where', kind: 'text' },
        { path: 'content.wear', label: 'Wear', kind: 'text' },
        { path: 'content.bring', label: 'Bring', kind: 'text' },
        { path: 'content.note', label: 'Handwritten note', kind: 'textarea' },
        { path: 'content.rsvp', label: 'RSVP button', kind: 'text' },
      ],
    },
  ],
  game: [
    {
      title: 'Interactive activity',
      fields: [
        { path: 'content.game', label: 'Game', kind: 'select', options: [['quiz', 'Quiz'], ['challenge', 'Photo challenge checklist']] },
        { path: 'content.intro', label: 'Intro', kind: 'textarea' },
        { path: 'content.questions', label: 'Questions', kind: 'list', addLabel: 'Add a question', when: (d) => d.content?.game !== 'challenge', itemFields: [
          { path: 'q', label: 'Question', kind: 'text' },
          { path: 'options', label: 'Answers (one per line)', kind: 'lines' },
          { path: 'answer', label: 'Correct answer number', kind: 'index' },
          { path: 'note', label: 'Note after answering', kind: 'text' },
        ] },
        { path: 'content.result', label: 'Result message', kind: 'text', when: (d) => d.content?.game !== 'challenge' },
        { path: 'content.steps', label: 'Challenge steps (one per line)', kind: 'lines', when: (d) => d.content?.game === 'challenge' },
        { path: 'content.doneText', label: 'When completed', kind: 'text', when: (d) => d.content?.game === 'challenge' },
      ],
    },
  ],
  secret: [
    {
      title: 'Secret message',
      fields: [
        { path: 'content.prompt', label: 'Question / prompt', kind: 'text' },
        { path: 'content.hint', label: 'Hint', kind: 'text' },
        { path: 'content.answers', label: 'Accepted answers (one per line)', kind: 'lines' },
        { path: 'content.reveal.title', label: 'Revealed title', kind: 'text' },
        { path: 'content.reveal.body', label: 'Revealed message', kind: 'paragraphs' },
      ],
    },
  ],
  dream: [
    {
      title: 'Future dream',
      fields: [
        { path: 'content.eyebrow', label: 'Eyebrow', kind: 'text' },
        { path: 'content.place', label: 'Place / dream', kind: 'text' },
        { path: 'content.intro', label: 'Intro', kind: 'textarea' },
        { path: 'content.image.src', label: 'Image file', kind: 'path' },
        { path: 'content.image.caption', label: 'Image caption', kind: 'text' },
        { path: 'content.details', label: 'Timeline', kind: 'list', addLabel: 'Add a moment', itemFields: [
          { path: 'label', label: 'Label', kind: 'text' },
          { path: 'text', label: 'Text', kind: 'text' },
        ] },
        { path: 'content.closing', label: 'Closing line', kind: 'text' },
      ],
    },
  ],
  reasons: [
    {
      title: 'Love reasons',
      fields: [
        { path: 'content.intro', label: 'Intro', kind: 'text' },
        { path: 'content.reasons', label: 'Reasons', kind: 'list', addLabel: 'Add a reason', itemFields: [
          { path: 'title', label: 'Reason', kind: 'text' },
          { path: 'text', label: 'Why', kind: 'text' },
        ] },
        { path: 'content.closing', label: 'Closing line', kind: 'text' },
      ],
    },
  ],
  finale: [
    {
      title: 'Opening',
      fields: [
        { path: 'content.greeting', label: 'Greeting', kind: 'text' },
        { path: 'content.subGreeting', label: 'Handwritten line', kind: 'text' },
      ],
    },
    {
      title: 'Christmas letter',
      fields: [
        { path: 'content.letter.greeting', label: 'Greeting', kind: 'text' },
        { path: 'content.letter.body', label: 'Letter', kind: 'paragraphs' },
        { path: 'content.letter.signature', label: 'Signature', kind: 'text' },
      ],
    },
    { title: 'Photos', fields: [{ path: 'content.photos', label: 'Photos', kind: 'list', addLabel: 'Add a photo', itemFields: photoItem }] },
    {
      title: 'Video (optional)',
      fields: [
        { path: 'content.video.src', label: 'Video file', kind: 'path' },
        { path: 'content.video.embed', label: 'or embed URL', kind: 'url' },
        { path: 'content.video.caption', label: 'Caption', kind: 'text' },
      ],
    },
    {
      title: 'Final gift',
      fields: [
        { path: 'content.gift.headline', label: 'Headline', kind: 'text' },
        { path: 'content.gift.message', label: 'Description', kind: 'textarea' },
        { path: 'content.gift.clue', label: 'Where to find it', kind: 'text' },
      ],
    },
    { title: 'Closing', fields: [{ path: 'content.closing', label: 'Closing lines (one per line)', kind: 'lines' }] },
  ],
};

/* ---------------- Tab: Extras (optional on any day) ---------------- */
export const EXTRAS_TAB = [
  {
    title: 'Personal message',
    fields: [
      { path: 'extras.message.title', label: 'Title', kind: 'text', placeholder: 'A little note' },
      { path: 'extras.message.text', label: 'Message', kind: 'textarea' },
      { path: 'extras.message.signature', label: 'Signature', kind: 'text' },
    ],
  },
  {
    title: 'Song dedication',
    fields: [
      { path: 'extras.song.title', label: 'Song', kind: 'text' },
      { path: 'extras.song.artist', label: 'Artist', kind: 'text' },
      { path: 'extras.song.dedication', label: 'Dedication', kind: 'textarea' },
      { path: 'extras.song.link', label: 'Song link', kind: 'url' },
    ],
  },
  {
    title: 'Poem',
    fields: [
      { path: 'extras.poem.title', label: 'Title', kind: 'text' },
      { path: 'extras.poem.text', label: 'Poem (line breaks are kept)', kind: 'textarea', rows: 8 },
    ],
  },
  {
    title: 'Love reasons',
    fields: [{ path: 'extras.reasons', label: 'Reasons', kind: 'list', addLabel: 'Add a reason', itemFields: [
      { path: 'title', label: 'Reason', kind: 'text' },
      { path: 'text', label: 'Why', kind: 'text' },
    ] }],
  },
  {
    title: 'Memory',
    fields: [
      { path: 'extras.memory.text', label: 'The memory', kind: 'textarea' },
      { path: 'extras.memory.photo', label: 'Photo file (optional)', kind: 'path' },
      { path: 'extras.memory.caption', label: 'Photo caption', kind: 'text' },
    ],
  },
  {
    title: 'Interactive activity',
    fields: [
      { path: 'extras.activity.title', label: 'Title', kind: 'text', placeholder: 'Something to do together' },
      { path: 'extras.activity.text', label: 'What to do', kind: 'textarea' },
    ],
  },
];

/* ---------------- Tab: Animation ---------------- */
export const ANIMATION_TAB = [
  {
    title: 'Special animation settings',
    hint: 'If her phone asks for reduced motion, opening ceremonies are always skipped.',
    fields: [
      { path: 'special', label: 'Gold “special” tile on the calendar', kind: 'toggle' },
      { path: 'animation.opening', label: 'Opening ceremony', kind: 'select', options: [['', 'Automatic (grand when special)'], ['standard', 'Standard gift box'], ['grand', 'Grand — longer, brighter'], ['none', 'None — open straight away']] },
    ],
  },
];

/* ---------------- Templates used when changing a day's type ---------------- */
export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function templateFor(type, defaultFinale) {
  switch (type) {
    case 'letter': return { greeting: 'My love,', body: [''], signature: '' };
    case 'photo': return { intro: '', photos: [{ src: null, alt: '', caption: '', date: '' }], story: '' };
    case 'video': return { intro: '', src: null, embed: null, caption: '', fallbackText: [''] };
    case 'song': return { song: '', artist: '', why: [''], link: null, linkLabel: 'Listen' };
    case 'gift': return { reveal: 'unwrap', headline: '', message: [''], clue: '' };
    case 'coupon': return { intro: '', coupons: [{ id: newId('coupon'), title: '', description: '' }] };
    case 'date': return { invitation: 'You are invited to', event: '', when: '', where: '', note: '', rsvp: 'I’ll be there' };
    case 'game': return { game: 'quiz', intro: '', questions: [{ q: '', options: ['', ''], answer: 0 }], result: '' };
    case 'secret': return { prompt: '', hint: '', answers: [''], reveal: { title: '', body: [''] } };
    case 'dream': return { eyebrow: 'One day, you and I', place: '', intro: '', details: [], closing: '' };
    case 'reasons': return { intro: '', reasons: [{ title: '', text: '' }], closing: '' };
    case 'finale': return structuredClone(defaultFinale);
    default: return {};
  }
}

/* ---------------- Path helpers ---------------- */
export function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : next && typeof next === 'object' ? { ...next } : {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

/* ---------------- Save-time normalisation & validation ---------------- */
const isBlank = (v) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

/** Removes empty extras/animation so untouched sections don't render. */
export function normalizeDay(day) {
  const d = structuredClone(day);
  if (d.extras) {
    for (const [k, v] of Object.entries(d.extras)) {
      if (Array.isArray(v)) {
        const items = v.filter((it) => it && Object.values(it).some((x) => !isBlank(x)));
        if (items.length) d.extras[k] = items;
        else delete d.extras[k];
      } else if (v && typeof v === 'object') {
        const kept = Object.fromEntries(Object.entries(v).filter(([, x]) => !isBlank(x)));
        if (Object.keys(kept).length) d.extras[k] = kept;
        else delete d.extras[k];
      } else if (isBlank(v)) delete d.extras[k];
    }
    if (isBlank(d.extras)) delete d.extras;
  }
  if (d.animation && !d.animation.opening) delete d.animation;
  if (Array.isArray(d.gifts)) d.gifts = d.gifts.filter((g) => g && !isBlank(g.name));
  return d;
}

export function validateDay(d, knownTypes) {
  const errors = [];
  if (!d.title || !String(d.title).trim()) errors.push('The day needs a title.');
  if (!knownTypes.includes(d.type)) errors.push(`Unknown content type “${d.type}”.`);
  if (!d.content || typeof d.content !== 'object' || Array.isArray(d.content)) errors.push('Content is missing.');
  const c = d.content || {};
  if (d.type === 'coupon') {
    if (!Array.isArray(c.coupons) || !c.coupons.length) errors.push('Add at least one coupon.');
    else if (c.coupons.some((x) => !x.id || !String(x.title || '').trim())) errors.push('Every coupon needs a title.');
  }
  if (d.type === 'game' && c.game !== 'challenge') {
    (c.questions || []).forEach((q, i) => {
      if (!Array.isArray(q.options) || q.options.filter((o) => String(o).trim()).length < 2) errors.push(`Question ${i + 1} needs at least two answers.`);
      else if (!(q.answer >= 0 && q.answer < q.options.length)) errors.push(`Question ${i + 1}: the correct answer number is out of range.`);
    });
  }
  if (d.type === 'secret' && !(c.answers || []).some((a) => String(a).trim())) errors.push('The secret needs at least one accepted answer.');
  if (d.type === 'gift' && !['unwrap', 'scratch', 'findHeart', undefined].includes(c.reveal)) errors.push('Unknown reveal interaction.');
  return errors;
}
