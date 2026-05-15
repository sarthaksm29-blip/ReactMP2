import { differenceInDays, parseISO, addDays, format } from 'date-fns';

// ─── Diagnosis Database ───
const CONDITIONS = [
  {
    keywords: ['yellow', 'yellowing', 'turning yellow'],
    name: 'Overwatering / Nutrient Deficiency',
    confidence: 'High',
    urgency: '🟡 Monitor',
    happening: 'Yellow leaves typically signal overwatering or nitrogen deficiency. The roots may be sitting in soggy soil, reducing nutrient uptake.',
    actNow: 'Check the soil — if it\'s still moist 2 inches deep, skip watering and let it dry out completely.',
    plan: ['1. Remove any fully yellow leaves to redirect energy', '2. Check drainage holes — ensure water flows freely', '3. Let soil dry out 50-70% before next watering', '4. Apply half-strength balanced fertilizer (10-10-10) in 5 days', '5. Reassess leaf color after 10 days'],
    watchFor: 'New growth appearing green and firm within 2 weeks',
  },
  {
    keywords: ['brown tip', 'brown tips', 'crispy tips', 'crispy edge'],
    name: 'Low Humidity / Salt Buildup',
    confidence: 'High',
    urgency: '🟢 Preventive',
    happening: 'Brown, crispy leaf tips are usually caused by low humidity or mineral buildup from tap water.',
    actNow: 'Mist the leaves or place a pebble tray with water beneath the pot to boost humidity.',
    plan: ['1. Trim brown tips with clean scissors at a slight angle', '2. Start misting 2x daily or add a humidifier nearby', '3. Switch to filtered or rainwater for watering', '4. Flush the soil monthly with distilled water to remove salts'],
    watchFor: 'New leaves emerging without brown tips',
  },
  {
    keywords: ['droop', 'drooping', 'wilting', 'limp', 'sad'],
    name: 'Underwatering / Transplant Shock',
    confidence: 'Medium',
    urgency: '🟡 Monitor',
    happening: 'Drooping leaves suggest the plant is either thirsty or recovering from being repotted. The roots need time to re-establish.',
    actNow: 'Give it a thorough bottom-watering — place the pot in a tray of water for 20 minutes.',
    plan: ['1. Bottom-water immediately until soil is evenly moist', '2. Move to indirect light — avoid direct sun for 5 days', '3. Do NOT fertilize for 2 weeks if recently repotted', '4. Maintain consistent moisture without waterlogging', '5. Expect recovery in 5-7 days'],
    watchFor: 'Leaves perking up and regaining firmness within 48 hours',
  },
  {
    keywords: ['spots', 'black spot', 'brown spot', 'dark spot', 'lesion'],
    name: 'Fungal Infection',
    confidence: 'Medium',
    urgency: '🔴 Urgent',
    happening: 'Dark spots with a yellow halo often indicate a fungal or bacterial infection, usually from wet foliage or poor air circulation.',
    actNow: 'Isolate the plant immediately to prevent spread. Remove affected leaves with sterilized scissors.',
    plan: ['1. Isolate from other plants right away', '2. Remove all spotted leaves and dispose (don\'t compost)', '3. Apply neem oil spray to remaining foliage', '4. Improve air circulation around the plant', '5. Avoid wetting leaves when watering — water at soil level'],
    watchFor: 'No new spots appearing on healthy leaves for 10 days',
  },
  {
    keywords: ['bug', 'pest', 'insect', 'web', 'spider mite', 'mealybug', 'aphid', 'sticky', 'white fuzz'],
    name: 'Pest Infestation',
    confidence: 'High',
    urgency: '🔴 Urgent',
    happening: 'Pests like spider mites, mealybugs, or aphids feed on plant sap, causing discoloration, sticky residue, and weakened growth.',
    actNow: 'Wipe all visible pests off with a cotton swab dipped in rubbing alcohol.',
    plan: ['1. Quarantine the plant immediately', '2. Wipe leaves with soapy water (1 tsp dish soap + 1L water)', '3. Apply neem oil spray every 3 days for 2 weeks', '4. Check nearby plants for signs of spread', '5. Inspect undersides of leaves — that\'s where they hide'],
    watchFor: 'No new webbing, sticky residue, or visible pests for 14 days',
  },
  {
    keywords: ['leggy', 'stretching', 'tall', 'thin', 'leaning', 'etiolat'],
    name: 'Insufficient Light',
    confidence: 'High',
    urgency: '🟢 Preventive',
    happening: 'Your plant is stretching toward light, producing long, thin stems with sparse leaves. It needs more brightness.',
    actNow: 'Move it closer to a bright window with indirect sunlight.',
    plan: ['1. Relocate to a spot with 6+ hours of bright indirect light', '2. Rotate the pot 90° every week for even growth', '3. Consider a grow light if natural light is limited', '4. Prune leggy stems to encourage bushier growth'],
    watchFor: 'New growth appearing compact and evenly spaced',
  },
  {
    keywords: ['root rot', 'mushy', 'smelly soil', 'rotten', 'soft stem', 'black root'],
    name: 'Root Rot',
    confidence: 'High',
    urgency: '🔴 Urgent',
    happening: 'Root rot is caused by persistent overwatering. The roots are suffocating and decaying, which can kill the plant if not addressed.',
    actNow: 'Unpot the plant, trim all black/mushy roots with sterilized scissors, and repot in fresh, dry soil.',
    plan: ['1. Remove plant from pot and shake off all old soil', '2. Cut away all dark, mushy, or smelly roots', '3. Let roots air-dry for 2-3 hours', '4. Repot in fresh well-draining mix with perlite', '5. Don\'t water for 5-7 days after repotting'],
    watchFor: 'New white root tips visible at drainage holes in 2-3 weeks',
  },
];

const FALLBACK = {
  name: 'General Plant Stress',
  confidence: 'Low',
  urgency: '🟡 Monitor',
  happening: 'The symptoms you described could have several causes. Let me give you a general care checklist.',
  actNow: 'Check soil moisture, lighting conditions, and inspect for any pests under the leaves.',
  plan: ['1. Ensure proper drainage — no standing water in saucer', '2. Check that light levels match the plant\'s needs', '3. Inspect under leaves and stems for pests', '4. Test soil moisture before watering (finger test, 2 inches)', '5. Monitor for any new or worsening symptoms over 5 days'],
  watchFor: 'Stable condition with no new symptoms for 1 week',
};

export function diagnosePlant(query, plants) {
  const q = query.toLowerCase();
  
  // Find matching condition
  let match = CONDITIONS.find(c => c.keywords.some(k => q.includes(k)));
  if (!match) match = FALLBACK;

  // Try to identify which plant
  const plantMatch = plants.find(p => q.includes(p.name.toLowerCase()));
  const plantCtx = plantMatch ? `<span style="color:var(--accent-gold)">${plantMatch.name}</span>` : 'your plant';

  const html = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong style="color:var(--accent-gold-light);">🔍 ${match.name}</strong>
        <span style="font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(255,255,255,0.06);color:var(--text-muted);">${match.confidence} confidence</span>
      </div>
      <div style="font-size:12px;padding:6px 10px;border-radius:8px;background:rgba(255,255,255,0.04);">
        ${match.urgency}
      </div>
      <p style="color:var(--text-secondary);margin:0;"><strong>What's happening:</strong> ${match.happening}</p>
      <div style="padding:8px 12px;border-radius:10px;border-left:3px solid var(--accent-gold);background:rgba(212,168,83,0.08);">
        <strong style="font-size:11px;color:var(--accent-gold);">⚡ ACT NOW</strong>
        <p style="margin:4px 0 0;color:var(--text-primary);font-size:12px;">${match.actNow}</p>
      </div>
      <div>
        <strong style="font-size:11px;color:var(--text-secondary);">Recovery Plan:</strong>
        <div style="margin-top:4px;font-size:12px;color:var(--text-secondary);display:flex;flex-direction:column;gap:3px;">
          ${match.plan.map(s => `<span>${s}</span>`).join('')}
        </div>
      </div>
      <div style="font-size:12px;padding:6px 10px;border-radius:8px;background:rgba(90,154,47,0.1);border:0.5px solid rgba(90,154,47,0.2);">
        <strong style="color:#86EFAC;">👀 Watch for:</strong> <span style="color:var(--text-secondary);">${match.watchFor}</span>
      </div>
    </div>
  `.trim();

  return { text: match.name, html };
}

export function getWateringAdvice(plant) {
  const now = new Date();
  const lastWatered = parseISO(plant.lastWatered);
  const daysSince = differenceInDays(now, lastWatered);
  let interval = plant.wateringFrequency;
  const reasons = [];

  // Get current month for season
  const month = now.getMonth();
  const isWinter = month === 11 || month === 0 || month === 1;
  const isSummer = month >= 4 && month <= 7;

  // Simulated weather (since we don't have a real API)
  const temp = isSummer ? 34 + Math.round(Math.random() * 6) : isWinter ? 12 + Math.round(Math.random() * 8) : 22 + Math.round(Math.random() * 8);
  const humidity = 45 + Math.round(Math.random() * 35);
  const recentRain = Math.random() > 0.7;

  // Apply rules
  if (temp > 35) { interval = Math.round(interval * 0.8); reasons.push(`High temp (${temp}°C) — reduced interval by 20%`); }
  if (humidity > 70) { interval = Math.round(interval * 1.15); reasons.push(`High humidity (${humidity}%) — extended interval by 15%`); }
  if (isWinter) { interval = Math.round(interval * 1.25); reasons.push('Winter season — extended interval by 25%'); }
  if (recentRain) { reasons.push('Recent rainfall detected — consider skipping if outdoors'); }

  const nextDate = addDays(lastWatered, interval);
  const daysUntil = differenceInDays(nextDate, now);
  const dateStr = format(nextDate, 'EEEE, MMM d');
  const status = daysUntil <= 0 ? '🔴 Overdue!' : daysUntil <= 1 ? '🟡 Due soon' : '🟢 On track';

  const categoryTips = {
    Tropical: 'Tropicals love humidity — mist between waterings.',
    Succulents: 'Let the soil dry completely between waterings.',
    Herbs: 'Herbs prefer consistent moisture but hate soggy feet.',
    Ferns: 'Ferns need consistently moist soil — never let them dry out.',
    Flowering: 'Water at the base to keep blooms dry and healthy.',
  };
  const tip = categoryTips[plant.category] || 'Water when the top inch of soil feels dry.';

  const html = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <strong style="color:var(--accent-gold-light);">💧 Watering Report: ${plant.name}</strong>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.04);text-align:center;">
          <div style="font-size:10px;color:var(--text-muted);">Last Watered</div>
          <div style="font-size:13px;font-weight:600;color:var(--text-heading);">${daysSince}d ago</div>
        </div>
        <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.04);text-align:center;">
          <div style="font-size:10px;color:var(--text-muted);">Frequency</div>
          <div style="font-size:13px;font-weight:600;color:var(--text-heading);">Every ${interval}d</div>
        </div>
      </div>
      <div style="padding:8px 12px;border-radius:10px;border-left:3px solid var(--info);background:rgba(91,155,213,0.08);">
        <strong style="font-size:11px;color:var(--info);">📅 Next Watering</strong>
        <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:var(--text-heading);">${dateStr}</p>
        <span style="font-size:11px;color:var(--text-muted);">${status} ${daysUntil > 0 ? `(${daysUntil} days)` : ''}</span>
      </div>
      <div style="font-size:11px;color:var(--text-muted);">
        <strong style="color:var(--text-secondary);">🌤 Weather Adjustments:</strong>
        <div style="margin-top:4px;display:flex;flex-direction:column;gap:2px;">
          <span>🌡 Temperature: ${temp}°C</span>
          <span>💨 Humidity: ${humidity}%</span>
          ${reasons.map(r => `<span style="color:var(--accent-gold);">• ${r}</span>`).join('')}
        </div>
      </div>
      <div style="font-size:12px;padding:6px 10px;border-radius:8px;background:rgba(90,154,47,0.1);border:0.5px solid rgba(90,154,47,0.2);">
        <strong style="color:#86EFAC;">💡 Tip:</strong> <span style="color:var(--text-secondary);">${tip}</span>
      </div>
    </div>
  `.trim();

  return { text: `Watering advice for ${plant.name}`, html };
}
