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
  ]
};

const DrugCalculator = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [dose, setDose] = useState('');

  const handleCalculate = () => {
    if (!selectedDrug || age === '' || (selectedDrug.calculations.length === 2 && weight === '')) {
      setDose('Please enter all required fields.');
      return;
    }
    
    const calculatedDose = selectedDrug.calculations(parseFloat(age), parseFloat(weight));
    setDose(calculatedDose);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-bold">Drug Dosage Calculator</h2>
      <div className="space-y-2">
        <label>Age (years):</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="border p-2 w-full" />
      </div>
      <div className="space-y-2">
        <label>Weight (kg):</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="border p-2 w-full" />
      </div>
      <div className="space-y-2">
        <label>Drug:</label>
        <select onChange={(e) => setSelectedDrug(DRUG_CATEGORIES.ANTIMICROBIALS.find(drug => drug.name === e.target.value))} className="border p-2 w-full">
          <option value="">Select a drug</option>
          {DRUG_CATEGORIES.ANTIMICROBIALS.map((drug) => (
            <option key={drug.name} value={drug.name}>{drug.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleCalculate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Calculate Dose
      </button>
      {dose && <div className="mt-4 p-2 bg-gray-100 rounded">{dose}</div>}
      
      <footer className="text-center mt-8 text-gray-600">
        <p>Programmed by PH. Mohamed Kamal Telis</p>
        <p className="text-sm mt-2">Pediatric Pharmacy Supervisor: Ph. ASHWAG Abdullah</p>
      </footer>
    </div>
  );
};

export default DrugCalculator;
