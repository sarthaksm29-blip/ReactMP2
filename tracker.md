Build a fully functional Plant Care Tracker web app in React. This is a lifestyle app to help users manage the watering schedules and track the health of their indoor plants.

— TECH STACK —
- React 18 with functional components and hooks only (no class components)
- React Router v6 for multi-page navigation
- Context API + useReducer for global state management
- Recharts for all data visualizations
- LocalStorage for persistent data (no backend needed)
- Framer Motion for page transitions and micro-animations
- CSS Modules or Tailwind for styling (prefer a clean, nature-inspired green + cream palette)

— PAGES & ROUTING —
Set up React Router with the following routes:
/ → Dashboard (home)
/plants → Plant Library
/plants/:id → Individual Plant Detail
/schedule → Watering Schedule
/growth → Growth Tracker
/gallery → Photo Gallery
/alerts → Seasonal Alerts & Notifications

— GLOBAL LAYOUT —
- Persistent sidebar (collapsible on mobile) with icons + labels for each page
- Top navbar with: app logo/name, global search bar, notification bell with badge count, dark/light mode toggle
- Breadcrumb trail on each inner page
- Responsive: sidebar collapses to bottom tab bar on mobile (< 768px)

— FEATURE 1: PLANT DATABASE (library page) —
- Grid/list toggle view of all plants
- Each plant card shows: photo thumbnail, name, species, health status badge (Healthy / Needs Attention / Critical), next watering date, and category tag
- Search bar to filter plants by name or species in real time
- Dropdown filters by: Category (Succulents, Tropical, Herbs, Ferns, Flowering), Health Status, and Watering Frequency
- Sort by: Name (A-Z), Date Added, Next Watering, Health Score
- "Add New Plant" modal/drawer with a form: name, species, category, purchase date, watering frequency (daily/weekly/biweekly), sunlight preference (low/medium/bright), notes, and optional image URL
- Each plant card has quick-action icons: log watering ✓, view details →, edit ✏, delete 🗑 (with confirm dialog)
- Built-in plant database with at least 10 pre-loaded plants covering all categories, each with care tips

— FEATURE 2: INDIVIDUAL PLANT DETAIL PAGE —
- Hero section: large photo, plant name, species, category badge, date added
- Tab navigation within the page: Overview | Health Logs | Growth | Photos | Care Tips
- Overview tab: watering schedule info, sunlight need, fertilizer schedule, soil type, care difficulty rating (1–5 stars)
- Health Logs tab: chronological list of health check-ins with date, notes, and health score (1–10). Form to add a new log entry. Display as a timeline UI
- Growth tab: line chart (Recharts) showing height over time. Form to add new growth entries (date + height in cm). Show min/max/average stats above the chart
- Photos tab: grid gallery of uploaded photos (via URL input) with date labels. Clicking a photo opens a lightbox/modal
- Care Tips tab: detailed species-specific care tips for watering, light, humidity, fertilizer, repotting, and common problems

— FEATURE 3: WATERING SCHEDULE —
- Monthly calendar view (build a custom calendar grid) with colored dots on days where plants need watering
- List view toggle showing upcoming watering tasks sorted by date (today first)
- Each task shows: plant name, plant thumbnail, days until watering, urgency level (overdue / today / upcoming)
- "Mark as Watered" button on each task — updates the next watering date automatically based on frequency
- Overdue tasks highlighted in red at the top of the list
- Watering streak tracker per plant (e.g., "Watered on time 7 times in a row! 🔥")
- Filter calendar by plant category or individual plant

— FEATURE 4: GROWTH PROGRESS TRACKING —
- Overview page showing all plants in a grid with a mini sparkline (small Recharts LineChart) under each plant card showing recent growth trend
- Selecting a plant shows its full growth chart (same as the Growth tab in detail page)
- Multi-plant comparison view: select up to 3 plants and overlay their growth curves on one chart with different colors and a legend
- Summary stats panel: fastest growing plant, most logs recorded, average growth rate

— FEATURE 5: PLANT CATEGORIZATION —
- Dedicated category filter on the Plant Library page (not a separate route)
- Category badges on all cards: Succulents 🌵, Tropical 🌿, Herbs 🌱, Ferns, Flowering 🌸
- Category stats widget on Dashboard: donut chart (Recharts PieChart) showing how many plants in each category

— FEATURE 6: FERTILIZER & SUNLIGHT LOGS —
- Inside each plant detail (Health Logs tab or a sub-section), allow logging: date, fertilizer type (liquid/granular/slow-release/none), amount, and sunlight hours received that day
- On the Dashboard, show a "This Week's Care Summary" card: how many plants were fertilized, total watering events, average sunlight logged
- Color-code sunlight hours: < 2h = red, 2–4h = amber, > 4h = green

— FEATURE 7: PHOTO GALLERY —
- Global gallery page (all plants) with masonry or uniform grid layout
- Filter by plant using a dropdown
- Each photo tile shows: plant name overlay on hover, date, small health badge
- Clicking opens a full lightbox modal with: photo, plant name, date, and caption; arrow navigation to prev/next photo
- "Add Photo" button opens a modal to select plant, enter image URL, date, and optional caption

— FEATURE 8: SEASONAL CARE ALERTS —
- Auto-detect current season based on system date (Spring: Mar–May, Summer: Jun–Aug, Autumn: Sep–Nov, Winter: Dec–Feb)
- Show a season banner on the Dashboard with current season icon and 2–3 general tips
- Alerts page: categorized list of seasonal care recommendations per plant category
- Per-plant smart alerts: if a plant has low sunlight logs in winter, show a "Consider a grow light" alert. If watering frequency is high in winter, suggest reducing it
- Notification bell in navbar shows count of active alerts. Clicking it opens a dropdown panel with the top 5 alerts, each linking to the relevant plant

— INTERACTIVITY & UX POLISH —
- All page transitions animated with Framer Motion (slide or fade)
- Plant cards animate on hover (subtle scale + shadow lift)
- Add/edit forms use controlled inputs with real-time validation (required fields, min/max for numbers)
- Toast notifications for every action: "Watered! Next due in 7 days", "Plant added successfully", "Log saved"
- Skeleton loading states on all list/grid views
- Empty states with illustrated SVG and a CTA button (e.g., "No plants yet — add your first one!")
- Confirm dialogs before destructive actions (delete plant, clear logs)
- Dark mode: full dark theme toggled via the navbar button, persisted in LocalStorage

— DASHBOARD (home page) —
Show the following widgets:
1. Summary stat cards (total plants, plants watered today, overdue count, alerts count)
2. "Needs Watering Today" horizontal scroll list
3. "Recently Added Plants" grid (last 3)
4. Category distribution donut chart
5. Seasonal tip banner
6. "This Week's Care Summary" activity card
7. Quick-add plant button (floating action button bottom-right)

— DATA & STATE MANAGEMENT —
- Use Context API + useReducer with a single PlantContext
- Actions: ADD_PLANT, UPDATE_PLANT, DELETE_PLANT, LOG_WATERING, ADD_HEALTH_LOG, ADD_GROWTH_ENTRY, ADD_PHOTO, ADD_FERTILIZER_LOG
- Seed the app with at least 10 pre-loaded plants with varied data so all features are demonstrable from first load
- Persist full state to LocalStorage on every state change using a useEffect

— CODE QUALITY —
- Split into small, reusable components (PlantCard, HealthBadge, WateringTask, GrowthChart, PhotoTile, AlertItem, etc.)
- Custom hooks: usePlants(), useWateringSchedule(), useSeasonalAlerts(), useLocalStorage()
- PropTypes or TypeScript interfaces for all components
- Consistent file structure: /components, /pages, /context, /hooks, /utils, /data

Make the UI feel premium and nature-inspired — use greens, warm creams, and earthy tones. Every section should feel polished and complete. Prioritize working functionality over placeholder content.