export const mockFinancialData = [
    { date: "Jan", ally: 15000, robinhood: 8500 },
    { date: "Feb", ally: 15200, robinhood: 9200 },
    { date: "Mar", ally: 15100, robinhood: 8800 },
    { date: "Apr", ally: 15400, robinhood: 9500 },
    { date: "May", ally: 15600, robinhood: 10200 },
    { date: "Jun", ally: 15800, robinhood: 10800 },
  ]
  
  export const mockEmails = [
    { from: "bank@ally.com", subject: "Monthly Statement Available", time: "2h ago" },
    { from: "noreply@github.com", subject: "New PR Review Request", time: "4h ago" },
    { from: "team@company.com", subject: "Weekly Standup Notes", time: "1d ago" },
  ]
  
  export const mockGithubRepos = [
    { name: "personal-dashboard", stars: 12, language: "TypeScript" },
    { name: "api-integrations", stars: 8, language: "Python" },
    { name: "data-viz-tools", stars: 23, language: "JavaScript" },
  ]
  
  export const initialWidgets = [
    {
      id: "financial-overview",
      type: "financial",
      title: "Financial Overview",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      data: { ally: 15800, robinhood: 10800, change: "+5.2%" },
    },
    {
      id: "financial-chart",
      type: "chart",
      title: "Portfolio Trends",
      x: 450,
      y: 100,
      width: 400,
      height: 250,
      data: mockFinancialData,
    },
    {
      id: "notes",
      type: "notes",
      title: "Quick Notes",
      x: 100,
      y: 350,
      width: 300,
      height: 200,
      data: { content: "Remember to:\n- Review Q4 budget\n- Update investment strategy\n- Check new API integrations" },
    },
    {
      id: "emails",
      type: "email",
      title: "Recent Emails",
      x: 450,
      y: 400,
      width: 350,
      height: 180,
      data: mockEmails,
    },
    {
      id: "github",
      type: "github",
      title: "GitHub Activity",
      x: 850,
      y: 100,
      width: 280,
      height: 200,
      data: mockGithubRepos,
    },
    {
      id: "spotify",
      type: "spotify",
      title: "Currently Playing",
      x: 850,
      y: 350,
      width: 280,
      height: 150,
      data: { track: "Bohemian Rhapsody", artist: "Queen", playlist: "Coding Vibes" },
    },
    {
      id: "ai-chat",
      type: "chat",
      title: "AI Assistant",
      x: 100,
      y: 600,
      width: 400,
      height: 300,
      data: { messages: [] },
    },
  ]
  