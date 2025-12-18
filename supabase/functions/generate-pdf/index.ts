import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InformeFinal {
  titulo: string;
  perfilEvaluado: {
    edad: string;
    genero: string;
  };
  conclusiones: {
    hipotesisPerfil: string;
    rasgosClave: {
      fortalezas: string[];
      desafios: string[];
      caracteristicasND: string[];
    };
    resumenNarrativo: string;
  };
  recomendaciones: {
    hogar: string[];
    escolar: string[];
  };
  evaluacionProfesional: {
    profesionalesSugeridos: string[];
    pruebasSugeridas: string[];
    urgencia: string;
  };
  disclaimer: string;
}

interface GeneratePdfRequest {
  informeFinal: InformeFinal;
  email: string;
  destinatario: string;
}

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const avgCharWidth = fontSize * 0.5;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > charsPerLine) {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { informeFinal, email, destinatario }: GeneratePdfRequest = await req.json();

    console.log("Generating PDF for:", email);

    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;

    const primaryColor = rgb(0.29, 0.56, 0.89);
    const textColor = rgb(0.13, 0.13, 0.13);
    const mutedColor = rgb(0.4, 0.4, 0.4);
    const successColor = rgb(0.31, 0.65, 0.31);
    const warningColor = rgb(0.8, 0.6, 0.2);

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPosition - requiredSpace < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
    };

    const drawText = (text: string, options: {
      font?: typeof helvetica;
      size?: number;
      color?: ReturnType<typeof rgb>;
      x?: number;
      maxWidth?: number;
    } = {}) => {
      const { 
        font = helvetica, 
        size = 10, 
        color = textColor,
        x = margin,
        maxWidth = contentWidth
      } = options;
      
      const lines = wrapText(text, maxWidth, size);
      for (const line of lines) {
        addNewPageIfNeeded(size + 4);
        currentPage.drawText(line, { x, y: yPosition, size, font, color });
        yPosition -= size + 4;
      }
    };

    const drawTitle = (text: string, size = 18) => {
      addNewPageIfNeeded(size + 15);
      currentPage.drawText(text, {
        x: margin,
        y: yPosition,
        size,
        font: helveticaBold,
        color: primaryColor,
      });
      yPosition -= size + 15;
    };

    const drawSubtitle = (text: string, size = 12) => {
      addNewPageIfNeeded(size + 10);
      currentPage.drawText(text, {
        x: margin,
        y: yPosition,
        size,
        font: helveticaBold,
        color: textColor,
      });
      yPosition -= size + 10;
    };

    const drawBulletList = (items: string[], color = mutedColor) => {
      for (const item of items) {
        const lines = wrapText(`• ${item}`, contentWidth - 15, 10);
        for (let i = 0; i < lines.length; i++) {
          addNewPageIfNeeded(14);
          currentPage.drawText(lines[i], {
            x: margin + (i === 0 ? 0 : 10),
            y: yPosition,
            size: 10,
            font: helvetica,
            color,
          });
          yPosition -= 14;
        }
      }
    };

    // Header
    drawTitle("ESPACIO NEURODIVERGENTE", 20);
    yPosition -= 5;
    drawText("Informe de Cribado Orientativo", { size: 12, color: mutedColor });
    yPosition -= 20;

    // Report title
    drawTitle(informeFinal.titulo, 16);
    yPosition -= 5;

    // Profile info
    drawText(`Perfil evaluado: ${informeFinal.perfilEvaluado.genero}, ${informeFinal.perfilEvaluado.edad}`, { color: mutedColor });
    drawText(`Destinatario: ${destinatario}`, { color: mutedColor });
    drawText(`Fecha: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, { color: mutedColor });
    yPosition -= 20;

    // Hipótesis de Perfil
    drawSubtitle("HIPÓTESIS DE PERFIL");
    drawText(informeFinal.conclusiones.hipotesisPerfil);
    yPosition -= 15;

    // Rasgos Clave
    drawSubtitle("RASGOS CLAVE");
    yPosition -= 5;

    // Fortalezas
    currentPage.drawText("Fortalezas:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: successColor,
    });
    yPosition -= 16;
    drawBulletList(informeFinal.conclusiones.rasgosClave.fortalezas, successColor);
    yPosition -= 10;

    // Desafíos
    addNewPageIfNeeded(40);
    currentPage.drawText("Desafíos:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: warningColor,
    });
    yPosition -= 16;
    drawBulletList(informeFinal.conclusiones.rasgosClave.desafios, warningColor);
    yPosition -= 10;

    // Características ND
    addNewPageIfNeeded(40);
    currentPage.drawText("Características Neurodivergentes:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: primaryColor,
    });
    yPosition -= 16;
    drawBulletList(informeFinal.conclusiones.rasgosClave.caracteristicasND, primaryColor);
    yPosition -= 15;

    // Resumen Narrativo
    addNewPageIfNeeded(60);
    drawSubtitle("RESUMEN");
    drawText(informeFinal.conclusiones.resumenNarrativo);
    yPosition -= 20;

    // Recomendaciones
    addNewPageIfNeeded(60);
    drawSubtitle("RECOMENDACIONES DE APOYO");
    yPosition -= 5;

    currentPage.drawText("En el Hogar:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 16;
    drawBulletList(informeFinal.recomendaciones.hogar);
    yPosition -= 10;

    addNewPageIfNeeded(40);
    currentPage.drawText("En el Entorno Escolar:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 16;
    drawBulletList(informeFinal.recomendaciones.escolar);
    yPosition -= 20;

    // Evaluación Profesional
    addNewPageIfNeeded(80);
    drawSubtitle("ORIENTACIÓN PARA EVALUACIÓN PROFESIONAL");
    yPosition -= 5;

    currentPage.drawText("Profesionales Sugeridos:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 16;
    drawText(informeFinal.evaluacionProfesional.profesionalesSugeridos.join(", "), { color: primaryColor });
    yPosition -= 10;

    addNewPageIfNeeded(40);
    currentPage.drawText("Pruebas Sugeridas:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 16;
    drawBulletList(informeFinal.evaluacionProfesional.pruebasSugeridas);
    yPosition -= 10;

    addNewPageIfNeeded(30);
    currentPage.drawText("Urgencia Recomendada:", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 16;
    drawText(informeFinal.evaluacionProfesional.urgencia);
    yPosition -= 25;

    // Disclaimer
    addNewPageIfNeeded(100);
    currentPage.drawRectangle({
      x: margin - 5,
      y: yPosition - 80,
      width: contentWidth + 10,
      height: 90,
      color: rgb(1, 0.95, 0.85),
    });
    yPosition -= 10;
    currentPage.drawText("AVISO IMPORTANTE", {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: warningColor,
    });
    yPosition -= 16;
    const disclaimerLines = wrapText(informeFinal.disclaimer, contentWidth - 10, 9);
    for (const line of disclaimerLines) {
      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: mutedColor,
      });
      yPosition -= 12;
    }

    // Footer
    yPosition = margin;
    currentPage.drawText(`Informe generado para: ${email}`, {
      x: margin,
      y: yPosition,
      size: 8,
      font: helvetica,
      color: mutedColor,
    });
    currentPage.drawText("www.espacioneurodivergente.com", {
      x: pageWidth - margin - 120,
      y: yPosition,
      size: 8,
      font: helvetica,
      color: primaryColor,
    });

    const pdfBytes = await pdfDoc.save();
    const base64Pdf = btoa(String.fromCharCode(...pdfBytes));

    console.log("PDF generated successfully");

    return new Response(
      JSON.stringify({ 
        pdf: base64Pdf,
        filename: `informe-cribado-${new Date().toISOString().split('T')[0]}.pdf`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
