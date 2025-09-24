import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, options } = body;

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Process margin object
    const processedOptions = {
      ...options,
      format: options.format || "A4",
      margin: options.margin
        ? {
            top: options.margin.top || "0",
            bottom: options.margin.bottom || "0",
            left: options.margin.left || "0",
            right: options.margin.right || "0",
          }
        : undefined,
    };

    // Remove empty/undefined values
    Object.keys(processedOptions).forEach((key) => {
      if (processedOptions[key] === "" || processedOptions[key] === undefined) {
        delete processedOptions[key];
      }
    });

    const pdfBuffer = await page.pdf(processedOptions);
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="generated.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
