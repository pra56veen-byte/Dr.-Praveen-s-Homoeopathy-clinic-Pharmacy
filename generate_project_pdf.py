import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

PROJECT_DIR = r"C:\Users\prave\.gemini\antigravity\scratch\dr-praveen-homoeopathy"
ARTIFACT_DIR = r"C:\Users\prave\.gemini\antigravity\brain\3686bbea-8eaf-48e9-801b-a70c5ad9fa36"
OUTPUT_PDF_1 = os.path.join(PROJECT_DIR, "Dr_Praveen_Homoeopathy_Project_Documentation.pdf")
OUTPUT_PDF_2 = os.path.join(ARTIFACT_DIR, "Dr_Praveen_Homoeopathy_Project_Documentation.pdf")

# Custom Numbered Canvas for professional "Page X of Y" and Running Header/Footer
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(40, 805, 555, 805)
            self.drawString(40, 810, "Dr. Praveen’s Homoeopathy Clinic & Pharmacy — Architecture & Documentation")
            self.drawRightString(555, 810, "Treating the root Cause - Not just the symptoms")

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 42, 555, 42)
        self.drawString(40, 30, "Confidential & Proprietary — Dr. Praveen's Homoeopathy, Bengaluru, Karnataka")
        self.drawRightString(555, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=48,
        bottomMargin=52
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    PRIMARY_BLUE = colors.HexColor("#1760CB")
    LIGHT_GREEN = colors.HexColor("#8BCB42")
    DARK_BLUE = colors.HexColor("#0F3D82")
    CHARCOAL = colors.HexColor("#1E293B")
    SLATE_MUTED = colors.HexColor("#64748B")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BORDER_LIGHT = colors.HexColor("#E2E8F0")

    # Typography Styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY_BLUE
    )
    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=LIGHT_GREEN
    )
    style_h1 = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PRIMARY_BLUE,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    style_h2 = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=DARK_BLUE,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    style_body = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=CHARCOAL,
        spaceAfter=4
    )
    style_bold = ParagraphStyle(
        'BodyBoldCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=CHARCOAL
    )
    style_code = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )
    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )
    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=CHARCOAL
    )
    style_table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=CHARCOAL
    )

    story = []

    # ----------------------------------------------------
    # COVER / HEADER BANNER
    # ----------------------------------------------------
    logo_path = os.path.join(PROJECT_DIR, "public", "logo.png")
    dr_photo_path = os.path.join(PROJECT_DIR, "public", "dr-praveen.jpg")
    
    header_data = []
    col_widths = [70, 365, 80]
    
    logo_img = Image(logo_path, width=64, height=64) if os.path.exists(logo_path) else Paragraph("LOGO", style_bold)
    dr_img = Image(dr_photo_path, width=70, height=64) if os.path.exists(dr_photo_path) else Paragraph("DOCTOR", style_bold)

    title_block = [
        Paragraph("Dr. Praveen’s Homoeopathy clinic & Pharmacy", style_cover_title),
        Spacer(1, 3),
        Paragraph("“Treating the root Cause - Not just the symptoms”", style_cover_subtitle),
        Spacer(1, 4),
        Paragraph("<b>Complete Technical Documentation, Local Path & Application Architecture</b>", style_body),
        Paragraph("Facility: Byappanahalli, Bengaluru, Karnataka | Consultations: Bengaluru, Hyderabad & Narasaraopet", style_body)
    ]

    header_table = Table([[logo_img, title_block, dr_img]], colWidths=col_widths)
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (0,0), 'CENTER'),
        ('ALIGN', (2,0), (2,0), 'CENTER'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # ----------------------------------------------------
    # SECTION 1: EXECUTIVE OVERVIEW & LOCAL LAPTOP PATH
    # ----------------------------------------------------
    story.append(Paragraph("1. Executive Overview & Laptop File Location", style_h1))
    
    path_info = [
        [Paragraph("<b>Exact Local Path:</b>", style_table_cell_bold),
         Paragraph(f"<font name='Courier'><b>{PROJECT_DIR}</b></font>", style_table_cell)],
        [Paragraph("<b>Framework & Stack:</b>", style_table_cell_bold),
         Paragraph("Next.js 14.2.15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Supabase Database & Auth", style_table_cell)],
        [Paragraph("<b>Local Server URL:</b>", style_table_cell_bold),
         Paragraph("<font name='Courier'><b>http://localhost:3000</b></font> (or http://localhost:3001 if port is busy)", style_table_cell)],
        [Paragraph("<b>Primary Clinic Contacts:</b>", style_table_cell_bold),
         Paragraph("Direct Phone: +91 9052523835 | WhatsApp: +91 9052523835 / +91 7732062291", style_table_cell)],
        [Paragraph("<b>Clinic Address:</b>", style_table_cell_bold),
         Paragraph("120, 5th Cross, Kada Agrahara Main Rd, Vinayaka Layout, Byappanahalli, Bengaluru, Karnataka 560049", style_table_cell)],
        [Paragraph("<b>Admin Credentials:</b>", style_table_cell_bold),
         Paragraph("URL: <font name='Courier'>/admin/login</font> | Email: <font name='Courier'>admin@drpraveenhomoeopathy.com</font> | Password: <font name='Courier'>Admin@Homoeo2024</font>", style_table_cell)]
    ]
    path_table = Table(path_info, colWidths=[120, 395])
    path_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(path_table)
    story.append(Spacer(1, 10))

    # ----------------------------------------------------
    # SECTION 2: COMPLETE DIRECTORY & FILE STRUCTURE
    # ----------------------------------------------------
    story.append(Paragraph("2. Complete Directory Structure & File Map", style_h1))
    
    struct_data = [
        [Paragraph("Directory / File", style_table_header),
         Paragraph("Type", style_table_header),
         Paragraph("Purpose and Technical Role", style_table_header)],

        # Root files
        [Paragraph("<font name='Courier'>package.json</font>", style_table_cell_bold),
         Paragraph("Configuration", style_table_cell),
         Paragraph("Project manifest, dependencies (Next.js 14, React 18, Supabase client), and build scripts.", style_table_cell)],
        [Paragraph("<font name='Courier'>tailwind.config.ts</font>", style_table_cell_bold),
         Paragraph("Styling", style_table_cell),
         Paragraph("Clinic brand palette: Primary Blue #1760CB, Green #8BCB42, charcoal text, and breakpoints.", style_table_cell)],
        [Paragraph("<font name='Courier'>next.config.js</font>", style_table_cell_bold),
         Paragraph("Configuration", style_table_cell),
         Paragraph("Next.js build settings, unoptimized image flags, and remote hostname permissions.", style_table_cell)],
        [Paragraph("<font name='Courier'>.env.local</font>", style_table_cell_bold),
         Paragraph("Environment", style_table_cell),
         Paragraph("Supabase URL, Anon Key, and local environment secrets.", style_table_cell)],

        # Public assets
        [Paragraph("<font name='Courier'>public/logo.png</font>", style_table_cell_bold),
         Paragraph("Asset (Image)", style_table_cell),
         Paragraph("Official circular emblem logo. Enlarged to w-20 h-20 in sticky navigation bar.", style_table_cell)],
        [Paragraph("<font name='Courier'>public/dr-praveen.jpg</font>", style_table_cell_bold),
         Paragraph("Asset (Image)", style_table_cell),
         Paragraph("Official portrait of Dr. Praveen used on Homepage Hero and Appointment consultation page.", style_table_cell)],
        [Paragraph("<font name='Courier'>public/pharmacy-shelves.png</font>", style_table_cell_bold),
         Paragraph("Asset (Image)", style_table_cell),
         Paragraph("Authentic uploaded pharmacy photo integrated as glassmorphic background for pharmacy counter.", style_table_cell)],
        [Paragraph("<font name='Courier'>public/medical-caduceus.png</font>", style_table_cell_bold),
         Paragraph("Asset (Image)", style_table_cell),
         Paragraph("Caduceus symbol watermark rendered at low opacity across Hero, Categories, and Ordering guide.", style_table_cell)],
        [Paragraph("<font name='Courier'>public/homeopathy-cross.png</font>", style_table_cell_bold),
         Paragraph("Asset (Image)", style_table_cell),
         Paragraph("Botanical leaf green cross symbol watermark rendered across Hero, Conditions, and Appointment.", style_table_cell)],
        [Paragraph("<font name='Courier'>public/conditions-treated.png</font>", style_table_cell_bold),
         Paragraph("Asset (Image)", style_table_cell),
         Paragraph("Official clinic conditions poster containing the 12 primary homoeopathic specialty areas.", style_table_cell)],

        # App Pages
        [Paragraph("<font name='Courier'>src/app/layout.tsx</font>", style_table_cell_bold),
         Paragraph("Page (Root Layout)", style_table_cell),
         Paragraph("Root HTML structure, sticky Header, Footer, Floating WhatsApp contact pill, and SEO metadata.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/app/page.tsx</font>", style_table_cell_bold),
         Paragraph("Page (Homepage)", style_table_cell),
         Paragraph("Main landing: Hero, Remedy Search, 18 Categories, 12 Conditions, Shelves Showcase, 3-Step Guide.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/app/products/page.tsx</font>", style_table_cell_bold),
         Paragraph("Page (Catalogue)", style_table_cell),
         Paragraph("Full remedy catalog with live search, 18 category filters, price sorting, and Add to Cart.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/app/products/[id]/page.tsx</font>", style_table_cell_bold),
         Paragraph("Page (Product Detail)", style_table_cell),
         Paragraph("Dedicated medicine detail page: strength/potency, pack size, verified MRP, discount, manufacturer.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/app/appointment/page.tsx</font>", style_table_cell_bold),
         Paragraph("Page (Consultation)", style_table_cell),
         Paragraph("Doctor appointment enquiry form: slot picker, in-clinic vs online toggle, WhatsApp transmission.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/app/cart/page.tsx</font>", style_table_cell_bold),
         Paragraph("Page (Shopping Cart)", style_table_cell),
         Paragraph("Persistent cart with item count, patient locality, and instant WhatsApp click-to-chat order format.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/app/admin/*</font>", style_table_cell_bold),
         Paragraph("Page (Admin Portal)", style_table_cell),
         Paragraph("Protected dashboard: product catalog manager, categories, clinic settings, and database reset seed.", style_table_cell)],

        # Library & Context
        [Paragraph("<font name='Courier'>src/context/CartContext.tsx</font>", style_table_cell_bold),
         Paragraph("State Management", style_table_cell),
         Paragraph("Persistent browser cart state using localStorage, revalidating item count and pricing.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/lib/whatsapp.ts</font>", style_table_cell_bold),
         Paragraph("Logic / Utility", style_table_cell),
         Paragraph("Encodes customized, structured WhatsApp messages for instant order placement and inquiries.", style_table_cell)],
        [Paragraph("<font name='Courier'>src/lib/store.ts</font>", style_table_cell_bold),
         Paragraph("Data Access Layer", style_table_cell),
         Paragraph("Unified CRUD operations: reads/writes to Supabase when connected; falls back to persistent store.", style_table_cell)],
        [Paragraph("<font name='Courier'>supabase/schema.sql</font>", style_table_cell_bold),
         Paragraph("Database Schema", style_table_cell),
         Paragraph("PostgreSQL tables (products, categories, store_settings, appointment_enquiries, orders) & RLS.", style_table_cell)]
    ]
    struct_table = Table(struct_data, colWidths=[130, 95, 290])
    struct_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_BLUE),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(struct_table)
    story.append(Spacer(1, 10))

    # ----------------------------------------------------
    # SECTION 3: 12 CLINICAL SPECIALTY CONDITIONS
    # ----------------------------------------------------
    story.append(Paragraph("3. 12 Clinical Specialty Conditions (Official Poster Integration)", style_h1))
    story.append(Paragraph("From the official clinic poster, the homepage features 12 dedicated condition cards. Each links directly to WhatsApp consultations pre-filled with the specific health concern:", style_body))

    conditions = [
        ("1. Diabetes Management", "Blood sugar stabilization, metabolic support, diabetic neuropathy, and chronic complication relief."),
        ("2. Respiratory Disorders", "Asthma, allergic bronchitis, recurrent colds, chronic sinusitis, and tonsillitis in children and adults."),
        ("3. Thyroid Disorders", "Hypothyroidism, hyperthyroidism, metabolic weight changes, chronic fatigue, and hair loss support."),
        ("4. Migraine & Headaches", "One-sided migraine, throbbing vascular headaches, tension headaches, and chronic stress relief."),
        ("5. Kidney Disorders", "Kidney stone dissolution support, recurring urinary tract infections (UTIs), burning, and edema."),
        ("6. Skin Disorders", "Acne/pimples, eczema, psoriasis, allergic hives, urticaria, fungal infections, and severe pruritus."),
        ("7. Joint Problems & Arthritis", "Knee joint degeneration, cervical spondylitis, stiffness, rheumatoid pain, and inflammation."),
        ("8. Digestive Disorders", "Acidity, GERD, chronic gas, abdominal bloating, indigestion, irritable bowel syndrome (IBS), constipation."),
        ("9. PCOD / PCOS Care", "Irregular menstrual cycles, hormonal acne, ovarian cysts, facial hair growth, and weight management."),
        ("10. Sexual Health", "Confidential, individualized homoeopathic treatment for male and female reproductive well-being."),
        ("11. Piles (Hemorrhoids)", "Bleeding piles, fissure in ano, severe rectal burning and itching, chronic constipation relief."),
        ("12. Mental Health & Sleep", "Anxiety, chronic depression, insomnia/sleeplessness, phobias, restlessness, and mental exhaustion.")
    ]
    
    cond_grid = []
    for i in range(0, len(conditions), 2):
        c1_title, c1_desc = conditions[i]
        c2_title, c2_desc = conditions[i+1]
        cond_grid.append([
            Paragraph(f"<b>{c1_title}</b><br/>{c1_desc}", style_table_cell),
            Paragraph(f"<b>{c2_title}</b><br/>{c2_desc}", style_table_cell)
        ])
    
    cond_table = Table(cond_grid, colWidths=[257, 258])
    cond_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8FAFC")),
        ('BACKGROUND', (1,0), (1,-1), colors.white),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(cond_table)
    story.append(Spacer(1, 10))

    # ----------------------------------------------------
    # SECTION 4: PRODUCTION COMPILATION & ROUTING TABLE
    # ----------------------------------------------------
    story.append(Paragraph("4. Production Compilation & Verified Route Table", style_h1))
    story.append(Paragraph("Compiled successfully with <b>Next.js 14.2.15 App Router</b> (zero errors, 17 static optimized routes):", style_body))

    route_data = [
        [Paragraph("Route", style_table_header),
         Paragraph("Rendering Type", style_table_header),
         Paragraph("Bundle Size", style_table_header),
         Paragraph("First Load JS", style_table_header),
         Paragraph("Description", style_table_header)],

        [Paragraph("<font name='Courier'>/</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("11.4 kB", style_table_cell), Paragraph("174 kB", style_table_cell), Paragraph("Main Clinic & Pharmacy Homepage", style_table_cell)],
        [Paragraph("<font name='Courier'>/products</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("6.81 kB", style_table_cell), Paragraph("169 kB", style_table_cell), Paragraph("Medicines Catalogue & Category Filters", style_table_cell)],
        [Paragraph("<font name='Courier'>/products/[id]</font>", style_table_cell_bold), Paragraph("Dynamic (ƒ)", style_table_cell), Paragraph("6.47 kB", style_table_cell), Paragraph("169 kB", style_table_cell), Paragraph("Remedy Potency & Pack Details", style_table_cell)],
        [Paragraph("<font name='Courier'>/appointment</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("4.91 kB", style_table_cell), Paragraph("161 kB", style_table_cell), Paragraph("Doctor Consultation Enquiry", style_table_cell)],
        [Paragraph("<font name='Courier'>/cart</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("5.71 kB", style_table_cell), Paragraph("168 kB", style_table_cell), Paragraph("Shopping Cart & WhatsApp Ordering", style_table_cell)],
        [Paragraph("<font name='Courier'>/admin</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("3.94 kB", style_table_cell), Paragraph("167 kB", style_table_cell), Paragraph("Admin Dashboard Overview", style_table_cell)],
        [Paragraph("<font name='Courier'>/admin/login</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("2.65 kB", style_table_cell), Paragraph("159 kB", style_table_cell), Paragraph("Administrator Authentication", style_table_cell)],
        [Paragraph("<font name='Courier'>/admin/products</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("5.39 kB", style_table_cell), Paragraph("161 kB", style_table_cell), Paragraph("Remedy & Stock Inventory Manager", style_table_cell)],
        [Paragraph("<font name='Courier'>/admin/categories</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("2.75 kB", style_table_cell), Paragraph("159 kB", style_table_cell), Paragraph("18 Homoeopathy Categories Manager", style_table_cell)],
        [Paragraph("<font name='Courier'>/admin/settings</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("3.55 kB", style_table_cell), Paragraph("159 kB", style_table_cell), Paragraph("Clinic Hours, Contact & WhatsApp Settings", style_table_cell)],
        [Paragraph("<font name='Courier'>/disclaimer</font>", style_table_cell_bold), Paragraph("Static (○)", style_table_cell), Paragraph("2.66 kB", style_table_cell), Paragraph("96.7 kB", style_table_cell), Paragraph("Healthcare & Medical Information Safety", style_table_cell)]
    ]
    route_table = Table(route_data, colWidths=[95, 75, 55, 65, 225])
    route_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_BLUE),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(route_table)
    story.append(Spacer(1, 10))

    # ----------------------------------------------------
    # SECTION 5: HOW TO RUN LOCALLY & DEPLOYMENT
    # ----------------------------------------------------
    story.append(Paragraph("5. Local Execution Guide & Production Deployment", style_h1))
    
    run_steps = [
        Paragraph("<b>1. Start Local Development Server:</b>", style_h2),
        Paragraph("<font name='Courier'>cd C:\\Users\\prave\\.gemini\\antigravity\\scratch\\dr-praveen-homoeopathy<br/>$env:PATH = 'C:\\Users\\prave\\nodejs;' + $env:PATH<br/>npm run dev</font>", style_code),
        Spacer(1, 4),
        Paragraph("<b>2. Preview in Web Browser:</b> Open <font name='Courier'><b>http://localhost:3000</b></font>", style_body),
        Spacer(1, 4),
        Paragraph("<b>3. Deploying to Vercel (Production):</b> Push the codebase to GitHub or run <font name='Courier'>npx vercel</font>. Configure Supabase environment variables in the Vercel dashboard: <font name='Courier'>NEXT_PUBLIC_SUPABASE_URL</font> and <font name='Courier'>NEXT_PUBLIC_SUPABASE_ANON_KEY</font>.", style_body),
        Spacer(1, 4),
        Paragraph("<b>4. Supabase Database Execution:</b> Run <font name='Courier'>supabase/schema.sql</font> in the Supabase SQL Editor. It creates tables, indexes, and Row Level Security (RLS) policies allowing public read access to active products and restricting write operations to authenticated administrators.", style_body)
    ]
    story.extend(run_steps)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    build_pdf(OUTPUT_PDF_1)
    # Also save a copy in the artifact directory
    import shutil
    shutil.copyfile(OUTPUT_PDF_1, OUTPUT_PDF_2)
    print(f"PDF generated successfully at:\n{OUTPUT_PDF_1}\n{OUTPUT_PDF_2}")
