import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/navigation/top-nav";
import { Search, User, FileText, Activity, TestTube, Stethoscope, ClipboardList, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MedicalRecord = () => {
  const [nik, setNik] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const { toast } = useToast();

  // Mock patient data
  const patientData = {
    personalInfo: {
      name: "Budi Santoso",
      nik: "3201234567890123",
      birthDate: "1985-05-15",
      gender: "Male",
      address: "Jl. Merdeka No. 123, Jakarta Pusat",
      phone: "081234567890",
    },
    diagnosis: [
      { date: "2024-01-15", diagnosis: "Hypertension Stage 1", icd10: "I10", doctor: "Dr. Sarah Wijaya" },
      { date: "2024-01-10", diagnosis: "Type 2 Diabetes Mellitus", icd10: "E11", doctor: "Dr. Ahmad Rahman" },
    ],
    vitals: [
      { date: "2024-01-15", time: "10:30", bp: "140/90", hr: "78", temp: "36.5°C", weight: "72kg", height: "170cm" },
      { date: "2024-01-10", time: "14:20", bp: "145/95", hr: "82", temp: "36.7°C", weight: "73kg", height: "170cm" },
    ],
    labResults: [
      { date: "2024-01-12", test: "Fasting Blood Glucose", result: "145 mg/dL", reference: "70-99 mg/dL", status: "High" },
      { date: "2024-01-12", test: "HbA1c", result: "7.2%", reference: "<5.7%", status: "High" },
      { date: "2024-01-12", test: "Total Cholesterol", result: "220 mg/dL", reference: "<200 mg/dL", status: "High" },
    ],
    treatments: [
      { date: "2024-01-15", medication: "Metformin 500mg", dosage: "2x daily", duration: "30 days", doctor: "Dr. Ahmad Rahman" },
      { date: "2024-01-15", medication: "Amlodipine 5mg", dosage: "1x daily", duration: "30 days", doctor: "Dr. Sarah Wijaya" },
    ],
    consultationNotes: [
      { 
        date: "2024-01-15", 
        doctor: "Dr. Sarah Wijaya", 
        specialty: "Internal Medicine",
        chief_complaint: "Headache and dizziness",
        assessment: "Blood pressure well controlled with current medication. Patient reports occasional headaches.",
        plan: "Continue current antihypertensive. Follow-up in 4 weeks."
      },
      { 
        date: "2024-01-10", 
        doctor: "Dr. Ahmad Rahman", 
        specialty: "Endocrinology",
        chief_complaint: "Routine diabetes follow-up",
        assessment: "Blood glucose levels improving with metformin. No signs of complications.",
        plan: "Continue metformin. Dietary counseling. HbA1c in 3 months."
      },
    ],
    disposition: [
      { date: "2024-01-15", status: "Discharged Home", instructions: "Continue medications as prescribed. Follow-up appointment in 4 weeks.", next_appointment: "2024-02-12" },
      { date: "2024-01-10", status: "Discharged Home", instructions: "Dietary modifications. Monitor blood glucose daily.", next_appointment: "2024-02-07" },
    ],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length >= 10) {
      setShowRecord(true);
      toast({
        title: "Patient Found",
        description: `Medical record for NIK ${nik} loaded successfully`,
      });
    } else {
      toast({
        title: "Invalid NIK",
        description: "Please enter a valid NIK (minimum 10 digits)",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "high": return "text-red-600";
      case "low": return "text-blue-600";
      case "normal": return "text-green-600";
      default: return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="h-6 w-6 text-medical-red" />
              <div>
                <CardTitle>Search Patient by NIK</CardTitle>
                <CardDescription>
                  Enter the National ID Number (NIK) to access patient medical records
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="nik" className="sr-only">NIK</Label>
                <Input
                  id="nik"
                  type="text"
                  placeholder="Enter NIK (e.g., 3201234567890123)"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="medical" size="default">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Patient Record */}
        {showRecord && (
          <div className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-medical-red" />
                  <CardTitle>Patient Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-semibold">{patientData.personalInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">NIK</Label>
                    <p className="text-lg font-semibold">{patientData.personalInfo.nik}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Birth Date</Label>
                    <p className="text-lg">{patientData.personalInfo.birthDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                    <p className="text-lg">{patientData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-lg">{patientData.personalInfo.phone}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-lg">{patientData.personalInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-medical-red" />
                  <CardTitle>Diagnosis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>ICD-10 Code</TableHead>
                      <TableHead>Doctor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.diagnosis.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-medium">{item.diagnosis}</TableCell>
                        <TableCell>{item.icd10}</TableCell>
                        <TableCell>{item.doctor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Activity className="h-6 w-6 text-medical-red" />
                  <CardTitle>Vital Signs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Height</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.vitals.map((vital, index) => (
                      <TableRow key={index}>
                        <TableCell>{vital.date} {vital.time}</TableCell>
                        <TableCell className="font-medium">{vital.bp}</TableCell>
                        <TableCell>{vital.hr} bpm</TableCell>
                        <TableCell>{vital.temp}</TableCell>
                        <TableCell>{vital.weight}</TableCell>
                        <TableCell>{vital.height}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Lab Results */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <TestTube className="h-6 w-6 text-medical-red" />
                  <CardTitle>Laboratory Results</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Reference Range</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.labResults.map((lab, index) => (
                      <TableRow key={index}>
                        <TableCell>{lab.date}</TableCell>
                        <TableCell>{lab.test}</TableCell>
                        <TableCell className="font-medium">{lab.result}</TableCell>
                        <TableCell>{lab.reference}</TableCell>
                        <TableCell className={`font-medium ${getStatusColor(lab.status)}`}>
                          {lab.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Treatments */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-6 w-6 text-medical-red" />
                  <CardTitle>Treatments & Medications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Prescribed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.treatments.map((treatment, index) => (
                      <TableRow key={index}>
                        <TableCell>{treatment.date}</TableCell>
                        <TableCell className="font-medium">{treatment.medication}</TableCell>
                        <TableCell>{treatment.dosage}</TableCell>
                        <TableCell>{treatment.duration}</TableCell>
                        <TableCell>{treatment.doctor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Consultation Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <ClipboardList className="h-6 w-6 text-medical-red" />
                  <CardTitle>Consultation Notes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {patientData.consultationNotes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-medical-gray-light">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{note.doctor}</p>
                          <p className="text-sm text-muted-foreground">{note.specialty}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{note.date}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium">Chief Complaint:</Label>
                          <p className="text-sm">{note.chief_complaint}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Assessment:</Label>
                          <p className="text-sm">{note.assessment}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Plan:</Label>
                          <p className="text-sm">{note.plan}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disposition */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-medical-red" />
                  <CardTitle>Disposition</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead>Next Appointment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.disposition.map((disp, index) => (
                      <TableRow key={index}>
                        <TableCell>{disp.date}</TableCell>
                        <TableCell className="font-medium">{disp.status}</TableCell>
                        <TableCell>{disp.instructions}</TableCell>
                        <TableCell>{disp.next_appointment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalRecord;