"use strict";
// Remove the CDN import statement
// import Shepherd from "https://cdn.jsdelivr.net/npm/shepherd.js@13.0.0/dist/esm/shepherd.mjs";
// Comment out Gemini API key
// const GEMINI_API_KEY = "AIzaSyB9Yx2GOJ9V8-Lrw7ubryz4TdrFzjFcIAk";
// Add GPT-4 API key
const OPENAI_API_KEY =
  "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"; // Replace with your actual OpenAI API key securely
document.addEventListener("DOMContentLoaded", () => {
  const guideButton = document.getElementById("submit");
  const outputDiv = document.getElementById("guide-output");
  const loadingDiv = document.getElementById("loading");
  // Add URL display
  const urlDisplay = document.createElement("div");
  urlDisplay.id = "current-url";
  document.body.insertBefore(urlDisplay, guideButton);
  async function updateCurrentUrl() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.url) {
      urlDisplay.textContent = `Current URL: ${tab.url}`;
      guideButton.disabled = false;
    } else {
      urlDisplay.textContent = "No valid URL found";
      guideButton.disabled = true;
    }
  }
  updateCurrentUrl();
  // Add a helper function to save the sitemap as a JSON file
  function downloadSitemapAsJson(sitemap) {
    const data = JSON.stringify(sitemap, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitemap-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  let generatedSitemap = []; // Store generated sitemap here
  const generateButton = document.getElementById("generate-sitemap");
  const downloadIcon = document.getElementById("download-sitemap");
  // Remove or comment out the sendSitemapToApi function
  // async function sendSitemapToApi(sitemap: SitemapElement[], userQuery: string) {
  //   const response = await fetch("https://api.example.com/submit-sitemap", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ sitemap, query: userQuery }),
  //   });
  //   if (!response.ok) {
  //     throw new Error("Failed to send sitemap to API");
  //   }
  //   return await response.json();
  // }
  // Add event listener for Generate Sitemap button
  generateButton?.addEventListener("click", async () => {
    outputDiv.textContent = "Generating sitemap...";
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id || !tab.url) throw new Error("No valid tab or URL found");
      // Generate sitemap
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const generator = {
            async generate() {
              const elements = [];
              const selector =
                'button, a, input, form, h1, h2, h3, h4, h5, h6, img, [role="button"], [type="submit"], [type="button"], [tabindex]';
              const allElements = Array.from(
                document.querySelectorAll(selector)
              );
              for (const element of allElements) {
                try {
                  const rect = element.getBoundingClientRect();
                  if (rect.width > 0 && rect.height > 0) {
                    // Removed text extraction
                    // Removed location extraction and exclusion
                    const sitemapElement = {
                      type: this.getElementType(element),
                      xpath: this.getXPath(element),
                      // text: element.textContent?.trim(), // Added text extraction
                      // Removed 'tag' assignment
                    };
                    if (element instanceof HTMLAnchorElement) {
                      sitemapElement.url = element.href;
                    }
                    elements.push(sitemapElement);
                  }
                } catch (error) {
                  console.warn("Error processing element:", error);
                }
              }
              return elements;
            },
            getXPath(element) {
              if (element.id) return `//*[@id="${element.id}"]`;
              const parts = [];
              let curr = element;
              while (curr && curr.nodeType === Node.ELEMENT_NODE) {
                let index = 1;
                for (
                  let sibling = curr.previousSibling;
                  sibling;
                  sibling = sibling.previousSibling
                ) {
                  if (
                    sibling.nodeType === Node.ELEMENT_NODE &&
                    sibling.nodeName === curr.nodeName
                  ) {
                    index++;
                  }
                }
                parts.unshift(`${curr.nodeName.toLowerCase()}[${index}]`);
                curr = curr.parentNode;
              }
              return `/${parts.join("/")}`;
            },
            getElementType(element) {
              if (
                element instanceof HTMLButtonElement ||
                element.getAttribute("role") === "button"
              )
                return "button";
              if (element instanceof HTMLAnchorElement) return "link";
              if (element instanceof HTMLInputElement) return "input";
              if (element.matches('div.g-recaptcha, iframe[src*="recaptcha"]'))
                return "captcha";
              if (element instanceof HTMLImageElement) return "image";
              if (element.tagName.match(/^H[1-6]$/)) return "heading";
              return "text";
            },
          };
          return generator.generate();
        },
      });
      generatedSitemap = results[0]?.result;
      if (!generatedSitemap || !Array.isArray(generatedSitemap)) {
        // Changed 'sitemap' to 'generatedSitemap'
        throw new Error("Invalid sitemap data received");
      }
      if (Array.isArray(generatedSitemap) && generatedSitemap.length > 0) {
        outputDiv.textContent = "Sitemap generated. Ready to download.";
      } else {
        outputDiv.textContent = "No elements found on the page";
      }
    } catch (err) {
      console.error(err);
      outputDiv.innerHTML = `
        <div style="color: red;">
          <strong>Error:</strong> ${
            err instanceof Error ? err.message : "Unknown error"
          }
        </div>
      `;
    }
  });
  // Add event listener for Download Sitemap icon
  downloadIcon?.addEventListener("click", () => {
    if (!generatedSitemap || generatedSitemap.length === 0) {
      outputDiv.textContent = "No sitemap to download. Please generate first.";
      return;
    }
    downloadSitemapAsJson(generatedSitemap);
    outputDiv.textContent = "Sitemap downloaded.";
  });
  // Modify Get Guide button to use GPT-4 API
  guideButton.addEventListener("click", async () => {
    loadingDiv.style.display = "block";
    outputDiv.textContent = "";
    try {
      const userQuery = document.getElementById("query").value;
      if (!generatedSitemap || generatedSitemap.length === 0) {
        throw new Error("No sitemap generated. Please generate sitemap first.");
      }
      // Prepare payload for GPT-4 API
      const payload = {
        model: "gpt-4-turbo", // Corrected the model reference here
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that generates step-by-step navigation guides based on a provided sitemap.",
          },
          {
            role: "user",
            content: `Generate a step-by-step navigation guide using the following sitemap. For each actionable element, provide:
      - Title of the step.
      - Instruction text (what the user should do).
      - XPath of the element to attach the tooltip.
      - Button actions (Next, Back, or any other action as needed).
      - Tooltip positions (top, bottom, etc.).

      Sitemap:
      ${JSON.stringify(generatedSitemap, null, 2)}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      };
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );
      // Log the full API response for debugging
      console.log("GPT-4 API Response:", response);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GPT-4 API error: ${response.status} ${errorText}`);
      }
      const resultData = await response.json();
      // Log the parsed API response
      console.log("Parsed GPT-4 API Response:", resultData);
      // Safely parse the API response to extract guide steps
      if (
        !resultData.choices ||
        !Array.isArray(resultData.choices) ||
        !resultData.choices[0]?.message?.content
      ) {
        throw new Error("Invalid response from GPT-4 API");
      }
      const guideSteps = resultData.choices[0].message.content
        .trim()
        .split("\n")
        .filter((step) => step);
      // Display the guide steps in the outputDiv
      outputDiv.textContent = guideSteps.join("\n");
      // Optional: Display a minimal confirmation
      // outputDiv.textContent = "Guide is being displayed.";
    } catch (error) {
      console.error("Error:", error);
      outputDiv.innerHTML = `
        <div style="color: red;">
          <strong>Error:</strong> ${
            error instanceof Error ? error.message : "Unknown error"
          }
        </div>
      `;
    } finally {
      loadingDiv.style.display = "none";
    }
  });
});
