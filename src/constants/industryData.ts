export type SelectOption = {
    label: string;
    value: string;
};

export const INDUSTRY_OPTIONS: SelectOption[] = [
    // PRIMARY SECTOR
    { label: "Agriculture & Farming", value: "Agriculture & Farming" },
    { label: "Animal & Livestock", value: "Animal & Livestock" },
    { label: "Forestry & Logging", value: "Forestry & Logging" },
    { label: "Mining & Extraction", value: "Mining & Extraction" },

    // MANUFACTURING
    { label: "Automobile & Auto Components", value: "Automobile & Auto Components" },
    { label: "Aerospace & Aviation", value: "Aerospace & Aviation" },
    { label: "Shipbuilding", value: "Shipbuilding" },
    { label: "Railways & Locomotives", value: "Railways & Locomotives" },
    { label: "Industrial Machinery & Tools", value: "Industrial Machinery & Tools" },
    { label: "Heavy Engineering", value: "Heavy Engineering" },
    { label: "Chemical & Petrochemical", value: "Chemical & Petrochemical" },
    { label: "Pharmaceuticals", value: "Pharmaceuticals" },
    { label: "Medical Devices & Equipment", value: "Medical Devices & Equipment" },
    { label: "Biotechnology", value: "Biotechnology" },
    { label: "Ayurvedic / Herbal Manufacturing", value: "Ayurvedic / Herbal Manufacturing" },
    { label: "Food & Beverage Manufacturing", value: "Food & Beverage Manufacturing" },
    { label: "Dairy Products", value: "Dairy Products" },
    { label: "Packaged Food", value: "Packaged Food" },
    { label: "Edible Oils", value: "Edible Oils" },
    { label: "Textiles & Apparel", value: "Textiles & Apparel" },
    { label: "Leather & Footwear", value: "Leather & Footwear" },
    { label: "Electronics & Electricals", value: "Electronics & Electricals" },
    { label: "Semiconductors", value: "Semiconductors" },
    { label: "Cables & Wires", value: "Cables & Wires" },
    { label: "Steel & Metals", value: "Steel & Metals" },
    { label: "Foundry & Casting", value: "Foundry & Casting" },
    { label: "Plastics, Rubber & Polymers", value: "Plastics, Rubber & Polymers" },
    { label: "Glass & Ceramics", value: "Glass & Ceramics" },
    { label: "Construction Materials", value: "Construction Materials" },
    { label: "Packaging & Printing", value: "Packaging & Printing" },
    { label: "Furniture & Woodwork", value: "Furniture & Woodwork" },
    { label: "Paints & Coatings", value: "Paints & Coatings" },

    // CONSTRUCTION & REAL ESTATE
    { label: "Real Estate & Infrastructure", value: "Real Estate & Infrastructure" },
    { label: "Roads & Highways", value: "Roads & Highways" },
    { label: "Architecture & Interior Design", value: "Architecture & Interior Design" },
    { label: "Smart City & Urban Development", value: "Smart City & Urban Development" },

    // IT & TECHNOLOGY
    { label: "Information Technology (IT)", value: "Information Technology (IT)" },
    { label: "Software Development", value: "Software Development" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Cybersecurity", value: "Cybersecurity" },
    { label: "Data Analytics & AI", value: "Data Analytics & AI" },
    { label: "Web & App Development", value: "Web & App Development" },
    { label: "BPO / KPO / Call Center", value: "BPO / KPO / Call Center" },
    { label: "Telecom & Internet", value: "Telecom & Internet" },

    // BANKING & FINANCE
    { label: "Banking", value: "Banking" },
    { label: "NBFC & Microfinance", value: "NBFC & Microfinance" },
    { label: "Insurance (Life / General / Health)", value: "Insurance (Life / General / Health)" },
    { label: "Investment & Wealth Management", value: "Investment & Wealth Management" },
    { label: "Fintech & Payment Solutions", value: "Fintech & Payment Solutions" },
    { label: "Stockbroking & Mutual Funds", value: "Stockbroking & Mutual Funds" },

    // RETAIL & FMCG
    { label: "FMCG", value: "FMCG" },
    { label: "Retail", value: "Retail" },
    { label: "E-commerce", value: "E-commerce" },
    { label: "Consumer Durables", value: "Consumer Durables" },
    { label: "Fashion Retail", value: "Fashion Retail" },
    { label: "Beauty & Personal Care", value: "Beauty & Personal Care" },
    { label: "Jewellery", value: "Jewellery" },

    // LOGISTICS
    { label: "Logistics & Supply Chain", value: "Logistics & Supply Chain" },
    { label: "Transport & Fleet", value: "Transport & Fleet" },
    { label: "Warehousing & Distribution", value: "Warehousing & Distribution" },
    { label: "Freight & Cargo", value: "Freight & Cargo" },
    { label: "Import–Export", value: "Import–Export" },
    { label: "Cold Chain Logistics", value: "Cold Chain Logistics" },

    // HOSPITALITY
    { label: "Hotels & Resorts", value: "Hotels & Resorts" },
    { label: "Restaurants & QSR", value: "Restaurants & QSR" },
    { label: "Travel & Tourism", value: "Travel & Tourism" },
    { label: "Airlines & Cruises", value: "Airlines & Cruises" },
    { label: "Facility & Event Management", value: "Facility & Event Management" },

    // HEALTHCARE
    { label: "Hospitals & Clinics", value: "Hospitals & Clinics" },
    { label: "Diagnostics & Pathology", value: "Diagnostics & Pathology" },
    { label: "Wellness, Spa & Fitness", value: "Wellness, Spa & Fitness" },
    { label: "Mental Health", value: "Mental Health" },

    // EDUCATION
    { label: "Schools & Colleges", value: "Schools & Colleges" },
    { label: "EdTech", value: "EdTech" },
    { label: "Coaching & Skill Development", value: "Coaching & Skill Development" },

    // MEDIA & CREATIVE
    { label: "Advertising & Digital Marketing", value: "Advertising & Digital Marketing" },
    { label: "Media & Broadcasting", value: "Media & Broadcasting" },
    { label: "Film, OTT & Production", value: "Film, OTT & Production" },
    { label: "Animation & Graphic Design", value: "Animation & Graphic Design" },
    { label: "Gaming & Esports", value: "Gaming & Esports" },

    // PROFESSIONAL SERVICES
    { label: "Legal Services", value: "Legal Services" },
    { label: "CA & Accounting", value: "CA & Accounting" },
    { label: "Business Consulting", value: "Business Consulting" },
    { label: "HR & Recruitment", value: "HR & Recruitment" },
    { label: "Market Research", value: "Market Research" },

    // ENERGY
    { label: "Oil & Gas", value: "Oil & Gas" },
    { label: "Power & Electricity", value: "Power & Electricity" },
    { label: "Renewable Energy (Solar, Wind, Hydro)", value: "Renewable Energy (Solar, Wind, Hydro)" },

    // EMERGING
    { label: "Electric Vehicles (EV)", value: "Electric Vehicles (EV)" },
    { label: "IoT & Smart Devices", value: "IoT & Smart Devices" },
    { label: "Blockchain & Crypto", value: "Blockchain & Crypto" },
    { label: "R&D & Scientific Research", value: "R&D & Scientific Research" },
    { label: "Robotics & Automation", value: "Robotics & Automation" },
    { label: "Green Technology & Waste Management", value: "Green Technology & Waste Management" },

    // GOVERNMENT & OTHERS
    { label: "Government & Public Sector", value: "Government & Public Sector" },
    { label: "Security Services", value: "Security Services" },
    { label: "NGO & Social Sector", value: "NGO & Social Sector" },
    { label: "Freelancer / Self-Employed", value: "Freelancer / Self-Employed" },
    { label: "Other", value: "Other" },
];
