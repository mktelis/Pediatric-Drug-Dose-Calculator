import React, { useState } from 'react';
import { Search } from 'lucide-react';

const DRUG_CATEGORIES = {
  "ANTIMICROBIALS": [
    {
      name: "ACYCLOVIR",
      calculations: (age) => {
        let herpes = [];
        let varicella = [];
        
        // Herpes simplex
        if (age >= 0.083 && age < 1) herpes.push("100-200 mg 4 times daily for 5 days");
        if (age >= 1 && age <= 17) herpes.push("200-400 mg 4 times daily for 5 days");
        
        // Varicella zoster
        if (age >= 0.083 && age < 1) varicella.push("200 mg 4 times daily for 5 days");
        if (age >= 1 && age <= 5) varicella.push("400 mg 4 times daily for 5 days");
        if (age >= 6 && age <= 11) varicella.push("800 mg 4 times daily for 5 days");
        if (age >= 12 && age <= 17) varicella.push("800 mg 5 times daily for 7 days");
        
        return [
          herpes.length > 0 && `Herpes simplex: ${herpes.join('')}`,
          varicella.length > 0 && `Varicella: ${varicella.join('')}`
        ].filter(Boolean).join('; ');
      }
    },
    {
      name: "AMOXICILLIN",
      calculations: (age, weight) => {
        const daily = `40-90 mg/kg/day = ${weight*40}-${weight*90} mg/day in 2-3 divided doses`;
        return daily;
      }
    },
    {
      name: "AZITHROMYCIN",
      calculations: (age, weight) => {
        const max500 = Math.min(weight*12, 500);
        const reg1 = `10-12 mg/kg/day: ${weight*10}-${max500} mg once daily for 3-5 days`;
        const reg2 = `10 mg/kg day 1 (${weight*10} mg), then 5 mg/kg (${weight*5} mg) for 4 days`;
        return `${reg1}; ${reg2}`;
      }
    },
    {
      name: "CEFACLOR",
      calculations: (age, weight) => {
        if (age < 12) {
          const dose = `${weight*20}-${weight*40} mg/day (max 1000 mg) in 2-3 doses`;
          return dose;
        }
        return "250-500 mg every 8h (max 4000 mg/day)";
      }
    },
    {
      name: "CEFADROXIL",
      calculations: (age, weight) => 
        `${weight*30}-${weight*50} mg/day in 2 divided doses`
    },
    {
      name: "CEFDINIR",
      calculations: (age, weight) => 
        age < 12 ? 
        `7 mg/kg every 12h (${weight*7} mg) or 14 mg/kg daily (${weight*14} mg)` :
        "Max 600 mg/day"
    },
    {
      name: "CEFIXIME",
      calculations: (age, weight) => 
        age <= 12 ? 
        `8 mg/kg/day = ${weight*8} mg in 1-2 doses` : 
        "400 mg once daily or 200 mg every 12h"
    },
    {
      name: "CEFPODOXIME",
      calculations: (age, weight) => 
        age <= 12 ? `5 mg/kg twice daily = ${weight*5} mg` : "N/A"
    },
    {
      name: "CEFUROXIME",
      calculations: (age) => {
        if (age >= 0.25 && age < 1) return "10 mg/kg twice daily (max 125 mg/dose)";
        if (age >= 2 && age <= 11) return "15 mg/kg twice daily (max 250 mg/dose)";
        if (age >= 12) return "250 mg twice daily (may double for severe infections)";
      }
    },
    {
      name: "CLARITHROMYCIN",
      calculations: (age, weight) => 
        age < 12 ? 
        `7.5 mg/kg twice daily (max 250 mg) = ${weight*7.5} mg` : 
        "250-500 mg twice daily"
    },
    {
      name: "CO-AMOXICLAV",
      calculations: (age, weight) => 
        `20-80 mg/kg/day = ${weight*20}-${weight*80} mg in 2 divided doses`
    },
    {
      name: "CO-TRIMOXAZOLE",
      calculations: (age, weight) => 
        `6-20 mg/kg/day = ${weight*6}-${weight*20} mg in 2 divided doses`
    },
    {
      name: "MEBENDAZOLE",
      calculations: (age) => {
        const threadworm = "100 mg once (repeat after 2 weeks if needed)";
        const others = "100 mg twice daily for 3 days";
        return age >= 0.5 ? `${threadworm}; ${others}` : "Not recommended <6mo";
      }
    },
    {
      name: "METRONIDAZOLE",
      calculations: (age, weight) => 
        `15-50 mg/kg/day = ${weight*15}-${weight*50} mg in 2-3 doses for 7-14 days`
    },
    {
      name: "NYSTATIN (RIANEST)",
      calculations: () => "100,000 units every 6h for 7 days"
    }
  ],
  "ANTITUSSIVE": [
    {
      name: "AMBROXOL (MUCOSOLVAN FORTE)",
      calculations: (age) => {
        if (age >= 2 && age < 5) return "1.25 ml 3x daily";
        if (age >= 5 && age < 12) return "2.5 ml 3x daily";
        return "5 ml 3x daily";
      }
    },
    {
      name: "BROMHEXINE (RIAXINE)",
      calculations: (age) => {
        if (age >= 2 && age < 7) return "2.5 ml 3x daily";
        return "5 ml 3x daily";
      }
    },
    {
      name: "RHINATHIOL PROMETHAZINE SYRUP",
      calculations: (age) => {
        if (age >= 2 && age <= 2.5) return "5 ml 3-4x daily";
        if (age > 2.5 && age <= 11) return "10 ml 2-3x daily";
        return "10-15 ml 3x daily";
      }
    },
    {
      name: "RHINATHIOL EXPECTORANT",
      calculations: (age) => 
        age <= 5 ? "5 ml 2x daily" : "5 ml 3x daily"
    },
    {
      name: "KAFOSED",
      calculations: (age) => 
        age >= 12 ? "5 ml 3x daily (max 40 ml)" : "Contraindicated <12y"
    },
    {
      name: "EZIPAN",
      calculations: (age) => {
        if (age >= 6 && age <= 10) return "5 ml 3x daily";
        return age > 10 ? "5-7.5 ml 3x daily" : "Contraindicated <6y";
      }
    }
  ],
  "ANTIHISTAMINES": [
    {
      name: "CETIRIZINE",
      calculations: (age) => {
        if (age < 1) return "0.25 mg/kg twice daily";
        if (age <= 6) return "2.5 mg twice daily";
        if (age <= 12) return "5 mg twice daily";
        return "10 mg once daily";
      }
    },
    {
      name: "CHLORPHENIRAMINE",
      calculations: (age) => {
        let oral = [];
        if (age <= 2) oral.push("1 mg twice daily");
        if (age > 2 && age <= 5) oral.push("1 mg every 4-6h (max 6 mg)");
        if (age > 5 && age <= 11) oral.push("2 mg every 4-6h (max 12 mg)");
        return oral.join('; ');
      }
    },
    {
      name: "DESLORATADINE",
      calculations: (age) => {
        if (age <= 5) return "1.25 mg daily";
        if (age <= 11) return "2.5 mg daily";
        return "5 mg daily";
      }
    },
    {
      name: "DIMETINDENE",
      calculations: (age, weight) => 
        `${weight} drops 3x daily`
    },
    {
      name: "DIPHENHYDRAMINE",
      calculations: (age) => 
        age >= 6 ? "10 ml 3x daily" : "Contraindicated <6y"
    },
    {
      name: "LORATADINE",
      calculations: (age, weight) => 
        age < 12 ? weight < 31 ? "5 mg daily" : "10 mg daily" : "10 mg daily"
    },
    {
      name: "LEVOCETIRIZINE",
      calculations: (age) => {
        if (age <= 5) return "2.5 ml (1.25 mg) daily";
        if (age <= 12) return "5 ml (2.5 mg) daily";
        return "10 ml (5 mg) daily";
      }
    }
  ],
  "ANTIPYRETICS & ANALGESICS": [
    {
      name: "PARACETAMOL",
      calculations: (age, weight) => {
        const oral = `${weight*10}-${weight*15} mg every 4-6h (max 4 doses)`;
        const rectal = `${weight*15}-${weight*20} mg every 4-6h`;
        return `Oral: ${oral}; Rectal: ${rectal}`;
      }
    },
    {
      name: "IBUPROFEN",
      calculations: (age, weight) => {
        if (age < 1) return "5-10 mg/kg 3-4x daily";
        return age < 12 ? 
          `${weight*5}-${weight*10} mg 3-4x daily` : 
          "200-400 mg 3-4x daily (max 2400 mg)";
      }
    },
    {
      name: "DICLOFENAC",
      calculations: (age, weight) => 
        `${weight*2}-${weight*3} mg/day`
    }
  ],
  "FOOD SUPPLEMENTS & VITAMINES": [
    {
      name: "VITAMIN D3",
      calculations: (age) => 
        age < 1 ? "400 IU daily" : "600 IU daily"
    },
    {
      name: "FERROUS SULFATE",
      calculations: (age) => {
        if (age <= 0.25) return "0.2 ml daily";
        if (age <= 6) return "0.5-1.2 ml daily";
        return "2.4-4.8 ml daily";
      }
    },
    {
      name: "FEROSE SYRUP",
      calculations: (age) => {
        if (age < 1) return "2.5-5 ml daily";
        if (age <= 12) return "5-10 ml daily";
        return "10-30 ml daily";
      }
    },
    {
      name: "ZINCOMED",
      calculations: (age, weight) => 
        `${weight*0.5}-${weight*1} mg/day`
    }
  ],
  "CORTICOSTEROIDS": [
    {
      name: "PREDNISOLONE",
      calculations: (age, weight) => 
        age < 12 ? 
        `${weight*1}-${weight*2} mg/day (max 40 mg)` : 
        "40-50 mg/day"
    }
  ],
  "GASTROENTEROLOGY": [
    {
      name: "LACTULOSE",
      calculations: (age) => {
        if (age < 1) return "2.5 ml twice daily";
        if (age <= 4) return "2.5-10 ml twice daily";
        return "5-20 ml twice daily";
      }
    },
    {
      name: "ONDANSETRON",
      calculations: (age, weight) => 
        `IV: ${weight*0.1}-${weight*0.15} mg (max 8 mg); Oral: 2-16 mg every 12h`
    },
    {
      name: "OMEPRAZOLE",
      calculations: (age, weight) => 
        age < 12 ? 
        `${weight*1}-${weight*2} mg/day (max 40 mg)` : 
        "40 mg daily"
    }
  ]
};

const DrugCalculator = () => {
  // ... (keep the same component code as before until footer)

  {/* Attribution */}
  <footer className="text-center mt-8 text-gray-600">
    <p>Programmed by PH. Mohamed Kamal Telis</p>
    <p className="text-sm mt-2">Pediatric Pharmacy Supervisor: Ph. ASHWAG Abdullah</p>
  </footer>
};

export default DrugCalculator;
