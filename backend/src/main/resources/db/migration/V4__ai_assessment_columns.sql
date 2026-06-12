-- AI-powered assessment: manual symptom text + AI analysis results
ALTER TABLE symptom_assessments ADD COLUMN IF NOT EXISTS additional_symptoms TEXT;
ALTER TABLE symptom_assessments ADD COLUMN IF NOT EXISTS possible_conditions TEXT;
ALTER TABLE symptom_assessments ADD COLUMN IF NOT EXISTS suggested_medicines TEXT;
ALTER TABLE symptom_assessments ADD COLUMN IF NOT EXISTS recommended_specialization VARCHAR(100);
ALTER TABLE symptom_assessments ADD COLUMN IF NOT EXISTS ai_advice TEXT;
