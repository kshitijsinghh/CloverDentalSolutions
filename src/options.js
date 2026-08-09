// Static dropdown option lists, ported verbatim from Clinic Console.dc.html
// (already deduplicated there from the raw lists the clinic provided).

export const GENDERS = ['Male', 'Female', 'Others'];

export const CHIEF_COMPLAINTS = [
  'General Check-up', 'Stains / Deposits', 'Decayed Tooth', 'Dislodged Filling',
  'Dislodged Bridge', 'Dislodged Crown / Cap', 'Dislodged Crown / Cap, Dislodged Filling',
  'Loose Tooth', 'Sensitivity', 'Bleeding Gums', 'Teeth Grinding', 'Broken Tooth',
  'Food Lodgement', 'Pain', 'Pain, Swelling', 'Swelling', 'Ulcer / Burning Sensation',
  'TMJ Pain / Difficulty Opening Mouth', 'Wisdom Tooth Pain', 'Other',
];

export const TREATMENT_GROUPS = [
  'Preventive', 'Restorative', 'Prosthodontics', 'Endodontics', 'Oral Surgery',
  'Implantology', 'Paediatric Dentistry', 'Consultation', 'Preventive, Restorative',
  'Restorative, Prosthodontics', 'Prosthodontics, Restorative', 'Endodontics, Restorative',
  'Endodontics, Prosthodontics', 'Endodontics, Prosthodontics, Restorative',
  'Restorative, Prosthodontics, Preventive', 'Prosthodontics, Restorative, Preventive',
  'Oral Surgery, Preventive', 'Oral Surgery, Endodontics', 'Restorative, Oral Surgery, Preventive',
  'Preventive, Endodontics', 'Preventive, Restorative, Prosthodontics', 'Consultation, Preventive',
  'Consultation, Endodontics', 'Preventive, Oral Surgery', 'Preventive, Prosthodontics', 'Other',
];

export const TREATMENTS = [
  'Scaling & Polishing', 'Composite Restoration', 'GIC Restoration', 'RCT', 'Re-RCT',
  'Access Opening', 'BMP', 'WL', 'Obturation', 'ICM', 'Irrigation', 'Core Build-up',
  'Post & Core', 'Crown Preparation', 'Crown', 'Crown Recementation', 'Crown Removal',
  'Bridge', 'Bridge Removal', 'Endocrown Preparation', 'Extraction', 'Surgical Extraction',
  'Suture Removal', 'Implant', 'Impression', 'Temporary Restoration', 'Night Guard Delivery',
  'Consultation', 'Scaling & Polishing, Composite Restoration', 'Scaling & Polishing, GIC Restoration',
  'Scaling & Polishing, ICM', 'Scaling & Polishing, Access Opening',
  'Scaling & Polishing, Composite Restoration, GIC Restoration',
  'Scaling & Polishing, Composite Restoration, Crown', 'Scaling & Polishing, Core Build-up, Crown Preparation',
  'Scaling & Polishing, Crown', 'Composite Restoration, GIC Restoration',
  'Composite Restoration, Core Build-up, Crown Preparation',
  'Composite Restoration, Suture Removal, Scaling & Polishing', 'GIC Restoration, Composite Restoration',
  'GIC Restoration, Temporary Restoration', 'Crown, Composite Restoration',
  'Crown, Composite Restoration, Scaling & Polishing', 'Crown, Core Build-up, Crown Preparation',
  'Crown, ICM', 'Core Build-up, Crown Preparation', 'Core Build-up, Composite Restoration',
  'Core Build-up, Crown Recementation', 'Core Build-up, Crown', 'Crown Preparation, Composite Restoration',
  'Crown Recementation, Composite Restoration', 'Post & Core, Crown Preparation',
  'Post & Core, Crown Preparation, GIC Restoration', 'Post & Core, Composite Restoration',
  'Access Opening, BMP', 'Access Opening, BMP, ICM', 'Access Opening, BMP, WL',
  'Access Opening, BMP, RCT', 'Access Opening, WL', 'Access Opening, WL, BMP',
  'Access Opening, Composite Restoration', 'BMP, WL, Obturation', 'ICM, Irrigation, WL',
  'ICM, Core Build-up', 'Irrigation, ICM', 'RCT, Obturation', 'RCT, Composite Restoration',
  'RCT, WL', 'RCT, WL, Obturation, Post & Core', 'RCT, Access Opening, BMP, WL',
  'RCT, Access Opening, WL', 'Obturation, RCT', 'Obturation, RCT, GIC Restoration',
  'Obturation, Access Opening', 'Obturation, Core Build-up', 'Obturation, Composite Restoration',
  'Endocrown Preparation, Impression', 'Consultation, Scaling & Polishing',
  'Consultation, Access Opening', 'Extraction, Scaling & Polishing', 'Extraction, Obturation',
  'Crown Removal, BMP', 'Other', 'Other, Extraction', 'Composite Restoration, Other',
];

export const PAYMENT_MODES = ['UPI', 'Debit Card', 'Credit Card'];
export const YES_NO = ['Yes', 'No'];
export const TREATMENT_STAGES = ['Complete', 'In Progress'];
