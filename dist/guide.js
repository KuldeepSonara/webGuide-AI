// Shepherd.js Tour Script
const shepherdTour = new Shepherd.Tour({
  defaultStepOptions: {
    scrollTo: true,
    cancelIcon: { enabled: true },
    classes: "shepherd-theme-arrows",
  },
  useModalOverlay: true,
});

// Add Steps to the Tour
shepherdTour.addStep({
  id: "step1",
  text: "Click here to generate a guide.",
  attachTo: { element: "#submit", on: "bottom" },
  buttons: [
    { text: "Next", action: shepherdTour.next },
    { text: "Close", action: shepherdTour.cancel },
  ],
});

shepherdTour.addStep({
  id: "step2",
  text: "Click this button to generate a sitemap.",
  attachTo: { element: "#generate-sitemap", on: "bottom" },
  buttons: [
    { text: "Next", action: shepherdTour.next },
    { text: "Close", action: shepherdTour.cancel },
  ],
});

shepherdTour.addStep({
  id: "step3",
  text: "This link takes you to the AWS Billing and Cost Management page.",
  attachTo: { element: "#billing-link", on: "top" },
  buttons: [
    { text: "Complete", action: shepherdTour.complete },
    { text: "Close", action: shepherdTour.cancel },
  ],
});

// Start the Shepherd Tour
document.getElementById("submit")?.addEventListener("click", () => {
  shepherdTour.start();
});

// Sitemap Generation
document.getElementById("generate-sitemap")?.addEventListener("click", () => {
  const sitemap = [
    {
      type: "link",
      xpath: "//a[@id='billing-link']",
      text: "Go to Billing and Cost Management",
      url: "https://console.aws.amazon.com/costmanagement/home?region=eu-north-1",
    },
  ];
  downloadSitemapAsJson(sitemap);
});

// Download Sitemap Function
function downloadSitemapAsJson(sitemap) {
  const data = JSON.stringify(sitemap, null, 2);
  // Shepherd.js Tour Script
  const shepherdTour = new Shepherd.Tour({
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: "shepherd-theme-arrows",
    },
    useModalOverlay: true,
    id: "shepherd-tour",
  });

  // Add Steps to the Tour
  shepherdTour.addStep({
    id: "step1",
    title: "Welcome to the Tour",
    text: "Click here to generate a guide.",
    attachTo: { element: "#submit", on: "bottom" },
    buttons: [
      { text: "Next", action: shepherdTour.next },
      { text: "Close", action: shepherdTour.cancel },
    ],
    when: {
      show: () => {
        console.log("Showing step 1");
      },
    },
  });

  shepherdTour.addStep({
    id: "step2",
    title: "Sitemap Generation",
    text: "Click this button to generate a sitemap.",
    attachTo: { element: "#generate-sitemap", on: "bottom" },
    buttons: [
      { text: "Next", action: shepherdTour.next },
      { text: "Close", action: shepherdTour.cancel },
    ],
    when: {
      show: () => {
        console.log("Showing step 2");
      },
    },
  });

  shepherdTour.addStep({
    id: "step3",
    title: "AWS Billing and Cost Management",
    text: "This link takes you to the AWS Billing and Cost Management page.",
    attachTo: { element: "#billing-link", on: "top" },
    buttons: [
      { text: "Complete", action: shepherdTour.complete },
      { text: "Close", action: shepherdTour.cancel },
    ],
    when: {
      show: () => {
        console.log("Showing step 3");
      },
    },
  });

  // Start the Shepherd Tour
  document.getElementById("submit")?.addEventListener("click", () => {
    shepherdTour.start();
  });

  // Sitemap Generation
  document.getElementById("generate-sitemap")?.addEventListener("click", () => {
    const sitemap = [
      {
        type: "link",
        xpath: "//a[@id='billing-link']",
        text: "Go to Billing and Cost Management",
        url: "https://console.aws.amazon.com/costmanagement/home?region=eu-north-1",
      },
    ];
    downloadSitemapAsJson(sitemap);
  });

  // Download Sitemap Function
  function downloadSitemapAsJson(sitemap) {
    const data = JSON.stringify(sitemap, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sitemap-${Date.now()}.json`;
    a.click();
  }
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sitemap-${Date.now()}.json`;
  a.click();
}
