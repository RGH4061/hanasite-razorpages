/* Hana site search — index data.
   Regenerated 13 Aug 2026 from hana-search-plus-package-finder/mockups/site-search-mockup.html
   (106 pages, five vocabulary sources). Ranking behaviour on the site is the pack's
   behaviour, not a re-implementation. Package rows live in js/search/packages.js. */
const PAGES = [{"n": "Home", "u": "/", "t": "Home", "s": "Corporate", "k": "electronics manufacturing services Thailand", "p": "HIGH"}, {"n": "Why Hana — Vertical Integration", "u": "/about/why-hana", "t": "Brand Page", "s": "About", "k": "EMS OSAT vertical integration electronics manufacturer", "p": "HIGH"}, {"n": "Markets Hub", "u": "/markets/", "t": "Hub", "s": "Markets", "k": "electronics manufacturing industries", "p": "HIGH"}, {"n": "Automotive", "u": "/markets/automotive/", "t": "Pillar", "s": "Markets", "k": "automotive electronics manufacturing Thailand IATF 16949", "p": "HIGH"}, {"n": "Power Modules", "u": "/markets/automotive/power-modules/", "t": "Sub-page", "s": "Markets", "k": "IGBT SiC power modules EMS Thailand", "p": "HIGH"}, {"n": "Sensor Assembly", "u": "/markets/automotive/sensor-assembly/", "t": "Sub-page", "s": "Markets", "k": "automotive sensor assembly Thailand", "p": "HIGH"}, {"n": "LED Lighting", "u": "/markets/automotive/led-lighting/", "t": "Sub-page", "s": "Markets", "k": "automotive LED lighting assembly Thailand", "p": "MEDIUM"}, {"n": "RFID Tire Tags", "u": "/markets/automotive/rfid-tire-tags/", "t": "Sub-page", "s": "Markets", "k": "RFID tire tag manufacturer automotive", "p": "HIGH"}, {"n": "Automotive PCBA", "u": "/markets/automotive/pcba/", "t": "Sub-page", "s": "Markets", "k": "automotive PCBA manufacturer IATF 16949", "p": "HIGH"}, {"n": "Industrial & IoT", "u": "/markets/industrial-iot/", "t": "Pillar", "s": "Markets", "k": "industrial IoT electronics manufacturing EMS", "p": "HIGH"}, {"n": "PCBA & Box Build", "u": "/markets/industrial-iot/pcba-box-build/", "t": "Sub-page", "s": "Markets", "k": "industrial PCBA box build EMS", "p": "HIGH"}, {"n": "IoT Device Assembly", "u": "/markets/industrial-iot/iot-device-assembly/", "t": "Sub-page", "s": "Markets", "k": "IoT device assembly Thailand EMS", "p": "MEDIUM"}, {"n": "RFID Asset Tracking", "u": "/markets/industrial-iot/rfid-asset-tracking/", "t": "Sub-page", "s": "Markets", "k": "industrial RFID asset tracking EMS", "p": "MEDIUM"}, {"n": "Telecommunications", "u": "/markets/telecommunications/", "t": "Pillar", "s": "Markets", "k": "telecom electronics manufacturing EMS Thailand", "p": "HIGH"}, {"n": "RF & High-Frequency Assembly", "u": "/markets/telecommunications/rf-assembly/", "t": "Sub-page", "s": "Markets", "k": "RF high frequency PCB assembly telecom", "p": "HIGH"}, {"n": "Telecom PCBA", "u": "/markets/telecommunications/pcba/", "t": "Sub-page", "s": "Markets", "k": "telecom PCBA manufacturing Thailand", "p": "MEDIUM"}, {"n": "RFID", "u": "/markets/rfid/", "t": "Pillar", "s": "Markets", "k": "RFID manufacturing card tag inlay EMS", "p": "HIGH"}, {"n": "RFID Card Manufacturing", "u": "/markets/rfid/rfid-cards/", "t": "Sub-page", "s": "Markets", "k": "RFID smart card manufacturing Thailand", "p": "HIGH"}, {"n": "RFID Tags & Inlays", "u": "/markets/rfid/rfid-tags-inlays/", "t": "Sub-page", "s": "Markets", "k": "RFID tag inlay manufacturer UHF HF LF", "p": "HIGH"}, {"n": "RFID Tire Tags", "u": "/markets/rfid/rfid-tire-tags/", "t": "Sub-page", "s": "Markets", "k": "RFID tire tag world leading manufacturer", "p": "HIGH"}, {"n": "Optical & Sensors", "u": "/markets/optical-sensors/", "t": "Pillar", "s": "Markets", "k": "optical sensor electronics manufacturing EMS", "p": "HIGH"}, {"n": "Camera Modules", "u": "/markets/optical-sensors/camera-modules/", "t": "Sub-page", "s": "Markets", "k": "camera module manufacturer precision optical", "p": "HIGH"}, {"n": "MEMS Sensors", "u": "/markets/optical-sensors/mems-sensors/", "t": "Sub-page", "s": "Markets", "k": "MEMS sensor manufacturer EMS Thailand", "p": "HIGH"}, {"n": "Consumer Electronics & Smartphone", "u": "/markets/consumer-electronics/", "t": "Pillar", "s": "Markets", "k": "consumer electronics EMS smartphone manufacturer", "p": "HIGH"}, {"n": "SMT & Sensor Assembly", "u": "/markets/consumer-electronics/smt-sensors/", "t": "Sub-page", "s": "Markets", "k": "consumer electronics SMT MEMS sensor assembly", "p": "HIGH"}, {"n": "Wireless Charging", "u": "/markets/consumer-electronics/wireless-charging/", "t": "Sub-page", "s": "Markets", "k": "wireless charging module assembly EMS consumer", "p": "HIGH"}, {"n": "Medical", "u": "/markets/medical/", "t": "Pillar", "s": "Markets", "k": "medical electronics manufacturing ISO 13485 Thailand", "p": "HIGH"}, {"n": "Hearing Aid Assembly", "u": "/markets/medical/hearing-aid-assembly/", "t": "Sub-page", "s": "Markets", "k": "hearing aid assembly manufacturer ISO 13485", "p": "HIGH"}, {"n": "Medical MEMS & Sensors", "u": "/markets/medical/mems-sensors/", "t": "Sub-page", "s": "Markets", "k": "medical MEMS sensor assembly inhaler respirator", "p": "HIGH"}, {"n": "Medical PCBA", "u": "/markets/medical/pcba/", "t": "Sub-page", "s": "Markets", "k": "medical PCBA assembly ISO 13485 Thailand", "p": "HIGH"}, {"n": "Wireless Charging (Medical)", "u": "/markets/medical/wireless-charging/", "t": "Sub-page", "s": "Markets", "k": "wireless charging hearing aid medical device", "p": "MEDIUM"}, {"n": "Access Control", "u": "/markets/access-control/", "t": "Pillar", "s": "Markets", "k": "access control electronics manufacturing EMS", "p": "HIGH"}, {"n": "RFID Access Cards", "u": "/markets/access-control/rfid-cards/", "t": "Sub-page", "s": "Markets", "k": "RFID access control card manufacturer", "p": "HIGH"}, {"n": "Smart Lock & Door Hardware", "u": "/markets/access-control/smart-lock-assembly/", "t": "Sub-page", "s": "Markets", "k": "smart lock electronic door hardware assembly EMS", "p": "MEDIUM"}, {"n": "Power Management", "u": "/markets/power-management/", "t": "Pillar", "s": "Markets", "k": "power management electronics manufacturing EMS", "p": "HIGH"}, {"n": "IGBT & SiC Power Modules", "u": "/markets/power-management/igbt-sic-modules/", "t": "Sub-page", "s": "Markets", "k": "IGBT SiC power module assembly test Thailand", "p": "HIGH"}, {"n": "Power Discrete Assembly", "u": "/markets/power-management/power-discrete/", "t": "Sub-page", "s": "Markets", "k": "power discrete semiconductor assembly EMS", "p": "HIGH"}, {"n": "Data Centers", "u": "/markets/data-centers/", "t": "Pillar", "s": "Markets", "k": "EMS for AI data center electronics", "p": "MEDIUM"}, {"n": "Capabilities Hub", "u": "/capabilities/", "t": "Hub", "s": "Capabilities", "k": "EMS manufacturing capabilities Thailand", "p": "HIGH"}, {"n": "PCBA & Box Build", "u": "/capabilities/pcba-box-build/", "t": "Cap Parent", "s": "Capabilities", "k": "PCBA box build assembly services Thailand EMS", "p": "HIGH"}, {"n": "SMT Assembly", "u": "/capabilities/pcba-box-build/smt-assembly/", "t": "Sub-pillar", "s": "Capabilities", "k": "SMT assembly services Thailand EMS manufacturer", "p": "HIGH"}, {"n": "Chip on Board (COB)", "u": "/capabilities/pcba-box-build/chip-on-board/", "t": "Sub-pillar", "s": "Capabilities", "k": "chip on board COB assembly manufacturer EMS (incl. chip on flex / COF)", "p": "HIGH"}, {"n": "Box Build", "u": "/capabilities/pcba-box-build/box-build/", "t": "Sub-pillar", "s": "Capabilities", "k": "box build full product assembly services EMS", "p": "HIGH"}, {"n": "OSAT", "u": "/capabilities/osat/", "t": "Cap Parent", "s": "Capabilities", "k": "OSAT IC assembly test semiconductor Thailand", "p": "HIGH"}, {"n": "Package Design & Simulation", "u": "/capabilities/osat/package-design/", "t": "Sub-pillar", "s": "Capabilities", "k": "semiconductor package design simulation leadframe thermal warpage", "p": "HIGH"}, {"n": "Power Packages — SiC & GaN", "u": "/capabilities/osat/power-packages/", "t": "Sub-pillar", "s": "Capabilities", "k": "SiC GaN power package assembly discrete module", "p": "HIGH"}, {"n": "QFN, DFN & LGA", "u": "/capabilities/osat/qfn-dfn-lga/", "t": "Sub-pillar", "s": "Capabilities", "k": "QFN DFN LGA package assembly wettable flank automotive", "p": "HIGH"}, {"n": "Clear Mold Packaging", "u": "/capabilities/osat/clear-mold-packaging/", "t": "Sub-pillar", "s": "Capabilities", "k": "clear mold packaging optical LGA package assembly", "p": "HIGH"}, {"n": "Hermetic & Ceramic Packaging", "u": "/capabilities/osat/hermetic-ceramic/", "t": "Sub-pillar", "s": "Capabilities", "k": "hermetic ceramic packaging TO-Can leak test", "p": "MEDIUM"}, {"n": "Ultra-small Packages", "u": "/capabilities/osat/ultra-small-packages/", "t": "Sub-pillar", "s": "Capabilities", "k": "ultra small IC package 0.6mm body thin package", "p": "HIGH"}, {"n": "System in Package (SiP) & Modules", "u": "/capabilities/osat/system-in-package/", "t": "Sub-pillar", "s": "Capabilities", "k": "system in package SiP assembly SMT modules Thailand", "p": "HIGH"}, {"n": "Wafer Processing", "u": "/capabilities/osat/wafer-processing/", "t": "Sub-pillar", "s": "Capabilities", "k": "wafer back-grinding and dicing service OSAT Thailand", "p": "HIGH"}, {"n": "Wafer Level Packaging (WLCSP)", "u": "/capabilities/osat/wafer-level-packaging/", "t": "Sub-pillar", "s": "Capabilities", "k": "wafer level packaging WLCSP manufacturer OSAT", "p": "HIGH"}, {"n": "Flip Chip & Interconnect", "u": "/capabilities/osat/flip-chip/", "t": "Sub-pillar", "s": "Capabilities", "k": "flip chip assembly semiconductor EMS Thailand", "p": "HIGH"}, {"n": "Wafer Probe & Final Test", "u": "/capabilities/osat/wafer-probe-final-test/", "t": "Sub-pillar", "s": "Capabilities", "k": "wafer probe final test semiconductor OSAT Thailand", "p": "HIGH"}, {"n": "Microelectronic Assembly", "u": "/capabilities/microelectronic-assembly/", "t": "Cap Parent", "s": "Capabilities", "k": "microelectronic assembly flip chip MEMS sensor interconnect micro-assembly EMS", "p": "HIGH"}, {"n": "Flip Chip", "u": "/capabilities/microelectronic-assembly/flip-chip/", "t": "Sub-pillar", "s": "Capabilities", "k": "flip chip microelectronic assembly manufacturer", "p": "MEDIUM"}, {"n": "MEMS & Sensor Assembly", "u": "/capabilities/microelectronic-assembly/mems-sensor-assembly/", "t": "Sub-pillar", "s": "Capabilities", "k": "MEMS sensor assembly manufacturer EMS Thailand", "p": "HIGH"}, {"n": "Interconnect Solutions", "u": "/capabilities/microelectronic-assembly/interconnect-solutions/", "t": "Sub-pillar", "s": "Capabilities", "k": "interconnect solutions wire bond ribbon assembly EMS", "p": "MEDIUM"}, {"n": "Micro-Assembly", "u": "/capabilities/microelectronic-assembly/micro-assembly/", "t": "Sub-pillar", "s": "Capabilities", "k": "micro miniature assembly manufacturer", "p": "MEDIUM"}, {"n": "RFID & Smart Tags", "u": "/capabilities/rfid/", "t": "Cap Parent", "s": "Capabilities", "k": "RFID manufacturing card tag inlay EMS", "p": "HIGH"}, {"n": "RFID Tire Tags", "u": "/capabilities/rfid/rfid-tire-tags/", "t": "Sub-pillar", "s": "Capabilities", "k": "RFID tire tag manufacturer world leading", "p": "HIGH"}, {"n": "RFID Inlays", "u": "/capabilities/rfid/rfid-inlay/", "t": "Sub-pillar", "s": "Capabilities", "k": "RFID inlay manufacturer UHF HF LF", "p": "HIGH"}, {"n": "Automation & Smart Manufacturing", "u": "/capabilities/automation/", "t": "Cap Parent", "s": "Capabilities", "k": "electronics manufacturing automation AOI MES traceability", "p": "HIGH"}, {"n": "Robotic & Smart Manufacturing", "u": "/capabilities/automation/robotic-smart-manufacturing/", "t": "Sub-pillar", "s": "Capabilities", "k": "robotic handling automated test electronics manufacturing", "p": "MEDIUM"}, {"n": "Manufacturing Traceability", "u": "/capabilities/automation/mes-traceability/", "t": "Sub-pillar", "s": "Capabilities", "k": "MES manufacturing traceability electronics EMS", "p": "MEDIUM"}, {"n": "DFx & JDM Collaboration", "u": "/capabilities/dfx-jdm/", "t": "Cap Parent", "s": "Capabilities", "k": "design for excellence DFM JDM NPI electronics manufacturing", "p": "HIGH"}, {"n": "Design for Excellence (DFx / DFM)", "u": "/capabilities/dfx-jdm/design-for-excellence/", "t": "Sub-pillar", "s": "Capabilities", "k": "design for excellence DFX DFM manufacturability review", "p": "HIGH"}, {"n": "Joint Development Model (JDM)", "u": "/capabilities/dfx-jdm/joint-development-model/", "t": "Sub-pillar", "s": "Capabilities", "k": "joint development manufacturing JDM electronics", "p": "MEDIUM"}, {"n": "New Product Introduction (NPI)", "u": "/capabilities/dfx-jdm/new-product-introduction/", "t": "Sub-pillar", "s": "Capabilities", "k": "new product introduction NPI electronics manufacturing", "p": "HIGH"}, {"n": "Locations", "u": "/locations/", "t": "Hub", "s": "Locations", "k": "Hana manufacturing locations worldwide", "p": "HIGH"}, {"n": "Ayutthaya", "u": "/locations/thailand/ayutthaya/", "t": "Location", "s": "Locations", "k": "IC assembly OSAT Ayutthaya Thailand", "p": "HIGH"}, {"n": "Lamphun", "u": "/locations/thailand/lamphun/", "t": "Location", "s": "Locations", "k": "EMS electronics manufacturing Lamphun Thailand", "p": "HIGH"}, {"n": "Ohio", "u": "/locations/usa/ohio/", "t": "Location", "s": "Locations", "k": "RFID tire tag manufacturer Ohio USA", "p": "HIGH"}, {"n": "Jiaxing", "u": "/locations/china/jiaxing/", "t": "Location", "s": "Locations", "k": "EMS manufacturer Jiaxing China IoT RFID", "p": "MEDIUM"}, {"n": "Koh Kong", "u": "/locations/cambodia/koh-kong/", "t": "Location", "s": "Locations", "k": "remote control assembly manufacturer Cambodia", "p": "LOW"}, {"n": "Our Heritage", "u": "/about/heritage", "t": "Corporate", "s": "About", "k": "Hana Microelectronics history founded 1978", "p": "MEDIUM"}, {"n": "Leadership", "u": "/about/leadership", "t": "Corporate", "s": "About", "k": "Hana Microelectronics leadership directors executives", "p": "MEDIUM"}, {"n": "Awards & Quality", "u": "/about/awards", "t": "Corporate", "s": "About", "k": "Hana Microelectronics awards recognition quality certifications IATF 16949 ISO 13485 ISO 27001", "p": "HIGH"}, {"n": "Investor Relations", "u": "/investor-relations/", "t": "Hub", "s": "Investor Relations", "k": "Hana Microelectronics investor relations SET listed financial information", "p": "HIGH"}, {"n": "Investor News", "u": "/investor-relations/investor-news", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics SET news press releases financial information", "p": "HIGH"}, {"n": "Group Structure & Shareholders", "u": "/investor-relations/group-structure-shareholders", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics group structure subsidiaries major shareholders", "p": "MEDIUM"}, {"n": "Annual Report", "u": "/investor-relations/annual-report", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics annual report 56-1 one report SET", "p": "HIGH"}, {"n": "Sustainability", "u": "/investor-relations/sustainability", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics sustainability ESG report", "p": "HIGH"}, {"n": "Governance Documents", "u": "/investor-relations/governance-documents", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics governance documents articles of association charters anti-corruption", "p": "MEDIUM"}, {"n": "Investor Events & Contacts", "u": "/investor-relations/events-contact", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics investor events contacts IR", "p": "MEDIUM"}, {"n": "Investor FAQ & Knowledge Hub", "u": "/investor-relations/faqs", "t": "AEO", "s": "Investor Relations", "k": "Hana Microelectronics investor FAQ SET listing", "p": "MEDIUM"}, {"n": "Careers", "u": "/careers", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers jobs Thailand", "p": "HIGH"}, {"n": "Job Detail (template)", "u": "/careers/jobs/[job-title]", "t": "Template", "s": "Careers", "k": "[dynamic per job]", "p": "HIGH"}, {"n": "Application: Data Consent (Step 1)", "u": "/careers/jobs/[job-title]/apply", "t": "Template", "s": "Careers", "k": "[dynamic per job — consent step]", "p": "HIGH"}, {"n": "Application: Form (Step 2)", "u": "/careers/jobs/[job-title]/apply/form", "t": "Template", "s": "Careers", "k": "[dynamic per job — application form]", "p": "HIGH"}, {"n": "Bangkok", "u": "/careers/bangkok", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Bangkok Thailand", "p": "MEDIUM"}, {"n": "Ayutthaya", "u": "/careers/ayutthaya", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Ayutthaya Thailand", "p": "MEDIUM"}, {"n": "Lamphun", "u": "/careers/lamphun", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Lamphun Thailand", "p": "MEDIUM"}, {"n": "Cambodia", "u": "/careers/cambodia", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Cambodia", "p": "LOW"}, {"n": "Hana Stories (Hub)", "u": "/careers/stories", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics employee stories testimonials careers", "p": "HIGH"}, {"n": "Story Detail (template)", "u": "/careers/stories/[person-name]", "t": "Template", "s": "Careers", "k": "[dynamic per person]", "p": "MEDIUM"}, {"n": "Contact", "u": "/contact/", "t": "Corporate", "s": "Contact", "k": "contact electronics manufacturer Thailand", "p": "HIGH"}, {"n": "News & Insights", "u": "/news/", "t": "Blog/AEO", "s": "Corporate", "k": "electronics manufacturing news Thailand", "p": "MEDIUM"}, {"n": "FAQ", "u": "/faq/", "t": "AEO", "s": "Corporate", "k": "EMS FAQ electronics manufacturing Thailand", "p": "HIGH"}, {"n": "Code of Conduct", "u": "/code-of-conduct", "t": "Legal", "s": "Corporate", "k": "Hana Microelectronics code of conduct", "p": "MEDIUM"}, {"n": "Privacy Policy", "u": "/privacy-policy", "t": "Legal", "s": "Corporate", "k": "Hana Microelectronics privacy policy", "p": "MEDIUM"}, {"n": "Terms of Use", "u": "/terms-of-use", "t": "Legal", "s": "Corporate", "k": "Hana Microelectronics terms of use", "p": "LOW"}, {"n": "Sitemap (HTML)", "u": "/sitemap", "t": "Utility", "s": "Corporate", "k": "Hana Microelectronics sitemap", "p": "LOW"}];

/* Sample of the proposed SEARCH TERMS column — the shorthand people actually type.
   About 20 pages shown here; the real column would cover ~40. */
const TERMS = {
"/capabilities/microelectronic-assembly/mems-sensor-assembly/":"mems sensor packaging transducer accelerometer gyroscope microphone pressure sensor die sensor die",
"/capabilities/osat/wafer-level-packaging/":"wlcsp wafer level chip scale csp wlp bump",
"/capabilities/osat/die-attach-wire-bond/":"wire bond wirebond gold wire copper wire die attach die bond eutectic epoxy",
"/capabilities/osat/flip-chip/":"flip chip bump copper pillar cu pillar underfill c4 fine pitch",
"/capabilities/microelectronic-assembly/flip-chip/":"flip chip micro bump fine pitch",
"/capabilities/osat/system-in-package/":"sip module multi die stacked die system in package",
"/capabilities/osat/wafer-probe-final-test/":"probe wafer probe final test ate burn in test house sort handler socket",
"/capabilities/osat/wafer-processing/":"back grind backgrinding grinding dicing saw thinning wafer",
"/capabilities/pcba-box-build/smt-assembly/":"smt surface mount pick and place reflow 0402 0201 01005 pcb pcba solder",
"/capabilities/pcba-box-build/box-build/":"box build final assembly enclosure system assembly full product integration",
"/capabilities/pcba-box-build/chip-on-board/":"cob chip on board glob top direct die",
"/capabilities/microelectronic-assembly/micro-assembly/":"micro assembly miniature precision placement",
"/capabilities/microelectronic-assembly/interconnect-solutions/":"interconnect ribbon bond wedge bond wire",
"/capabilities/automation/aoi-spi/":"aoi spi optical inspection solder paste inspection x-ray",
"/capabilities/automation/mes-traceability/":"mes traceability serialisation track and trace",
"/capabilities/automation/robotic-handling-test/":"robot robotic cobot automated handling",
"/capabilities/rfid/rfid-inlay/":"inlay uhf hf lf nfc antenna",
"/capabilities/rfid/rfid-tire-tags/":"tire tag tyre tpms rubber",
"/capabilities/dfx-jdm/design-for-excellence/":"dfm dfx design review manufacturability cost down",
"/capabilities/dfx-jdm/new-product-introduction/":"npi new product prototype ramp pilot",
"/markets/automotive/":"iatf 16949 aec-q100 grade 0 under hood",
"/markets/medical/":"iso 13485 medical device hearing aid drug delivery",
"/locations/china/jiaxing/":"jiaxing zhejiang china",
"/locations/cambodia/koh-kong/":"koh kong cambodia",
"/locations/thailand/ayutthaya/":"ayutthaya thailand osat ic assembly",
"/locations/thailand/lamphun/":"lamphun thailand ems pcba",
"/locations/usa/ohio/":"solon ohio usa rfid"
};


/* ---------------------------------------------------------------------------
   SECONDARY KEYWORDS — the `keywords:` line in each page-spec markdown file
   under Page Specs & Templates/. Already written for SEO, never indexed:
   14 pages, 84 phrases. Extracted verbatim, nothing added.
   --------------------------------------------------------------------------- */
const SECONDARY = {
"/markets/consumer-electronics/smt-sensors/":"consumer electronics SMT, MEMS sensor assembly, fine-pitch SMT, micro-BGA assembly, WLCSP assembly, high-volume SMT manufacturer",
"/markets/consumer-electronics/wireless-charging/":"wireless charging module assembly, coil winding manufacturer, wireless charger contract manufacturer, charging pad assembly, wireless charging EMS",
"/markets/industrial-iot/iot-device-assembly/":"IoT device assembly, connected device manufacturing, wireless functional test, box build IoT, IoT contract manufacturer, EMS IoT device",
"/markets/industrial-iot/pcba-box-build/":"industrial PCBA, high density PCBA, high density PCBA manufacturer, industrial box build, ruggedized PCBA, conformal coating PCBA",
"/markets/industrial-iot/rfid-asset-tracking/":"industrial RFID tags, RFID asset tracking, on-metal RFID tag, rugged UHF tag, UHF RFID inlay manufacturer, warehouse asset tag",
"/markets/optical-sensors/mems-sensors/":"MEMS sensor manufacturer, MEMS sensor assembly, optical sensor packaging, proximity sensor manufacturing, ambient light sensor assembly, time of flight sensor packaging",
"/markets/power-management/igbt-sic-modules/":"IGBT SiC power module assembly, SiC power module manufacturer, IGBT module packaging, IPM assembly, DBC substrate module assembly, power module cycling test",
"/markets/power-management/power-discrete/":"power discrete assembly, power discrete packaging, SiC MOSFET packaging, TO-247 assembly, D2PAK-7L, wettable flank leadframe, copper clip MOSFET",
"/markets/rfid/rfid-cards/":"RFID smart card manufacturing, contactless card manufacturer, RFID card inlay, card lamination, card personalization, transit card manufacturing",
"/markets/rfid/rfid-tags-inlays/":"RFID tag manufacturer, RFID inlay manufacturer, UHF inlay, HF inlay, RFID strap, on-metal RFID tag, temperature sensing RFID tag, battery assisted passive tag",
"/markets/rfid/rfid-tire-tags/":"RFID tire tag manufacturer, rubber embeddable RFID tag, UHF tire tag, tire RFID inlay",
"/markets/telecommunications/rf-assembly/":"RF assembly, high frequency PCB assembly telecom, microwave module assembly, millimeter wave module assembly, RF power amplifier assembly, hermetic seal helium leak test"
};


/* ---------------------------------------------------------------------------
   CAPABILITIES SEARCH TERMS — drafted 4 Aug 2026, full column.
   Source: Search terms — Capabilities.md in this folder. Every term traced to
   the page brief. Flip Chip deliberately omits bumping / RDL.
   --------------------------------------------------------------------------- */
const CAPTERMS = {
"/capabilities/":"capabilities, processes, services, what can you make, what do you do, can you build, manufacturing services, technology",
"/capabilities/automation/":"automation, automated, robotic, robot, cobot, in-line, lights out, industry 4.0",
"/capabilities/automation/mes-traceability/":"mes, traceability, unit level traceability, track and trace, serialisation, serialization, die position, wafer map, genealogy, recall",
"/capabilities/automation/robotic-smart-manufacturing/":"robotic, robot, laser soldering, selective soldering, singulation, auto offload, handler, automated test, defect scrap, potting, aoi, spi, optical inspection, solder paste inspection, x-ray, 3d aoi, 3d spi, six sides inspection, coating inspection, post reflow inspection",
"/capabilities/dfx-jdm/":"dfx, dfm, design support, engineering support, co-development, collaboration, design for manufacture",
"/capabilities/dfx-jdm/design-for-excellence/":"dfm, dfx, dfa, dft, design review, manufacturability, cost down, warpage, thermal simulation, mechanical simulation, package design, pcb design review, autocad, solidworks, altium, ansys",
"/capabilities/dfx-jdm/joint-development-model/":"jdm, joint development, co-design, co-engineering, odm, product development partner",
"/capabilities/dfx-jdm/new-product-introduction/":"npi, new product introduction, prototype, trial run, pilot run, qualification build, ramp, ppap, mass production release, account engineer",
"/capabilities/microelectronic-assembly/":"microelectronics, micro assembly, precision assembly, hybrid assembly, bare die assembly, sensor packaging, miniature assembly",
"/capabilities/microelectronic-assembly/flip-chip/":"flip chip, micro bump, fine pitch flip chip, gold to gold interconnect, precision flip chip",
"/capabilities/microelectronic-assembly/interconnect-solutions/":"interconnect, wire bond, ribbon bond, ribbon, copper clip, clip bond, voids, deep access bonding, acf, hot bar, hot bar bonding, flex to pcb, dual-cool, dual cool, top-exposed clip, two-sided heat sinking, wettable flank",
"/capabilities/microelectronic-assembly/mems-sensor-assembly/":"mems, sensor, sensor packaging, sensor assembly, optical package, open cavity, pressure sensor, humidity sensor, lidar, infrared, tsv, proximity sensor, ambient light sensor, time of flight, sensor test",
"/capabilities/microelectronic-assembly/micro-assembly/":"micro assembly, miniature assembly, hearing aid, hearing aid assembly, fine wire soldering, micro package, acoustic test, lock mechanism, micro electro mechanical",
"/capabilities/osat/":"osat, subcon, subcontractor, outsourced assembly and test, ic packaging, semiconductor packaging, chip packaging, package assembly, assembly and test, back end, test house",
"/capabilities/osat/flip-chip/":"flip chip, copper pillar, cu pillar, 80 micron pitch, gold to gold interconnect, thermocompression, solder bump mounting, underfill, c4, die attach, die bond, wire bond, wirebond, gold wire, copper wire, aluminium wire, aluminum wire, silver sinter, ag sinter, solder die attach, conductive epoxy, deep access, multi-die, optoelectronic",
"/capabilities/osat/qfn-dfn-lga/":"qfn, dfn, lga, leadless, wettable flank, de-burr, fam mold, msl1, multi-die leadless, automotive leadless",
"/capabilities/osat/system-in-package/":"sip, system in package, module, multi-die, stacked die, molded module, leadframe module, substrate module, coil assembly, hermetic, helium leak test",
"/capabilities/osat/ultra-small-packages/":"lga, qfn, dfn, ultra small, small package, small form factor, 0.6mm, 0.37mm, thin package, miniature package, xxdfn, uqfn, body size, sot23, sc70, soic, pdip",
"/capabilities/osat/wafer-level-packaging/":"wlcsp, wafer level packaging, wlp, chip scale package, csp, pop, package on package, 0.2mm pitch, flux dipping, tsv, ultrathin, laser dicing",
"/capabilities/osat/wafer-probe-final-test/":"probe, wafer probe, wafer sort, sort, final test, ate, test development, burn-in, msl, tape and reel, handler, mixed signal test, rf test, opto coupler test",
"/capabilities/osat/wafer-processing/":"back grind, backgrind, grinding, thinning, wafer thinning, dicing, saw, laser dicing, backside coat, daf, die attach film, sic, gan, low-k, 12 inch wafer, 300mm",
"/capabilities/pcba-box-build/":"pcba, pcb assembly, circuit board assembly, board assembly, contract assembly, wire harness, cable assembly, rf assembly, conformal coating, led packaging",
"/capabilities/pcba-box-build/box-build/":"box build, final assembly, full product assembly, enclosure, cable assembly, wire harness, potting, system integration, functional test, drop ship, fulfilment",
"/capabilities/pcba-box-build/chip-on-board/":"cob, chip on board, bare die, die on board, glob top, dam and fill, encapsulation, gold wire bond, aluminium wire bond, ceramic substrate, bt laminate, rigid flex, cof, chip on flex, flexible circuit, flex assembly, bga on flex, acf, hot bar bonding, flex to pcb, flex to ceramic",
"/capabilities/pcba-box-build/smt-assembly/":"smt, surface mount, pick and place, reflow, 01005, 0201, 0402, fine pitch, high density, hdi, high density interconnect, bga pitch, 0.2mm bga, micro bga, solder paste, spi, x-ray",
"/capabilities/rfid/":"rfid, smart tag, tag, inlay, transponder, nfc, uhf, hf, lf, smart card, contactless",
"/capabilities/rfid/rfid-inlay/":"inlay, rfid inlay, wet inlay, dry inlay, roll to roll, antenna, uhf, hf, lf, nfc, arc certified, label, tag converting",
"/capabilities/rfid/rfid-tire-tags/":"tire tag, tyre tag, rubber embeddable, tire strap, in-tire, vulcanisation, temperature sensing tag, uhf tire tag, tire inlay, tpms",
"/locations/":"locations, factories, plants, sites, facilities, where, where do you manufacture, manufacturing footprint, countries, addresses, map, thailand, china, cambodia, usa, dual source, second source, supply chain resilience",
"/locations/cambodia/koh-kong/":"koh kong, cambodia, special economic zone, sez, pcba, smt, box build, final assembly, cable assembly, wire harness, crystal assembly, remote control, access control reader, security reader, usb token, iso 13485, tl9000",
"/locations/china/jiaxing/":"jiaxing, china, zhejiang, ems, pcba, smt, cob, cof, rfid inlay, inlay lines, ic packaging, flip chip, power discrete, power modules, led packaging, hybrid modules, jdm, medical line, automotive line, iso 13485, iatf 16949, iecq qc 080000, iso 27001",
"/locations/thailand/ayutthaya/":"ayutthaya, ayt, thailand, hana semiconductor, osat, ic assembly, ic packaging, semiconductor packaging, test, final test, wafer probe, burn-in, opto coupler, solid state relay, proximity sensor, high voltage isolation, mixed signal, logic, memory, rf, ultra-small packages, iso 13485, iatf 16949, iso 27001, ansi/esd",
"/locations/thailand/lamphun/":"lamphun, lpn, thailand, northern thailand, chiang mai, ems, pcba, smt, cob, chip on board, cof, hybrid assembly, flip chip, led packaging, clear qfn, micromechanical, automotive sensors, millimetre wave, industrial meters, medical devices, iso 13485, iatf 16949",
"/locations/usa/ohio/":"ohio, solon, twinsburg, usa, united states, america, north america, hana technologies, rfid inlay, uhf inlay, hf inlay, strap, arc certified, itar, defence, defense"
};
Object.assign(TERMS, CAPTERMS);
const NOROW_TERMS = {};


/* ---------------------------------------------------------------------------
   "WHAT WE SPECIALIZE IN" — the product section on all 26 Markets sub-pages.
   Indexed as full section text, not just the bold labels: "Dual Cool", "TO-247TE",
   "hermetic sealing" and "helium fine-leak test" all live in the description that
   follows a bold, so labels alone would miss them.
   Source: the `## What we specialize in` block in Page Specs & Templates/Markets/.
   --------------------------------------------------------------------------- */
const SPECIALISE = {
"/markets/access-control/rfid-cards/":"- credential inlay and card build \u2014 hf and uhf inlays through to laminated, printed and finished cards and fobs, on automated inlay lines. - secure chip handling \u2014 chip attach, encoding and personalization under controlled handling, with the unique-id management an access program depends on. - read and write verification \u2014 every credential is tested and its unique id accounted for, so faults are caught on the line rather than at the door.",
"/markets/access-control/smart-lock-assembly/":"- electro-mechanical assembly \u2014 the board, motor or actuator, battery and mechanical hardware brought together into a complete lock or reader. - radio and electronics integration \u2014 ble and other radios, keypads, fingerprint and reader electronics assembled onto the board and into the housing. - complete-unit functional test \u2014 the electronics and the mechanism tested together, so the lock is proven as a working product, not just a populated board.",
"/markets/automotive/led-lighting/":"hana builds the lighting module as one tested unit: - led placement \u2014 smt and chip-on-board (cob) placement, in single- and multi-led layouts, to optical-grade accuracy. - board and thermal build \u2014 metal-core and fr4 board assembly with a thermal path attaching the module to its heat sink. - driver integration \u2014 the driver and power electronics built onto the same module, so the light source and its control circuit are one assembly. - light and quality checks \u2014 light-output and color checks so modules match across a vehicle.",
"/markets/automotive/pcba/":"hana assembles automotive boards across technologies and complexity: - fine-pitch board assembly \u2014 fine-pitch and small-component placement, double-sided and mixed-technology boards. - soldering \u2014 reflow, plus selective and through-hole soldering where the design needs it. - inspection on every board \u2014 automated optical inspection on every board rather than a sampled batch, with x-ray for the hidden and bga joints an automotive program cannot leave unproven.",
"/markets/automotive/power-modules/":"hana builds power modules from bare die through to a tested, traceable assembly: - power device attach \u2014 igbt and silicon-carbide (sic) die in single- and multi-die layouts, joined with solder or silver-sinter die attach for the higher-temperature work. - interconnect \u2014 aluminum heavy-wire and copper-clip bonding to carry the current the module is designed for. - substrate and thermal path \u2014 ceramic substrates, baseplate attach and controlled solder joints that move heat from the die to the coolant. - encapsulation and finishing \u2014 protecting the assembly against the powertrain's electrical, thermal and mechanical environment.",
"/markets/automotive/rfid-tire-tags/":"hana builds the tire tag from inlay through to a tested, traceable assembly: - rugged inlay and strap build \u2014 uhf inlays and straps designed to be embedded in rubber. - materials and encapsulation \u2014 rubber-compatible materials and encapsulation that take the heat and pressure of the cure. - automated assembly \u2014 roll-to-roll lines for consistent, high-volume build. - test and unique id \u2014 read-range and functional test, durability checks, and a unique identity per tag.",
"/markets/automotive/sensor-assembly/":"hana builds sensor modules from die attach through to a tested, calibrated assembly: - sensor die attach \u2014 low-stress die attach for mems and sensor die, in cavity and open-package formats. - interconnect \u2014 wire-bond and flip-chip interconnect matched to the device. - optical alignment and packaging \u2014 alignment of camera and optical modules, lens and aperture assembly, and cavity or sealed package work. - functional test and calibration \u2014 verifying the sensor performs to specification before it leaves the line.",
"/markets/consumer-electronics/smt-sensors/":"- fine-pitch consumer pcbas \u2014 high-volume surface-mount boards carrying 01005 passives and micro-bga or wlcsp packages to 0.2 mm pitch, placed to \u00b118 \u00b5m on panels up to 440\u00d7600 mm. - miniaturized sensor assemblies \u2014 sensor die and packaged sensors assembled onto or into the board, drawing on the same micro-assembly discipline hana runs for its osat sensor work. - inspection coverage on every board \u2014 solder paste inspection before placement, automated optical inspection before and after reflow, and x-ray on the joints a dense layout hides. - functional test on the line \u2014 acoustic and bluetooth test, and wireless and gps test, available to the program's requirements.",
"/markets/consumer-electronics/wireless-charging/":"- wound coils and coil assemblies \u2014 coil winding and coil assembly run in-house as a group capability, rather than bought in as a finished part. - charging electronics \u2014 the driver and control pcba built on hana's high-volume smt lines, in compliance with the qi (wpc) standard where a program calls for it. - complete charging units \u2014 chargers, charging pads and charging modules assembled as finished products, including enclosure, wiring and mechanical parts. - functional test \u2014 charge function verified on the assembled unit, to the test set the program specifies.",
"/markets/industrial-iot/iot-device-assembly/":"- complete connected devices \u2014 board, radio, sensors, battery and enclosure built and tested as one finished, shippable unit. - board, radio and antenna integration \u2014 pcba carrying embedded wireless modules, with antenna and sensor integration handled on the same line as the board build. - enclosure, cable and harness assembly \u2014 cable and harness build, enclosure fitting and final mechanical assembly around the board. - wireless functional test \u2014 802.11 embedded wireless module test, gsm/cellular and gps test, and bluetooth and acoustic test, with the test set selected per program.",
"/markets/industrial-iot/pcba-box-build/":"- ruggedized pcbas \u2014 surface-mount and mixed-technology boards with conformal or parylene coating, through-hole for high-current and heavy connectors, and selective or wave soldering to suit the joint. - complete box-build units \u2014 the board integrated with its enclosure, wiring and mechanical parts, assembled and functionally tested as one finished product. - high density pcba \u2014 dense, multi-layer boards for infrastructure and data-center equipment, built on the same fine-pitch smt lines with x-ray on the joints a dense layout hides.",
"/markets/industrial-iot/rfid-asset-tracking/":"- rugged and on-metal uhf tags \u2014 hardened tag constructions for mounting on equipment and on metal, with the format chosen for the mounting surface. - uhf inlays and straps \u2014 the inlay and strap layer underneath, built on roll-to-roll automated lines. - rubber-embeddable and temperature-sensing formats \u2014 embeddable constructions and temperature-sensing tags where the application calls for them. - encoding, unique id and read verification \u2014 a unique identity per tag, with read performance verified on the finished tag as part of the build.",
"/markets/medical/hearing-aid-assembly/":"- complete hearing devices \u2014 micro-miniature assembly of hearing aids, including ai hearing aids, built and tested as finished units on dedicated medical lines. - acoustic component integration \u2014 microphone and receiver integration handled as part of the micro-assembly, not as a separate downstream step. - wireless charging cases \u2014 the charging case assembled alongside the device itself, with coil winding and assembly in the same company. see wireless charging for medical devices. - test and traceability coverage \u2014 hearing-aid and bluetooth test rigs in-house, with material, unit and product traceability recorded through the build and functional test available to the program's requirements.",
"/markets/medical/mems-sensors/":"- air-flow and pressure sensor assemblies \u2014 the mems and sensor assemblies used in inhalers, respiratory and drug-delivery devices, packaged and functionally tested. - gas sensor assemblies \u2014 co2, ch4 and r32 gas sensing assemblies built on the same sensor lines. - cavity and sealed packaging \u2014 low-stress die attach into cavity and sealed package formats, where the die must not be loaded by its own package. - functional test and traceability \u2014 gas and mems test rigs in-house, with material, unit and product traceability recorded through the build.",
"/markets/medical/pcba/":"- flex and rigid-flex assemblies \u2014 two- and four-layer adhesiveless flex down to around 5 mil total thickness, with 2 mil lines and spaces and 2 mil blind vias, assembled and then folded into the device envelope in multiple controlled steps. - flip chip on flex and board \u2014 bare die attached at fine bump pitch, in solder-bump, gold-bump and gold-plated forms, placed alongside 0201 and 01005 passives on the same circuit. - underfill, coating and finishing \u2014 automated underfill and coating dispense with thermal or air cure, single or stepped, and laser depanel and marking to fine line widths. - documented, traceable build \u2014 controlled work instructions, formal change control, and material, process and parameter traceability recorded as the board is built.",
"/markets/medical/wireless-charging/":"- hearing-aid charging cases \u2014 the charging case assembled alongside the hearing device it serves. see hearing aid assembly. - wearable medical charging modules \u2014 coil, board and enclosure assembled and functionally tested as one unit. - coil winding and assembly \u2014 coil work handled in-house as part of the build rather than bought in.",
"/markets/optical-sensors/camera-modules/":"- complete camera modules \u2014 image sensor through to a finished, focused and tested module, supplied as a turnkey assembly. - infrared and specialist modules \u2014 infrared camera modules and their surface-mount lens housings, for sensing as well as imaging. - lens housings and optical sub-assemblies \u2014 the mounted optical parts that sit between the lens and the sensor.",
"/markets/optical-sensors/mems-sensors/":"- optical sensor packages \u2014 proximity, ambient light, color and time-of-flight sensor devices, assembled and packaged as finished sensor components. - mems die assembly \u2014 mems die attached, interconnected and packaged, with the attach method chosen to keep mechanical stress off the structure. - cavity and clear packages \u2014 clear transfer mold, metal and plastic caps, and film-assist mold, selected per device rather than applied as a standard format. - cleanroom build and test coverage \u2014 assembly under controlled esd handling, with electrical and functional test available to the program's requirements.",
"/markets/power-management/igbt-sic-modules/":"- igbt and sic power modules \u2014 multi-die assemblies on dbc ceramic in the standard package families: 34 mm and 62 mm, xm3, econo and econo dual3, pim, hp1, easy 1b/2b/3b and hepack/dbc. - intelligent power modules (ipms) \u2014 drive and power stages packaged together as a single module for motor-control programs. - board-mount and compact power packages \u2014 to-247te, top and dual cool qfn, insop, eesip and fc lga outlines, where the module sits on a board rather than a baseplate. - reliability and cycling test \u2014 power cycling, thermal cycling and reliability sequences available to a program's own qualification plan.",
"/markets/power-management/power-discrete/":"- through-hole power packages \u2014 to-247 in 2l, 3l and 4l, and to-272 in plastic and ceramic versions. - surface-mount power packages \u2014 d2pak-7l in both leadframe and dbc versions, for board-mounted power stages. - wide-bandgap and silicon devices \u2014 sic mosfet and sic diode, superjunction mos and frfet, and silicon mosfet with copper-clip interconnect. - lead finish and flank quality \u2014 wettable-flank leads by step-cut or dimpled leadframe, with pure tin plating and chemical deflash, selected per program.",
"/markets/rfid/rfid-cards/":"- card inlays \u2014 antenna and chip attach produced on automated inlay lines, supplied as inlay stock or carried through to a finished card. - laminated and printed cards \u2014 the inlay laminated into the card body, printed and finished to the program's card specification. - encoding and personalization \u2014 chip encoding, unique-id management and card personalization, available as part of the same build rather than as a separate hand-off. - line verification \u2014 read and write checks with unique-id accounting on the line, so a card that will not read is caught before packing.",
"/markets/rfid/rfid-tags-inlays/":"- uhf and hf inlays and straps \u2014 inlay and strap production on automated roll-to-roll lines, supplied as inlay stock or converted into a finished tag format. - ruggedized and embeddable tags \u2014 hardened tag builds, including rubber-embeddable constructions and on-metal formats for mounting surfaces that detune a standard tag. - sensing and battery-assisted formats \u2014 temperature-sensing tags and battery-assisted passive builds, where a program calls for more than a plain passive tag. - test, encoding and unique id \u2014 electrical and read test with encoding and unique-id handling, applied to the program's test plan.",
"/markets/rfid/rfid-tire-tags/":"- rubber-embeddable uhf tags \u2014 inlay and strap builds encapsulated in rubber-compatible materials for embedding rather than surface application. - automated production \u2014 built on the same automated roll-to-roll rfid lines as the rest of hana's inlay and tag range. - post-cure verification and unique id \u2014 read performance can be verified after cure, with a unique identity per tag.",
"/markets/telecommunications/rf-assembly/":"- rf and microwave modules \u2014 module-level assembly with controlled ground paths and shielding, built and rf-measured before shipment. - millimeter-wave modules \u2014 mmwave module assembly on lines that already run high-frequency programs. - rf power amplifier assembly \u2014 gan-on-si die into to-272 plastic and metal-ceramic packages, with ausn eutectic or sintered die attach, multi-die module build and ceramic lid encapsulation. - fiber-optic components \u2014 optical component assembly, with hermetic sealing and helium fine-leak test available where the package calls for it."
};


/* ---------------------------------------------------------------------------
   "PRODUCT EXAMPLES" — the hero strip on the Markets hub pages. Same defect as the
   sub-page sections: 42 product terms live ONLY here. Before this, "hotel safes",
   "patient monitors", "network switches" and "thermoelectric coolers" all returned
   nothing. Source: the "Product examples" line in each _hub.md under Page Specs &
   Templates/Markets/.
   NOTE: Automotive/_hub.md has no Product examples line — template inconsistency.
   --------------------------------------------------------------------------- */
const HUBPRODUCTS = {
"/markets/data-centers/":"thermoelectric coolers (tec), optical transceiver test systems, sic power transformers, high density pcba",
"/markets/access-control/":"smart door locks, access readers, key cards & fobs, fingerprint locks, hotel safes, security tokens",
"/markets/consumer-electronics/":"wireless chargers, remote controls, bluetooth audio, smart-home hubs, wearables, led lighting",
"/markets/industrial-iot/":"environmental monitors, meters, controllers, connected sensors, label printers, drone sensors",
"/markets/medical/":"hearing aids, smart inhalers, patient monitors, mems bio-sensors, hearing-aid wireless charging cases, diagnostic devices",
"/markets/optical-sensors/":"camera modules, proximity sensors, ambient light sensors, mems sensors, infrared modules",
"/markets/power-management/":"igbt power modules, sic power modules, ipm motor-control modules, power discretes, solar inverter modules",
"/markets/rfid/":"uhf inlays, hf inlays, asset-tracking tags, temperature-sensing tags, smart cards, rfid tire tags",
"/markets/telecommunications/":"rf/microwave modules, mmwave modules, rf power amplifiers, network switches, fiber-optic components, comms modules"
};


/* ---------------------------------------------------------------------------
   CERTIFICATION INDEX — which site holds what.
   Every row taken from the plant review documents in
   Page Specs & Templates/Locations/. Nothing here is invented.

   PROVENANCE: those tables come from the CURRENT website quality pages
   (/AytQty, /LpnQty, /JxQty, /KkQty) plus the 2026 company overview deck.
   No plant has confirmed its certifications — the reviews asking them to do so
   went out 14 May 2026 and only Ayutthaya's headcount/floor space came back.
   Treat every row as unverified until a plant confirms it.
   --------------------------------------------------------------------------- */
const SITES = {
 ayt:{n:"Ayutthaya",c:"Thailand",r:"OSAT",u:"/locations/thailand/ayutthaya/"},
 lpn:{n:"Lamphun",  c:"Thailand",r:"EMS", u:"/locations/thailand/lamphun/"},
 jx: {n:"Jiaxing",  c:"China",   r:"EMS", u:"/locations/china/jiaxing/"},
 kk: {n:"Koh Kong", c:"Cambodia",r:"EMS", u:"/locations/cambodia/koh-kong/"},
 oh: {n:"Solon",    c:"Ohio, USA",r:"RFID & Optical",u:"/locations/usa/ohio/"}
};

const CERTS = [
 {id:"ISO 13485", full:"ISO 13485:2016", scope:"Medical devices — quality management",
  alias:"13485 medical device medical certification",
  sites:[
   {s:"ayt",num:"TH21/14457",body:"SGS",date:"renewed Oct 2024"},
   {s:"lpn",num:"GB07/72438",body:"SGS",date:"renewed Jul 2025"},
   {s:"jx", num:"249057-2017-AQ-RGC-NA-PS",body:"DNV",date:"renewed Feb 2025"},
   {s:"kk", num:"145834/A/0001/UK/En",body:"URS",date:"issued Feb 2026",note:"the 2026 deck does not list this — confirm"}]},

 {id:"IATF 16949", full:"IATF 16949:2016", scope:"Automotive — quality management",
  alias:"16949 iatf automotive certification",
  sites:[
   {s:"ayt",num:"TH06/3318 IATF0534357",body:"SGS",date:"renewed Jul 2024"},
   {s:"lpn",num:"TH10/5266.01",body:"SGS",date:"renewed Aug 2024"},
   {s:"jx", num:"CN038585-IATF/430177",body:"BV",date:"renewed Sep 2024"},
   {s:"kk", num:"—",body:"—",date:"",unconfirmed:1,note:"listed in the 2026 deck but not on the plant's cert table — confirm"}]},

 {id:"ISO 9001", full:"ISO 9001:2015", scope:"Quality management",
  alias:"9001 quality management",
  sites:[
   {s:"ayt",num:"TH21/14373",body:"SGS",date:"renewed Jul 2024"},
   {s:"lpn",num:"TH10/5267",body:"SGS",date:"renewed Aug 2024"},
   {s:"jx", num:"CNBJ314315-U / CN051400",body:"BV",date:"renewed Aug 2024"},
   {s:"kk", num:"TAQ24527",body:"Best ISO",date:"issued Mar 2024"},
   {s:"oh", num:"—",body:"—",date:"",unconfirmed:1,note:"certificate number and dates not yet supplied"}]},

 {id:"ISO 14001", full:"ISO 14001:2015", scope:"Environmental management",
  alias:"14001 environmental",
  sites:[
   {s:"ayt",num:"TH016510",body:"BVQI",date:"renewed Jun 2024"},
   {s:"lpn",num:"TH08/1526",body:"SGS",date:"renewed May 2023"},
   {s:"jx", num:"3148-2006-AE-RGC-RvA",body:"DNV",date:"renewed Nov 2024"}]},

 {id:"ISO 45001", full:"ISO 45001:2018", scope:"Occupational health and safety",
  alias:"45001 health safety",
  sites:[
   {s:"ayt",num:"TH018896",body:"BVQI",date:"renewed Jun 2025"},
   {s:"lpn",num:"TH08/1527",body:"SGS",date:"renewed May 2023"},
   {s:"jx", num:"185471-2015-ASA-RGC-RvA",body:"DNV",date:"renewed Oct 2024"}]},

 {id:"ISO 27001", full:"ISO/IEC 27001:2022", scope:"Information security",
  alias:"27001 information security cyber data security",
  sites:[
   {s:"ayt",num:"TH025675",body:"BVQI",date:"renewed Aug 2025"},
   {s:"jx", num:"639119-2023-AIS-RGC-UKAS",body:"DNV",date:"renewed Oct 2025"}]},

 {id:"ANSI/ESD S20.20", full:"ANSI/ESD S20.20-2021", scope:"Electrostatic discharge control",
  alias:"esd s20.20 static",
  sites:[{s:"ayt",num:"TH18/11154",body:"SGS",date:"renewed Aug 2025"}]},

 {id:"IECQ QC 080000", full:"IECQ QC 080000:2017", scope:"Hazardous substance process management",
  alias:"qc080000 iecq hazardous substance rohs",
  sites:[{s:"jx",num:"IECQ-H-SGSCN 09.0267",body:"SGS-CSTC",date:"renewed Jul 2023"}]},

 {id:"TL9000", full:"TL9000:2016", scope:"Telecommunications — quality management",
  alias:"tl9000 telecom telecommunications",
  sites:[{s:"kk",num:"FM788162",body:"BSI",date:"issued Sep 2023"}]},

 {id:"ISO 14064", full:"ISO 14064-1", scope:"Greenhouse gas statement",
  alias:"14064 ghg greenhouse carbon",
  sites:[{s:"jx",num:"00033-2023-GHG-RGC",body:"DNV",date:"issued Dec 2023"}]},

 {id:"ITAR", full:"ITAR registration", scope:"US defence-related work",
  alias:"itar defense defence military",
  sites:[
   {s:"oh",num:"—",body:"—",date:"",unconfirmed:1,note:"stated in the 2026 deck — registration detail not yet supplied"},
   {s:"ayt",num:"—",body:"—",date:"",unconfirmed:1,note:"listed in the deck but not on the plant's cert table — confirm"}]},

 {id:"ARC", full:"ARC Quality Certification", scope:"RFID inlay design and manufacture (Auburn)",
  alias:"arc auburn rfid inlay certification",
  sites:[{s:"oh",num:"—",body:"Auburn (ARC)",date:"",unconfirmed:1,note:"deck states USA and China — confirm both"}]},

 {id:"Sony Green Partner", full:"Sony Green Partner", scope:"Customer environmental programme",
  alias:"sony green partner",
  sites:[{s:"ayt",num:"—",body:"—",date:"",unconfirmed:1,note:"listed in the deck but not on the plant's cert table — confirm"}]}
];

/* Certifications feed the page index too, so location pages surface in normal results. */
CERTS.forEach(c=>c.sites.forEach(s=>{
  const u = SITES[s.s].u;
  TERMS[u] = (TERMS[u]||"") + " " + c.id.toLowerCase() + " " + c.full.toLowerCase() + " " + c.alias;
}));

/* The two pages decided 31 July with no row in the URL Structure tab yet. */
/* EMPTY as of the 4–6 Aug 2026 restructure + the Data Centers row.
   All three pages previously flagged here now have real rows in the URL Structure tab:
   Ultra-small Packages and QFN/DFN/LGA arrived with the OSAT 6→11 restructure, and
   Data Centers was added Aug 2026. Nothing is currently missing.
   Three pages went the other way and are now GONE from the index — Die Attach & Wire
   Bond (absorbed into Flip Chip & Interconnect), In-line AOI & SPI and Robotic Handling
   & Test (merged into Robotic & Smart Manufacturing). Their vocabulary was migrated to
   the successor pages so nothing became unsearchable. */
const MISSING = [];
/* Chip on Flex and COB Assembly are NOT listed here — both briefs were superseded in
   June 2026 and folded into /capabilities/pcba-box-build/chip-on-board/. They are
   retired pages, not missing ones. */

/* Synonyms — how a customer says it, mapped to how the site says it. */
const SYN = {packaging:"assembly",package:"assembly",packages:"assembly",subcon:"osat",subcontractor:"osat",
 wirebond:"wire bond",tyre:"tire",pcb:"pcba",factory:"plant",fab:"plant",foundry:"plant",
 miniature:"micro",tiny:"micro","backgrind":"back grind"};

/* Common word -> which section the customer is really asking about. */
const INTENT = {assembly:"Capabilities",manufacturing:"Capabilities",osat:"Capabilities",ems:"Capabilities",
 process:"Capabilities",capability:"Capabilities",services:"Capabilities",
 market:"Markets",industry:"Markets",sector:"Markets",application:"Markets",
 plant:"Locations",site:"Locations",location:"Locations",where:"Locations",
 factory:"Locations",facility:"Locations",footprint:"Locations",
 /* Place names route to Locations. Necessary because country names are the NOISIEST
    words in the index — "thailand" is on 30% of pages, more than any other term — so
    without this a bare "Thailand" scores every page equally and the type weighting puts
    the Home page first. The intent filter is what makes the plants win. */
 thailand:"Locations",china:"Locations",cambodia:"Locations",
 vietnam:"Locations",ayutthaya:"Locations",lamphun:"Locations",jiaxing:"Locations",
 solon:"Locations",twinsburg:"Locations",bangkok:"Locations",
 job:"Careers",jobs:"Careers",vacancy:"Careers",career:"Careers"};

/* ---------------------------------------------------------------------------
   ANCHOR SECTIONS — column G of the URL Structure tab, which the index was not
   reading. These are real destinations inside a page: #conformal-coating lives
   on the PCBA & Box Build page. Indexing them costs nothing (they're already
   written) and lets a result deep-link to the right part of the page.
   Only 4 of 102 rows define anchors today — 10 in total.
   --------------------------------------------------------------------------- */
const ANCHOR_ROWS = {
 "/about/why-hana":"#vision-mission #company-overview",
 "/capabilities/pcba-box-build/":"#wire-harness #rf-assembly #conformal-coating #led-packaging",
 "/about/leadership":"#board-of-directors #executive-team",
 "/investor-relations/faqs":"#performance-videos #faq"
};

const ANCHORS = [];
Object.keys(ANCHOR_ROWS).forEach(u=>{
  const parent = PAGES.find(p=>p.u===u); if(!parent) return;
  (ANCHOR_ROWS[u].match(/#[a-z0-9-]+/g)||[]).forEach(a=>{
    const slug = a.slice(1);
    const ACR = {rf:"RF",led:"LED",faq:"FAQ",aoi:"AOI",spi:"SPI",cob:"COB",sip:"SiP",
                 npi:"NPI",dfm:"DFM",dfx:"DFx",esd:"ESD",mems:"MEMS",pcba:"PCBA",smt:"SMT",
                 rfid:"RFID",qfn:"QFN",dfn:"DFN",lga:"LGA",ic:"IC"};
    const label = slug.split("-")
      .map((w,i)=>ACR[w] || (i===0 ? w.replace(/^./,ch=>ch.toUpperCase()) : w))
      .join(" ");
    ANCHORS.push({n:label, u:u+a, t:parent.t, s:parent.s, p:parent.p,
                  k:parent.k, x:slug.replace(/-/g," "), anchor:parent.n});
  });
});

const ALL = PAGES.concat(MISSING, ANCHORS);
const N = ALL.length;
const blob = p => (p.n+" "+p.k+" "+(SECONDARY[p.u]||"")+" "+(SPECIALISE[p.u]||"")+" "+(HUBPRODUCTS[p.u]||"")+" "+(p.x||TERMS[p.u]||"")).toLowerCase();

/* Document frequency, measured from the index itself — not a hand-written stop list. */
const DF = {};
ALL.forEach(p=>{ new Set(blob(p).match(/[a-z0-9.]{2,}/g)||[]).forEach(w=>DF[w]=(DF[w]||0)+1); });
const isNoise = w => (DF[w]||0)/N >= 0.15;

const TYPEW = {Home:1.3,Hub:1.3,Pillar:1.3,"Cap Parent":1.3,"Sub-pillar":1.15,"Sub-page":1.15,Location:1.15,
 "Brand Page":1.05,Corporate:1,AEO:1,"Blog/AEO":.75,Legal:.5,Utility:.5,Template:0};

/* Section priority — Rupert, Aug 2026: "most important are the capabilities that are
   being looked for". Capabilities lead on an even match. This is a tie-breaker, not an
   override: a page matching a specific phrase still beats a capability page that only
   matches a general one, which is why "fiber-optic components" still returns the
   Telecommunications page. */
const SECTIONW = {Capabilities:1.35, Markets:1.0, Locations:1.0, About:0.9,
 "Investor Relations":0.8, Careers:0.8, Insights:0.9, Corporate:0.85, Contact:0.9};

window.HS_DATA = {PAGES, TERMS, SECONDARY, SPECIALISE, HUBPRODUCTS, NOROW_TERMS, SITES, CERTS, MISSING,
 SYN, INTENT, ANCHOR_ROWS, ANCHORS, ALL, N, blob, DF, isNoise, TYPEW, SECTIONW};
