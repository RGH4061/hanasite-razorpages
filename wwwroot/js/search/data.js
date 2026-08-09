/* Hana site search — index data.
   Lifted verbatim from design/site-search-mockup.html (4 Aug 2026) so ranking
   behaviour in these placement concepts is the real behaviour, not a mock. */
const PAGES = [{"n": "Home", "u": "/", "t": "Home", "s": "Corporate", "k": "electronics manufacturing services Thailand", "p": "HIGH"}, {"n": "Why Hana — Vertical Integration", "u": "/about/why-hana", "t": "Brand Page", "s": "About", "k": "EMS OSAT vertical integration electronics manufacturer", "p": "HIGH"}, {"n": "Markets Hub", "u": "/markets/", "t": "Hub", "s": "Markets", "k": "electronics manufacturing industries", "p": "HIGH"}, {"n": "Automotive", "u": "/markets/automotive/", "t": "Pillar", "s": "Markets", "k": "automotive electronics manufacturing Thailand IATF 16949", "p": "HIGH"}, {"n": "Power Modules", "u": "/markets/automotive/power-modules/", "t": "Sub-page", "s": "Markets", "k": "IGBT SiC power modules EMS Thailand", "p": "HIGH"}, {"n": "Sensor Assembly", "u": "/markets/automotive/sensor-assembly/", "t": "Sub-page", "s": "Markets", "k": "automotive sensor assembly Thailand", "p": "HIGH"}, {"n": "LED Lighting", "u": "/markets/automotive/led-lighting/", "t": "Sub-page", "s": "Markets", "k": "automotive LED lighting assembly Thailand", "p": "MEDIUM"}, {"n": "RFID Tire Tags", "u": "/markets/automotive/rfid-tire-tags/", "t": "Sub-page", "s": "Markets", "k": "RFID tire tag manufacturer automotive", "p": "HIGH"}, {"n": "Automotive PCBA", "u": "/markets/automotive/pcba/", "t": "Sub-page", "s": "Markets", "k": "automotive PCBA manufacturer IATF 16949", "p": "HIGH"}, {"n": "Industrial & IoT", "u": "/markets/industrial-iot/", "t": "Pillar", "s": "Markets", "k": "industrial IoT electronics manufacturing EMS", "p": "HIGH"}, {"n": "PCBA & Box Build", "u": "/markets/industrial-iot/pcba-box-build/", "t": "Sub-page", "s": "Markets", "k": "industrial PCBA box build EMS", "p": "HIGH"}, {"n": "IoT Device Assembly", "u": "/markets/industrial-iot/iot-device-assembly/", "t": "Sub-page", "s": "Markets", "k": "IoT device assembly Thailand EMS", "p": "MEDIUM"}, {"n": "RFID Asset Tracking", "u": "/markets/industrial-iot/rfid-asset-tracking/", "t": "Sub-page", "s": "Markets", "k": "industrial RFID asset tracking EMS", "p": "MEDIUM"}, {"n": "Power Modules", "u": "/markets/industrial-iot/power-modules/", "t": "Sub-page", "s": "Markets", "k": "industrial power modules EV photovoltaic EMS", "p": "MEDIUM"}, {"n": "Telecommunications", "u": "/markets/telecommunications/", "t": "Pillar", "s": "Markets", "k": "telecom electronics manufacturing EMS Thailand", "p": "HIGH"}, {"n": "RF & High-Frequency Assembly", "u": "/markets/telecommunications/rf-assembly/", "t": "Sub-page", "s": "Markets", "k": "RF high frequency PCB assembly telecom", "p": "HIGH"}, {"n": "Telecom PCBA", "u": "/markets/telecommunications/pcba/", "t": "Sub-page", "s": "Markets", "k": "telecom PCBA manufacturing Thailand", "p": "MEDIUM"}, {"n": "RFID", "u": "/markets/rfid/", "t": "Pillar", "s": "Markets", "k": "RFID manufacturing card tag inlay EMS", "p": "HIGH"}, {"n": "RFID Card Manufacturing", "u": "/markets/rfid/rfid-cards/", "t": "Sub-page", "s": "Markets", "k": "RFID smart card manufacturing Thailand", "p": "HIGH"}, {"n": "RFID Tags & Inlays", "u": "/markets/rfid/rfid-tags-inlays/", "t": "Sub-page", "s": "Markets", "k": "RFID tag inlay manufacturer UHF HF LF", "p": "HIGH"}, {"n": "RFID Tire Tags", "u": "/markets/rfid/rfid-tire-tags/", "t": "Sub-page", "s": "Markets", "k": "RFID tire tag world leading manufacturer", "p": "HIGH"}, {"n": "Optical & Sensors", "u": "/markets/optical-sensors/", "t": "Pillar", "s": "Markets", "k": "optical sensor electronics manufacturing EMS", "p": "HIGH"}, {"n": "Camera Modules", "u": "/markets/optical-sensors/camera-modules/", "t": "Sub-page", "s": "Markets", "k": "camera module manufacturer precision optical", "p": "HIGH"}, {"n": "MEMS Sensors", "u": "/markets/optical-sensors/mems-sensors/", "t": "Sub-page", "s": "Markets", "k": "MEMS sensor manufacturer EMS Thailand", "p": "HIGH"}, {"n": "Microdisplay (LCOS/HTPS)", "u": "/markets/optical-sensors/microdisplay/", "t": "Sub-page", "s": "Markets", "k": "microdisplay LCOS HTPS manufacturer", "p": "MEDIUM"}, {"n": "Consumer Electronics & Smartphone", "u": "/markets/consumer-electronics/", "t": "Pillar", "s": "Markets", "k": "consumer electronics EMS smartphone manufacturer", "p": "HIGH"}, {"n": "SMT & Sensor Assembly", "u": "/markets/consumer-electronics/smt-sensors/", "t": "Sub-page", "s": "Markets", "k": "consumer electronics SMT MEMS sensor assembly", "p": "HIGH"}, {"n": "Wireless Charging", "u": "/markets/consumer-electronics/wireless-charging/", "t": "Sub-page", "s": "Markets", "k": "wireless charging module assembly EMS consumer", "p": "HIGH"}, {"n": "Medical", "u": "/markets/medical/", "t": "Pillar", "s": "Markets", "k": "medical electronics manufacturing ISO 13485 Thailand", "p": "HIGH"}, {"n": "Hearing Aid Assembly", "u": "/markets/medical/hearing-aid-assembly/", "t": "Sub-page", "s": "Markets", "k": "hearing aid assembly manufacturer ISO 13485", "p": "HIGH"}, {"n": "Medical MEMS & Sensors", "u": "/markets/medical/mems-sensors/", "t": "Sub-page", "s": "Markets", "k": "medical MEMS sensor assembly inhaler respirator", "p": "HIGH"}, {"n": "Medical PCBA", "u": "/markets/medical/pcba/", "t": "Sub-page", "s": "Markets", "k": "medical PCBA assembly ISO 13485 Thailand", "p": "HIGH"}, {"n": "Wireless Charging (Medical)", "u": "/markets/medical/wireless-charging/", "t": "Sub-page", "s": "Markets", "k": "wireless charging hearing aid medical device", "p": "MEDIUM"}, {"n": "Access Control", "u": "/markets/access-control/", "t": "Pillar", "s": "Markets", "k": "access control electronics manufacturing EMS", "p": "HIGH"}, {"n": "RFID Access Cards", "u": "/markets/access-control/rfid-cards/", "t": "Sub-page", "s": "Markets", "k": "RFID access control card manufacturer", "p": "HIGH"}, {"n": "Smart Lock & Door Hardware", "u": "/markets/access-control/smart-lock-assembly/", "t": "Sub-page", "s": "Markets", "k": "smart lock electronic door hardware assembly EMS", "p": "MEDIUM"}, {"n": "Power Management", "u": "/markets/power-management/", "t": "Pillar", "s": "Markets", "k": "power management electronics manufacturing EMS", "p": "HIGH"}, {"n": "IGBT & SiC Power Modules", "u": "/markets/power-management/igbt-sic-modules/", "t": "Sub-page", "s": "Markets", "k": "IGBT SiC power module assembly test Thailand", "p": "HIGH"}, {"n": "Power Discrete Assembly", "u": "/markets/power-management/power-discrete/", "t": "Sub-page", "s": "Markets", "k": "power discrete semiconductor assembly EMS", "p": "HIGH"}, {"n": "Capabilities Hub", "u": "/capabilities/", "t": "Hub", "s": "Capabilities", "k": "EMS manufacturing capabilities Thailand", "p": "HIGH"}, {"n": "PCBA & Box Build", "u": "/capabilities/pcba-box-build/", "t": "Cap Parent", "s": "Capabilities", "k": "PCBA box build assembly services Thailand EMS", "p": "HIGH"}, {"n": "SMT Assembly", "u": "/capabilities/pcba-box-build/smt-assembly/", "t": "Sub-pillar", "s": "Capabilities", "k": "SMT assembly services Thailand EMS manufacturer", "p": "HIGH"}, {"n": "Chip on Board (COB)", "u": "/capabilities/pcba-box-build/chip-on-board/", "t": "Sub-pillar", "s": "Capabilities", "k": "chip on board COB assembly manufacturer EMS (incl. chip on flex / COF)", "p": "HIGH"}, {"n": "Box Build", "u": "/capabilities/pcba-box-build/box-build/", "t": "Sub-pillar", "s": "Capabilities", "k": "box build full product assembly services EMS", "p": "HIGH"}, {"n": "OSAT", "u": "/capabilities/osat/", "t": "Cap Parent", "s": "Capabilities", "k": "OSAT IC assembly test semiconductor Thailand", "p": "HIGH"}, {"n": "Wafer Processing", "u": "/capabilities/osat/wafer-processing/", "t": "Sub-pillar", "s": "Capabilities", "k": "wafer back-grinding and dicing service OSAT Thailand", "p": "HIGH"}, {"n": "Die Attach & Wire Bond", "u": "/capabilities/osat/die-attach-wire-bond/", "t": "Sub-pillar", "s": "Capabilities", "k": "die attach wire bond semiconductor assembly OSAT", "p": "HIGH"}, {"n": "Flip Chip", "u": "/capabilities/osat/flip-chip/", "t": "Sub-pillar", "s": "Capabilities", "k": "flip chip assembly semiconductor EMS Thailand", "p": "HIGH"}, {"n": "System in Package (SiP)", "u": "/capabilities/osat/system-in-package/", "t": "Sub-pillar", "s": "Capabilities", "k": "system in package SiP assembly SMT modules Thailand", "p": "HIGH"}, {"n": "Wafer Probe & Final Test", "u": "/capabilities/osat/wafer-probe-final-test/", "t": "Sub-pillar", "s": "Capabilities", "k": "wafer probe final test semiconductor OSAT Thailand", "p": "HIGH"}, {"n": "Wafer Level Packaging (WLCSP)", "u": "/capabilities/osat/wafer-level-packaging/", "t": "Sub-pillar", "s": "Capabilities", "k": "wafer level packaging WLCSP manufacturer OSAT", "p": "HIGH"}, {"n": "Microelectronic Assembly", "u": "/capabilities/microelectronic-assembly/", "t": "Cap Parent", "s": "Capabilities", "k": "microelectronic assembly flip chip MEMS sensor interconnect micro-assembly EMS", "p": "HIGH"}, {"n": "Flip Chip", "u": "/capabilities/microelectronic-assembly/flip-chip/", "t": "Sub-pillar", "s": "Capabilities", "k": "flip chip microelectronic assembly manufacturer", "p": "MEDIUM"}, {"n": "MEMS & Sensor Assembly", "u": "/capabilities/microelectronic-assembly/mems-sensor-assembly/", "t": "Sub-pillar", "s": "Capabilities", "k": "MEMS sensor assembly manufacturer EMS Thailand", "p": "HIGH"}, {"n": "Interconnect Solutions", "u": "/capabilities/microelectronic-assembly/interconnect-solutions/", "t": "Sub-pillar", "s": "Capabilities", "k": "interconnect solutions wire bond ribbon assembly EMS", "p": "MEDIUM"}, {"n": "Micro-Assembly", "u": "/capabilities/microelectronic-assembly/micro-assembly/", "t": "Sub-pillar", "s": "Capabilities", "k": "micro miniature assembly manufacturer", "p": "MEDIUM"}, {"n": "RFID & Smart Tags", "u": "/capabilities/rfid/", "t": "Cap Parent", "s": "Capabilities", "k": "RFID manufacturing card tag inlay EMS", "p": "HIGH"}, {"n": "RFID Tire Tags", "u": "/capabilities/rfid/rfid-tire-tags/", "t": "Sub-pillar", "s": "Capabilities", "k": "RFID tire tag manufacturer world leading", "p": "HIGH"}, {"n": "RFID Inlays", "u": "/capabilities/rfid/rfid-inlay/", "t": "Sub-pillar", "s": "Capabilities", "k": "RFID inlay manufacturer UHF HF LF", "p": "HIGH"}, {"n": "Automation", "u": "/capabilities/automation/", "t": "Cap Parent", "s": "Capabilities", "k": "electronics manufacturing automation AOI MES traceability", "p": "HIGH"},  {"n": "Robotic & Smart Manufacturing", "u": "/capabilities/automation/robotic-smart-manufacturing/", "t": "Sub-pillar", "s": "Capabilities", "k": "robotic handling automated test electronics manufacturing", "p": "MEDIUM"}, {"n": "Manufacturing Traceability", "u": "/capabilities/automation/mes-traceability/", "t": "Sub-pillar", "s": "Capabilities", "k": "MES manufacturing traceability electronics EMS", "p": "MEDIUM"}, {"n": "DFx & JDM Collaboration", "u": "/capabilities/dfx-jdm/", "t": "Cap Parent", "s": "Capabilities", "k": "design for excellence DFM JDM NPI electronics manufacturing", "p": "HIGH"}, {"n": "Design for Excellence (DFx / DFM)", "u": "/capabilities/dfx-jdm/design-for-excellence/", "t": "Sub-pillar", "s": "Capabilities", "k": "design for excellence DFX DFM manufacturability review", "p": "HIGH"}, {"n": "Joint Development Model (JDM)", "u": "/capabilities/dfx-jdm/joint-development-model/", "t": "Sub-pillar", "s": "Capabilities", "k": "joint development manufacturing JDM electronics", "p": "MEDIUM"}, {"n": "New Product Introduction (NPI)", "u": "/capabilities/dfx-jdm/new-product-introduction/", "t": "Sub-pillar", "s": "Capabilities", "k": "new product introduction NPI electronics manufacturing", "p": "HIGH"}, {"n": "Locations", "u": "/locations/", "t": "Hub", "s": "Locations", "k": "Hana manufacturing locations worldwide", "p": "HIGH"}, {"n": "Ayutthaya", "u": "/locations/thailand/ayutthaya/", "t": "Location", "s": "Locations", "k": "IC assembly OSAT Ayutthaya Thailand", "p": "HIGH"}, {"n": "Lamphun", "u": "/locations/thailand/lamphun/", "t": "Location", "s": "Locations", "k": "EMS electronics manufacturing Lamphun Thailand", "p": "HIGH"}, {"n": "Ohio", "u": "/locations/usa/ohio/", "t": "Location", "s": "Locations", "k": "RFID tire tag manufacturer Ohio USA", "p": "HIGH"}, {"n": "Jiaxing", "u": "/locations/china/jiaxing/", "t": "Location", "s": "Locations", "k": "EMS manufacturer Jiaxing China IoT RFID", "p": "MEDIUM"}, {"n": "Cheongju", "u": "/locations/south-korea/cheongju/", "t": "Location", "s": "Locations", "k": "wireless charging power module R&D Cheongju South Korea", "p": "MEDIUM"}, {"n": "Koh Kong", "u": "/locations/cambodia/koh-kong/", "t": "Location", "s": "Locations", "k": "remote control assembly manufacturer Cambodia", "p": "LOW"}, {"n": "Our Heritage", "u": "/about/heritage", "t": "Corporate", "s": "About", "k": "Hana Microelectronics history founded 1978", "p": "MEDIUM"}, {"n": "Leadership", "u": "/about/leadership", "t": "Corporate", "s": "About", "k": "Hana Microelectronics leadership directors executives", "p": "MEDIUM"}, {"n": "Awards & Quality", "u": "/about/awards", "t": "Corporate", "s": "About", "k": "Hana Microelectronics awards recognition quality certifications IATF 16949 ISO 13485 ISO 27001", "p": "HIGH"}, {"n": "Investor Relations", "u": "/investor-relations/", "t": "Hub", "s": "Investor Relations", "k": "Hana Microelectronics investor relations SET listed financial information", "p": "HIGH"}, {"n": "Investor News", "u": "/investor-relations/investor-news", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics SET news press releases financial information", "p": "HIGH"}, {"n": "Group Structure & Shareholders", "u": "/investor-relations/group-structure-shareholders", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics group structure subsidiaries major shareholders", "p": "MEDIUM"}, {"n": "Annual Report", "u": "/investor-relations/annual-report", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics annual report 56-1 one report SET", "p": "HIGH"}, {"n": "Sustainability", "u": "/investor-relations/sustainability", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics sustainability ESG report", "p": "HIGH"}, {"n": "Governance Documents", "u": "/investor-relations/governance-documents", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics governance documents articles of association charters anti-corruption", "p": "MEDIUM"}, {"n": "Investor Events & Contacts", "u": "/investor-relations/events-contact", "t": "Corporate", "s": "Investor Relations", "k": "Hana Microelectronics investor events contacts IR", "p": "MEDIUM"}, {"n": "Investor FAQ & Knowledge Hub", "u": "/investor-relations/faqs", "t": "AEO", "s": "Investor Relations", "k": "Hana Microelectronics investor FAQ SET listing", "p": "MEDIUM"}, {"n": "Careers", "u": "/careers", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers jobs Thailand", "p": "HIGH"}, {"n": "Job Detail (template)", "u": "/careers/jobs/[job-title]", "t": "Template", "s": "Careers", "k": "[dynamic per job]", "p": "HIGH"}, {"n": "Application: Data Consent (Step 1)", "u": "/careers/jobs/[job-title]/apply", "t": "Template", "s": "Careers", "k": "[dynamic per job — consent step]", "p": "HIGH"}, {"n": "Application: Form (Step 2)", "u": "/careers/jobs/[job-title]/apply/form", "t": "Template", "s": "Careers", "k": "[dynamic per job — application form]", "p": "HIGH"}, {"n": "Bangkok", "u": "/careers/bangkok", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Bangkok Thailand", "p": "MEDIUM"}, {"n": "Ayutthaya", "u": "/careers/ayutthaya", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Ayutthaya Thailand", "p": "MEDIUM"}, {"n": "Lamphun", "u": "/careers/lamphun", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Lamphun Thailand", "p": "MEDIUM"}, {"n": "Cambodia", "u": "/careers/cambodia", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics careers Cambodia", "p": "LOW"}, {"n": "Hana Stories (Hub)", "u": "/careers/stories", "t": "Corporate", "s": "Careers", "k": "Hana Microelectronics employee stories testimonials careers", "p": "HIGH"}, {"n": "Story Detail (template)", "u": "/careers/stories/[person-name]", "t": "Template", "s": "Careers", "k": "[dynamic per person]", "p": "MEDIUM"}, {"n": "Contact", "u": "/contact/", "t": "Corporate", "s": "Contact", "k": "contact electronics manufacturer Thailand", "p": "HIGH"}, {"n": "News & Insights", "u": "/news/", "t": "Blog/AEO", "s": "Corporate", "k": "electronics manufacturing news Thailand", "p": "MEDIUM"}, {"n": "FAQ", "u": "/faq/", "t": "AEO", "s": "Corporate", "k": "EMS FAQ electronics manufacturing Thailand", "p": "HIGH"}, {"n": "Code of Conduct", "u": "/code-of-conduct", "t": "Legal", "s": "Corporate", "k": "Hana Microelectronics code of conduct", "p": "MEDIUM"}, {"n": "Privacy Policy", "u": "/privacy-policy", "t": "Legal", "s": "Corporate", "k": "Hana Microelectronics privacy policy", "p": "MEDIUM"}, {"n": "Terms of Use", "u": "/terms-of-use", "t": "Legal", "s": "Corporate", "k": "Hana Microelectronics terms of use", "p": "LOW"}, {"n": "Sitemap (HTML)", "u": "/sitemap", "t": "Utility", "s": "Corporate", "k": "Hana Microelectronics sitemap", "p": "LOW"}];

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
"/capabilities/automation/mes-traceability/":"mes traceability serialisation track and trace",
"/capabilities/automation/robotic-smart-manufacturing/":"robot robotic cobot automated handling aoi spi optical inspection solder paste inspection x-ray",
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
"/markets/industrial-iot/power-modules/":"industrial power modules, IGBT module assembly, SiC power module manufacturer, IPM assembly, solar inverter power module, EV charger power module",
"/markets/industrial-iot/rfid-asset-tracking/":"industrial RFID tags, RFID asset tracking, on-metal RFID tag, rugged UHF tag, UHF RFID inlay manufacturer, warehouse asset tag",
"/markets/optical-sensors/mems-sensors/":"MEMS sensor manufacturer, MEMS sensor assembly, optical sensor packaging, proximity sensor manufacturing, ambient light sensor assembly, time of flight sensor packaging",
"/markets/optical-sensors/microdisplay/":"microdisplay manufacturer, LCOS microdisplay, HTPS microdisplay, LCOS manufacturing, LCD packaging, wafer processing dicing",
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
"/capabilities/automation/robotic-smart-manufacturing/":"robotic, robot, smart manufacturing, laser soldering, selective soldering, singulation, auto offload, handler, automated test, defect scrap, potting, aoi, spi, optical inspection, solder paste inspection, x-ray, 3d aoi, 3d spi, 7 micron, six sides inspection, coating inspection, post reflow inspection",
"/capabilities/dfx-jdm/":"dfx, dfm, design support, engineering support, co-development, collaboration, design for manufacture",
"/capabilities/dfx-jdm/design-for-excellence/":"dfm, dfx, dfa, dft, design review, manufacturability, cost down, warpage, thermal simulation, mechanical simulation, package design, pcb design review, autocad, solidworks, altium, ansys",
"/capabilities/dfx-jdm/joint-development-model/":"jdm, joint development, co-design, co-engineering, odm, product development partner",
"/capabilities/dfx-jdm/new-product-introduction/":"npi, new product introduction, prototype, trial run, pilot run, qualification build, ramp, ppap, mass production release, account engineer",
"/capabilities/microelectronic-assembly/":"microelectronics, micro assembly, precision assembly, hybrid assembly, bare die assembly, sensor packaging, miniature assembly",
"/capabilities/microelectronic-assembly/flip-chip/":"flip chip, micro bump, fine pitch flip chip, gold to gold interconnect, precision flip chip",
"/capabilities/microelectronic-assembly/interconnect-solutions/":"interconnect, wire bond, ribbon bond, ribbon, copper clip, clip bond, voids, deep access bonding, acf, hot bar, hot bar bonding, flex to pcb",
"/capabilities/microelectronic-assembly/mems-sensor-assembly/":"mems, sensor, sensor packaging, sensor assembly, optical package, open cavity, pressure sensor, humidity sensor, lidar, infrared, tsv, proximity sensor, ambient light sensor, time of flight, sensor test",
"/capabilities/microelectronic-assembly/micro-assembly/":"micro assembly, miniature assembly, hearing aid, hearing aid assembly, fine wire soldering, micro package, acoustic test, lock mechanism, micro electro mechanical",
"/capabilities/osat/":"osat, subcon, subcontractor, outsourced assembly and test, ic packaging, semiconductor packaging, chip packaging, package assembly, assembly and test, back end, test house",
"/capabilities/osat/die-attach-wire-bond/":"die attach, die bond, wire bond, wirebond, gold wire, copper wire, aluminium wire, aluminum wire, silver sinter, ag sinter, solder die attach, conductive epoxy, deep access, multi-die, optoelectronic",
"/capabilities/osat/flip-chip/":"flip chip, copper pillar, cu pillar, 80 micron pitch, gold to gold interconnect, thermocompression, solder bump mounting, underfill, c4",
"/capabilities/osat/system-in-package/":"sip, system in package, module, multi-die, stacked die, molded module, leadframe module, substrate module, coil assembly, hermetic, helium leak test",
"/capabilities/osat/wafer-level-packaging/":"wlcsp, wafer level packaging, wlp, chip scale package, csp, pop, package on package, 0.2mm pitch, flux dipping, tsv, ultrathin, laser dicing",
"/capabilities/osat/wafer-probe-final-test/":"probe, wafer probe, wafer sort, sort, final test, ate, test development, burn-in, msl, tape and reel, handler, mixed signal test, rf test, opto coupler test",
"/capabilities/osat/wafer-processing/":"back grind, backgrind, grinding, thinning, wafer thinning, dicing, saw, laser dicing, backside coat, daf, die attach film, sic, gan, low-k, 12 inch wafer, 300mm",
"/capabilities/pcba-box-build/":"pcba, pcb assembly, circuit board assembly, board assembly, contract assembly, wire harness, cable assembly, rf assembly, conformal coating, led packaging",
"/capabilities/pcba-box-build/box-build/":"box build, final assembly, full product assembly, enclosure, cable assembly, wire harness, potting, system integration, functional test, drop ship, fulfilment",
"/capabilities/pcba-box-build/chip-on-board/":"cob, chip on board, bare die, die on board, glob top, dam and fill, encapsulation, gold wire bond, aluminium wire bond, ceramic substrate, bt laminate, rigid flex, cof, chip on flex, flexible circuit, flex assembly, bga on flex, acf, hot bar bonding, flex to pcb, flex to ceramic",
"/capabilities/pcba-box-build/smt-assembly/":"smt, surface mount, pick and place, reflow, 01005, 0201, 0402, fine pitch, high density, hdi, high density interconnect, bga pitch, 0.2mm bga, micro bga, solder paste, spi, x-ray",
"/capabilities/rfid/":"rfid, smart tag, tag, inlay, transponder, nfc, uhf, hf, lf, smart card, contactless",
"/locations/":"locations, factories, plants, sites, facilities, where, where do you manufacture, manufacturing footprint, countries, addresses, map, thailand, china, cambodia, usa, dual source, second source, supply chain resilience",
"/locations/cambodia/koh-kong/":"koh kong, cambodia, special economic zone, sez, pcba, smt, box build, final assembly, cable assembly, wire harness, crystal assembly, remote control, access control reader, security reader, usb token, iso 13485, tl9000",
"/locations/china/jiaxing/":"jiaxing, china, zhejiang, ems, pcba, smt, cob, cof, rfid inlay, inlay lines, ic packaging, flip chip, power discrete, power modules, led packaging, hybrid modules, jdm, medical line, automotive line, iso 13485, iatf 16949, iecq qc 080000, iso 27001",
"/locations/south-korea/cheongju/":"cheongju, south korea, korea, wireless charging, power module, r&d",
"/locations/thailand/ayutthaya/":"ayutthaya, ayt, thailand, hana semiconductor, osat, ic assembly, ic packaging, semiconductor packaging, test, final test, wafer probe, burn-in, opto coupler, solid state relay, proximity sensor, high voltage isolation, mixed signal, logic, memory, rf, ultra-small packages, iso 13485, iatf 16949, iso 27001, ansi/esd",
"/locations/thailand/lamphun/":"lamphun, lpn, thailand, northern thailand, chiang mai, ems, pcba, smt, cob, chip on board, cof, hybrid assembly, flip chip, led packaging, clear qfn, micromechanical, automotive sensors, millimetre wave, industrial meters, medical devices, iso 13485, iatf 16949",
"/locations/usa/ohio/":"ohio, solon, twinsburg, usa, united states, america, north america, hana technologies, rfid inlay, uhf inlay, hf inlay, strap, arc certified, itar, defence, defense"
};
Object.assign(TERMS, CAPTERMS);
const NOROW_TERMS = {"/capabilities/osat/ultra-small-packages/": "lga, qfn, dfn, ultra small, small package, small form factor, 0.6mm, 0.37mm, thin package, miniature package, xxdfn, uqfn, body size, sot23, sc70, soic, pdip", "/capabilities/osat/qfn-dfn-lga/": "qfn, dfn, lga, leadless, wettable flank, de-burr, fam mold, msl1, multi-die leadless, automotive leadless"};

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
   {s:"oh", num:"—",body:"—",date:"—"}]},

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
const MISSING = [
 {n:"Ultra-small packages",u:"/capabilities/osat/ultra-small-packages/",t:"Sub-pillar",s:"Capabilities",p:"HIGH",
  k:"ultra small IC package manufacturer small form factor packaging",miss:1},
 {n:"QFN, DFN & LGA",u:"/capabilities/osat/qfn-dfn-lga/",t:"Sub-pillar",s:"Capabilities",p:"HIGH",
  k:"QFN DFN LGA leadless package assembly automotive",miss:1}
].map(m=>({...m, x:NOROW_TERMS[m.u]||""}));
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
 thailand:"Locations",china:"Locations",cambodia:"Locations",korea:"Locations",
 vietnam:"Locations",ayutthaya:"Locations",lamphun:"Locations",jiaxing:"Locations",
 solon:"Locations",twinsburg:"Locations",cheongju:"Locations",bangkok:"Locations",
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
const blob = p => (p.n+" "+p.k+" "+(SECONDARY[p.u]||"")+" "+(p.x||TERMS[p.u]||"")).toLowerCase();

/* Document frequency, measured from the index itself — not a hand-written stop list. */
const DF = {};
ALL.forEach(p=>{ new Set(blob(p).match(/[a-z0-9.]{2,}/g)||[]).forEach(w=>DF[w]=(DF[w]||0)+1); });
const isNoise = w => (DF[w]||0)/N >= 0.15;

const TYPEW = {Home:1.3,Hub:1.3,Pillar:1.3,"Cap Parent":1.3,"Sub-pillar":1.15,"Sub-page":1.15,Location:1.15,
 "Brand Page":1.05,Corporate:1,AEO:1,"Blog/AEO":.75,Legal:.5,Utility:.5,Template:0};

window.HS_DATA = {PAGES, TERMS, SECONDARY, NOROW_TERMS, SITES, CERTS, MISSING, SYN, INTENT, ANCHOR_ROWS, ANCHORS, ALL, N, blob, DF, isNoise, TYPEW};
